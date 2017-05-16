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
            }).then(({result}) => {
                debugger;
                if (!result.ItemLookupResponse || !result.ItemLookupResponse.Items || !result.ItemLookupResponse.Items.Item || !result.ItemLookupResponse.Items.Item.ItemAttributes){
                    resolve({ failure: true });
                } else {
                    resolve(projectResponse(result.ItemLookupResponse.Items.Item));
                }
            }).catch(err => {
                debugger;
                resolve({ failure: true });
            })
        })
    }
}

function projectResponse(item){
    let attributes = item.ItemAttributes,
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
        return obj[path] || '';
    }

    function safeAccessObject(obj, path){
        return obj[path] || {};
    }
}

export default AmazonSearch;