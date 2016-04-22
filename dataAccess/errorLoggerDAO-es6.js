const DAO = require('./dao');

class ErrorLoggerDAO extends DAO {
    constructor(userId) {
        super();
        this.userId = userId;
    }
    async log(type, err){
        let db = await super.open();
        try {
            return await db.collection('errorLog').insert({ type, error: err, stack: err.stack || '' });
        } finally {
            super.dispose(db);
        }
    }
}

export default ErrorLoggerDAO;