import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'vue-scroll-list.js',
    dest: 'dist/vue-scroll-list.js',
    format: 'umd',
    plugins: [
        babel()
    ]
};