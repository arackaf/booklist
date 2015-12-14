const { httpPost, route, nonRoutable } = require('easy-express-controllers');
const SubjectDAO = require('../dataAccess/SubjectDAO');

class subjectController{
    constructor(){}
    async all(userId){
        let subjectDao = new SubjectDAO(),
            subjects = await subjectDao.loadSubjects(userId);

        this.send({ results: subjects })
    }
    @httpPost
    async setInfo(_id, newName, newParent){
        let subjectDao = new SubjectDAO(),
            { affectedSubjects, newInfo } = await subjectDao.updateSubjectInfo(_id, newName, newParent || null);

        this.send({ affectedSubjects, newInfo });
    }
}

module.exports = subjectController;