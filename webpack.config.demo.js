const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

baseConfig.output = {
    path: path.resolve(__dirname, 'onlineDemo'),
    publicPath: '/vue-scroll-list/',
    filename: '[name].[hash].js',
    sourceMapFilename: '[file].map'
};

baseConfig.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    })
);

baseConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false,
        sourceMap: true
    })
);

baseConfig.plugins.push(
    new HtmlWebpackPlugin({
        title: 'vue-scroll-list',
        template: 'example/index.html',
        filename: 'index.html'
    })
);

baseConfig.devtool = 'source-map';

module.exports = baseConfig;