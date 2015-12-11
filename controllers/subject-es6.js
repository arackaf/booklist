const SubjectDAO = require('../dataAccess/SubjectDAO');

class subjectController{
    constructor(){}
    async all(userId){
        let subjectDao = new SubjectDAO(),
            subjects = await subjectDao.loadSubjects(userId);

        this.send({ results: subjects })
    }
}

module.exports = subjectController;