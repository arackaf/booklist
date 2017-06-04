export const bulkUpdateHash = (hash, keys: string[], values: object) => {
    let result = {...hash};
    keys.forEach(k => result[k] = {...result[k], ...values});
    return result;
}