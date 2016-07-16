import { httpPost, route, nonRoutable } from 'easy-express-controllers';
import tagDAO from '../dataAccess/tagDAO';

class tagController{
    constructor(){}
    async all({ userId }){
        let tagDao = new tagDAO(this.request.user ? this.request.user.id : null),
            { tags, labelColors } = await tagDao.loadTags(userId);

        this.send({ results: tags, colors: labelColors });
    }
    //@httpPost
    //async setInfo({ _id, name, backgroundColor, textColor, parentId }){
    //    let subjectDao = new SubjectDAO(this.request.user.id),
    //        { affectedSubjects } = await subjectDao.updateSubjectInfo(_id, name, backgroundColor, textColor, parentId || null);
    //
    //    this.send({ affectedSubjects });
    //}
    //@httpPost
    //async delete({ _id }){
    //    let subjectDao = new SubjectDAO(this.request.user.id);
    //    let { subjectsDeleted } = await subjectDao.deleteSubject(_id);
    //    this.send({ success: true, subjectsDeleted });
    //}
}

module.exports = tagController;