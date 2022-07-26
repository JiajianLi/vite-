import { A } from './types';
// interface A {
//     name: string
// }

// declare const enum Num {
//     First = 0,
//     Second = 1
// }

// export const a: A = {
//     name: 'leezar',
//     age: Num.First,
// }


// interface A {}

declare const enum Num {
    First = 0,
    Second = 1
}

export const a: A = {
    num: Num.First,
}

export { A }
