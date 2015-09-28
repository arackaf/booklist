global.Symbol = require('es6-symbol');
global.Promise = require('promise');
require('../utils/promiseUtils');

var assert = require('chai').assert;
var { AmazonQueue } = require('../amazonDataAccess/amazonOperationQueue');
AmazonQueue.AWS_DELAY = 100; //we'll make the delay 100ms to make the tests a little quicker

//to handle the boilerplate of resolving all these promises I'm kicking off - would rather not have unresolved promises just lingering around
function makeDelayedPromise(f){
    return Promise.delayed(res => {
        f();
        res();
    });
}

describe('AWS Throttling Tests', function(){
    let queue, p1, p2, p3, p4;

    beforeEach(function(){
        queue = new AmazonQueue();
        p1 = p2 = p3 = p4 = false;
    });

    it('Should fire 1st request immediately', function(done){
        queue.push(makeDelayedPromise(() => p1 = true));

        setTimeout(() => {
            assert.isTrue(p1);
            done();
        }, 15);
    });

    it('Should make the 2nd request wait', function(done){
        queue.push(makeDelayedPromise(() => p1 = true));
        queue.push(makeDelayedPromise(() => p2 = true));

        setTimeout(() => assert.isTrue(p1), 15);
        setTimeout(() => assert.isFalse(p2), 80);
        setTimeout(() => {
            assert.isTrue(p2);
            done();
        }, 120);
    });

    it('Should execute a 2nd delayed request immediately', function(done){
        queue.push(makeDelayedPromise(() => p1 = true));
        setTimeout(() => assert.isTrue(p1), 15);

        setTimeout(() => {
            queue.push(makeDelayedPromise(() => p2 = true));
            setTimeout(() => {
                assert.isTrue(p2);
                done();
            }, 15);
        }, 110);
    });

    it('Should execute a 2nd delayed request immediately and queue a 3rd', function(done){
        queue.push(makeDelayedPromise(() => p1 = true));
        setTimeout(() => assert.isTrue(p1), 15);
        setTimeout(() => {
            queue.push(makeDelayedPromise(() => p2 = true));
            queue.push(makeDelayedPromise(() => p3 = true));
            setTimeout(() => assert.isTrue(p2), 15);
            setTimeout(() => assert.isFalse(p3), 80);
            setTimeout(() => {
                assert.isTrue(p3);
                done();
            }, 130);

        }, 110);
    });

    it('Should execute a 2nd delayed request then queue a 3rd and 4th', function(done){
        queue.push(makeDelayedPromise(() => p1 = true));
        setTimeout(() => assert.isTrue(p1), 15);
        setTimeout(() => {
            queue.push(makeDelayedPromise(() => p2 = true));
            queue.push(makeDelayedPromise(() => p3 = true));
            queue.push(makeDelayedPromise(() => p4 = true));
            setTimeout(() => assert.isTrue(p2), 15);
            setTimeout(() => assert.isFalse(p3), 80);
            setTimeout(() => assert.isFalse(p4), 80);
            setTimeout(() => {
                assert.isTrue(p3);
                assert.isFalse(p4);
            }, 130);

            setTimeout(() => {
                assert.isTrue(p4);
                done();
            }, 240);

        }, 110);
    });

});