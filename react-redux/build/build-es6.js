const Builder = require('systemjs-builder');
const gulpUglify = require('gulp-uglify');
const gulpRename = require('gulp-rename');
const gulp = require('gulp');
const glob = require('glob');
const fs = require('fs');
const colors = require('colors');
const concat = require('gulp-concat');
const { liveConfig } = require('../systemJsConfiguration/systemJs.paths');

const sharedFilesToBuild = [
    ...globToTranspiledFiles('../applicationRoot/**/*.js'),
    ...globToTranspiledFiles('../util/**/*.js'),
    'reactStartup'
];

let allSharedUtilities = sharedFilesToBuild.join(' + '),
    buildOutputs = {},
    builds = [
        'scan', /* 'books', 'home', 'authenticate', */
        { module: 'reactStartup', path: '( reactStartup + ' + allSharedUtilities + ' ) - react-bootstrap + reselect', saveTo: '../dist/reactStartup' }
    ];

Promise.all(builds.map(buildEntryToPromise)).then(results => {
    results.forEach(({ module, path, saveTo, results }) => {
        buildOutputs[saveTo.replace('../dist', 'dist')] = { modules: results.modules };
    });

    gulp.src(['../dist/**/*-unminified.js'], { base: './' })
        //.pipe(gulpUglify())
        .pipe(gulpRename(function (path) {
            path.basename = path.basename.replace(/-unminified$/, '-build');
            console.log(`Finished compressing ${path.basename}`);
        }))
        .pipe(gulp.dest(''))
        .on('end', checkBundlesForDupsAndCreateConfigForBrowser);
}).catch(err => console.log(err));

function buildEntryToPromise(entry){
    if (typeof entry === 'string'){
        entry = { module: `modules/${entry}/${entry}`, excludeNpm: true };
    }
    let config = {
        baseURL: '../',
        ...liveConfig
    };
    if (entry.allowNpm) {
        config.meta['node_modules/*'] = { build: false };
    }
    let builder = new Builder(config);

    let adjustedEntry = Object.assign({}, entry, { saveTo: (entry.saveTo || '../dist/' + entry.module) + '-unminified.js' }),
        whatToBuild = adjustedEntry.path || adjustedEntry.module + ` - ( ${allSharedUtilities} ) - node_modules/* `;
    return builder.bundle(whatToBuild, adjustedEntry.saveTo, { meta: { 'node_modules/*': { build: false } }, exclude: ['node_modules/*'] }).then(results => Object.assign(adjustedEntry, { results }));
}

function checkBundlesForDupsAndCreateConfigForBrowser(){
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

    fs.writeFileSync('../systemJsConfiguration/bundlePathsTranspiled.js', `
var gBundlePathsTranspiled = {
\t${moduleEntries}
}`);

    gulp.src('../systemJsConfiguration/**/*.js', { base: './' })
        .pipe(concat('../systemJsConfiguration.js'))
        .pipe(gulp.dest(''));
}

function globToTranspiledFiles(globPattern){
    return glob.sync(globPattern)
               .filter(file => !/-es6.js$/.test(file));
}