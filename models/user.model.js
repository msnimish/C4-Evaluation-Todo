let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  email: {type:String, unique:true},
  password: String,
//   userIP : String 
})

let UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };