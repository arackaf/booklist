import { httpPost } from 'easy-express-controllers';
import UserDAO from '../dataAccess/userDAO';

class userController {
    constructor(){}
    @httpPost
    async getPubliclyAvailableUsersName({ _id }){
        let user = await (new UserDAO().getPublicName(_id));
        this.send({ name: user && user.publicName, booksHeader: user && user.publicBooksHeader });
    }
}

module.exports = userController;