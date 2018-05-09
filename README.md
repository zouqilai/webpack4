#### webpack4.0
本地安装 最好不要全局安装，因为可能每个人的版本不同
初始化package.json
<pre>
npm init -y
</pre>
全局安装
<pre>
npm install webpack -g
</pre>
本地安装
<pre>
npm install webpack webpack-cli -D  线下环境用 打包不需要 项目依赖
</pre>

##### webpack中所有文件都是模块
js模块 模块化（AMD CMD->seajs ES6Module->import ）
##### 直接允许webpack运行，搭建环境
会执行node_modules对应的bin下的webpack.cmd
<pre>
npx webpack
</pre>
##### webpack.config.js 配置文件
<pre>
1、在webpack中如何配置开发服务器 webpack-dev-server
	npm install webpack-dev-server
2、2webpack插件 将html打包到build下可以自动引入生产的js 
	npm install html-webpack-plugin -D
	let HtmlWebPackPlugin = require('html-webpack-plugin');
3、删除上次的打包文件
	npm install clean-webpack-plugin -D
let CleanWebPackPlugin = require('clean-webpack-plugin');
4、css处理 loader  加载模块 模块配置
	npm install style-loader css-loader less less-loader -D
5、抽离样式 抽离到一个css文件 用过css文件的方式来引用
	npm install extract-text-webpack-plugin@next mini-css-extract-plugin -D
	//把css和less合并成一个文件，并通过import引入
	//抽离文件
	let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
	let lessExtract = new ExtractTextWebpackPlugin('css/less.css');
	let cssExtract = new ExtractTextWebpackPlugin('css/css.css');
6、删除不需要的内容
	npm install purifycss-webpack purify-css glob -D
	let Purifycss = require('purifycss-webpack');
	let glob = require('glob');
7、给css自动加浏览器前缀
	npm install postcss-loader autoprefixer -D
	新建postcss.config.js
	module.exports = {
		plugins:[
			require('autoprefixer')
		]
	};
8、拷贝文件到另外一个目录
	npm install copy-webpack-plugin -D
	let Copy = require('copy-webpack-plugin');
</pre>
<pre>
const path = require('path');
module.exports = {
	//entry:'./src/index.js',//打包入口  如果需要打包两个js到html页面 ['index.js','a.js']
	//多入口打包
	//多页 a.html->index.js b.html->a.js
	entry:{
		index:'./src/index.js',
		a:'./src/a.js'
	},
	output:{
		filename:'build.js',//build.[hash:8].js
		//这个路径必须是绝对路径 打包到那个位置
		//用当前的路径解析出一个绝对路径
		path:path.resolve('./build')
	},//打包出口 打包到哪里
	devServer:{
		//打包到内存  以build起服务
		contentBase:'./build',
		port:3000,
		compress:true,//服务器压缩
		open:true//自动开浏览器
	},//开发服务器
	module:{
		rules:[//从右往左写 css-loader插入到style
			//{
				//test:/\.css$/,
				//use:[
					//{
						//loader:'style-loader'
					//},
					//{
						//loader:'css-loader'
					//}
				//]
			//}
			{
				test:/\.css$/,
				//把css和less合并成一个文件，并通过import引入
				//use: ExtractTextWebpackPlugin.extract({
				//css文件抽离到对应的css
				use: cssExtract.extract({
					use:[
						//{loader:'style-loader'},
						{loader:'css-loader'}
					]
				})
			},
			{
				test:/\.less$/,
				//use:ExtractTextWebpackPlugin.extract({
				//less文件抽离到对应的less
				use: lessExtract.extract({
					fallback:'style-loader',
					use:[
						//{loader:'style-loader'},
						{loader:'css-loader'},
						{loader:'less-loader'}
					]
				})
			}
		]
	},//模块配置
	plugins:[
		//抽离css文件
		//new ExtractTextWebpackPlugin({
			//filename:'css/index.css'
		//}),
		lessExtract,
		cssExtract,
		new Copy([
			{
				from:'./src/doc',
				to:'public'
			}
		]),
		//先清空build文件夹
		new CleanWebPackPlugin(['./build']),
		//打包的静态文件 打包html插件
		new HtmlWebPackPlugin({
			//别名  最终打包的成的文件名  a.html引用的是entry的相对应的文件，引用写在chunks
			filename:'a.html',
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
			},
			chunks:['index']//对应的entry下的相应的入口文件
		}),
		new HtmlWebPackPlugin({
			filename:'b.html',
			//打包的静态文件的地址
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
			},
			chunks:['a']//对应的entry下的相应的入口文件
		}),
		//必须放在html后面
		//没用的css消除
		new Purifycss({
			paths:glob.sync(path.resolve('src/*.html'))
		})
	],//插件配置
	mode:'development',//可以更改模式 开发模式
	resolve:{},//配置解析
};

</pre>
##### package.json
<pre>
"scripts": {
    "build": "build",//打包真实文件
    "start": "webpack-dev-server"//开发启动一个服务
  }
</pre>