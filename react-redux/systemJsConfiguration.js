
var gBundlePathsTranspiled = {
	'dist-bundles/modules/scan/scan-build.js': ['modules/scan/scan.js', 'modules/scan/reducers/reducer.js', 'modules/scan/reducers/actionNames.js', 'modules/scan/components/bookEntryList.js', 'modules/scan/reducers/actionCreators.js', 'modules/scan/components/bookEntryItem.js'],
	'dist-bundles/modules/books/books-build.js': ['modules/books/books.js', 'modules/books/reducers/bookSearch/actionCreators.js', 'modules/books/reducers/tags/actionCreators.js', 'modules/books/reducers/tags/actionNames.js', 'modules/books/reducers/books/actionCreators.js', 'modules/books/reducers/books/actionNames.js', 'modules/books/reducers/bookSearch/actionNames.js', 'modules/books/reducers/reducer.js', 'modules/books/reducers/editBook/reducer.js', 'modules/books/reducers/editBook/actionNames.js', 'modules/books/reducers/booksTagModification/reducer.js', 'modules/books/reducers/tags/reducer.js', 'modules/books/reducers/booksTagModification/actionNames.js', 'modules/books/reducers/booksSubjectModification/reducer.js', 'modules/books/reducers/subjects/reducer.js', 'modules/books/reducers/subjects/actionNames.js', 'modules/books/reducers/booksSubjectModification/actionNames.js', 'modules/books/reducers/bookSearch/reducer.js', 'modules/books/reducers/books/reducer.js', 'modules/scan/reducers/actionNames.js', 'modules/books/components/bookViewList.js', 'modules/books/reducers/editBook/actionCreators.js', 'modules/books/components/tagEditModal.js', 'modules/books/components/subjectEditModal.js', 'modules/books/reducers/subjects/actionCreators.js', 'modules/books/components/bookTagSetter.js', 'modules/books/reducers/booksTagModification/actionCreators.js', 'modules/books/components/bookSubjectSetter.js', 'modules/books/reducers/booksSubjectModification/actionCreators.js', 'modules/books/components/booksMenuBar.js', 'modules/books/components/bookViewList-basicList.js', 'modules/books/components/bookViewList-grid.js'],
	'dist-bundles/modules/home/home-build.js': ['modules/home/home.js', 'modules/home/homeComponent.js'],
	'dist-bundles/modules/authenticate/authenticate-build.js': ['modules/authenticate/authenticate.js', 'modules/authenticate/loginScreen.js'],
	'dist-bundles/react-autosuggest-build.js': ['node_modules/react-autosuggest/dist/standalone/autosuggest.min.js'],
	'dist-bundles/react-collapse-build.js': ['node_modules/react-collapse/build/react-collapse.min.js', 'node_modules/react-height/build/react-height.min.js', 'node_modules/react-motion/build/react-motion.js'],
	'dist-bundles/reactStartup-build.js': ['util/jscolor.js', 'util/immutableHelpers.js', 'applicationRoot/components/manualBookEntry.js', 'node_modules/simple-react-bootstrap/dist/simple-react-bootstrap.min.js', 'node_modules/react-dom/dist/react-dom.min.js', 'node_modules/react-dropzone/dist/index.js', 'applicationRoot/components/bootstrapButton.js', 'applicationRoot/components/mainNavigation.js', 'reactStartup.js', 'util/ajaxUtil.js', 'applicationRoot/rootReducerActionCreators.js', 'applicationRoot/rootReducerActionNames.js', 'applicationRoot/store.js', 'node_modules/redux/dist/redux.min.js', 'node_modules/redux-thunk/lib/index.js', 'applicationRoot/rootReducer.js', 'node_modules/reselect/lib/index.js', 'applicationRoot/renderUI.js', 'applicationRoot/components/header.js', 'node_modules/react-redux/dist/react-redux.min.js', 'util/hashManager.js', 'applicationRoot/components/genericLabelSelect.js', 'applicationRoot/components/labelDisplay.js', 'applicationRoot/components/customColorPicker.js', 'util/jscolor.min.js', 'applicationRoot/components/colorsPalette.js']
}
var systemJsDevConfig = {
    defaultJSExtensions: true,
    map: {
        'React': 'node_modules/react/dist/react-with-addons.js',
        'react': 'node_modules/react/dist/react-with-addons.js',
        'react-autosuggest': 'node_modules/react-autosuggest/dist/standalone/autosuggest.js',
        'react-collapse': 'node_modules/react-collapse/build/react-collapse.js',
        'react-dnd': 'node_modules/react-dnd/dist/ReactDnD.js',
        'react-dnd-html5-backend': 'node_modules/react-dnd-html5-backend/dist/ReactDnDHTML5Backend.min.js',
        'react-dnd-touch-backend': 'node_modules/react-dnd-touch-backend/dist/Touch.browserified.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.js',
        'react-dropzone': 'node_modules/react-dropzone/dist/index.js',
        'react-height': 'node_modules/react-height/build/react-height.js',
        'react-motion': 'node_modules/react-motion/build/react-motion.js',
        'react-redux': 'node_modules/react-redux/dist/react-redux.js',
        'redux': 'node_modules/redux/dist/redux.js',
        'redux-thunk': 'node_modules/redux-thunk/lib/index.js',
        'reselect': 'node_modules/reselect/lib/index.js',
        'simple-react-bootstrap': 'node_modules/simple-react-bootstrap/dist/simple-react-bootstrap.js',
        'jscolor': 'util/jscolor.js'
    },
    meta: {
        jscolor: { format: 'global' },
        'react-collapse': { format: 'cjs' },
        'react-height': { format: 'cjs' },
        'react-motion': { format: 'cjs' },
    }
}

var systemJsLiveConfig = {
    defaultJSExtensions: true,
    map: {
        'React': 'node_modules/react/dist/react-with-addons.min.js',
        'react': 'node_modules/react/dist/react-with-addons.min.js',
        'react-autosuggest': 'node_modules/react-autosuggest/dist/standalone/autosuggest.min.js',
        'react-collapse': 'node_modules/react-collapse/build/react-collapse.min.js',
        'react-dnd': 'node_modules/react-dnd/dist/ReactDnD.min.js',
        'react-dnd-html5-backend': 'node_modules/react-dnd-html5-backend/dist/ReactDnDHTML5Backend.min.js',
        'react-dnd-touch-backend': 'node_modules/react-dnd-touch-backend/dist/Touch.browserified.js',
        'react-dom': 'node_modules/react-dom/dist/react-dom.min.js',
        'react-dropzone': 'node_modules/react-dropzone/dist/index.js',
        'react-height': 'node_modules/react-height/build/react-height.min.js',
        'react-motion': 'node_modules/react-motion/build/react-motion.js',
        'react-redux': 'node_modules/react-redux/dist/react-redux.min.js',
        'redux': 'node_modules/redux/dist/redux.min.js',
        'redux-thunk': 'node_modules/redux-thunk/lib/index.js',
        'reselect': 'node_modules/reselect/lib/index.js',
        'simple-react-bootstrap': 'node_modules/simple-react-bootstrap/dist/simple-react-bootstrap.min.js',
        'jscolor': 'util/jscolor.min.js'
    },
    meta: {
        jscolor: { format: 'global' },
        'react-collapse': { format: 'cjs' },
        'react-height': { format: 'cjs' },
        'react-motion': { format: 'cjs' },
    }
}

if (typeof module != 'undefined'){
    module.exports.devConfig = systemJsDevConfig;
    module.exports.liveConfig = systemJsLiveConfig;
} else {
    //leave the global variables because meh
}