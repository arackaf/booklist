import DAO from './dao';
import md5 from 'blueimp-md5';
import { ObjectID } from 'mongodb';
import sendEmail from '../app-helpers/sendEmail';

var salt = process.env.SALT;

const newUsersSubjects = [
    { name: 'History', path: null },
    { name: 'Science', path: null },
    { name: 'Literature', path: null },
    { name: 'Economics', path: null },
    { name: 'Law', path: null },
    { name: 'Technology', path: null }
]

const siteRoot = process.env.NODE_ENV == 'production' ? 'http://mylibrary.io' : 'http://localhost:8080';

class UserDAO extends DAO {
    async createUser(email, password, rememberMe){
        email = email.toLowerCase();
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
        email = email.toLowerCase();
        let db = await super.open();
        try {
            return await db.collection('users').findOne({ activated: true, email, password: this.saltAndHashPassword(password) });
        } finally{
            super.dispose(db);
        }
    }
    async getPublicDisplayInfo(_id){
        let db = await super.open();
        try {
            return await db.collection('users').findOne({ _id: ObjectID(_id), isPublic: true });
        } finally {
            super.dispose(db);
        }
    }
    async checkUserExists(email, password){
        email = email.toLowerCase();
        let db = await super.open();
        try {
            return !!(await db.collection('users').findOne({ email }));
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
            return { success: true, rememberMe: user.rememberMe, username: user.email, _id: user._id, id: user._id, token: user.token };
        } catch(err){
            console.log('oops', err)
        } finally{
            super.dispose(db);
        }
    }
    async getPublicSettings(_id){
        let db = await super.open();
        try {
            let user = await db.collection('users').findOne({ _id: ObjectID(_id) });
            return {isPublic: user.isPublic, publicBooksHeader: user.publicBooksHeader || '', publicName: user.publicName || ''};
        } catch(Err){ console.log(Err);} finally{
            super.dispose(db);
        }
    }
    async setPublicSettings(_id, isPublic, publicName, publicBooksHeader){
        if (!isPublic){
            publicName = '';
            publicBooksHeader = '';
        }

        let db = await super.open();
        try {
            let user = await db.collection('users').findOne({ _id: ObjectID(_id) });
            await db.collection('users').update({ _id: ObjectID(_id) }, { $set: { isPublic, publicName, publicBooksHeader } });
        } finally{
            super.dispose(db);
        }
    }
    async resetPassword(_id, oldPassword, newPassword){
        let db = await super.open();
        try {
            let user = await db.collection('users').findOne({ _id: ObjectID(_id), password: this.saltAndHashPassword(oldPassword) });
            if (!user){
                return {error: 1};
            }
            await db.collection('users').update({ _id: ObjectID(_id) }, { $set: { password: this.saltAndHashPassword(newPassword) } });
            return {success: true};
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
        email = email.toLowerCase();
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
        email = email.toLowerCase();
        return md5(`${salt}${email}${salt}`);
    }
    getActivationToken(email){
        email = email.toLowerCase();
        return md5(`${salt}${salt}${email}${salt}${salt}`);
    }
}

export default UserDAO;