import 'core-js/modules/es.object.to-string.js';
import 'core-js/modules/es.promise.js';
import 'core-js/modules/web.timers.js';


import 'core-js/modules/web.timers.js'; // import '../css/iconfont.css';
// import '../css/index.less';
// import '../css/a.css';
// import '../css/b.css';
// import '@babel/polyfill';

const add = function add(x, y, z) {
  return x + y + z;
};

console.log(add(2, 5, 1)); // const promise = new Promise(resolve => {

const promise = new Promise(((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完了~');
    resolve();
  }, 1000);
}));
console.log(promise); // 下一行eslint所有规则都失效（下一行不进行eslint检查）
// eslint-disable-next-line
//console.log(add(1, 2));