const mongoose = require('mongoose')

const CptSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    Time:{
        type:String,
        required:true
    },
    Value:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('crypto' , CptSchema);