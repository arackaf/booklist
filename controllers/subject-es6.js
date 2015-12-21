const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const SubjectDAO = require('../dataAccess/SubjectDAO');

class subjectController{
    constructor(){}
    async all(){
        let subjectDao = new SubjectDAO(this.request.user.id),
            subjects = await subjectDao.loadSubjects();

        this.send({ results: subjects })
    }
    @httpPost
    async setInfo(_id, newName, newParent){
        let subjectDao = new SubjectDAO(1),
            { affectedSubjects, existingParent } = await subjectDao.updateSubjectInfo(_id, newName, newParent || null);

        this.send({ affectedSubjects, existingParent });
    }
}

module.exports = subjectController;