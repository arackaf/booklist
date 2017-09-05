require('dotenv').config();

require('regenerator/runtime');

require('./node-dest/app-helpers/promiseUtils');
const dao = require('./node-dest/dataAccess/dao').default;

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Jimp = require('jimp');
const compression = require('compression');

const bookEntryQueueManager = require('./node-dest/app-helpers/bookEntryQueueManager').default;
const PendingBookEntryDao = require('./node-dest/dataAccess/pendingBookEntryDAO').default;
const ErrorLoggerDao = require('./node-dest/dataAccess/errorLoggerDAO').default;
const UserDao = require('./node-dest/dataAccess/userDAO').default;

const hour = 3600000;
const rememberMeExpiration = 2 * 365 * 24 * hour; //2 years

const multer  = require('multer');

const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RememberMeStrategy = require('passport-remember-me').Strategy;

if (!process.env.IS_DEV){
    app.use(function ensureSec(request, response, next){
        let proto = request.header('x-forwarded-proto') || request.header('X-Forwarded-Proto') || request.get('X-Forwarded-Proto'),
            secure = proto == 'https';
        if (secure){
            return next();
        } else {
            response.redirect("https://" + request.headers.host + request.url);
        }
    });
}

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

app.use(compression());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());
app.use(session({ secret: 'adam_booklist', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

const expressWs = require('express-ws')(app);

app.use('/static/', express.static(__dirname + '/static/'));
app.use('/node_modules/', express.static(__dirname + '/node_modules/'));
app.use('/react-redux/', express.static(__dirname + '/react-redux/'));
app.use('/utils/', express.static(__dirname + '/utils/'));
app.use('/uploads/', express.static(__dirname + '/uploads/'));

app.ws('/bookEntryWS', function(ws, req) {
    bookEntryQueueManager.subscriberAdded(req.user.id, ws);
});

const easyControllers = require('easy-express-controllers').easyControllers;
easyControllers.createAllControllers(app, { fileTest: f => !/-es6.js$/.test(f) }, {__dirname: './node-dest'});

app.get('/', browseToReactRedux);
app.get('/books', browseToReactRedux);
app.get('/login', browseToReactRedux);
app.get('/subjects', browseToReactRedux);
app.get('/settings', browseToReactRedux);
app.get('/scan', browseToReactRedux);
app.get('/home', browseToReactRedux);
app.get('/view', browseToReactRedux);
app.get('/react-redux', browseToReactRedux);
app.get('/service-worker.js', (request, response) => {
    response.sendFile(path.join(__dirname + '/react-redux/dist/service-worker.js'));
})

function browseToReactRedux(request, response){
    if (!!request.user) {
    } else {
        response.clearCookie('logged_in');
        response.clearCookie('remember_me');
        response.clearCookie('userId');
    }
    response.sendFile(path.join(__dirname + '/react-redux/default.htm'));
}

app.get('/favicon.ico', function (request, response) {
    response.sendFile(path.join(__dirname + '/favicon.ico'));
});

app.post('/react-redux/login', passport.authenticate('local'), function(req, response) {
    // If this function gets called, authentication was successful. `req.user` contains the authenticated user.
    let rememberMe = req.body.rememberme == 1;
    
    response.cookie('logged_in', 'true', { maxAge: rememberMe ? rememberMeExpiration : 900000 });
    response.cookie('userId', req.user.id, { maxAge: rememberMe ? rememberMeExpiration : 900000 });
    if (rememberMe) {
        response.cookie('remember_me', req.user.token, {path: '/', httpOnly: true, maxAge: rememberMeExpiration });
    }
    response.send(req.user);
});

app.post('/react-redux/logout', function(req, response){
    response.clearCookie('logged_in');
    response.clearCookie('remember_me');
    response.clearCookie('userId');
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
        Jimp.read(pathToFileUploaded, function (err, image) {
            if (err) {
                return response.send({ success: false, error: 'Error opening file. Is it a valid image?' });
            }
            image.exifRotate();

            processImageAsNeeded(image);
        });
    } catch (err){
        return response.send({ success: false, error: 'Error opening file. Is it a valid image?' });
    }

    function processImageAsNeeded(image) {
        if (image.bitmap.width > 55) {
            let width = image.bitmap.width,
                height = image.bitmap.height,
                newWidth = (height * 50) / width;

            image.resize(50, newWidth);
            let resizedDestination = `${pathResult}/resized_${req.file.originalname}`;

            image.write(resizedDestination, err => {
                response.send({success: true, smallImagePath: '/' + resizedDestination}); //absolute for client, since it'll be react-redux base (or something else someday, perhaps)
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

app.get('/activate', browseToReactRedux);
app.get('/activate/:code', function(req, response){
    let userDao = new UserDao(),
        code = req.params.code;

    response.clearCookie('remember_me');
    req.logout();

    userDao.activateUser(code).then(result => {
        //console.log('activation results', 'success', success, 'already activated', alreadyActivated, 'invalid', invalid);
        if (result.success){
            req.login(result, function(){
                response.cookie('userId', result._id, { maxAge: 900000 });
                if (result.rememberMe) {
                    response.cookie('remember_me', result.token, { path: '/', httpOnly: true, maxAge: rememberMeExpiration });
                }
                response.redirect('/activate');
            })
        } else {
            response.redirect(result.alreadyActivated ? '/activate?alreadyActivated=true' : '/activate');
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