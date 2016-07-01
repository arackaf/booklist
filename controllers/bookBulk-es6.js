import { httpPost, route, nonRoutable } from 'easy-express-controllers';
import AmazonSearch from '../amazonDataAccess/AmazonSearch.js';
import { amazonOperationQueue } from '../amazonDataAccess/amazonOperationQueue';
import BookDAO from '../dataAccess/bookDAO';

class bookController{
    constructor(){}
    @httpPost
    async setSubjects(books, add, remove){
        try {
            let bookDao = new BookDAO();
            await bookDao.setBooksSubjects(books, add, remove);
            this.send({success: true});
        } catch(errr){ console.log(errr); }
    }
}

export default bookController;