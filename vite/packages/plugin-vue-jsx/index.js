// @ts-check
const babel = require('@babel/core')
const jsx = require('@vue/babel-plugin-jsx')
const importMeta = require('@babel/plugin-syntax-import-meta')
const { createFilter, normalizePath } = require('@rollup/pluginutils')
const hash = require('hash-sum')
const path = require('path')

const ssrRegisterHelperId = '/__vue-jsx-ssr-register-helper'
const ssrRegisterHelperCode =
  `import { useSSRContext } from "vue"\n` +
  `export ${ssrRegisterHelper.toString()}`

/**
 * This function is serialized with toString() and evaluated as a virtual
 * module during SSR
 * @param {import('vue').ComponentOptions} comp
 * @param {string} filename
 */
function ssrRegisterHelper(comp, filename) {
  const setup = comp.setup
  comp.setup = (props, ctx) => {
    // @ts-ignore
    const ssrContext = useSSRContext()
    ;(ssrContext.modules || (ssrContext.modules = new Set())).add(filename)
    if (setup) {
      return setup(props, ctx)
    }
  }
}

/**
 * @typedef { import('@rollup/pluginutils').FilterPattern} FilterPattern
 * @typedef { { include?: FilterPattern, exclude?: FilterPattern, babelPlugins?: any[] } } CommonOptions
 */

/**
 *
 * @param {import('@vue/babel-plugin-jsx').VueJSXPluginOptions & CommonOptions} options
 * @returns {import('vite').Plugin}
 */
