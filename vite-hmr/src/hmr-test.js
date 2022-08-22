// import javascriptLogo from './javascript.svg'

export function render () {
  document.querySelector('#app').innerHTML = `
    <div>
      <h1>Hello HMR!</h1>
    </div>
  `
}
// let timer
// export function render () {
//   timer = setInterval(() => {
//     i++
//     document.querySelector('#app').innerHTML = `
//         <div>
//           <h1>Hello HMR!！</h1>
//           <h2>${i}</h2>
//         </div>
//       `
//   }, 1000)
// }

export let i = import.meta?.hot?.data?.cache?.getI() || 0
const timer = setInterval(() => { console.log(++i) }, 1000)

if (import.meta.hot) {
  console.log('触发hmr-test热更新')
  // 触发热更新时缓存i值在闭包里
  if (import.meta.hot.data) {
    import.meta.hot.data.I = i
    import.meta.hot.data.cache = {
      getI () {
        return i
      }
    }
  }
  import.meta.hot.dispose(() => { if (timer) clearInterval(timer) })
}

// export function render () {
//   document.querySelector('#app').innerHTML = `
//     <div>
//       <a href="https://vitejs.dev" target="_blank">
//         <img src="/vite.svg" class="logo" alt="Vite logo" />
//       </a>
//       <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//         <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//       </a>
//       <h1>Hello Vite!</h1>
//       <div class="card">
//         <button id="counter" type="button">112</button>
//       </div>
//       <p class="read-the-docs">
//         Click on the Vite logo to learn more
//       </p>
//     </div>
//   `
// }
