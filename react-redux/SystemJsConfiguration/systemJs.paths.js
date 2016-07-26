var systemJsDevConfig = {
    defaultJSExtensions: true,
    map: {
        'React': 'node_modules/react/dist/react-with-addons.js',
        'react': 'node_modules/react/dist/react-with-addons.js',
        'react-autosuggest': 'node_modules/react-autosuggest/dist/standalone/autosuggest.js',
        'react-bootstrap': 'node_modules/react-bootstrap/dist/react-bootstrap.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.js',
        'react-dropzone': 'node_modules/react-dropzone/dist/index.js',
        'react-redux': 'node_modules/react-redux/dist/react-redux.js',
        redux: 'node_modules/redux/dist/redux.js',
        'redux-thunk': 'node_modules/redux-thunk/lib/index.js',
        reselect: 'node_modules/reselect/lib/index.js',
        jscolor: 'util/jscolor.js'
    },
    meta: {
        jscolor: {
            format: 'global'
        }
    }
}

var systemJsLiveConfig = {
    defaultJSExtensions: true,
    map: {
        'React': 'node_modules/react/dist/react-with-addons.min.js',
        'react': 'node_modules/react/dist/react-with-addons.min.js',
        'react-autosuggest': 'node_modules/react-autosuggest/dist/standalone/autosuggest.min.js',
        'react-bootstrap': 'node_modules/react-bootstrap/dist/react-bootstrap.min.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.min.js',
        'react-dropzone': 'node_modules/react-dropzone/dist/index.js',
        'react-redux': 'node_modules/react-redux/dist/react-redux.min.js',
        'redux': 'node_modules/redux/dist/redux.min.js',
        'redux-thunk': 'node_modules/redux-thunk/lib/index.js',
        'reselect': 'node_modules/reselect/lib/index.js',
        jscolor: 'util/jscolor.min.js'
    },
    meta: {
        jscolor: {
            format: 'global'
        }
    }
}

if (typeof module != 'undefined'){
    module.exports.devConfig = systemJsDevConfig;
    module.exports.liveConfig = systemJsLiveConfig;
} else {
    //leave the global variables because meh
}