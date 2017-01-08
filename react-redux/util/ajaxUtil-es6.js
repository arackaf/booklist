window.ajaxUtil = {
    post(url, data, callback = () => null, errorCallback = () => null){
        return $.ajax(url, {
            method: 'post',
            data: data,
            success: callback,
            error: errorCallback
        });
    },
    postWithFiles(url, data, callback = () => null, errorCallback = () => null){
        return $.ajax(url, {
            method: 'post',
            data: data,
            processData: false,
            contentType: false,
            success: callback,
            error: errorCallback
        });
    },
    ['get'](url, data){
        let queryString = Object.keys(data).map(p => `${p}=${data[p]}`).join('&');
        return fetch(`${url}?${queryString}`, { method: 'get', credentials: 'include' }).then(resp => resp.json())
    }
};