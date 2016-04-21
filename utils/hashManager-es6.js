class SerializedHash {
    constructor(module, submodule, parameters) {
        this.module = module || '';
        this.submodule = submodule || '';
        this.parameters = parameters || {};
    }
    addOrSetValue(key, value) {
        if (value == null || value === '') return;

        if (this.parameters.hasOwnProperty(key)) {
            this.addValue(key, value);
        } else {
            this.setValue(key, value);
        }
    }
    addValue(key, newValue) {
        if (!this.parameters.hasOwnProperty(key)) {
            this.setValue(key, [newValue]);
        } else {
            var priorParameterValue = this.findParameterWithKey(key);
            if (!Array.isArray(priorParameterValue)) {
                //wasn't an array before, it is now
                this.setValue(key, [priorParameterValue]);
            }

            this.parameters[key].push(newValue);
        }
    }
    setValue(key, value) {
        this.parameters[key] = value;
    }
    removeValue(key) {
        delete this.parameters[key];
    }
    getValue(key){
        return this.parameters[key];
    }
    findParameterWithKey(key) {
        return this.parameters[key];
    }
}


class HashUtility {
    constructor() {
    }
    parseHashTag(hash) {
        if (hash.indexOf('#') > -1) {
            hash = hash.split("#")[1];
        }

        if (hash.charAt(hash.length - 1) === '/') {
            hash = hash.substr(0, hash.length - 1);
        }

        var modSubmodSection = hash.indexOf("?") > -1 ? hash.split("?")[0] : hash;
        var queryStringSection = hash.indexOf("?") > -1 ? hash.split("?")[1] : null;
        var modSections = modSubmodSection.split("/");

        var result = new SerializedHash(modSections[0], modSections[1]);

        if (queryStringSection) {
            var pairs = queryStringSection.split('&');
            for (var i = 0, max = pairs.length; i < max; i++) {
                var keyValuePair = pairs[i].split('=');
                var key = keyValuePair[0];
                var value = keyValuePair.length > 1 ? decodeURIComponent(keyValuePair[1]) : undefined;

                result.addOrSetValue(key, value);
            }
        }

        return result;
    }
    createHashTag(hashObject) {
        let result = '';

        if (hashObject.module) {
            result += hashObject.module;
        }
        if (hashObject.submodule) {
            result += '/' + hashObject.submodule;
        }

        var allPairs = [];
        if (hashObject.parameters) {
            Object.keys(hashObject.parameters).forEach(k => {
                if (Array.isArray(hashObject.parameters[k])) {
                    hashObject.parameters[k].forEach(val => allPairs.push(`${k}=${encodeURIComponent(val)}`));
                } else {
                    if (hashObject.parameters[k] !== '' && hashObject.parameters[k] != null) {
                        allPairs.push(`${k}=${encodeURIComponent(hashObject.parameters[k])}`);
                    }
                }
            });
        }

        if (allPairs.length) {
            result += '/?' + allPairs.join('&');
        }
        return result;
    }
    removeFromHash(...keys){
        var hashInfo = this.parseHashTag(window.location.hash);
        keys.forEach(key => hashInfo.removeValue(key));
        this.setHash(hashInfo);
    }
    addValueOf(key, value){
        var hashInfo = this.parseHashTag(window.location.hash);
        hashInfo.addValue(key, value);
        this.setHash(hashInfo);
    }
    setValueOf(key, value){
        var hashInfo = this.parseHashTag(window.location.hash);
        hashInfo.setValue(key, value);
        this.setHash(hashInfo);
    }
    setValues(...pairs){
        var hashInfo = this.parseHashTag(window.location.hash);
        for (let i = 0; i < pairs.length; i += 2){
            hashInfo.setValue(pairs[i], pairs[i + 1]);
        }
        this.setHash(hashInfo);
    }
    setHash(hashInfo){
        let oldHash = window.location.hash,
            newHash = this.createHashTag(hashInfo);

        window.location.hash = newHash;
    }
    getCurrentHashInfo(){
        return this.parseHashTag(window.location.hash);
    }
    get getCurrentHashParameters(){
        return this.parseHashTag(window.location.hash).parameters;
    }
    getCurrentHashValueOf(name){
        var hashObject = this.parseHashTag(window.location.hash);
        return hashObject.getValue(name);
    }
}

module.exports = HashUtility;