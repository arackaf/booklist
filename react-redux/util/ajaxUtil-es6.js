window.ajaxUtil = {
    post(url, data, callback = () => null, errorCallback = () => null){
        return $.ajax(url, {
            method: 'post',
            data: data,
            processData: false,
            contentType: false,
            success: callback,
            error: errorCallback
        });
    },
    ['get'](url, data, callback = () => null, errorCallback = () => null){
        return $.ajax(url, {
            method: 'get',
            data: data,
            success: callback,
            error: errorCallback
        });
    }
};