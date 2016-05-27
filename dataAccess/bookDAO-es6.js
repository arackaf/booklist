const ObjectId = require('mongodb').ObjectID;
const DAO = require('./dao');
const path = require('path');
const fs = require('fs');
const AmazonSearch = require('../amazonDataAccess/AmazonSearch');
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

class BookDAO extends DAO {
    constructor(userId){
        super();
        this.userId = userId;
    }
    async fixBooks(){
        let db = await super.open();
        try {
            let books = await db.collection('books').find({  }).toArray();
            console.log('books length', books.length);
            this.doBooks(books);
        } finally {
            super.dispose(db);
        }

    }
    async doBooks(bookResults){
        let db = await super.open();
        if (!bookResults.length) return;

        let aSearch = new AmazonSearch();

        try {
            let book = await aSearch.lookupBook(bookResults[0].isbn);
            db.collection('books').update({ _id: ObjectId(bookResults[0]._id) }, { $set: { authors: book.authors, publisher: book.publisher } });
            console.log('done with', bookResults[0].title);
            setTimeout(() => this.doBooks(bookResults.slice(1)), 1000);
        } finally{
            super.dispose(db);
        }
    }
    async searchBooks({ search, subjects, searchChildSubjects, sort, sortDirection }){
        subjects = subjects || [];
        let db = await super.open();
        try {
            let query = { userId: this.userId },
                sortObj = { _id: -1 };

            if (search){
                query.title = new RegExp(search, 'gi');
            }

            if (sort){
                sortObj = { [sort]: +sortDirection };
            }

            if (subjects.length){
                if (searchChildSubjects){
                    let allPaths = subjects.map(s => `,${s},`).join('|');
                    let childIds = (await db.collection('subjects').find({ path: { $regex: allPaths }, userId: this.userId }, { _id: 1 }).toArray()).map(o => '' + o._id);

                    subjects.push(...childIds);
                }

                query.subjects = { $in: subjects };
            }
            //may implement $or another way
            //if (query.title && query.subjects){
            //    query.$or = [
            //        { subjects: query.subjects },
            //        { title: query.title }
            //    ];
            //    delete query.subjects;
            //    delete query.title;
            //}
            return (await db.collection('books').find(query).sort(sortObj).toArray()).map(addCreatedOn);
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
    async update(book){
        let db = await super.open();
        try {

            //coming right from the client, so we'll sanitize
            const validProperties = ['title', 'isbn', 'pages', 'publisher', 'publicationDate'];

            let $set = {};
            validProperties.forEach(prop => $set[prop] = (book[prop] || '').substr(0, 500));
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
            await db.collection('books').remove({ _id: ObjectId(id) });
        } finally {
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

        } finally {
            super.dispose(db);
        }
    }
}

function addCreatedOn(book){
    book.dateAdded = +book._id.getTimestamp();
    return book;
}

export default BookDAO;