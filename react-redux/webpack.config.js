var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require('path');
var webpack = require('webpack');
var noVisualization = process.env.NODE_ENV === 'production' 
        || process.argv.slice(-1)[0] == '-p'
        || process.argv.some(arg => arg.indexOf('webpack-dev-server') >= 0);

module.exports = {
    entry: {
        main: './reactStartup.js'
    },
    output: {
        filename: '[name]-bundle.js',
        chunkFilename: '[name]-chunk.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'react-redux/dist/'
    },
    resolve: {
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
                return context && (context.indexOf('node_modules\\react\\') >= 0 || context.indexOf('node_modules\\react-dom\\') >= 0);
            },
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),        

        //*********************************** async chunks*************************

        //catch all - anything used in more than one place
        new webpack.optimize.CommonsChunkPlugin({
            async: 'used-twice',
            minChunks(module, count) {
                return count >= 2;
            },
        }),

        //specifically bundle these large things
        new webpack.optimize.CommonsChunkPlugin({
            async: 'react-dnd',
            minChunks(module, count) {
                var context = module.context;
                var targets = ['react-dnd', 'react-dnd-html5-backend', 'react-dnd-touch-backend', 'dnd-core']
                return context && context.indexOf('node_modules') >= 0 && targets.find(t => new RegExp('\\\\' + t + '\\\\', 'i').test(context));
            },
        }),
    ].filter(p => p),
    devServer: {
        proxy: {
            "/react-redux/login": "http://localhost:3000",
            "/react-redux/logout": "http://localhost:3000",
            "/react-redux/createUser": "http://localhost:3000",
            "/react-redux/static": "http://localhost:3000",
            "/subject": "http://localhost:3000",
            "/tag": "http://localhost:3000",
            "/book": "http://localhost:3000",
            "/user": "http://localhost:3000",
            "/static": "http://localhost:3000",
            "/react-redux/util": "http://localhost:3000"
        }
    }
};