var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require('path');
var webpack = require('webpack');
var noVisualization = process.env.NODE_ENV === 'production' 
        || process.argv.slice(-1)[0] == '-p'
        || process.argv.some(arg => arg.indexOf('webpack-dev-server') >= 0);

const asyncBundle = (name, {nodePaths = [], resources = []}) => 
    new webpack.optimize.CommonsChunkPlugin({
        async: name,
        minChunks({context, resource}, count) {
            if (!context) return false;
            let resourcePath = context.replace(/\\/g, '/');

            return (resourcePath.indexOf('node_modules') >= 0 && nodePaths.find(t => new RegExp('/' + t + '/', 'i').test(resourcePath)))
                    ||
                   (resource && (resources.find(r => !path.relative(r + '.js', resource)) || resources.find(r => !path.relative(r + '.ts', resource)) || resources.find(r => !path.relative(r + '.tsx', resource))))
        }
    })

module.exports = {
    entry: {
        main: './reactStartup.ts'
    },
    output: {
        filename: '[name]-bundle.js',
        chunkFilename: '[name]-chunk.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'react-redux/dist/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'jscolor': 'util/jscolor.js'
        },
        modules: [
            path.resolve('./'),
            path.resolve('./node_modules'),
        ]
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015-webpack', 'stage-1', 'stage-2'],
                    plugins: ['transform-decorators-legacy', 'external-helpers']
                }
            }
        ]
    },
    plugins: [
        (!noVisualization ? 
            new BundleAnalyzerPlugin({
                analyzerMode: 'static'
            }) : null),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'react-build',
            minChunks(module, count) {
                var context = module.context;
                context = context.replace(/\\/g, '/');
                return context && (
                    context.indexOf('node_modules/react/') >= 0 || 
                    context.indexOf('node_modules/react-dom/') >= 0 ||
                    context.indexOf('node_modules/react-loadable/') >= 0 
                );
            },
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),        

        //*********************************** async chunks*************************

        //catch all - anything used in more than one place
        new webpack.optimize.CommonsChunkPlugin({
            async: 'used-twice',
            minChunks: (module, count) => count >= 2,
        }),

        asyncBundle('react-dnd', { nodePaths: ['react-dnd', 'react-dnd-html5-backend', 'react-dnd-touch-backend', 'dnd-core']  }),
        asyncBundle('book-list-modals', {
            nodePaths: ['react-autosuggest', 'react-autowhatever', 'react-themeable', 'section-iterator'] 
        }),

        // new webpack.optimize.CommonsChunkPlugin({
        //     async: 'book-list-modals',
        //     children: true,
        //     chunks: ['book-subject-setter', 'book-tag-setter', 'subject-edit-modal', 'tag-edit-modal']
        // }),

    ].filter(p => p),
    devServer: {
        proxy: {
            "/": "http://localhost:3000",
            "/react-redux/login": "http://localhost:3000",
            "/react-redux/logout": "http://localhost:3000",
            "/react-redux/createUser": "http://localhost:3000",
            "/react-redux/static": "http://localhost:3000",
            "/subject": "http://localhost:3000",
            "/tag": "http://localhost:3000",
            "/book": "http://localhost:3000",
            "/user": "http://localhost:3000",
            "/static": "http://localhost:3000",
            "/react-redux/util": "http://localhost:3000",
            "/react-redux/logout": "http://localhost:3000"
        }
    }
};