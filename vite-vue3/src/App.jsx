import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return () => {
      return <div>Hello Vue3 Jsx</div>
    }
  }
})
console.log(111)

if (import.meta.hot) {
  import.meta.hot.on('handleHotUpdate', val => {
    console.log(val)
  })
}
