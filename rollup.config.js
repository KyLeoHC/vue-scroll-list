import babel from 'rollup-plugin-babel';

const distPath = 'dist/';

export default {
    input: 'src/index.js',
    output: [{
        file: distPath + 'vue-scroll-list.js',
        format: 'umd',
        name: 'vue-scroll-list'
    }, {
        file: distPath + 'vue-scroll-list.common.js',
        format: 'cjs'
    }, {
        file: distPath + 'vue-scroll-list.esm.js',
        format: 'es'
    }],
    plugins: [
        babel()
    ]
};