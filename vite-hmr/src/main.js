import './style.css'
import { render } from './hmr-test'

render()

if (import.meta.hot) {
  import.meta.hot.accept(['./hmr-test'], ([newHmrTest]) => {
    newHmrTest.render()
  })
}
