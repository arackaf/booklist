export const removeFromHash = (hash, keys: string[]) =>{
    let result = {...hash};
    keys.forEach(k => delete result[k]);
    return result;
}

export const updateHash = (hash, key: string, values: object) => {
    return {
        ...hash,
        [key]: {...hash[key], ...values}
    };
}

export const bulkUpdateHash = (hash, keys: string[], values: object) => {
    let result = {...hash};
    keys.forEach(k => result[k] = {...result[k], ...values});
    return result;
}