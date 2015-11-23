window.ajaxUtil = {
    post(url, data, callback){
        return $.ajax(url, {
            method: 'post',
            data: data,
            success: function(res){
                setTimeout(() => callback(res), 1500);
            }
        })
    },
    ['get'](url, data, callback){
        return $.ajax(url, {
            method: 'get',
            data: data,
            success: function(res){
                setTimeout(() => callback(res), 1500);
            }
        })
    }
};