const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');

baseConfig.output = {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].js'
};

baseConfig.plugins.push(
    new HtmlWebpackPlugin({
        title: 'vue-scroll-list',
        template: 'example/index.html',
        filename: 'index.html'
    })
);

baseConfig.devServer = {
    host: '0.0.0.0',
    port: '8686',
    noInfo: true
};

module.exports = baseConfig;