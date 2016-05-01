const Builder = require('systemjs-builder');
const gulpUglify = require('gulp-uglify');
const gulpRename = require('gulp-rename');
const gulp = require('gulp');
const glob = require('glob');
const fs = require('fs');
const colors = require('colors');

let builder = new Builder({
    baseURL: '../'
});
builder.config({
    defaultJSExtensions: true,
    map: {
        'react-redux-util': 'util',
        'root-components': 'applicationRoot/rootComponents',
        'application-root': 'applicationRoot',
        'react-startup': 'reactStartup'
    }
});

    const sharedFilesToBuild = [
        ...globToTranspiledFiles('../../react-redux/applicationRoot/**/*.js'),
        ...globToTranspiledFiles('../../react-redux/util/**/*.js')
    ];

let paths = sharedFilesToBuild.join(' + '),
    buildOutputs = {},
    builds = [
        { module: 'modules/books/books', path: 'modules/books/books - (' + paths + ')' },
        { module: 'modules/scan/scan', path: 'modules/scan/scan - (' + paths + ')' },
        { module: 'reactStartup + ' + paths, path: 'reactStartup', saveTo: '../dist/reactStartup' }
    ];



Promise.all(builds.map(buildEntryToPromise)).then(results => {
    results.forEach(({ module, path, saveTo, results }) => {
        buildOutputs[saveTo.replace('../dist', 'dist')] = { modules: results.modules };
    });

    gulp.src(['../dist/**/*-unminified.js'], {base: './'})
        .pipe(gulpUglify())
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
        return `'${name}': [${modulesArray}]`;
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
               .filter(file => !/-es6.js$/.test(file))
               .map(file => file.replace('../../react-redux/', ''));
}

function buildEntryToPromise(entry){
    let adjustedEntry = Object.assign({}, entry, { saveTo: (entry.saveTo || '../dist/' + entry.module) + '-unminified.js' });
    return builder.bundle(adjustedEntry.path, adjustedEntry.saveTo).then(results => Object.assign(adjustedEntry, { results }));
}