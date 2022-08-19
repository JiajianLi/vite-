export default () => {
  return {
    name: 'test',
    transformIndexHtml(html) {
      console.log(html)
    },
    handleHotUpdate(ctx) {
      console.log('handleHotUpdate!')
      console.log(ctx)
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

interface ImportMeta {
  readonly hot?: {
    readonly data: any

    accept(): void
    accept(cb: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    accept(deps: string[], cb: (mods: any[]) => void): void

    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void

    on(event: string, cb: (...args: any[]) => void): void
  }
}