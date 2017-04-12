var awsCredentials = {
    awsId: process.env.AWS_ID,
    awsSecret: process.env.AWS_SECRET,
    assocId: process.env.ASSOC_ID
};

var OperationHelper = require('apac').OperationHelper,
    opHelper = new OperationHelper(awsCredentials),
    { nodeCallback } = require('../app-helpers/nodeHelpers.js');

class AmazonSearch{
    constructor(){ }
    lookupBook(isbn){
        return new Promise(function(resolve, reject){
            opHelper.execute('ItemLookup', {
                'SearchIndex': 'Books',
                'IdType': 'ISBN',
                'ResponseGroup': 'ItemAttributes,EditorialReview,Images',
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
            pages: +safeAccess(attributes, 'NumberOfPages') || undefined,
            smallImage: safeAccess(safeAccessObject(item, 'SmallImage'), 'URL'),
            mediumImage: safeAccess(safeAccessObject(item, 'MediumImage'), 'URL'),
            publicationDate: safeAccess(attributes, 'PublicationDate'),
            publisher: safeAccess(attributes, 'Publisher'),
            editorialReviews: []
        },
        editorialReviews = item.EditorialReviews && item.EditorialReviews[0] && item.EditorialReviews[0].EditorialReview;

        result.authors = attributes.Author;

    if (typeof result.pages === 'undefined'){
        delete result.pages;
    }

    if (editorialReviews){
        result.editorialReviews = editorialReviews.map(({ Source, Content }) => ({ source: Source[0], content: Content[0]  }));
    }
    return result;

    function safeAccess(obj, path){
        return (obj[path] && obj[path][0]) || '';
    }

    function safeAccessObject(obj, path){
        return (obj[path] && obj[path][0]) || {};
    }
}

export default AmazonSearch;