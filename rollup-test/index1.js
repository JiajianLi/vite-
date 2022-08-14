import path from 'path';
import { funA } from 'a';

import react from 'react';

import pkg from './package.json'

import { myTSFun } from './testts';

import url from './logo.png'

console.log(url)
console.log(__TEST__);

myTSFun('leezar')

funA();
console.log('hello rollup1', pkg);

// 2
import react from 'react'

const div = react.createElement('div')

function helloDiv () {
    console.log('hello div')
}

helloDiv()

// const aa = 1
// bb += aa
// console.log(bb)

console.log(GLOBAL)

export default helloDiv