import PendingBookEntryDao from '../dataAccess/pendingBookEntryDAO';

class BookEntryQueueManager {
    constructor(){
        this.pendingBooksDao = new PendingBookEntryDao();
        this.localQueue = [];
        this.wsSubscriptions = new Map();
    }
    async initialize(){
        this.localQueue = await this.pendingBooksDao.getLatest(10);
    }
    async subscriberAdded(userId, ws){
        let pending = await this.pendingBooksDao.getPendingForUser(userId);
        console.log('sending', pending);
        ws.send(JSON.stringify({ pending }));
        this.wsSubscriptions.set(userId, ws);
    }
}

const instance = new BookEntryQueueManager();

export default instance;