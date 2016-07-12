
var gBundlePathsTranspiled = {
	'dist-bundles/modules/scan/scan-build.js': ['modules/scan/scan.js', 'modules/scan/reducers/reducer.js', 'modules/scan/reducers/actionNames.js', 'modules/scan/components/bookEntryList.js', 'modules/scan/reducers/actionCreators.js', 'modules/scan/components/bookEntryItem.js'],
	'dist-bundles/modules/books/books-build.js': ['modules/books/books.js', 'modules/books/reducers/reducer.js', 'modules/books/reducers/ui/reducer.js', 'modules/books/reducers/ui/actionNames.js', 'modules/books/reducers/editBook/reducer.js', 'modules/books/reducers/editBook/actionNames.js', 'modules/books/reducers/booksSubjectModification/reducer.js', 'modules/books/reducers/subjects/reducer.js', 'node_modules/reselect/lib/index.js', 'modules/books/reducers/subjects/actionNames.js', 'modules/books/reducers/booksSubjectModification/actionNames.js', 'modules/books/reducers/bookSearch/reducer.js', 'modules/books/reducers/books/reducer.js', 'modules/books/reducers/books/actionNames.js', 'modules/books/reducers/bookSearch/actionNames.js', 'modules/books/components/bookViewList.js', 'modules/books/reducers/bookSearch/actionCreators.js', 'modules/books/reducers/books/actionCreators.js', 'modules/books/reducers/ui/actionCreators.js', 'modules/books/reducers/editBook/actionCreators.js', 'modules/books/components/subject-edit/subjectEditModal.js', 'modules/books/components/subject-edit/customColorPicker.js', 'modules/books/components/subject-edit/subjectEditTree.js', 'modules/books/reducers/subjects/actionCreators.js', 'modules/books/components/bookSubjectSetter.js', 'node_modules/react-autosuggest/dist/standalone/autosuggest.min.js', 'modules/books/reducers/booksSubjectModification/actionCreators.js', 'modules/books/components/booklist-menubar/booksMenuBar.js', 'modules/books/components/booklist-menubar/bookSelectTree.js', 'modules/books/components/bookViewList-mobile.js', 'modules/books/components/bookViewList-desktop.js'],
	'dist-bundles/modules/home/home-build.js': ['modules/home/home.js', 'modules/home/homeComponent.js'],
	'dist-bundles/modules/authenticate/authenticate-build.js': ['modules/authenticate/authenticate.js', 'modules/authenticate/loginScreen.js'],
	'dist-bundles/reactStartup-build.js': ['util/responsiveUiLoaders.js', 'util/responsiveChangeNotifier.js', 'util/bootstrap-toolkit.js', 'util/jscolor.min.js', 'util/jscolor.js', 'applicationRoot/rootComponents/manualBookEntry.js', 'node_modules/react-dropzone/dist/index.js', 'applicationRoot/rootComponents/bootstrapButton.js', 'applicationRoot/rootComponents/ajaxButton.js', 'applicationRoot/rootComponents/mainNavigation.js', 'reactStartup.js', 'util/ajaxUtil.js', 'applicationRoot/store.js', 'node_modules/redux/dist/redux.min.js', 'node_modules/redux-thunk/lib/index.js', 'applicationRoot/rootReducer.js', 'applicationRoot/renderUI.js', 'node_modules/react-dom/dist/react-dom.min.js', 'applicationRoot/rootComponents/header.js', 'node_modules/react-redux/dist/react-redux.min.js', 'util/hashManager.js']
}
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