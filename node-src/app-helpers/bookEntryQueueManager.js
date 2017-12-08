import PendingBookEntryDao from "../dataAccess/pendingBookEntryDAO";
import CompletedEntriesDao from "../dataAccess/completedEntriesDAO";
import AmazonSearch from "../amazonDataAccess/amazonSearch.js";
import amazonOperationQueue from "../amazonDataAccess/amazonOperationQueue";
import BookDAO from "../dataAccess/bookDAO";

class BookEntryQueueManager {
  constructor() {
    this.pendingBooksDao = new PendingBookEntryDao();
    this.completedEntriesDao = new CompletedEntriesDao();
    this.localQueue = [];
    this.wsSubscriptions = new Map();
    this.amazonSearch = new AmazonSearch();
  }
  async initialize() {
    this.running = true;
    this.localQueue = await this.pendingBooksDao.getLatest(10);

    if (this.localQueue.length) {
      await this.runQueue();
    } else {
      this.running = false;
      setTimeout(() => this.initialize(), 5000);
    }
  }
  async runQueue() {
    let allItems = this.localQueue.map(item => this.pendingItemToPromise(item));

    allItems.forEach(op => amazonOperationQueue.push(op));
    await Promise.all(allItems).then(() => this.initialize());
  }
  pendingItemToPromise(item) {
    return Promise.delayed(resolve => {
      this.amazonSearch.lookupBook(item.isbn, item.userId).then(async bookFromAmazon => {
        let bookDao = new BookDAO(item.userId);

        if (bookFromAmazon.failure) {
          await this.pendingBooksDao.remove(item._id);
          this.bookLookupFailed(item.userId, item.isbn);
          await this.completedEntriesDao.logFailedEntry(item.userId, item.isbn);
        } else {
          let newBook = Object.assign(bookFromAmazon, { subjects: [] });
          await bookDao.saveBook(newBook);
          await this.pendingBooksDao.remove(item._id);
          this.bookAdded(item.userId, newBook);
          await this.completedEntriesDao.logCompletedEntry(item.userId, item.isbn, bookFromAmazon);
        }
        resolve();
      });
    });
  }
  bookAdded(userId, bookFromAmazon) {
    this.runWsAction(userId, ws => ws.send(JSON.stringify(Object.assign({ _messageType: "bookAdded" }, bookFromAmazon, { saveMessage: "saved" }))));
  }
  bookLookupFailed(userId, isbn) {
    this.runWsAction(userId, ws => ws.send(JSON.stringify({ _messageType: "bookLookupFailed", isbn })));
  }
  async subscriberAdded(userId, ws) {
    let pending = await this.pendingBooksDao.getPendingForUser(userId);
    ws.send(JSON.stringify({ _messageType: "initial", pending }));
    this.wsSubscriptions.set(userId, ws);

    ws.on("close", () => this.wsClosed(userId));
  }
  async addPendingBook(userId, pendingBook) {
    await this.pendingBooksDao.add(pendingBook);
    this.wsMessagePendingBookAdded(userId);
  }
  wsMessagePendingBookAdded(userId) {
    this.runWsAction(userId, ws => ws.send(JSON.stringify(Object.assign({ _messageType: "pendingBookAdded" }))));
  }
  runWsAction(userId, action) {
    let ws = this.wsSubscriptions.get(userId);
    if (ws) {
      if (ws.readyState === 1) {
        action(ws);
      } else {
        this.wsClosed(userId);
      }
    }
  }
  wsClosed(userId) {
    this.wsSubscriptions.delete(userId);
  }
}

const instance = new BookEntryQueueManager();

export default instance;
