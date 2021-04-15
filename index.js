const express = require('express')
const mongoose  = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
mongoose.connect('mongodb://localhost/stress', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB CONNECTED")
})

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.use(cookieParser())
app.use("/",require('./routes/route'))

app.listen(4000,()=>{
    console.log("Server at 4000");
})