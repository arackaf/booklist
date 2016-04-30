const Builder = require('systemjs-builder');
const gulpUglify = require('gulp-uglify');
const gulpRename = require('gulp-rename');
const gulp = require('gulp');
const glob = require('glob');
const fs = require('fs');

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

const files = glob.sync('../../react-redux/applicationRoot/**/*.js')
                  .filter(file => !/-es6.js$/.test(file))
                  .map(file => file.replace('../../react-redux/', ''));

let paths = files.join(' + '),
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
    console.log(Object.keys(buildOutputs).length);
    let moduleEntries = Object.keys(buildOutputs).map(name => {
        let entry = buildOutputs[name],
            modulesArray = entry.modules.map(n => `'${n}'`).join(', ');
        return `'${name}': [${modulesArray}]`;
    }).join(',\n\t');

    let fileContents =
`
var gBundlePaths = {
\t${moduleEntries}
}
`

    fs.writeFileSync('../dist/bundlePaths.js', fileContents);
}

function buildEntryToPromise(entry){
    let adjustedEntry = Object.assign({}, entry, { saveTo: (entry.saveTo || '../dist/' + entry.module) + '-unminified.js' });
    return builder.bundle(adjustedEntry.path, adjustedEntry.saveTo).then(results => Object.assign(adjustedEntry, { results }));
}