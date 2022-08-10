import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import json from '@rollup/plugin-json'
// import alias from '@rollup/plugin-alias'
// import replace from '@rollup/plugin-replace'
// import ts from '@rollup/plugin-typescript'
// import image from '@rollup/plugin-image'
// import strip from '@rollup/plugin-strip'
// // import eslint from '@rollup/plugin-eslint'
// import { terser } from 'rollup-plugin-terser'
// export default {
//     input: 'index.js',
//     output: {
//         file: 'dist.js',
//         format: 'umd',
//         name: 'index'
//     },
//     plugins: [json()]
// }

export default [
    // {
    //     input: 'index.js',
    //     output: {
    //         file: 'dist/dist.umd.js',
    //         format: 'umd',
    //         name: 'index'
    //     },
    //     plugins: [resolve(), commonjs(), json()]
    // },
    {
        input: 'index.js',
        // external: ['react'],
        output: {
            // file: 'dist.rlp.js',
            file: 'dist/dist.rlp.js',
            // plugins: [terser()],
            // banner: '/** Hello This is Banner **/'
        },
        plugins: [
            resolve(),
            // alias({
            //     entries: {
            //         a: './a'
            //     }
            // }),
            // eslint({
            //     throwOnError: true
            // }),
            // image(),
            // strip(),
            commonjs(),
            // ts(),
            // replace({
            //     __TEST__: 123,
            // }),
            // json()
        ]
    },
]