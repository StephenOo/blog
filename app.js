//加载express模块
const express = require("express");

//加载模块 处理模板
const swig = require("swig");

//引入数据库处理模块
const mongoose = require("mongoose");

//处理数据
const bodyParse = require("body-parser");

//cookie模块
const Cookies = require("cookies");
const User = require("./models/User");

//创建app应用 == http.createServer()
const app = express();

/*
	中间件
	定义当前应用所使用的模板引擎，swig.renderFile/ejs.render() 

	第一个参数： 模板引擎的名字，同时也是模板文件的后缀
*/
app.engine("html", swig.renderFile);

/*
	设置模板文件的存放目录
	第一个参数必须是views
	第二个参数是目录
*/
app.set("views", "./views");

/*
	注册所用的模板引擎/中间件
	第一个参数：不能改 view engine
	第二个参数： app.engine的中间件名字
*/
app.set("view engine", "html");

/*
	bodyParse设置
*/
app.use(bodyParse.urlencoded({extended: true}));

/*
	设置cookies
*/
app.use(function(req, res, next){
	req.cookies = new Cookies(req, res);
	/*
		userInfo
	*/
	/*
		因为在每一个路由下都需要判断用户是否登录，所以我们将数据挂在req上
		【注】当前用户是否是管理员不要卸载cookie里，最好直接挂在req.userInfo上,
		这样所有路由都可以拿到是否是管理员的信息。
	*/
	req.userInfo = {};
	if(req.cookies.get("userInfo")){
		try{
			req.userInfo = JSON.parse(req.cookies.get("userInfo"));
			//获取当前用户是否是管理员
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}catch(err){
			console.log(err);
		}
	}else{
		next();
	}

})

/*
	首页
	req request  请求对象
	res response 响应对象

app.get("/", function(req, res, next){
	//res.send("<h1>欢迎</h1>");
	res.render("index");
})
*/

/*
	根据不同的路由进行分发
*/
app.use("/admin", require('./routers/admin'));
app.use("/api", require('./routers/api'));
app.use("/",require('./routers/main'));

/*
	设置静态文件托管
	app.use  找到路由，执行后续的代码
*/

app.use("/public", express.static(__dirname + "/public"));


/*
	swig自动缓存，对开发不友好，开发时清除缓存
*/
swig.setDefaults({cache: false});

/*
	加载数据库
*/
mongoose.connect("mongodb://127.0.0.1:27017", function(err){
	if(err){
		console.log("数据库连接失败：" + err);
	}else{
		console.log("数据库连接成功");
		//监听http请求
		app.listen(8081);
	}
})
