var Promise = global.Promise;

Promise.delayed = function(f){
    let resolve,
        p = new Promise(res => resolve = res),
        result = p.then(() => new Promise(f));

    result.start = () => (resolve(), result);
    return result;
};