window.ajaxUtil = {
    post(url, data, callback = () => null){
        return $.ajax(url, {
            method: 'post',
            data: data,
            success: callback
        });
    },
    ['get'](url, data, callback = () => null){
        return $.ajax(url, {
            method: 'get',
            data: data,
            success: callback
        });
    }
};