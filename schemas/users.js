var mongoose = require("mongoose");

//定义用户的集合结构，对外的接口
module.exports = new mongoose.Schema({
	//用户名
	username: String,
	password: String,
	//是否是管理员
	isAdmin: {
		type: Boolean,
		default: false
	}
})