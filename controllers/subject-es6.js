import { httpPost, route, nonRoutable } from 'easy-express-controllers';
import SubjectDAO from '../dataAccess/subjectDAO';

class subjectController{
    constructor(){}
    async all(){
        let subjectDao = new SubjectDAO(this.request.user.id),
            { subjects, labelColors } = await subjectDao.loadSubjects();

        this.send({ results: subjects, colors: labelColors });
    }
    @httpPost
    async setInfo(_id, name, backgroundColor, textColor, parentId){
        let subjectDao = new SubjectDAO(this.request.user.id),
            { affectedSubjects } = await subjectDao.updateSubjectInfo(_id, name, backgroundColor, textColor, parentId || null);

        this.send({ affectedSubjects });
    }
    @httpPost
    async delete(_id){
        let subjectDao = new SubjectDAO(this.request.user.id);
        let { subjectsDeleted } = await subjectDao.deleteSubject(_id);
        this.send({ success: true, subjectsDeleted });
    }
}

module.exports = subjectController;