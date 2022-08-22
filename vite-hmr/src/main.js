import './style.css'
import { render } from './hmr-test'

render()

if (import.meta.hot) {
  import.meta.hot.accept(['./hmr-test'], ([newHmrTest]) => {
    console.log('hmr-test change! newHmrTest：', newHmrTest)
    if (newHmrTest.i > 10) import.meta.hot.invalidate()
    else newHmrTest.render()
  })
  // import.meta.hot.decline()
  import.meta.hot.accept((newMain) => { console.log('newMain:', newMain) })
}

console.log(1211)
