global.Symbol = require('es6-symbol');

require('regenerator/runtime');
global.Promise = require('promise');
require('./utils/promiseUtils');

const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
import { authInfo, myAddresses } from './utils/mailAuthenticationInfo';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RememberMeStrategy = require('passport-remember-me').Strategy;

const adamToken = 'foooooooooo';
const userObj = { name: 'adam', id: 1, username: 'adam', password: 'pwd', msg: 'nice work!', token: adamToken };

passport.use(new LocalStrategy(
    function(username, password, done) {
        if (username == 'adam' && password == 'password'){
            return done(null, userObj);
        } else {
            return done(null, false, { message: 'Incorrect login' });
        }
    }
));

function consumeRememberMeToken(token, fn) {
    if (token == adamToken) return fn(null, userObj);
    else return fn(null, null);
}

passport.use(new RememberMeStrategy(
    function(token, done) {
        consumeRememberMeToken(token, function(err, userObj) {
            if (err) { return done(err); }
            if (!userObj) { return done(null, false); }

            return done(null, userObj);
        });
    },
    function(user, done) {
        return done(null, adamToken);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.name);
});

passport.deserializeUser(function(id, done) {
    done(undefined, userObj);
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

app.listen(3000);

app.use(express.static(__dirname + '/'));

app.ws('/bookEntryWS', function(ws, req) {
    ws.on('message', function(msg) {
        console.log('express-ws --- ', msg);
    });
    console.log('socket', req.user);

    ws.on('close', function(){
        console.log('client closed it');
    });

    var X = setInterval(() => {
        if (ws.readyState == 1) {
            ws.send('Hellooooooo from node')
        }
    }, 3000);

    setTimeout(() => {
        clearInterval(X);
        ws.close();
    }, 12000)
});


var easyControllers = require('easy-express-controllers').easyControllers;
easyControllers.createAllControllers(app, { fileTest: f => !/-es6\.js$/i.test(f) });

app.get('/react-redux', function (request, response) {
    if (!request.user){
        response.redirect('/react-redux/login');
    } else {
        response.sendFile(path.join(__dirname + '/react-redux/default.htm'));
    }
});

app.get('/react-redux/login', function (request, response) {
    response.sendFile(path.join(__dirname + '/react-redux/login.htm'));
});

app.post('/react-redux/login', passport.authenticate('local'), function(req, response) {
    // If this function gets called, authentication was successful. `req.user` contains the authenticated user.

    //handleSayHello()
    function handleSayHello() {
        // Not the movie transporter!
        let mailTransport = nodemailer.createTransport(authInfo);
        let emailInfo = Object.assign({}, myAddresses, {
            subject: 'You logged in!',
            html: '<h2>You logged in</h2>'
        });

        mailTransport.sendMail(emailInfo, function(err, info){
            if(err){
                console.log(err);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    }

    response.cookie('remember_me', req.user.token, { path: '/', httpOnly: true, maxAge: 604800000 });
    response.send(req.user);
});

app.post('/react-redux/logout', function(req, response){
    response.clearCookie('remember_me');
    req.logout();
    response.send({});
});