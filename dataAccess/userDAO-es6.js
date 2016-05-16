import DAO from './dao';
import md5 from 'blueimp-md5';
import salt from '../private/salt';
import { ObjectID } from 'mongodb';
import sendEmail from '../app/sendEmail';

const newUsersSubjects = [
    { name: 'History', path: null },
    { name: 'Science', path: null },
    { name: 'Literature', path: null },
    { name: 'Economics', path: null },
    { name: 'Law', path: null },
    { name: 'Technology', path: null }
]

const siteRoot = 'http://localhost:3000/react-redux';

class UserDAO extends DAO {
    async createUser(email, password, rememberMe){
        let db = await super.open();
        try {
            let activationToken = this.getActivationToken(email),
                newUser = { email, password: this.saltAndHashPassword(password), token: this.saltAndHashToken(email), rememberMe, activationToken };

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
    async activateUser(activationToken){
        let db = await super.open();
        try {
            let user = await db.collection('users').findOne({ activationToken });

            if (!user){
                return { invalid: true }
            }
            if (user.activated){
                return { alreadyActivated: true };
            }

            await db.collection('users').update(
                { _id: user._id },
                {
                    $set: { activated: true },
                    $unset: { rememberMe: '' }
                }
            )
            return { success: true };
        } catch(err){
            console.log('oops', err)
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
    async sendActivationCode(email){
        let code = this.getActivationToken(email),
            url = `${siteRoot}/activate/${code}`;

        await sendEmail({
            to: email,
            subject: 'Activate your My Library account',
            html: `To activate your account, simply click <a href="${url}">here</a>.\n\n\nOr paste this url into a browser ${url}`
        });
    }
    saltAndHashPassword(password){
        return md5(`${salt}${password}${salt}`);
    }
    saltAndHashToken(email){
        return md5(`${salt}${email}${salt}`);
    }
    getActivationToken(email){
        return md5(`${salt}${salt}${email}${salt}${salt}`);
    }
}

export default UserDAO;