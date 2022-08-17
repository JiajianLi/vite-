export default (enforce: 'pre' | 'post') => {
    return {
      name: 'test',
      // config(userConfig) {
      //   console.log('config:', userConfig.resolve)
      //   // return {
      //   //     resolve: {
      //   //         alias: {
      //   //             '@diy': '/src/diy'
      //   //         }
      //   //     }
      //   // }
      //   return new Promise(resolve => {
      //     resolve({
      //       resolve: {
      //         alias: {
      //           '@diy': enforce || '/src/diy'
      //         }
      //       }
      //     })
      //   })
      // },
      // configResolved(config) {
      //   console.log('configResolved:', config.resolve)
      // },
      configureServer(server) {
        // console.log('configureServer:', server)
        // vite 中间件之前会先执行它
        return () => {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/test') {
              console.log(1, res)
              res.end('test')
            } else {
              next()
            }
          })
        }
      }
    }
  }