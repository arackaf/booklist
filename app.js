'use strict';

var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var AmazonSearch = require('./amazonDataAccess/AmazonSearch.js');
var BookDAO = require('./dataAccess/BookDAO.js');

require('regenerator/runtime');
global.Promise = require('promise');

var aSearch = new AmazonSearch(),
    bookDAO = new BookDAO(1);
aSearch.lookupBook('0679764410').then(function (book) {
    return bookDAO.saveBook(book);
}).then(function () {
    return console.log('Book Saved');
}, function (err) {
    return console.log('Oops - error', err);
});

0 && MongoClient.connect('mongodb://localhost:27017/mongotest').then(function (db) {
    try {
        //db.collections(function(e, cols) {
        //    cols.forEach(function(col) {
        //        console.log(col.collectionName); //WORKS just fine
        //    });
        //});

        var foo = db.collection('foo');
        var fooResults = foo.find();

        fooResults.forEach(function (item) {
            console.log(item);
        });

        //db.foos.find(); //[TypeError: Cannot call method 'find' of undefined]
        //db.foo.find(); //[TypeError: Cannot call method 'find' of undefined]
    } catch (ex) {
        console.log(ex);
    } finally {
        setTimeout(function () {
            db.close();
        }, 2000);
    }
});

if (0) {

    app.use(bodyParser.json()); // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
        extended: true
    }));

    app.listen(3000);

    app.get('/react', function (request, response) {
        response.sendFile(path.join(__dirname + '/react/default.htm'));
    });

    app.post('/react', function (request, response) {
        console.log('requesting ' + request.body.book1);
        response.sendFile(path.join(__dirname + '/react/default.htm'));
    });
}