require('regenerator/runtime');
require('./utils/promiseUtils');

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
import bookEntryQueueManager from './app/bookEntryQueueManager';
import PendingBookEntryDao from './dataAccess/pendingBookEntryDAO';
import ErrorLoggerDao from './dataAccess/errorLoggerDAO';
import UserDao from './dataAccess/userDAO';

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

app.listen(process.env.PORT || 3000);

app.use('/static/', express.static(__dirname + '/static/'));
app.use('/node_modules/', express.static(__dirname + '/node_modules/'));
app.use('/react-redux/', express.static(__dirname + '/react-redux/'));
app.use('/utils/', express.static(__dirname + '/utils/'));

app.ws('/bookEntryWS', function(ws, req) {

    bookEntryQueueManager.subscriberAdded(req.user.id, ws);

    //ws.on('message', function(msg) {
    //    console.log('express-ws --- ', msg);
    //});

    //setTimeout(() => {
    //    clearInterval(X);
    //    ws.close();
    //}, 12000)
});


var easyControllers = require('easy-express-controllers').easyControllers;
easyControllers.createAllControllers(app, { fileTest: f => !/-es6\.js$/i.test(f) });

app.get('/react-redux', function (request, response) {
    if (!!request.user) {
        response.cookie('logged_in', 'true', { maxAge: 900000 });
    } else {
        response.clearCookie('logged_in');
    }
    response.sendFile(path.join(__dirname + '/react-redux/default.htm'));
});

app.get('/favicon.ico', function (request, response) {
    response.sendFile(path.join(__dirname + '/favicon.ico'));
});

app.post('/react-redux/login', passport.authenticate('local'), function(req, response) {
    // If this function gets called, authentication was successful. `req.user` contains the authenticated user.

    response.cookie('logged_in', 'true', { maxAge: 900000 });
    if (req.body.rememberme == 1) {
        response.cookie('remember_me', req.user.token, {path: '/', httpOnly: true, maxAge: 604800000});
    }
    response.send(req.user);
});

app.post('/react-redux/logout', function(req, response){
    response.clearCookie('remember_me');
    req.logout();
    response.send({});
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

    console.log('activating', code);
    userDao.activateUser(code).then(({ alreadyActivated, invalid, success }) => {
        console.log('activation results', 'success', success, 'already activated', alreadyActivated, 'invalid', invalid);
    }, err => console.log(':(', err));
});

process.on('uncaughtException', function (err) {
    try{
        let logger = new ErrorLoggerDao();
        logger.log('exception', err);
    } catch(e) { }
});

process.on('unhandledRejection', function (err, p) {
    try{
        let logger = new ErrorLoggerDao();
        logger.log('promise rejection', err);
    } catch(e) { }
});


bookEntryQueueManager.initialize();

