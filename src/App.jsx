import { defineComponent } from "vue";
// import './styles/index.css';

import '@styles/test.less';

import classes from '@styles/test.module.css';

// import { a } from './test';

import { a } from './b';

export default defineComponent({
    setup() {
        return () => (
            <div class={ `root ${classes.moduleClass} ` }>Hello { a.name }</div>
        )
    }
})