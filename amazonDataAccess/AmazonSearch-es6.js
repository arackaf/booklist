var awsCredentials = require('../utils/awsCredentials'), //not checked in - you'll need to use your own
    OperationHelper = require('apac').OperationHelper,
    opHelper = new OperationHelper(awsCredentials),
    { nodeCallback } = require('../utils/nodeHelpers.js'),
    Promise = require('promise');

class AmazonSearch{
    constructor(){ }
    lookupBook(isbn){
        return new Promise(function(resolve, reject){
            opHelper.execute('ItemLookup', {
                'SearchIndex': 'Books',
                'IdType': 'ISBN',
                'ResponseGroup': 'ItemAttributes,EditorialReview',
                'ItemId': isbn
            }, nodeCallback(function (results, xml) { // you can add a third parameter for the raw xml response, "results" here are currently parsed using xml2js
                if (!results.ItemLookupResponse || !results.ItemLookupResponse.Items || !results.ItemLookupResponse.Items[0] || !results.ItemLookupResponse.Items[0].Item || !results.ItemLookupResponse.Items[0].Item[0] || !results.ItemLookupResponse.Items[0].Item[0].ItemAttributes || !results.ItemLookupResponse.Items[0].Item[0].ItemAttributes[0]){
                    resolve({ failure: true });
                } else {
                    resolve(projectResponse(results.ItemLookupResponse.Items[0].Item[0]));
                }
            }));
        });
    }
}

function projectResponse(item){
    let attributes = item.ItemAttributes[0],
        result = {
            title: safeAccess(attributes, 'Title'),
            isbn: safeAccess(attributes, 'ISBN'),
            ean: safeAccess(attributes, 'EAN'),
            author: safeAccess(attributes, 'Author'),
            pages: safeAccess(attributes, 'NumberOfPages'),
            publicationDate: safeAccess(attributes, 'PublicationDate'),
            editorialReviews: []
        },
        editorialReviews = item.EditorialReviews && item.EditorialReviews[0] && item.EditorialReviews[0].EditorialReview;

    if (editorialReviews){
        result.editorialReviews = editorialReviews.map(({ Source, Content }) => ({ source: Source[0], content: Content[0]  }));
    }
    return result;

    function safeAccess(obj, path){
        return (obj[path] && obj[path][0]) || '';
    }
}

module.exports = AmazonSearch;