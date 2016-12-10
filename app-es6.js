import 'regenerator/runtime';

import './app-helpers/promiseUtils';
import './private/awsS3Credentials';
import dao from './dataAccess/dao';

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const lwip = require('lwip');
const exif = require('exif-parser');

import bookEntryQueueManager from './app-helpers/bookEntryQueueManager';
import PendingBookEntryDao from './dataAccess/pendingBookEntryDAO';
import ErrorLoggerDao from './dataAccess/errorLoggerDAO';
import UserDao from './dataAccess/userDAO';

const hour = 3600000;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years

const multer  = require('multer');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RememberMeStrategy = require('passport-remember-me').Strategy;

passport.use(new LocalStrategy(
    function(email, password, done) {
        let userDao = new UserDao();

        userDao.lookupUser(email, password).then(userResult => {
            if (userResult) {
                userResult.id = '' + userResult._id;
                done(null, userResult);
            } else {
                done(null, false, {message: 'Incorrect login'});
            }
        });
    }
));

function consumeRememberMeToken(token, done) {
    let userDao = new UserDao();

    userDao.lookupUserByToken(token).then(userResult => {
        if (userResult) {
            userResult.id = '' + userResult._id;
            done(null, userResult);
        } else {
            done(null, null);
        }
    });
}

passport.use(new RememberMeStrategy(
    function(token, done) {
        consumeRememberMeToken(token, function(err, userResult) {
            if (err) { return done(err); }
            if (!userResult) { return done(null, false); }

            done(null, userResult);
        });
    },
    function(user, done) {
        return done(null, user.token);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    return done(undefined, { id: '' + id, _id: '' + id });
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());
app.use(session({ secret: 'adam_booklist', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

var expressWs = require('express-ws')(app);

app.use('/', express.static(__dirname + ''));
app.use('/static/', express.static(__dirname + '/static/'));
app.use('/node_modules/', express.static(__dirname + '/node_modules/'));
app.use('/react-redux/', express.static(__dirname + '/react-redux/'));
app.use('/react-mobx/', express.static(__dirname + '/react-mobx/'));
app.use('/utils/', express.static(__dirname + '/utils/'));
app.use('/uploads/', express.static(__dirname + '/uploads/'));

app.ws('/bookEntryWS', function(ws, req) {
    bookEntryQueueManager.subscriberAdded(req.user.id, ws);
});


var easyControllers = require('easy-express-controllers').easyControllers;
easyControllers.createAllControllers(app, { fileTest: f => !/-es6.js$/.test(f) });

app.get('/', browseToReactRedux);
app.get('/react-redux', browseToReactRedux);
app.get('/react-mobx', browseToReactMobX);

function browseToReactRedux(request, response){
    if (!!request.user) {
        response.cookie('logged_in', 'true', { maxAge: 900000 });
    } else {
        response.clearCookie('logged_in');
    }
    response.sendFile(path.join(__dirname + '/react-redux/default.htm'));
}

function browseToReactMobX(request, response){
    if (!!request.user) {
        response.cookie('logged_in', 'true', { maxAge: 900000 });
    } else {
        response.clearCookie('logged_in');
    }
    response.sendFile(path.join(__dirname + '/react-mobx/default.htm'));
}

app.get('/favicon.ico', function (request, response) {
    response.sendFile(path.join(__dirname + '/favicon.ico'));
});

app.post('/react-mobx/login', passport.authenticate('local'), function(req, response) {
    // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
    response.cookie('logged_in', 'true', { maxAge: 900000 });
    if (req.body.rememberme == 1) {
        response.cookie('remember_me', req.user.token, {path: '/', httpOnly: true, maxAge: rememberMeExpiration });
    }
    response.send(req.user);
});

app.post('/react-mobx/logout', function(req, response){
    response.clearCookie('remember_me');
    req.logout();
    response.send({});
});

app.post('/react-redux/login', passport.authenticate('local'), function(req, response) {
    // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
    response.cookie('logged_in', 'true', { maxAge: 900000 });
    if (req.body.rememberme == 1) {
        response.cookie('remember_me', req.user.token, {path: '/', httpOnly: true, maxAge: rememberMeExpiration });
    }
    response.send(req.user);
});

app.post('/react-redux/logout', function(req, response){
    response.clearCookie('remember_me');
    req.logout();
    response.send({});
});

const multerBookCoverUploadStorage = multer.diskStorage({
    destination(req, file, cb){
        if (!req.user.id){
            cb('Not logged in');
        } else {
            let path = `./uploads/${req.user.id}/coverUpload`;

            fs.stat(path, function(err){
                if (err){
                    mkdirp(path, (err, res) => cb(err, path));
                } else {
                    cb(null, path);
                }
            });
        }
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: multerBookCoverUploadStorage });

//TODO: refactor to be a controller action - will require middleware in easy-express-controllers which doesn't currently exist
app.post('/react-redux/upload', upload.single('fileUploaded'), function(req, response){
    //req.body.___ still has manual fields sent over
    if (req.file.size > 900000){
        return response.send({ success: false, error: 'Max size is 500K' });
    }

    let pathResult = path.normalize(req.file.destination).replace(/\\/g, '/'),
        pathToFileUploaded = `${pathResult}/${req.file.originalname}`,
        ext = (path.extname(pathToFileUploaded) || '').toLowerCase();

    try {
        lwip.open(pathToFileUploaded, function (err, image) {
            if (err) {
                return response.send({ success: false, error: 'Error opening file. Is it a valid image?' });
            }

            if (ext == '.jpg' || ext == '.jpeg') {
                fs.readFile(pathToFileUploaded, (err, data) => {
                    if (err) {
                        console.log('ERROR', pathToFileUploaded, err);
                    }
                    let exifData = exif.create(data).parse(),
                        batchImage = null;

                    if (exifData && exifData.tags) {
                        switch (exifData.tags.Orientation) {
                            case 2:
                                batchImage = image.batch().flip('x'); // top-right - flip horizontal
                                break;
                            case 3:
                                batchImage = image.batch().rotate(180); // bottom-right - rotate 180
                                break;
                            case 4:
                                batchImage = image.batch().flip('y'); // bottom-left - flip vertically
                                break;
                            case 5:
                                batchImage = image.batch().rotate(90).flip('x'); // left-top - rotate 90 and flip horizontal
                                break;
                            case 6:
                                batchImage = image.batch().rotate(90); // right-top - rotate 90
                                break;
                            case 7:
                                batchImage = image.batch().rotate(270).flip('x'); // right-bottom - rotate 270 and flip horizontal
                                break;
                            case 8:
                                batchImage = image.batch().rotate(270); // left-bottom - rotate 270
                                break;
                        }
                    }

                    if (batchImage) {
                        batchImage.exec((err, image) => processImageAsNeeded(image))
                    } else {
                        processImageAsNeeded(image);
                    }
                });
            } else {
                processImageAsNeeded(image);
            }
        });
    } catch (err){
        return response.send({ success: false, error: 'Error opening file. Is it a valid image?' });
    }

    function processImageAsNeeded(image) {
        if (image.width() > 55) {
            let width = image.width(),
                height = image.height(),
                newWidth = (height * 50) / width;

            image.resize(50, newWidth, function (err, image) {
                let resizedDestination = `${pathResult}/resized_${req.file.originalname}`;

                image.writeFile(resizedDestination, err => {
                    response.send({success: true, smallImagePath: '/' + resizedDestination}); //absolute for client, since it'll be react-redux base (or something else someday, perhaps)
                });
            });
        } else {
            response.send({success: true, smallImagePath: `/${pathResult}/${req.file.originalname}`}); //absolute for client, since it'll be react-redux base (or something else someday, perhaps)
        }
    }
});

app.post('/react-redux/createUser', function(req, response){
    let userDao = new UserDao(),
        username = req.body.username,
        password = req.body.password,
        rememberMe = req.body.rememberme == 1;

    userDao.checkUserExists(username, password).then(exists => {
        if (exists) {
            response.send({ errorCode: 's1' });
        } else {
            userDao.createUser(username, password, rememberMe).then(() => {
                userDao.sendActivationCode(username);
                response.send({});
            });
        }
    });
});

app.get('/react-redux/activate/:code', function(req, response){
    let userDao = new UserDao(),
        code = req.params.code;

    userDao.activateUser(code).then(result => {
        //console.log('activation results', 'success', success, 'already activated', alreadyActivated, 'invalid', invalid);
        if (result.success){
            req.login(result, function(){
                if (result.rememberMe) {
                    response.cookie('remember_me', result.token, { path: '/', httpOnly: true, maxAge: rememberMeExpiration });
                }
                response.redirect('/react-redux/#activate');
            })
        } else {
            response.redirect('/react-redux/#activate');
        }

    }, err => console.log(':(', err));
});

process.on('uncaughtException', error);
process.on('unhandledRejection', error);
process.on('exit', shutdown);
process.on('SIGINT', shutdown);

function shutdown(){
    dao.shutdown();
    process.exit();
}

function error(err){
    try{
        let logger = new ErrorLoggerDao();
        logger.log('exception', err);
    } catch(e) { }
}

Promise.resolve(dao.init()).then(() => {
    app.listen(process.env.PORT || 3000);
    bookEntryQueueManager.initialize();
});

//var AWS = require('aws-sdk');
//AWS.config.region = 'us-east-1';

/*
fs.readFile('./uploads/beefcake.jpg', function (err, data) {
    console.log('file read', err, data);
    if (err) throw err; // Something went wrong!

    let s3bucket = new AWS.S3({ params: { Bucket: 'my-library-cover-uploads' } });
    let params = {
        Key: 'the/file/x.jpg',
        Body: data
    };

    s3bucket.upload(params, function (err, data) {
        if (err) {
            console.log(err, ':(')
        } else {
            console.log(data, 'hooray! :)')
        }
    });
});

lwip.open('./uploads/li_large.jpg', function (err, image) {
    if (err){
        console.log('err', err)
    }

    let width = image.width(),
        height = image.height();

    let ratio = height / width;
    let newWidth = (height * 50) / width;

    console.log('opened', width, height);
    image.resize(50, newWidth, function(err, image){
        console.log('resized', image, typeof image.writePath);

        image.writeFile('./uploads/li_finished.jpg', err => {
            console.log('root?')
            if (err) {
                console.log(err);
            }else {
                console.log('written?');
            }
        });
    });
});
*/