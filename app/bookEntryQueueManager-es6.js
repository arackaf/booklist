import PendingBookEntryDao from '../dataAccess/pendingBookEntryDAO';
import AmazonSearch from '../amazonDataAccess/AmazonSearch.js';
import amazonOperationQueue from '../amazonDataAccess/amazonOperationQueue';
import BookDAO from '../dataAccess/bookDAO';

class BookEntryQueueManager {
    constructor(){
        this.pendingBooksDao = new PendingBookEntryDao();
        this.localQueue = [];
        this.wsSubscriptions = new Map();
        this.amazonSearch = new AmazonSearch()
    }
    async initialize(){
        this.running = true;
        this.localQueue = await this.pendingBooksDao.getLatest(10);

        if (this.localQueue.length) {
            await this.runQueue();
        } else {
            this.running = false;
        }
    }
    async runQueue(){
        let allItems = this.localQueue.map(item => this.pendingItemToPromise(item));

        allItems.forEach(op => amazonOperationQueue.push(op));
        await Promise.all(allItems).then(() => this.initialize());
    }
    pendingItemToPromise(item){
        return Promise.delayed(resolve => {
            this.amazonSearch.lookupBook(item.isbn).then(async bookFromAmazon => {
                let bookDao = new BookDAO(item.userId);

                if (bookFromAmazon.failure){
                    //TODO: log it
                } else {
                    //TODO: Log and save it
                    let newBook = Object.assign(bookFromAmazon, { subjects: [] });
                    await bookDao.saveBook(newBook);
                    await this.pendingBooksDao.remove(item._id);
                    console.log(newBook);
                    this.bookAdded(item.userId, newBook);
                }
                resolve();
            });
        });
    }
    bookAdded(userId, bookFromAmazon){
        //TODO: check if closed
        let ws = this.wsSubscriptions.get(userId);
        if (ws){
            if (ws.readyState === 1) {
                ws.send(JSON.stringify(Object.assign({ _messageType: 'bookAdded' }, bookFromAmazon, {saveMessage: 'saved'})));
            } else {
                this.wsClosed(userId);
            }
        }
    }
    async subscriberAdded(userId, ws) {
        let pending = await this.pendingBooksDao.getPendingForUser(userId);
        ws.send(JSON.stringify({ _messageType: 'initial', pending}));
        this.wsSubscriptions.set(userId, ws);

        ws.on('close', () => this.wsClosed(userId));
    }
    async addPendingBook(item){
        await this.pendingBooksDao.add(item);
        if (!this.running){
            this.initialize();
        }
    }
    wsClosed(userId){
        console.log('closing', userId);
        this.wsSubscriptions.delete(userId);
    }
}

const instance = new BookEntryQueueManager();

export default instance;