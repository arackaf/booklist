window.ajaxUtil = {
    post: function(url, data, callback){
        return $.ajax(url, {
            method: 'post',
            data: data,
            success: function(res){
                setTimeout(() => callback(res), 1500);
            }
        })
    }
};