const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const AmazonSearch = require('../amazonDataAccess/AmazonSearch.js');
const { amazonOperationQueue } = require('../amazonDataAccess/amazonOperationQueue');
const BookDAO = require('../dataAccess/BookDAO');

class bookController{
    constructor(){}
    @httpPost
        async setSubjects(books, add, remove){
        let bookDao = new BookDAO();
        await bookDao.setBooksSubjects(books, add, remove);
        setTimeout(() => this.send({ success: true }), 2000);
    }
}

module.exports = bookController;