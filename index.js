const express = require('express')
const mongoose  = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb://localhost/sttttt', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB CONNECTED")
})


app.use(express.urlencoded({extends:true}))
app.set("view engine","ejs")
app.use(cookieParser())
app.use("/",require('./routes/route'))

app.listen(3100,()=>{
    console.log("Server at 3000");
})