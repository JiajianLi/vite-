import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import testPlugin from './plugins/test-plugin'
import fs from 'fs'
import path from 'path'
import amdi18nLoader from 'amdi18n-loader'

const { createFilter, dataToEsm } = require('@rollup/pluginutils')

function createMyHTMLPlugin () {
  // 建立一个用于筛选模块的 filter

  const filter = createFilter(['**/*.html'])

  return {

    name: 'vite-plugin-my-html', // 起个名字
    enforce: 'pre',

    // 根据 id 来筛选模块，并在遇到匹配的模块时变换其 source

    transform (source, id) {
      if (!filter(id)) return

      // 这样 HTML 字符串就能被 export default 给其他 JS 模块了

      return dataToEsm(source)
    }
  }
}

const htmlImport = (conponentName) => ({
  name: 'htmlImport',
  enforce: 'pre',
  /**
   * Checks to ensure that a html file is being imported.
   * If it is then it alters the code being passed as being a string being exported by default.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path.
   * @returns {{code: string}}
   */
  resolveId (id) {
    console.log('resolveId: ', id)
    if (/datepicker/.test(id)) console.log('resolveId: ', id)
    // if (id === '/node_modules/@futuweb/ui-datepicker/es5/index.js') {
    //   console.log(111, '在这也不是不行')
    //   return id
    // }
    // if (id === conponentName) return id
    if (id === 'amdi18n-loader!./nls/datepicker') {
      console.log(1111111111111)
      return id
    }
  },
  load (id) {
    if (id === conponentName) {
      const a = fs.readFileSync(`./node_modules/${conponentName}/package.json`)
      // TODO 自己读
      // console.log(1111, a.toString())
      // const aaa = /"main":\s?"(.*)"/.match(a)
      // const aaa = a.match(/"main":\s?"(.*)"/)
      console.log(111, JSON.parse(a).main)
      const _entry = JSON.parse(a).main
      console.log(111, path.join(`./node_modules/${conponentName}`, _entry))
      const b = fs.readFileSync(path.join(`./node_modules/${conponentName}`, _entry))
      console.log(111, b.toString())
      return b.toString()
    }
    // if (/ui-datepicker&/.test(id)) {
    //   console.log(321)
    //   // return '读完的文件内容'
    // }
    if (/datepicker/.test(id)) console.log('load: ', id)
    console.log('load: ', id)
  },
  transform (code, id) {
    if (id === conponentName) {
      console.log('【transform】', ' id:', id, ' code:', code)
      // return { code: `exports.Datepicker='6啊兄弟'` }
      return { code: 'const Datepicker=\'6啊兄弟\'' }
      // return `exports.Datepicker='6啊兄弟';`
    }
    // if (id === '@futuweb/ui-datepicker') console.log(6666666)
    // console.log(1, id)

    // if (/^.*\.html$/g.test(id)) {
    //   code = `export default \`${code}\``
    // }
    if (/datepicker/.test(id)) {
      console.log('transform: ', id)
      console.log(1, code)
    }
    return { code }
  }
})

const amdI18nLoaderResolver = (source, importer, options) => {
  console.log(1111, source, importer, options)
  // 第一步，获得调用 require 的文件
  // 上面的例子即 node_modules/@futuweb/ui-datepicker/es5/Datepicker.js
  const targetDir = path.dirname(importer)
  // 第二步，计算目标文件，即 ./nls/datepicker 的路径
  const target = path.resolve(targetDir, `${source}.js`)
  // 第三步，调用 call，由于 webpack 上下文 Context 有很多属性，amdi18nLoader 只用到了 this.resourcePath，因此模拟这个即可；
  // 通过 fs 把 target 源文件内容传入，content 就是处理后的代码
  const content = amdi18nLoader.call({ resourcePath: target }, fs.readFileSync(target))
  // 第四步，由于 resolve 返回的是一个路径，因此需要把 content 存成一个文件；建文件夹，确定文件名，写入文件
  // 用一个 temp 目录存放这些文件【可自定义】
  const tempDir = path.resolve(__dirname, './temp')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
  }
  // 临时文件的文件名【可自定义】
  const tempFile = path.relative(__dirname, target).replace(/\//g, '_')
  fs.writeFileSync(path.resolve(tempDir, `amdi18nLoader-${tempFile}`), content, {})
  // 返回临时文件的路径
  return path.resolve(tempDir, `amdi18nLoader-${tempFile}`)
}

const htmlImport1 = {
  name: 'htmlImport1',
  enforce: 'pre',
  /**
   * Checks to ensure that a html file is being imported.
   * If it is then it alters the code being passed as being a string being exported by default.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path.
   * @returns {{code: string}}
   */
  transform (code, id) {
    if (/^.*\.html$/g.test(id)) {
      code = `export default \`${code}\``
    }
    return { code }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [htmlImport1, createMyHTMLPlugin(), htmlImport('@futuweb/ui-datepicker'), vue(), vueJsx(), testPlugin()],
  // resolve: {
  //   alias: {
  //     '@diy': ''
  //   }
  // },
  resolve: {
    alias: [
      {
        find: '@diy',
        replacement: ''
      },
      {
        find: /^amdi18n-loader!(.*)/,
        replacement: '$1',
        customResolver: amdI18nLoaderResolver
      }
      // {
      //   find: /\.html/
      // }
    ]
  },
  optimizeDeps: {
    // exclude: ['amdi18n-loader!./nls/datepicker']
    // exclude: ['amdi18n-loader!./nls/datepicker', '@futuweb/ui-datepicker']
  },
  build: {
    manifest: true
  }
})

// import amdi18nLoader  from 'amdi18n-loader'

// const __datepicker = require('./nls/datepicker')
// const _datepicker = amdi18nLoader(__datepicker)

// console.log(_datepicker)
