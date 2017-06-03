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
                    if (!result.ItemLookupResponse || !result.ItemLookupResponse.Items || !result.ItemLookupResponse.Items.Item || !result.ItemLookupResponse.Items.Item.ItemAttributes) {
                        let itemsArray = result.ItemLookupResponse.Items.Item;

                        if (Array.isArray(itemsArray)){
                            //multiple sent back - pick the best
                            let paperbacks = itemsArray.filter(i => i.ItemAttributes && (('' + i.ItemAttributes.Binding).toLowerCase() == 'paperback'));
                            if (paperbacks.length === 1) {
                                resolve(projectResponse(paperbacks[0]));
                            } else if (paperbacks.length === 0) {
                                resolve({ failure: true });
                            } else {
                                //merge them I guess
                                let item = {
                                    ItemAttributes: paperbacks.reduce((attrs, item) => Object.assign(attrs, item.ItemAttributes || {}), {}),
                                    EditorialReviews: paperbacks[0].EditorialReviews
                                }

                                item.SmallImage = paperbacks.map(item => item.SmallImage).find(s => s);
                                item.MediumImage = paperbacks.map(item => item.MediumImage).find(m => m);                                

                                for (let i = 1; i < paperbacks.length; i++){
                                    if (editorialReviewsCount(paperbacks[i]) > editorialReviewsCount(item.EditorialReviews)){
                                        item.EditorialReviews = paperbacks[i].EditorialReviews;
                                    }
                                }

                                resolve(projectResponse(item));

                                function editorialReviewsCount(EditorialReviews){
                                    if (!EditorialReviews || !EditorialReviews.EditorialReview) return 0;
                                    if (typeof EditorialReviews.EditorialReview === 'object'){
                                        return 1;
                                    } else if (Array.isArray(EditorialReviews.EditorialReview)) {
                                        return EditorialReviews.EditorialReview.length;
                                    }
                                    return 0;
                                }
                            }
                        } else {
                            resolve({ failure: true });
                        }
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