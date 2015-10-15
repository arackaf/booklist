global.Symbol = require('es6-symbol');

require('regenerator/runtime');
global.Promise = require('promise');
require('./utils/promiseUtils');

var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var AmazonSearch = require('./amazonDataAccess/AmazonSearch.js');
var BookDAO = require('./dataAccess/BookDAO.js');
var { amazonOperationQueue } = require('./amazonDataAccess/amazonOperationQueue');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.listen(3000);

app.use(express.static(__dirname + '/'));

app.get('/react', function (request, response) {
    response.sendFile(path.join(__dirname + '/react/default.htm'));
});
app.post('/react/getBookInfo', function (request, response) {
    let search = new AmazonSearch();
    let p = Promise.delayed(resolve => {
        search.lookupBook(request.body.isbn).then(response => resolve(response));
    });

    amazonOperationQueue.push(p);

    p.then(obj => response.send(obj));
});