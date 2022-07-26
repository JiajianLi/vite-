import { defineComponent } from "vue";
// import './styles/index.css';

import '@styles/test.less';

import classes from '@styles/test.module.css';

// import { A } from './test';

// import { a } from './b';

import a from './a?raw';


import pngUrl from './assets/logo.png';
console.log(a, 1);

export default defineComponent({
    setup() {
        return () => (
            <>
                <div class={ `root ${classes.moduleClass} ` }>
                    Hello vite
                </div>
                <img src={pngUrl} />
            </>
        )
    }
})