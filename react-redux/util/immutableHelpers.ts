export const removeFromHash = (hash, keys: string[]) =>{
    let result = {...hash};
    keys.forEach(k => delete result[k]);
    return result;
}

export const mergeHashEntry = (hash, key, obj) => {
    return {
        ...hash,
        [key]: {...hash[key], ...obj}
    };
}