function vueJsxPlugin(options = {}) {
  let root = ''
  let needHmr = false
  let needSourceMap = true

  return {
    name: 'vue-jsx',

    config(config) {
      return {
        // only apply esbuild to ts files
        // since we are handling jsx and tsx now
        // TODO 仅用esbuild来处理ts文件，这个插件已经处理好了jsx和tsx
        esbuild: {
          include: /\.ts$/
        },
        // TODO 定义了两个环境变量，跟vue相关的
        define: {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: false,
          ...config.define
        }
      }
    },

    configResolved(config) {
      // TODO 启动命令包含 serve 就是开发环境
      needHmr = config.command === 'serve' && !config.isProduction
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap
      root = config.root
    },

    resolveId(id) {
      if (id === ssrRegisterHelperId) {
        return id
      }
    },

    load(id) {
      if (id === ssrRegisterHelperId) {
        return ssrRegisterHelperCode
      }
      // TODO 处理特定引入代码
      /**
       * 想当于有import xxxx from ssrRegisterHelperId的时候
       * 处理文件代码为 ssrRegisterHelperCode
       * 不需要手动新增文件，也就是说我们可以在页面里直接使用：
       * import { ssrRegisterHelper } from '/__vue-jsx-ssr-register-helper'
       */
    },
    // TODO
    /**
     *
     * @param {*} code 文件源代码
     * @param {*} id 文件路径
     * @param {*} ssr 当前是否为ssr环境
     * @returns
     */
    transform(code, id, ssr) {
      console.log(33, babelPluginOptions);
      const {
        include,
        exclude,
        babelPlugins = [], // TODO 使用babel转译代码至ast
        ...babelPluginOptions // 剩余的参数用babelPluginOptions
      } = options

      // TODO 借助createFilter判断文件是否需要进行transform
      const filter = createFilter(include || /\.[jt]sx$/, exclude)
      // TODO step1
      // TODO ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️ 文件处理 ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
      if (filter(id)) {
        /**
         * importMeta，官方提供 import.meta的一些信息
         * jxs: 官方的插件
         * babelPluginOptions: 给plugin传递配置项
         * 外部(vite.config.js)传入的babel plugins： plugins: [vueJsx({ babelPlugins: [] })]
         */
        const plugins = [importMeta, [jsx, babelPluginOptions], ...babelPlugins]
        // TODO 是tsx类型文件用 @babel/plugin-transform-typescript 处理，babel默认不开启ts编译
        if (id.endsWith('.tsx')) {
          plugins.push([
            require('@babel/plugin-transform-typescript'),
            // @ts-ignore
            { isTSX: true, allowExtensions: true }
          ])
        }
        // TODO transformSync就是得到 ast的过程，result得到ast的代码
        const result = babel.transformSync(code, {
          babelrc: false,
          ast: true,
          plugins,
          sourceMaps: needSourceMap,
          sourceFileName: id,
          configFile: false
        })
        // TODO 不是ssr和不是hmr模式，不需要做其它事情
        if (!ssr && !needHmr) {
          return {
            code: result.code,
            map: result.map
          }
        }

        // check for hmr injection
        /**
         * @type {{ name: string }[]}
         */
        const declaredComponents = []
        /**
         * @type {{
         *  local: string,
         *  exported: string,
         *  id: string,
         * }[]}
         */
        const hotComponents = []
        let hasDefault = false
        // TODO 遍历每一个语句
        for (const node of result.ast.program.body) {
          // TODO 节点类型为VariableDeclaration
          /**
           * 什么是VariableDeclaration，就是 const test = defineComponent({}) 没有export出去
           */
           if (node.type === 'VariableDeclaration') {
            // TODO 判断变量的声明是否是一个组件的声明，如果是会放到declaredComponents里
            const names = parseComponentDecls(node, code)
            // TODO 如果赋值语句是组件的定义，会将变量名存到declaredComponents
            if (names.length) {
              declaredComponents.push(...names)
            }
          }

          // TODO ExportNamedDeclaration是有名字的export export const xxxx = ...或 export { xxxx, xxxx }
          // TODO 就是在 VariableDeclaration 基础上加上export
          if (node.type === 'ExportNamedDeclaration') {
            if (
              node.declaration &&
              node.declaration.type === 'VariableDeclaration'
            ) {
              // TODO 如果是 export const xxxx = ... 这种形式会将组件的变量名加工成{}push进hotComponents里
              hotComponents.push(
                ...parseComponentDecls(node.declaration, code).map(
                  ({ name }) => ({
                    local: name,
                    exported: name, // TODO 因为我们把这个变量export出去了，引入的时候也要import这个名字
                    id: hash(id + name) // TODO 文件名(文件路径)+变量名
                  })
                )
              )
            } else if (node.specifiers.length) {
              // TODO specifiers：判断是否存在export {}的形式导出的变量
              for (const spec of node.specifiers) {
                if (
                  spec.type === 'ExportSpecifier' &&
                  spec.exported.type === 'Identifier'
                ) {
                  // 如果存在export 的变量，会去declaredComponents找同样的变量名
                  const matched = declaredComponents.find(
                    ({ name }) => name === spec.local.name
                  )
                  // TODO 如果matched代表变量同样是一个组件，也会push到hotComponents里
                  if (matched) {
                    hotComponents.push({
                      local: spec.local.name,
                      exported: spec.exported.name,
                      id: hash(id + spec.exported.name)
                    })
                  }
                  // TODO 看到这里应该能看出来 hotComponents 和 declaredComponents的差别，不是所有声明组件都会被添加到hot里的
                  // TODO 只有export的组件才会被加入hotComponents
                  // TODO 为什么要这么做呢，因为jsx不同于.vue文件一个文件就是一个组件，jsx允许有多个组件
                  // TODO plugin-vue-jsx更关心export出去的组件，对它们进行热更新的处理，因为它们会在外部被渲染，没export的组件只会在内部的某个部分里被渲染
                  // TODO 只要对export的组件进行热更新，内部的组件肯定也会被覆盖到
                }
              }
            }
          }
          // TODO 这个就不用多说了，判断 export default是否为组件
          if (node.type === 'ExportDefaultDeclaration') {
            // TODO 如果export的是变量，判断是否为组件，是则push到hotComponents里
            if (node.declaration.type === 'Identifier') {
              const _name = node.declaration.name
              const matched = declaredComponents.find(
                ({ name }) => name === _name
              )
              if (matched) {
                hotComponents.push({
                  local: node.declaration.name,
                  exported: 'default',
                  id: hash(id + 'default')
                })
              }
            } else if (isDefineComponentCall(node.declaration)) {
              // TODO 是defineComponentCall也推进hotComponents
              hasDefault = true
              // TODO 是不是很熟悉，在源代码里见到过
              // TODO local会赋值为__default__，如果没有变量名字无法在文件里通过import {} 结构的方式引用它
              // TODO 因为vite是基于es module的方式进行模块管理的，也就是通过收集export xxx 和 import { xxx } from xxxx来进行模块管理，没有变量名对hmr来说很不方便
              // TODO 所以会加工成 __default__ = defineComponent  export default __default__ 这种形式
              hotComponents.push({
                local: '__default__',
                exported: 'default',
                id: hash(id + 'default')
              })
            }
          }
        }
        // TODO ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️ 文件处理 ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️

        // TODO step2

        if (hotComponents.length) {
          if (hasDefault && (needHmr || ssr)) {
            result.code =
              result.code.replace(
                /export default defineComponent/g,
                `const __default__ = defineComponent`
              ) + `\nexport default __default__`
          }

          if (needHmr && !ssr) {
            let code = result.code
            let callbackCode = ``
            for (const { local, exported, id } of hotComponents) {
              code +=
                `\n${local}.__hmrId = "${id}"` +
                `\n__VUE_HMR_RUNTIME__.createRecord("${id}", ${local})`
              callbackCode += `\n__VUE_HMR_RUNTIME__.reload("${id}", __${exported})`
            }

            code += `\nimport.meta.hot.accept(({${hotComponents
              .map((c) => `${c.exported}: __${c.exported}`)
              .join(',')}}) => {${callbackCode}\n})`

            result.code = code
          }

          if (ssr) {
            const normalizedId = normalizePath(path.relative(root, id))
            let ssrInjectCode =
              `\nimport { ssrRegisterHelper } from "${ssrRegisterHelperId}"` +
              `\nconst __moduleId = ${JSON.stringify(normalizedId)}`
            for (const { local } of hotComponents) {
              ssrInjectCode += `\nssrRegisterHelper(${local}, __moduleId)`
            }
            result.code += ssrInjectCode
          }
        }

        return {
          code: result.code,
          map: result.map
        }
      }
    }
  }
}

/**
 * @param {import('@babel/core').types.VariableDeclaration} node
 * @param {string} source
 */
function parseComponentDecls(node, source) { // TODO node: VariableDeclaration里的内容
  const names = []
  for (const decl of node.declarations) {
    // TODO isDefineComponentCall判断init是否为defineComponent的函数调用
    // TODO 有什么用呢，其实就是为了判断当前的组件是vue3创建的组件！所以使用vue3的时候建议尽量使用defineComponent来定义组件
    if (decl.id.type === 'Identifier' && isDefineComponentCall(decl.init)) {
      // TODO 如果是vue3的组件，会把 id.name（组件变量名）push进names
      names.push({
        name: decl.id.name
      })
    }
  }
  return names
}

/**
 * @param {import('@babel/core').types.Node} node
 */
function isDefineComponentCall(node) {
  // TODO CallExpression：函数调用
  return (
    node &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'defineComponent'
  )
}

module.exports = vueJsxPlugin
vueJsxPlugin.default = vueJsxPlugin
