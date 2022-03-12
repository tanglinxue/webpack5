
import print from './print';
import '../css/a.css';
import '../css/b.css';

console.log('打印');
const add = function add(x, y, z) {
  return x + y + z;
};
console.log(add(1, 3, 2));
print();

if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./print.js', () => {
    // 方法会监听 print.js 文件的变化，一旦发生变化，其他模块不会重新打包构建。
    // 会执行后面的回调函数
    print();
  });
}
