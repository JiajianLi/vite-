import { createApp } from 'vue'
import App from './App'

// import Worker from './webWorker?worker';

// const worker = new Worker();

// worker.onmessage = (e) => {
//     console.log(e);
// };

import pkg from '../package.json'

console.log(pkg)

createApp(App).mount('#app')
