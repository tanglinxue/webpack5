/*
  webpack.config.js  webpack的配置文件
    作用: 指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）

    所有构建工具都是基于nodejs平台运行的~模块化默认采用commonjs。
*/

const {resolve} = require('path')
module.exports = {
	//webpack配置
	//入口起点
	entry:'./src/index.js',
	output:{
		//输出文件名
		filename:'built.js',
		//输出路径
		path:resolve(__dirname,'build')
	},
	module:{
		rules:[]
	}
}