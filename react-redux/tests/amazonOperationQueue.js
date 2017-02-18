'use strict';

require('./promiseUtils');

var assert = require('chai').assert;

var _require = require('../../amazonDataAccess/amazonOperationQueue'),
    AmazonQueue = _require.AmazonQueue;

AmazonQueue.AWS_DELAY = 100; //we'll make the delay 100ms to make the tests a little quicker

//to handle the boilerplate of resolving all these promises I'm kicking off - would rather not have unresolved promises just lingering around
function makeDelayedPromise(f) {
    return Promise.delayed(function (res) {
        f();
        res();
    });
}

describe('AWS Throttling Tests', function () {
    var queue = void 0,
        p1 = void 0,
        p2 = void 0,
        p3 = void 0,
        p4 = void 0;

    beforeEach(function () {
        queue = new AmazonQueue();
        p1 = p2 = p3 = p4 = false;
    });

    it('Should fire 1st request immediately', function (done) {
        queue.push(makeDelayedPromise(function () {
            return p1 = true;
        }));

        setTimeout(function () {
            assert.isTrue(p1);
            done();
        }, 15);
    });

    it('Should make the 2nd request wait', function (done) {
        queue.push(makeDelayedPromise(function () {
            return p1 = true;
        }));
        queue.push(makeDelayedPromise(function () {
            return p2 = true;
        }));

        setTimeout(function () {
            return assert.isTrue(p1);
        }, 15);
        setTimeout(function () {
            return assert.isFalse(p2);
        }, 80);
        setTimeout(function () {
            assert.isTrue(p2);
            done();
        }, 120);
    });

    it('Should execute a 2nd delayed request immediately', function (done) {
        queue.push(makeDelayedPromise(function () {
            return p1 = true;
        }));
        setTimeout(function () {
            return assert.isTrue(p1);
        }, 15);

        setTimeout(function () {
            queue.push(makeDelayedPromise(function () {
                return p2 = true;
            }));
            setTimeout(function () {
                assert.isTrue(p2);
                done();
            }, 15);
        }, 110);
    });

    it('Should execute a 2nd delayed request immediately and queue a 3rd', function (done) {
        queue.push(makeDelayedPromise(function () {
            return p1 = true;
        }));
        setTimeout(function () {
            return assert.isTrue(p1);
        }, 15);
        setTimeout(function () {
            queue.push(makeDelayedPromise(function () {
                return p2 = true;
            }));
            queue.push(makeDelayedPromise(function () {
                return p3 = true;
            }));
            setTimeout(function () {
                return assert.isTrue(p2);
            }, 15);
            setTimeout(function () {
                return assert.isFalse(p3);
            }, 80);
            setTimeout(function () {
                assert.isTrue(p3);
                done();
            }, 130);
        }, 110);
    });

    it('Should execute a 2nd delayed request then queue a 3rd and 4th', function (done) {
        queue.push(makeDelayedPromise(function () {
            return p1 = true;
        }));
        setTimeout(function () {
            return assert.isTrue(p1);
        }, 15);
        setTimeout(function () {
            queue.push(makeDelayedPromise(function () {
                return p2 = true;
            }));
            queue.push(makeDelayedPromise(function () {
                return p3 = true;
            }));
            queue.push(makeDelayedPromise(function () {
                return p4 = true;
            }));
            setTimeout(function () {
                return assert.isTrue(p2);
            }, 15);
            setTimeout(function () {
                return assert.isFalse(p3);
            }, 80);
            setTimeout(function () {
                return assert.isFalse(p4);
            }, 80);
            setTimeout(function () {
                assert.isTrue(p3);
                assert.isFalse(p4);
            }, 130);

            setTimeout(function () {
                assert.isTrue(p4);
                done();
            }, 240);
        }, 110);
    });
});