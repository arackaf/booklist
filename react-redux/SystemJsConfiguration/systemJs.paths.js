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