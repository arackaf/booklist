import { httpPost, route, nonRoutable } from 'easy-express-controllers';
import tagDAO from '../dataAccess/tagDAO';

class tagController{
    async all({ userId }){
        let tagDao = new tagDAO(this.request.user ? this.request.user.id : null),
            { tags, labelColors } = await tagDao.loadTags(userId);

        this.send({ results: tags, colors: labelColors });
    }
    @httpPost
    async setInfo({ _id, name, backgroundColor, textColor, parentId }){
        let tagDao = new tagDAO(this.request.user.id),
            { tag } = await tagDao.updateTagInfo(_id, name, backgroundColor, textColor);

        this.send({ tag });
    }
    @httpPost
    async delete({ _id }){
        let tagDao = new tagDAO(this.request.user.id);
        await tagDao.deleteTag(_id);
        this.send({ success: true });
    }
}

export default tagController;