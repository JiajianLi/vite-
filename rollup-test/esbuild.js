let exampleOnLoadPlugin = {
  name: 'example',
  setup(build) {
    let fs = require('fs')

		build.onResolve({ filter: /\.txt$/ }, async (args) => ({
			path: args.path,
			namespace: 'txt'
		}))

    // Load ".txt" files and return an array of words
    // build.onLoad({ filter: /\.txt$/ }, async (args) => {
		build.onLoad({ filter: /\.*/, namespace: 'txt' }, async (args) => {
			let text = await fs.promises.readFile(args.path, 'utf8')
      return {
        // contents: JSON.stringify(text.split(/\s+/)),
				// loader: 'json',
        contents: `export default ${JSON.stringify(text.split(/\s+/))}`,
      }
    })
  },
}

require('esbuild')
	.build({
		entryPoints: ['index.js'],
		bundle: true,
		// outdir: 'dist',
		outfile: 'dist.js',
		loader: {
			'.png': 'dataurl'
		},
		plugins: [exampleOnLoadPlugin]
	})
	.catch(() => process.exit(1))