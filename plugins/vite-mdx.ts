import type { Plugin } from 'vite'

import { createCompiler } from '@mdx-js/mdx'

import { createFilter, FilterPattern } from '@rollup/pluginutils'


interface Options {
  include?: FilterPattern,
  exclude?: FilterPattern
}

export default (options: Options = {}): Plugin => {
  return {
    name: 'vite-mdx',
    // mdx => jsx/tsx
    transform(code, id, ssr) {

      const { include = /\.mdx/, exclude } = options
      const filter = createFilter(include, exclude)

      if (filter(id)) {
        console.log('【begin】mdx => jsx/tsx code:')
        console.log(code)

        const compiler = createCompiler()

        const result = compiler.processSync(code)

        console.log('【end】code:')
        console.log(result.contents)

        return {
          code: result.contents
        }
      }


    }
  }
}