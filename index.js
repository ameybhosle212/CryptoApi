const express = require('express')
const mongoose  = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')
const uri = "mongodb+srv://<username>:<password>@cluster0.hd8jn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB CONNECTED")
})


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.use(cookieParser())
app.use("/",require('./routes/route'))

app.listen(3100,()=>{
    console.log("Server at 3000");
})