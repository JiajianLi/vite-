import { defineComponent } from 'vue'
import { aaa } from './testId'
// import { Datepicker } from '@futuweb/ui-datepicker'
aaa()

const cb = (
  {
    default: __default,
    aaa: __aaa,
    bbb: __bbb,
    ccc: __ccc
  }
) => {
  console.log(1221, __aaa, __bbb, __ccc)
}
// eslint-disable-next-line n/no-callback-literal
cb({ default: 1, aaa: 2, bbb: 3, ccc: 4 })

// console.log(1, Datepicker)
export default defineComponent({
  setup () {
    return () => {
      return <div>Hello Vue3 Jsx</div>
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.on('handleHotUpdate', val => {
    // console.log(val)
    console.log('[client] handleHotUpdate')
  })
}
