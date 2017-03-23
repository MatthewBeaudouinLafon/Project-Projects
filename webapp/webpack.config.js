var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './dist');
var APP_DIR = path.resolve(__dirname, './src');

var config = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        APP_DIR + '/index.js'
    ],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.NamedModulesPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'react-hot-loader!babel-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader'
            }
        ]
    },
    resolve: {
        extensions: [
            '*',
            '.js',
            '.jsx'
        ]
    },
    output: {
        path: BUILD_DIR,
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: BUILD_DIR,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000'
            }
        }
    }
};

module.exports = config;
