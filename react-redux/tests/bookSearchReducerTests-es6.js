import { bookSearchReducer as reducer } from '../modules/books/reducers/bookSearchReducer';
import { setFilters } from '../modules/books/actions/actionCreators';

import { LOAD_BOOKS } from '../modules/books/actions/actionNames';

const assert = require('chai').assert;

describe('book search', function() {
    before(function(){
    });

    after(function(){ });

    beforeEach(function(){ });

    afterEach(function(){ });

    it('set isDirty to true', async function(){
        assert.strictEqual(true, apply(setFilters('', {}, null)).isDirty);
    });

    it('set isDirty to true then false after load', async function(){
        assert.strictEqual(
            false,
            apply(
                setFilters('', {}, null),
                { type: LOAD_BOOKS }
            ).isDirty);
    });

    it('set isDirty to true then false after load, keep false for non-changing set filters call', async function(){
        assert.strictEqual(
            false,
            apply(
                setFilters('', {}, null),
                { type: LOAD_BOOKS },
                setFilters('', {}, null)
            ).isDirty);
    });

    it('set isDirty to true then false after load, keep false for non-changing set filters call 2', async function(){
        assert.strictEqual(
            false,
            apply(
                setFilters('', { a: true }, null),
                { type: LOAD_BOOKS },
                setFilters('', { a: true }, null)
            ).isDirty);
    });

    it('set isDirty to true then false after load, keep false for non-changing set filters call 2', async function(){
        assert.strictEqual(
            false,
            apply(
                setFilters('', { a: true }, true),
                { type: LOAD_BOOKS },
                setFilters('', { a: true }, true)
            ).isDirty);
    });

    it('searchChildSubjects resets isDirty properly', async function(){
        assert.strictEqual(
            true,
            apply(
                setFilters('', { a: true }, true),
                { type: LOAD_BOOKS },
                setFilters('', { a: true }, null)
            ).isDirty);
    });

    it('searchChildSubjects resets isDirty properly', async function(){
        assert.strictEqual(
            true,
            apply(
                setFilters('', { a: true }, null),
                { type: LOAD_BOOKS },
                setFilters('', { a: true }, true)
            ).isDirty);
    });

    it('subjects change resets isDirty properly', async function(){
        assert.strictEqual(
            true,
            apply(
                setFilters('', { a: true }, true),
                { type: LOAD_BOOKS },
                setFilters('', { }, true)
            ).isDirty);
    });

    it('subjects change resets isDirty properly 2', async function(){
        assert.strictEqual(
            true,
            apply(
                setFilters('', { }, true),
                { type: LOAD_BOOKS },
                setFilters('', { a: true  }, true)
            ).isDirty);
    });

    it('text change resets isDirty properly 2', async function(){
        assert.strictEqual(
            true,
            apply(
                setFilters('', { a: true }, true),
                { type: LOAD_BOOKS },
                setFilters('a', { a: true  }, true)
            ).isDirty);
    });

    function apply(...actions){
        let state = reducer(undefined, { type: '________' });
        actions.forEach(a => state = reducer(state, a));
        return state;
    }

});
