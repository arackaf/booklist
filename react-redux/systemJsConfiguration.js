
var gBundlePathsTranspiled = {
	'dist/modules/scan/scan-build.js': ['modules/scan/scan.js', 'modules/scan/reducers/reducer.js', 'modules/scan/reducers/actionNames.js', 'modules/scan/components/bookEntryList.js', 'modules/scan/reducers/actionCreators.js', 'modules/scan/components/bookEntryItem.js']
}
var systemJsDevConfig = {
    defaultJSExtensions: true,
    map: {
        'react': 'node_modules/react/dist/react-with-addons.js',
        'react-bootstrap': 'node_modules/react-bootstrap/dist/react-bootstrap.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.js',
        'react-dropzone': 'node_modules/react-dropzone/dist/index.js',
        'react-redux': 'node_modules/react-redux/dist/react-redux.js',
        redux: 'node_modules/redux/dist/redux.js',
        'redux-thunk': 'node_modules/redux-thunk/lib/index.js',
        reselect: 'node_modules/reselect/lib/index.js'
    }
}

var systemJsLiveConfig = {
    defaultJSExtensions: true,
    map: {
        'react': 'node_modules/react/dist/react-with-addons.min.js',
        'react-bootstrap': 'node_modules/react-bootstrap/dist/react-bootstrap.min.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.min.js',
        'react-dropzone': 'node_modules/react-dropzone/dist/index.js',
        'react-redux': 'node_modules/react-redux/dist/react-redux.min.js',
        'redux': 'node_modules/redux/dist/redux.min.js',
        'redux-thunk': 'node_modules/redux-thunk/lib/index.js',
        'reselect': 'node_modules/reselect/lib/index.js'
    }
}

if (typeof module !== 'undefined'){
    module.exports.devConfig = systemJsDevConfig;
    module.exports.liveConfig = systemJsLiveConfig;
} else {
    window.systemJsConfigs = {
        dev: systemJsDevConfig,
        live: systemJsLiveConfig
    };
}