'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilHashManager = require('../util/hashManager');

var _utilHashManager2 = _interopRequireDefault(_utilHashManager);

var assert = require('chai').assert;

describe('Hash management', function () {
    var hashManager;

    beforeEach(function () {
        hashManager = new _utilHashManager2['default']();
    });

    it('should parse a hash', function () {
        var hashObj = hashManager.parseHashTag('#foo/?a=1&b=2');

        assert.strictEqual(hashObj.module, 'foo');
        assert.strictEqual(hashObj.parameters.a, '1');
        assert.strictEqual(hashObj.parameters.b, '2');
    });

    it('should parse a hash with array', function () {
        var hashObj = hashManager.parseHashTag('#foo/?a=1&b=2&b=3');

        assert.strictEqual(hashObj.module, 'foo');
        assert.strictEqual(hashObj.parameters.a, '1');

        assert.isArray(hashObj.parameters.b, 'b not array');
        assert.strictEqual(hashObj.parameters.b[0], '2');
        assert.strictEqual(hashObj.parameters.b[1], '3');
    });

    it('should set a hash', function () {
        var hashObj = hashManager.parseHashTag('#foo/?a=1&b=2');

        hashObj.setValue('a', 2);
        hashObj.setValue('b', 3);

        hashObj = hashManager.parseHashTag(hashManager.createHashTag(hashObj));
        assert.strictEqual(hashObj.module, 'foo');
        assert.strictEqual(hashObj.parameters.a, '2');
        assert.strictEqual(hashObj.parameters.b, '3');
    });
});