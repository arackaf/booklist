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

let paths = files.join(' + ');

let p1 = builder.bundle('reactStartup + ' + paths, '../dist/shared-unminified.js').then(results => ({ name: 'reactStartup', results }));
let p2 = builder.bundle('modules/books/books', '../dist/books/books-unminified.js').then(results => ({ name: 'modules/books/books', results }));
let p3 = builder.bundle('modules/scan/scan', '../dist/scan/scan-unminified.js').then(results => ({ name: 'modules/scan/scan', results }));

let buildOutputs = {};
Promise.all([p1, p2, p3]).then(results => {
    results.forEach(({ name, results }) => {
        buildOutputs[name] = { modules: results.modules };
    });

    gulp.src(['../dist/**/*-unminified.js'], {base: './'})
        .pipe(gulpUglify())
        .pipe(gulpRename(function (path) {
            path.basename = path.basename.replace(/-unminified$/, '');
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