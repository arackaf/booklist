const Builder = require('systemjs-builder');
const gulpUglify = require('gulp-uglify');
const gulpRename = require('gulp-rename');
const gulp = require('gulp');
const glob = require('glob');
const fs = require('fs');
const colors = require('colors');
const concat = require('gulp-concat');

let builder = new Builder({
    baseURL: '../'
});
builder.config({
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
});

const sharedFilesToBuild = [
    ...globToTranspiledFiles('../applicationRoot/**/*.js'),
    ...globToTranspiledFiles('../util/**/*.js'),
    'reactStartup'
];

let paths = sharedFilesToBuild.join(' + '),
    buildOutputs = {},
    builds = [
        //{ module: 'modules/books/books', path: 'modules/books/books - (' + paths + ')' },
        { module: 'modules/scan/scan' },
        //{ module: 'modules/home/home', path: 'modules/home/home - (' + paths + ')' },
        //{ module: 'modules/authenticate/authenticate', path: 'modules/authenticate/authenticate - (' + paths + ')' },
        //{ module: 'reactStartup', path: 'reactStartup + ' + paths + ' - react', saveTo: '../dist/reactStartup' }
    ];

Promise.all(builds.map(buildEntryToPromise)).then(results => {
    results.forEach(({ module, path, saveTo, results }) => {
        buildOutputs[saveTo.replace('../dist', 'dist')] = { modules: results.modules };
    });

    gulp.src(['../dist/**/*-unminified.js'], {base: './'})
        //.pipe(gulpUglify())
        .pipe(gulpRename(function (path) {
            path.basename = path.basename.replace(/-unminified$/, '-build');
            console.log(`Finished compressing ${path.basename}`);
        }))
        .pipe(gulp.dest(''))
        .on('end', createBundlesFileForBrowser);
}).catch(err => console.log(err));

function createBundlesFileForBrowser(){
    let bundleMap = new Map();

    let moduleEntries = Object.keys(buildOutputs).map(name => {
        buildOutputs[name].modules.forEach(bundleContentItem => {
            if (!bundleMap.has(bundleContentItem)) {
                bundleMap.set(bundleContentItem, []);
            }
            bundleMap.get(bundleContentItem).push(name)
        });
        let entry = buildOutputs[name],
            modulesArray = entry.modules.map(n => `'${n}'`).join(', ');
        return `'${name.replace(/-unminified.js$/, '-build.js')}': [${modulesArray}]`;
    }).join(',\n\t');

    for (let dep of bundleMap.keys()){
        let containedIn = bundleMap.get(dep);
        if (containedIn.length > 1){
            console.log(colors.yellow(`${dep} is contained in\n\t${containedIn.join('\n\t')}\n`));
        }
    }

    let fileContents =
`
var gBundlePaths = {
\t${moduleEntries}
}
`

    fs.writeFileSync('../dist/bundlePaths.js', fileContents);
}

function globToTranspiledFiles(globPattern){
    return glob.sync(globPattern)
               .filter(file => !/-es6.js$/.test(file));
}

function buildEntryToPromise(entry){
    let adjustedEntry = Object.assign({}, entry, { saveTo: (entry.saveTo || '../dist/' + entry.module) + '-unminified.js' }),
        whatToBuild = adjustedEntry.module ? adjustedEntry.module + ` - ( ${paths} ) - node_modules/* ` : adjustedEntry.path;
    return builder.bundle(whatToBuild, adjustedEntry.saveTo).then(results => Object.assign(adjustedEntry, { results }));
}