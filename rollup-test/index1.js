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