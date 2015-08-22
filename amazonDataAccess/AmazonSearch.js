'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var awsCredentials = require('../utils/awsCredentials'); //not checked in - you'll need to use your own
var OperationHelper = require('apac').OperationHelper;
var opHelper = new OperationHelper(awsCredentials);

var _require = require('../utils/nodeHelpers.js');

var nodeCallback = _require.nodeCallback;
var Promise = require('promise');
var AmazonSearch = (function () {
    function AmazonSearch() {
        _classCallCheck(this, AmazonSearch);
    }

    _createClass(AmazonSearch, [{
        key: 'lookupBook',
        value: function lookupBook(isbn) {
            return new Promise(function (resolve, reject) {
                opHelper.execute('ItemLookup', {
                    'SearchIndex': 'Books',
                    'IdType': 'ISBN',
                    'ResponseGroup': 'ItemAttributes,EditorialReview',
                    'ItemId': isbn
                }, nodeCallback(function (results, xml) {
                    // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
                    resolve(projectResponse(results.ItemLookupResponse.Items[0].Item[0]));
                }));
            });
        }
    }]);

    return AmazonSearch;
})();

function projectResponse(item) {
    var attributes = item.ItemAttributes[0],
        result = {
        title: attributes.Title[0],
        isbn: attributes.ISBN[0],
        ean: attributes.EAN[0],
        author: attributes.Author[0],
        pages: attributes.NumberOfPages[0],
        publicationDate: attributes.PublicationDate[0],
        editorialReviews: []
    },
        editorialReviews = item.EditorialReviews && item.EditorialReviews[0] && item.EditorialReviews[0].EditorialReview;

    if (editorialReviews) {
        result.editorialReviews = editorialReviews.map(function (_ref) {
            var Source = _ref.Source;
            var Content = _ref.Content;
            return { source: Source[0], content: Content[0] };
        });
    }
    return result;
}

module.exports = AmazonSearch;