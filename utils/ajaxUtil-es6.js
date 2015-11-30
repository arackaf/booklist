window.ajaxUtil = {
    post(url, data, callback = () => null){
        return $.ajax(url, {
            method: 'post',
            data: data,
            success: function(res){
                setTimeout(() => callback(res), 1500);
            }
        })
    },
    ['get'](url, data, callback = () => null){
        return $.ajax(url, {
            method: 'get',
            data: data,
            success: function(res){
                setTimeout(() => callback(res), 1500);
            }
        })
    }
};