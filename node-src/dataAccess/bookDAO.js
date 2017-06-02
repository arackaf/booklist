import { ObjectId } from 'mongodb';
import DAO from './dao';

import moment from 'moment';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';
AWS.config.region = 'us-east-1';

class BookDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async searchBooks({ search, subjects = [], page, pageSize, searchChildSubjects, tags = [], sort, sortDirection, author, publisher, pages, pagesOperator, isRead, userId }){
        let db = await super.open(),
            userIdToUse = userId || this.userId;

        let skip = (page - 1) * pageSize,
            limit = +pageSize + 1;

        try {
            let query = { userId: userIdToUse },
                sortObj = { _id: -1 };

            if (isRead === 1 || isRead === '1'){
                query.isRead = true;
            } else if (isRead === 0 || isRead === '0'){
                query.isRead = { $ne: true };
            }

            if (search){
                query.title = new RegExp(search, 'gi');
            }
            if (sort){
                if (sort == 'title'){
                    sort = 'titleLower';
                } 
                sortObj = { [sort]: +sortDirection };
            }
            if (author){
                query.authors = { $in: [new RegExp(author, 'gi')] };
            }
            if (publisher){
                query.publisher = new RegExp(publisher, 'gi');
            }
            if (pages){
                if (pagesOperator == 'gt'){
                    query.pages = { $gt: +pages };
                } else {
                    query.pages = { $lt: +pages };
                }
            }

            if (subjects.length){
                if (searchChildSubjects){
                    let allPaths = subjects.map(s => `,${s},`).join('|');
                    let childIds = (await db.collection('subjects').find({ path: { $regex: allPaths }, userId: userIdToUse }, { _id: 1 }).toArray()).map(o => '' + o._id);

                    subjects.push(...childIds);
                }

                query.subjects = { $in: subjects };
            }
            
            if (tags.length){
                query.tags = { $in: tags };
            }
            //may implement $or another way
            //if (query.title && query.subjects){
            //    query.$or = [
            //        { subjects: query.subjects },
            //        { title: query.title }
            //    ];
            //    delete query.subjects;
            //    delete query.title;
            //}//
            let allFields = ['_id', 'title', 'isbn', 'ean', 'pages', 'smallImage', 'mediumImage', 'publicationDate', 'userId', 'subjects', 'authors', 'publisher', 'tags', 'isRead'],
                project = Object.assign({}, allFields.reduce((hash, key) => (hash[key] = 1, hash), {}), { titleLower: { $toLower: '$title' } });

            return (await db.collection('books').aggregate([{$match: query}, {$project: project}, {$sort: sortObj}, {$skip: skip}, {$limit: limit}]).toArray()).map(adjustForClient);
        } finally {
            super.dispose(db);
        }
    }
    async saveBook(book){
        let db = await super.open();
        try {
            book.userId = this.userId;
            let result = await db.collection('books').insert(book);

            super.confirmSingleResult(result);
        } finally {
            super.dispose(db);
        }
    }
    async saveManual(book){
        let db = await super.open();
        try {
            let bookToInsert = {};
            bookToInsert.userId = this.userId;

            //coming right from the client, so we'll sanitize
            const validProperties = ['title', 'isbn', 'pages', 'publisher', 'publicationDate'];
            validProperties.forEach(prop => bookToInsert[prop] = (book[prop] || '').substr(0, 500));
            bookToInsert.authors = (book.authors || []).filter(a => a).map(a => ('' + a).substr(0, 500));

            if (bookToInsert.pages || bookToInsert.pages === '0'){
                bookToInsert.pages = +bookToInsert.pages;
            } else {
                delete bookToInsert.pages;
            }

            if (book.smallImage){
                try {
                    let smallImageSavedToAws = await this.saveToAws(book.smallImage);
                    bookToInsert.smallImage = smallImageSavedToAws;
                } catch(err){
                    //for now just proceed and save the rest of the book
                }
            }

            let result = await db.collection('books').insert(bookToInsert);

            super.confirmSingleResult(result);
        } finally {
            super.dispose(db);
        }
    }
    saveToAws(webPath){
        return new Promise((res, rej) => {
            fs.readFile('.' + webPath, (err, data) => {
                if (err) return rej(err);

                let s3bucket = new AWS.S3({params: {Bucket: 'my-library-cover-uploads'}}),
                    params = {
                        Key: `bookCovers/${this.userId}/${path.basename(webPath)}`,
                        Body: data
                    };

                s3bucket.upload(params, function (err) {
                    if (err) rej(err);
                    else res(`http://my-library-cover-uploads.s3-website-us-east-1.amazonaws.com/${params.Key}`);
                });
            });
        })
    }
    async deleteBook(id){
        let db = await super.open();
        try {
            await db.collection('books').remove({ _id: ObjectId(id), userId: this.userId });
        } finally {
            super.dispose(db);
        }
    }
    async update(book){
        let db = await super.open();
        try {

            //coming right from the client, so we'll sanitize
            const validProperties = ['title', 'isbn', 'pages', 'publisher', 'publicationDate'];

            let $set = {};
            validProperties.forEach(prop => {
                let val = book[prop] || '';
                if (prop === 'pages'){
                    let pagesVal = val || val === '0' ? +val : '';
                    $set[prop] = pagesVal;
                } else if (typeof val === 'string') {
                    $set[prop] = val.substr(0, 500)
                }
            });
            $set.authors = (book.authors || []).filter(a => a).map(a => ('' + a).substr(0, 500));

            if (book.smallImage){
                try {
                    let smallImageSavedToAws = await this.saveToAws(book.smallImage);
                    $set.smallImage = smallImageSavedToAws;
                } catch(err){
                    //for now just proceed and save the rest of the book
                }
            }

            await db.collection('books').update({ _id: ObjectId(book._id), userId: this.userId }, { $set });
        } finally{
            super.dispose(db);
        }
    }
    async setBooksSubjects(books, add, remove){
        let db = await super.open();
        try{
            await db.collection('books').update(
                { _id: { $in: books.map(_id => ObjectId(_id)) } },
                { $addToSet: { subjects: { $each: (add || []) } } }, { upsert: false, multi: true }
            );

            await db.collection('books').update(
                { _id: { $in: books.map(_id => ObjectId(_id)) } },
                { $pullAll: { subjects: (remove || []) } }, { upsert: false, multi: true }
            );

        } catch(errr){ console.log(errr); } finally {
            super.dispose(db);
        }
    }
    async setBooksTags(books, add, remove){
        let db = await super.open();
        try{
            await db.collection('books').update(
                { _id: { $in: books.map(_id => ObjectId(_id)) } },
                { $addToSet: { tags: { $each: (add || []) } } }, { upsert: false, multi: true }
            );

            await db.collection('books').update(
                { _id: { $in: books.map(_id => ObjectId(_id)) } },
                { $pullAll: { tags: (remove || []) } }, { upsert: false, multi: true }
            );

        } catch(errr){ console.log(errr); } finally {
            super.dispose(db);
        }
    }
    async setRead(_ids, isRead){
        let db = await super.open();
        try{
            await db.collection('books').update(
                { _id: { $in: _ids.map(_id => ObjectId(_id)) }, userId: this.userId },
                { $set: { isRead } }, { multi: true }
            );
        } finally {
            super.dispose(db);
        }
    }
}

function adjustForClient(book){
    book.dateAdded = +book._id.getTimestamp();
    if (/\d{4}-\d{2}-\d{2}/.test(book.publicationDate)){
        book.publicationDate = moment(book.publicationDate).format('MMMM Do YYYY');
    }
    return book;
}

export default BookDAO;