var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var awsCredentials = require('./utils/awsCredentials'); //not checked in - you'll need to use your own

var util = require('util'),
    OperationHelper = require('apac').OperationHelper;

var opHelper = new OperationHelper(awsCredentials);


opHelper.execute('ItemSearch', {
    'SearchIndex': 'Books',
    'Keywords': 'harry potter',
    'ResponseGroup': 'ItemAttributes'
}, function(err, results, xml) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
    //console.log(results.ItemSearchResponse);
    console.log(results.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0]);
    console.log(results.ItemSearchResponse.Items[0].Item[0].ItemAttributes[0].Title);
});

//MongoClient.connect('mongodb://localhost:27017/mongotest', function(err, db){
//    db.close();
//});

if (0) {

    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
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