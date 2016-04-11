import DAO from './DAO';
import md5 from 'blueimp-md5';
import salt from '../private/salt';
import { ObjectID } from 'mongodb';

const newUsersSubjects = [
    { name: 'History', path: null },
    { name: 'Science', path: null },
    { name: 'Literature', path: null },
    { name: 'Economics', path: null },
    { name: 'Law', path: null },
    { name: 'Technology', path: null }
]

class UserDAO extends DAO {
    async createUser(email, password){
        let db = await super.open();
        try {
            let newUser = { email, password: this.saltAndHashPassword(password), token: this.saltAndHashToken(email) };
            await db.collection('users').insert(newUser);
            let subjectsToInsert = newUsersSubjects.map(s => ({ ...s, userId: '' + newUser._id }));
            await db.collection('subjects').insert(subjectsToInsert);
            return newUser;
        } catch(eee){
            console.log(eee);
        } finally{
            super.dispose(db);
        }
    }
    async lookupUser(email, password){
        let db = await super.open();
        try {
            return await db.collection('users').findOne({ email: new RegExp(email, 'i'), password: this.saltAndHashPassword(password) });
        } finally{
            super.dispose(db);
        }
    }
    async checkUserExists(email, password){
        let db = await super.open();
        try {
            return !!(await db.collection('users').findOne({ email: new RegExp(email, 'i') }));
        } finally{
            super.dispose(db);
        }
    }
    async lookupUserByToken(token){
        let db = await super.open();
        try {
            return await db.collection('users').findOne({ token });
        } finally{
            super.dispose(db);
        }
    }
    async findById(_id){
        let db = await super.open();
        try {
            return await db.collection('users').findOne({ _id: ObjectID(_id) });
        } finally{
            super.dispose(db);
        }
    }
    saltAndHashPassword(password){
        return md5(`${salt}${password}${salt}`);
    }
    saltAndHashToken(email){
        return md5(`${salt}${email}${salt}`);
    }
}

export default UserDAO;