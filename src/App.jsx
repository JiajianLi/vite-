import { defineComponent } from 'vue'

// import './styles/index.css';
import '@styles/test.less'

import classes from '@styles/test.module.css'

// import a from './a?raw'

import pngUrl from './assets/logo.png'

import Hello from './hello.mdx'

export default defineComponent({
  setup () {
    return () => (
      <>
        <div class={ `root ${classes.moduleClass} ` }>
          Hello vite
        </div>
        <img src={pngUrl} />
        <Hello />
      </>
    )
  }
})
