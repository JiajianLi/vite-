export default () => {
  return {
    name: 'test',
    // enforce: 'pre',
    // configResolved(config) {
    //   console.log(11, config.command)
    // },
    resolveId(id) {
      console.log(22, id)
    },
    load(id) {
      console.log(33, id)
    },
    transformIndexHtml(html) {
      console.log('transformIndexHtml:')
      console.log(html)
    },
    handleHotUpdate(ctx) {
      console.log('handleHotUpdate!!')
      // console.log(ctx)
      /**
       * {
       *    file: 更新的文件
       *    timestamp: 更新的时间
       *    modules: 更新的module [
       *      ModuleNode: modulePased处理的内容
       *    ]
       *    ...
       * }
       */
      ctx.server.ws.send({
        type: 'custom',
        event: 'handleHotUpdate',
        data: {
          msg: 'hello client, hot updated',
          file: ctx.file,
          id: ctx.id,
          timestamp: ctx.timestamp
        }
      })
      /**
       * {
       *   msg: 'hello client, hot updated',
       *   file: '/Users/admin/Desktop/Vite/vite-/vite-vue3/src/App.jsx',
       *   timestamp: 1660728266941
       * }
       */
    }
  }
}
