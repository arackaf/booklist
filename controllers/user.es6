import { httpPost } from 'easy-express-controllers';
import UserDAO from '../dataAccess/userDAO';

class userController {
    @httpPost
    async getPubliclyAvailableUsersName({ _id }){
        let user = await (new UserDAO().getPublicName(_id));
        this.send({ name: user && user.publicName, booksHeader: user && user.publicBooksHeader });
    }
    @httpPost
    async getPublicUserInfo(){
        let userId = this.request.user.id,
            result = await (new UserDAO().getPublicUserInfo(userId));
        this.send({ info: result });
    }
    @httpPost
    async setPublicUserInfo({isPublic, publicName, publicBooksHeader}){
        let userId = this.request.user.id,
            result = await (new UserDAO().setPublicUserInfo(userId, isPublic, publicName, publicBooksHeader));
        this.send({ });
    }    
}

export default userController;