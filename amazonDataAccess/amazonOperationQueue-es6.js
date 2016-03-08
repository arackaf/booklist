let _timer = Symbol('aws'),
    _lastRun = Symbol('lastRun'),
    _startOp = Symbol('startItem');

//Amazon only allows 1 request per second.  This class implements a queue that ensures this limit is not violated
export class AmazonQueue{
    constructor(){
        this.queue = [];
        this[_lastRun] = 0;
    }
    push(op){
        if (!op.start){
            throw 'Something other than a delayed promise passed to the Amazon queue';
        }

        this.queue.push(op);
        if (!this[_timer]){ //nothing's running - kick it off
            this.runNext();
        }
    }
    runNext(){
        let opToRun = this.queue.shift();
        this[_timer] = setTimeout(() => this[_startOp](opToRun), currentlyNeededDelay(this[_lastRun]));
    }
    [_startOp](opToRun){
        opToRun.start().then(() => {
            this[_lastRun] = +new Date();
            this.finishedItem()
        });
    }
    finishedItem(){
        this[_timer] = null;
        if (this.queue.length){
            this.runNext();
        }
    }
}

AmazonQueue.AWS_DELAY = 1050; //1 second plus a teeny safety factor because why not

function currentlyNeededDelay(lastRun = 0){
    let currentTime = +new Date(),
        currentlyElapsedSinceLastRun = currentTime - lastRun,
        neededDelay = AmazonQueue.AWS_DELAY - currentlyElapsedSinceLastRun;

    return Math.max(neededDelay, 0); //might be negative, in which case we need no delay
}

export default new AmazonQueue();