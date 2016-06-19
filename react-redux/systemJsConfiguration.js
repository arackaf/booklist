
var gBundlePathsTranspiled = {
	'dist-es5/modules/scan/scan-build.js': ['modules/scan/scan.js', 'modules/scan/reducers/reducer.js', 'modules/scan/reducers/actionNames.js', 'modules/scan/components/bookEntryList.js', 'modules/scan/reducers/actionCreators.js', 'modules/scan/components/bookEntryItem.js'],
	'dist-es5/reactStartup-build.js': ['util/responsiveUiLoaders.js', 'util/responsiveChangeNotifier.js', 'util/bootstrap-toolkit.js', 'applicationRoot/rootComponents/manualBookEntry.js', 'node_modules/react-dropzone/dist/index.js', 'applicationRoot/rootComponents/bootstrapButton.js', 'applicationRoot/rootComponents/ajaxButton.js', 'applicationRoot/rootComponents/mainNavigation.js', 'reactStartup.js', 'util/ajaxUtil.js', 'applicationRoot/store.js', 'node_modules/redux/dist/redux.min.js', 'node_modules/redux-thunk/lib/index.js', 'applicationRoot/rootReducer.js', 'applicationRoot/renderUI.js', 'node_modules/react-dom/dist/react-dom.min.js', 'applicationRoot/rootComponents/header.js', 'node_modules/react-redux/dist/react-redux.min.js', 'util/hashManager.js']
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
    },
    meta: {

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
    },
    meta: {

    }
}

if (module){
    module.exports.devConfig = systemJsDevConfig;
    module.exports.liveConfig = systemJsLiveConfig;
} else {
    window.systemJsBaseConfig = isDev() ? systemJsDevConfig : systemJsLiveConfig;
}