const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');
const { amazonOperationQueue } = require('../amazonDataAccess/amazonOperationQueue');
const BookDAO = require('../dataAccess/bookDAO');

class bookController{
    constructor(){}
    @httpPost
        async setSubjects(books, add, remove){
        let bookDao = new BookDAO();
        await bookDao.setBooksSubjects(books, add, remove);
        this.send({ success: true });
    }
}

module.exports = bookController;