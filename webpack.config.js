const webpack = require('webpack');
const path = require('path');

let config = {
    entry: {
        index: './example/index'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'vue-scroll-list': path.resolve(__dirname, 'index.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {}
            }
        ]
    },
    devServer: {
        contentBase: './example',
        host: '0.0.0.0',
        port: '8686',
        noInfo: true
    }
};

module.exports = config;