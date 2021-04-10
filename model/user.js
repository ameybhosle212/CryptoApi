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
    ApiKey:{
        type:String
    },
    AccessedTimes:{
        type:Number
    },
    AccessTime:{
        type:String
    }
})

module.exports = mongoose.model('user' , UserSchema);