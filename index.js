const express = require('express')
const mongoose  = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb://localhost/apps', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB CONNECTED")
})


app.use(express.urlencoded({extends:true}))
app.set("view engine","ejs")

app.use("/",require('./routes/route'))

app.listen(3000,()=>{
    console.log("Server at 3000");
})