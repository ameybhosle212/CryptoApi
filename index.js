const express = require('express')
const mongoose  = require('mongoose')
const app = express()
mongoose.connect('mongodb://localhost/apps', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB CONNECTED")
})


app.use(express.urlencoded({extends:true}))
app.set("ejs" , "view engine" )

app.use("/",require('./routes/route'))

app.listen(3000,()=>{
    console.log("Server at 3000");
})