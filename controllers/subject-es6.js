const SubjectDAO = require('../dataAccess/SubjectDAO');

class subjectController{
    constructor(){}
    async all(){
        let subjectDao = new SubjectDAO(),
            subjects = await subjectDao.loadSubjects();

        this.send({ results: subjects })
    }
}

module.exports = subjectController;