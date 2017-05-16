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
                if (!result.ItemLookupResponse || !result.ItemLookupResponse.Items || !result.ItemLookupResponse.Items.Item || !result.ItemLookupResponse.Items.Item.ItemAttributes){
                    resolve({ failure: true });
                } else {
                    resolve(projectResponse(result.ItemLookupResponse.Items.Item));
                }
            }).catch(err => {
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
            pages: +safeAccess(attributes, 'NumberOfPages') || undefined,
            smallImage: safeAccess(safeAccessObject(item, 'SmallImage'), 'URL'),
            mediumImage: safeAccess(safeAccessObject(item, 'MediumImage'), 'URL'),
            publicationDate: safeAccess(attributes, 'PublicationDate'),
            publisher: safeAccess(attributes, 'Publisher'),
            authors: safeArray(attributes, attributes => attributes.Author),
            editorialReviews: safeArray(item, item => item.EditorialReviews.EditorialReview)
        };

    if (typeof result.pages === 'undefined'){
        delete result.pages;
    }
    return result;

    function safeArray(item, lambda){
        try {
            let val = lambda(item);
            if (!val){
                return [];
            } else if (Array.isArray(val)){
                return val;
            } else {
                return [val];
            }
        } catch(err){
            return [];
        }
    }

    function safeAccess(obj, path){
        return obj[path] || '';
    }

    function safeAccessObject(obj, path){
        return obj[path] || {};
    }
}

export default AmazonSearch;