
var gBundlePathsTranspiled = {
	'dist-bundles-es5/modules/scan/scan-build.js': ['modules/scan/scan.js', 'modules/scan/reducers/reducer.js', 'modules/scan/reducers/actionNames.js', 'modules/scan/components/bookEntryList.js', 'modules/scan/reducers/actionCreators.js', 'modules/scan/components/bookEntryItem.js'],
	'dist-bundles-es5/modules/books/books-build.js': ['modules/books/books.js', 'modules/books/reducers/reducer.js', 'modules/books/reducers/editBook/reducer.js', 'modules/books/reducers/editBook/actionNames.js', 'modules/books/reducers/booksSubjectModification/reducer.js', 'modules/books/reducers/booksSubjectModification/actionNames.js', 'node_modules/reselect/lib/index.js', 'modules/books/reducers/bookSearch/reducer.js', 'modules/books/reducers/bookSearch/actionNames.js', 'modules/books/reducers/subjects/reducer.js', 'modules/books/util/booksSubjectsHelpers.js', 'modules/books/reducers/subjects/actionNames.js', 'modules/books/reducers/books/reducer.js', 'modules/books/reducers/books/actionNames.js', 'modules/books/components/bookViewList.js', 'modules/books/reducers/editBook/actionCreators.js', 'modules/books/components/subject-edit/subjectEditModal.js', 'modules/books/components/subject-edit/hierarchicalSubjectList.js', 'modules/books/reducers/subjects/actionCreators.js', 'modules/books/components/bookSubjectSetter-desktop.js', 'modules/books/reducers/booksSubjectModification/actionCreators.js', 'modules/books/components/booklist-menubar/booksMenuBar.js', 'modules/books/reducers/books/actionCreators.js', 'modules/books/reducers/bookSearch/actionCreators.js', 'modules/books/components/booklist-menubar/hierarchicalSelectableSubjectList.js'],
	'dist-bundles-es5/modules/home/home-build.js': ['modules/home/home.js', 'modules/home/homeComponent.js'],
	'dist-bundles-es5/modules/authenticate/authenticate-build.js': ['modules/authenticate/authenticate.js', 'modules/authenticate/loginScreen.js'],
	'dist-bundles-es5/reactStartup-build.js': ['util/responsiveUiLoaders.js', 'util/responsiveChangeNotifier.js', 'util/bootstrap-toolkit.js', 'applicationRoot/rootComponents/manualBookEntry.js', 'node_modules/react-dropzone/dist/index.js', 'applicationRoot/rootComponents/bootstrapButton.js', 'applicationRoot/rootComponents/ajaxButton.js', 'applicationRoot/rootComponents/mainNavigation.js', 'reactStartup.js', 'util/ajaxUtil.js', 'applicationRoot/store.js', 'node_modules/redux/dist/redux.min.js', 'node_modules/redux-thunk/lib/index.js', 'applicationRoot/rootReducer.js', 'applicationRoot/renderUI.js', 'node_modules/react-dom/dist/react-dom.min.js', 'applicationRoot/rootComponents/header.js', 'node_modules/react-redux/dist/react-redux.min.js', 'util/hashManager.js']
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

if (typeof module !== 'undefined'){
    module.exports.devConfig = systemJsDevConfig;
    module.exports.liveConfig = systemJsLiveConfig;
} else {
    //just leave as global variables - meh
}