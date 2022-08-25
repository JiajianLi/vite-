import { defineComponent } from 'vue'
import { aaa } from './testId'
aaa()
export default defineComponent({
  setup () {
    return () => {
      return <div>Hello Vue3 Jsx</div>
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.on('handleHotUpdate', val => {
    console.log(val)
  })
}
