//基于node的 遵循commonjs规范
let path = require('path');
let HtmlWebPackPlugin = require('html-webpack-plugin');
let CleanWebPackPlugin = require('clean-webpack-plugin');
let webpack = require('webpack');
//把css和less合并成一个文件，并通过import引入
//抽离文件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let Purifycss = require('purifycss-webpack');
let glob = require('glob');
let Copy = require('copy-webpack-plugin');
// let lessExtract = new ExtractTextWebpackPlugin({
// 	filename:'css/less.css',
// 	disable:true
// });
let cssExtract = new ExtractTextWebpackPlugin({
	filename:'css/css.css'
	//disable:true
});
//单页 index.html 引用了多个js
//多页 a.html->index.js b.html->a.js
module.exports = {
	entry:'./src/index.js',//打包入口  如果需要打包两个js到html页面 ['index.js','a.js']
	// entry:{
	// 	index:'./src/index.js',
	// 	a:'./src/a.js'
	// },
	output:{
		filename:'build.[hash:8].js',
		//多入口
		//filename:'[name].[hash:8].js',
		//这个路径必须是绝对路径 打包到那个位置
		//用当前的路径解析出一个绝对路径
		path:path.resolve('./build')
	},//出口
	devServer:{
		//打包到内存  以build起服务
		contentBase:'./build',
		port:8080,
		compress:true,//服务器压缩
		//open:true,//自动开浏览器
		hot:true//组件不全部更新
	},//开发服务器
	module:{
		rules:[//从右往左写 css-loader插入到style
			{
				test:/\.css$/,
				//把css和less合并成一个文件，并通过import引入
				//use: ExtractTextWebpackPlugin.extract({
				//css文件抽离到对应的css
				use: cssExtract.extract({
					fallback:'style-loader',
					use:[
						{loader:'css-loader'},
						{loader:'postcss-loader'}
					]
				})
			}//,
			// {
			// 	test:/\.less$/,
			// 	//fallback:'style-loader',
			// 	//use:ExtractTextWebpackPlugin.extract({
			// 	//less文件抽离到对应的less
			// 	use: lessExtract.extract({
			// 		use:[
			// 			{loader:'style-loader'},
			// 			{loader:'css-loader'},
			// 			{loader:'less-loader'}
			// 		]
			// 	})
			// }
		]
	},//模块配置
	plugins:[
		//抽离css文件 将css和less合并到css/index.css
		// new ExtractTextWebpackPlugin({
		// 	filename:'css/index.css'
		// }),
		//lessExtract,
		cssExtract,
		new Copy([
			{
				from:'./src/doc',
				to:'public'
			}
		]),
		//热更新插件 页面改了就刷新  devServer->hot
		new webpack.HotModuleReplacementPlugin(),
		//先清空build文件夹
		new CleanWebPackPlugin(['./build']),
		//打包的静态文件 打包html插件
		new HtmlWebPackPlugin({
			//别名  最终打包的成的文件名  a.html引用的是entry的相对应的文件，引用写在chunks
			//filename:'a.html',
			//打包的静态文件的模板地址
			template:'./src/index.html',
			//打包完成后的title
			title:'webpack学习',
			//hash值，去缓存
			hash:true,
			//压缩
			minify:{
				//干掉双引号
				removeAttributeQuotes:true,
				//压缩一行
				collapseWhitespace:true
			}//,
			//chunks:['index']//对应的entry下的相应的入口文件
		}),
		//必须放在html后面
		//没用的css消除
		new Purifycss({
			paths:glob.sync(path.resolve('./src/*.html'))
		})
	],//插件配置
	mode:'development',//可以更改模式 开发模式
	resolve:{},//配置解析
};
//1在webpack中如何配置开发服务器 webpack-dev-server
//2webpack插件 将html打包到build下可以自动引入生产的js
//抽离样式 抽离到一个css文件 用过css文件的方式来引用  