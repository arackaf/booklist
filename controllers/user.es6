import { httpPost } from 'easy-express-controllers';
import UserDAO from '../dataAccess/userDAO';

class userController {
    @httpPost
    async getPubliclyAvailableUsersName({ _id }){
        let user = await (new UserDAO().getPublicName(_id));
        this.send({ name: user && user.publicName, booksHeader: user && user.publicBooksHeader });
    }
    @httpPost
    async getBasicUserInfo(){
        let userId = this.request.user.id,
            result = await (new UserDAO().getBasicUserInfo(userId));
        this.send({ info: result });
    }
}

export default userController;