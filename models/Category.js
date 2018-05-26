var mongoose = require("mongoose");
var usersSchema = require("../schemas/categories");


//完成模型类
module.exports = mongoose.model("Category", usersSchema);
