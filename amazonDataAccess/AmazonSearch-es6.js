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
                resolve(projectResponse(results.ItemLookupResponse.Items[0].Item[0]));
            }));
        });
    }
}

function projectResponse(item){
    let attributes = item.ItemAttributes[0],
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

    if (editorialReviews){
        result.editorialReviews = editorialReviews.map(({ Source, Content }) => ({ source: Source[0], content: Content[0]  }));
    }
    return result;
}

module.exports = AmazonSearch;