const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    uname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    vaild:{
        type:Boolean,
        default:false
    },
    ApiKey:{
        type:String
    },
    AccessedTimes:{
        type:Number,
        default: 0
    },
    AccessTime:{
        type:String
    }
})

module.exports = mongoose.model('user' , UserSchema);