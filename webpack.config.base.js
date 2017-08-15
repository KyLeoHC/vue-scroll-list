const webpack = require('webpack');
const path = require('path');

let config = {
    entry: {
        index: './example/index'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'vue-scroll-list': path.resolve(__dirname, 'src/index.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {}
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false, // don't read '.babelrc' file
                            presets: ['es2015'],
                            plugins: ['transform-runtime']
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         babel: {
        //             presets: ['es2015'],
        //             plugins: ['transform-runtime']
        //         }
        //     }
        // })
    ]
};

module.exports = config;