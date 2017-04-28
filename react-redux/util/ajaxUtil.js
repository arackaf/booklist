const ajaxUtil = {
    post(url, data, callback = () => null, errorCallback = () => null){
        return fetch(url,
            {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(resp => resp.json())
            .then(obj => {
                callback(obj);
                return obj;
            })
            .catch(errorCallback);
    },
    postWithFiles(url, data, callback = () => null, errorCallback = () => null){
        return fetch(url,
            {
                method: 'post',
                credentials: 'include',
                body: data
            })
            .then(resp => resp.json())
            .then(callback)
            .catch(errorCallback);
    },
    ['get'](url, data){
        let queryString = Object.keys(data).map(p => `${p}=${data[p]}`).join('&');
        return fetch(`${url}?${queryString}`, { method: 'get', credentials: 'include' }).then(resp => resp.json())
    }
};

export default window.ajaxUtil = ajaxUtil;

window.ajaxUtil = ajaxUtil;