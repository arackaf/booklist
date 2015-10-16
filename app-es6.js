global.Symbol = require('es6-symbol');

require('regenerator/runtime');
global.Promise = require('promise');
require('./utils/promiseUtils');

var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.listen(3000);

app.use(express.static(__dirname + '/'));

var easyControllers = require('easy-express-controllers').easyControllers;
easyControllers.createController(app, 'book');

app.get('/react', function (request, response) {
    response.sendFile(path.join(__dirname + '/react/default.htm'));
});
