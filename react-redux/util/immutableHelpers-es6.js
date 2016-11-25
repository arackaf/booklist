export const removeKeysFromObject = (obj, keys) =>{
    let result = {...obj};
    keys.forEach(k => delete result[k]);
    return result;
}