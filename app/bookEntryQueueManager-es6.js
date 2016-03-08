import PendingBookEntryDao from '../dataAccess/pendingBookEntryDAO';
import AmazonSearch from '../amazonDataAccess/AmazonSearch.js';
import amazonOperationQueue from '../amazonDataAccess/amazonOperationQueue';
import BookDAO from '../dataAccess/bookDAO';

class BookEntryQueueManager {
    constructor(){
        this.pendingBooksDao = new PendingBookEntryDao();
        this.localQueue = [];
        this.wsSubscriptions = new Map();
    }
    async initialize(){
        this.localQueue = await this.pendingBooksDao.getLatest(10);
        if (this.localQueue.length) {
            await this.runQueue();
        }
    }
    async runQueue(){
        let item = this.localQueue.shift(),
            search = new AmazonSearch(),
            p = Promise.delayed(resolve => {
                search.lookupBook(item.isbn).then(response => resolve(response));
            });

        amazonOperationQueue.push(p);
        let bookFromAmazon = await p;

        if (bookFromAmazon.failure){
            //this.send({ failure: true });
        } else {
            let bookDao = new BookDAO(item.userId);
            await bookDao.saveBook(bookFromAmazon);
            //await this.pendingBooksDao.remove(item._id);
            this.bookAdded(item.userId, bookFromAmazon);
            //this.send(bookFromAmazon);
        }

        if (this.localQueue.length){
            //this.runQueue();
        }
    }
    async subscriberAdded(userId, ws){
        let pending = await this.pendingBooksDao.getPendingForUser(userId);
        ws.send(JSON.stringify({ pending }));
        this.wsSubscriptions.set(userId, ws);
    }
    bookAdded(userId, bookFromAmazon){
        this.wsSubscriptions.get(userId).send(JSON.stringify(Object.assign({}, bookFromAmazon, { saveMessage: 'saved' })));
    }
}

const instance = new BookEntryQueueManager();

export default instance;