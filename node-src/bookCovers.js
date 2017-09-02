import DAO from './dataAccess/dao';
import AmazonSearch from './amazonDataAccess/amazonSearch';

module.exports = async function fixBookCovers(){
    try {
        let db = await DAO.init();
        let books = (await db.collection('books').find({ smallImage: /http:\/\/./ }).toArray());

        if (!books.length) return;

        for(let book of books){
            let amazonResult = await getFreshInfo(book);

            let dbUpdate = {};
            if (amazonResult.smallImage && /https:\/\/./.test(amazonResult.smallImage)){
                dbUpdate.smallImage = amazonResult.smallImage;
            }
            if (amazonResult.mediumImage && /https:\/\/./.test(amazonResult.mediumImage)){
                dbUpdate.mediumImage = amazonResult.mediumImage;
            }
            if (dbUpdate.smallImage || dbUpdate.mediumImage){
                db.update({_id: book._id}, dbUpdate);
            }
        }

        //fixBookCovers();
    } catch(err){
        console.log(err)
    }
};

async function getFreshInfo(book){
    let amazon = new AmazonSearch();
    return Promise.all([
        amazon.lookupBook(book.isbn),
        new Promise(res => setTimeout(res, 1000))
    ]).then(([amazonResult]) => amazonResult);
}