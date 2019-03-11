import GoodreadsSimilarityLookup from "../goodreadsDataAccess/goodreadsSimilarLookup";
import amazonOperationQueue from "../amazonDataAccess/amazonOperationQueue";
import BookDAO from "../dataAccess/bookDAO";

class BookSimilarityQueueManager {
  constructor() {
    this.localQueue = [];
    this.grSimilarLookup = new GoodreadsSimilarityLookup();
    this.bookDao = new BookDAO();
  }
  async initialize() {
    this.localQueue = await this.bookDao.booksWithoutSimilarity();

    if (this.localQueue.length) {
      await this.runQueue();
    } else {
      setTimeout(() => this.initialize(), 6000);
    }
  }
  async runQueue() {
    let allItems = this.localQueue.map(item => this.pendingItemToPromise(item));

    allItems.forEach(op => amazonOperationQueue.push(op));
    await Promise.all(allItems).then(() => this.initialize());
  }
  pendingItemToPromise(item) {
    return Promise.delayed(resolve => {
      this.grSimilarLookup.lookupBook(item.isbn).then(async booksFromAmazon => {
        await this.bookDao.updateBookSimilarity(item, booksFromAmazon);
        resolve();
      });
    });
  }
}

const instance = new BookSimilarityQueueManager();

export default instance;
