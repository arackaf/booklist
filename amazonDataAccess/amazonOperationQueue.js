'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _timer = Symbol('aws'),
    _lastRun = Symbol('lastRun'),
    _startOp = Symbol('startItem');

//Amazon only allows 1 request per second.  This class implements a queue that ensures this limit is not violated

var AmazonQueue = (function () {
    function AmazonQueue() {
        _classCallCheck(this, AmazonQueue);

        this.queue = [];
        this[_lastRun] = 0;
    }

    _createClass(AmazonQueue, [{
        key: 'push',
        value: function push(op) {
            if (!op.start) {
                throw 'Something other than a delayed promise passed to the Amazon queue';
            }

            this.queue.push(op);
            if (!this[_timer]) {
                //nothing's running - kick it off
                this.runNext();
            }
        }
    }, {
        key: 'runNext',
        value: function runNext() {
            var _this = this;

            var opToRun = this.queue.shift();
            this[_timer] = setTimeout(function () {
                return _this[_startOp](opToRun);
            }, currentlyNeededDelay(this[_lastRun]));
        }
    }, {
        key: _startOp,
        value: function value(opToRun) {
            var _this2 = this;

            opToRun.start().then(function () {
                _this2[_lastRun] = +new Date();
                _this2.finishedItem();
            });
        }
    }, {
        key: 'finishedItem',
        value: function finishedItem() {
            this[_timer] = null;
            if (this.queue.length) {
                this.runNext();
            }
        }
    }]);

    return AmazonQueue;
})();

AmazonQueue.AWS_DELAY = 1050; //1 second plus a teeny safety factor because why not

function currentlyNeededDelay() {
    var lastRun = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var currentTime = +new Date(),
        currentlyElapsedSinceLastRun = currentTime - lastRun,
        neededDelay = AmazonQueue.AWS_DELAY - currentlyElapsedSinceLastRun;

    return Math.max(neededDelay, 0); //might be negative, in which case we need no delay
}

module.exports = {
    AmazonQueue: AmazonQueue,
    amazonOperationQueue: new AmazonQueue()
};