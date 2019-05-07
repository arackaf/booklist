let _timer = Symbol("aws");
let _startOp = Symbol("startItem");

//Amazon only allows 1 request per second.  This class implements a queue that ensures this limit is not violated
export class AmazonQueue {
  constructor() {
    this.queue = [];
  }
  push(op) {
    if (!op.start) {
      throw "Something other than a delayed promise passed to the Amazon queue";
    }

    this.queue.push(op);
    if (!this[_timer]) {
      //nothing's running - kick it off
      this.runNext();
    }
  }
  runNext() {
    let opToRun = this.queue.shift();
    this[_timer] = setTimeout(() => this[_startOp](opToRun), AmazonQueue.AWS_DELAY);
  }
  [_startOp](opToRun) {
    opToRun.start().then(() => {
      this.finishedItem();
    });
  }
  finishedItem() {
    this[_timer] = null;
    if (this.queue.length) {
      this.runNext();
    }
  }
}

AmazonQueue.AWS_DELAY = 1050; //1 second plus a teeny safety factor because why not

export default new AmazonQueue();
