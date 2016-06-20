const Builder = require('systemjs-builder');
const babel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const lazypipe = require('lazypipe');
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
    builds = [
        'scan', /* 'books', 'home', 'authenticate', */
        { module: 'reactStartup', path: '( reactStartup + ' + allSharedUtilities + ' )', saveTo: '../dist/reactStartup', exclude: ['react', 'react-bootstrap'] }
    ];

Promise.all([
    runBuild('dist-es5', { presets: ['es2015'] }),
    runBuild('dist-es6', undefined)
]).then(([buildOutputs]) => checkBundlesForDupsAndCreateConfigForBrowser(buildOutputs));

function runBuild(distFolder, babelOptions){
    let buildOutputs = {}
    return Promise
        .all(builds.map(createSingleBuild.bind(null, distFolder)))
        .then(results =>
            new Promise(function(res){
                results.forEach(({ saveTo, results }) => buildOutputs[saveTo.replace(`../dist`, 'dist-bundles')] = { modules: results.modules });

                gulp.src([`../${distFolder}/**/*-unminified.js`], { base: './' })
                    .pipe(gulpIf(babelOptions, lazypipe().pipe(babel, babelOptions).pipe(gulp.dest, '')()))
                    .pipe(gulpIf(babelOptions, gulpUglify()))
                    .pipe(gulpRename(function (path) {
                        path.basename = path.basename.replace(/-unminified$/, '-build');
                        console.log(`Finished compressing ${path.basename}`);
                    }))
                    .pipe(gulp.dest(''))
                    .on('end', () => res(buildOutputs));
            }).catch(err => console.log(err))
        )
}

function createSingleBuild(distFolder, entry){
    if (typeof entry === 'string'){
        entry = { module: `modules/${entry}/${entry}` };
    }
    let config = {
        baseURL: '../',
        ...liveConfig
    };
    if (entry.exclude){
        entry.exclude.forEach(item => config.meta[item] = { build: false });
    }
    let builder = new Builder(config);

    let adjustedEntry = Object.assign({}, entry, { saveTo: (entry.saveTo ? entry.saveTo :  `../dist/` + entry.module) + '-unminified.js' }),
        whatToBuild = adjustedEntry.path || adjustedEntry.module + ` - ( ${allSharedUtilities} ) - node_modules/* `;
    return builder.bundle(whatToBuild, adjustedEntry.saveTo, { meta: { 'node_modules/*': { build: false } }, exclude: ['node_modules/*'] }).then(results => Object.assign(adjustedEntry, { results }));
}

function checkBundlesForDupsAndCreateConfigForBrowser(buildOutputs){
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