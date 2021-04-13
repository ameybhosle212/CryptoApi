const route = require('express').Router();
const User = require('../model/user')
const Crypto = require('../model/crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {spawn} = require('child_process')
const saltRounds = 10;
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ameybhosle212@gmail.com", // generated ethereal user
      pass: "22334AMEY", // generated ethereal password
    },
});

route.get("/", isAuth ,(req,res)=>{
    const data1 = req.cookies.auth;
    var use1 = jwt.verify(data1 , 'secret')
    return res.render("home",{data:use1.user});
})

route.get("/login",(req,res)=>{
    res.render("login")
})

route.post("/login", async (req,res)=>{
    const {email ,pass } = req.body;
    await User.findOne({email:email}).then(user =>{
        if(user){
            if(user.password == pass){
                const token = jwt.sign({user:user} , 'secret')
                res.cookie('auth' , token);
                return res.redirect("/")
            }
            return res.json("false")
        }
        return res.redirect("/register")
    })
})

route.get("/register",isNothAuth,(req,res)=>{
    res.render("register")
})

route.post("/register",async(req,res)=>{
    const {uname , email , pass} = req.body;
    await User.findOne({email:email}).then(user =>{
        if(!user){
            var newUser = User({uname:uname,email:email,password:pass})
            newUser.save();
            const token = jwt.sign({user:newUser},'verify');
            transporter.sendMail({
                from: "ameybhosle212@gmail.com", // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world? Click on Link to verify", // plain text body
                html: `"http://localhost:3100/verify/${token}"` // html body
            },(err,info)=>{
                if(err){
                    console.error(err);
                }
                res.cookie('verify',token);
                return res.redirect("/message")
            });
        }else{
            res.redirect("/login")
        }
    })
})

route.get("/message",(req,res)=>{
    res.render("message")
})


route.get("/verify/:url", isinVerify ,(req,res)=>{
    jwt.verify(req.params.url , 'verify',(err,data)=>{
        if(err){
            return res.json(err);
        }
        console.log(data);
        User.findOne({email:data.user.email},function(err,user){
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(user.password , salt, function(err, hash) {
                    user.ApiKey = hash;     
                    user.save();
                });
            });
            res.clearCookie("verify");
            return res.redirect("/login")
        })
    })
})

route.get("/api/:apikey/crypto" ,(req,res)=>{
    var apikey = req.params.apikey;
    User.findOne({ApiKey:apikey},function(err , data){
        if(err){
            console.error(err);
        }
        if(data){
            data.AccessedTimes = data.AccessedTimes + 1 ;
            data.save();
            var dataToSend;
            // spawn new child process to call the python script
            const python = spawn('python', ['./test.py']);
            // collect data from script
            python.stdout.on('data', function (data) {
            console.log('Pipe data from python script ...');
            console.log(data);
            dataToSend = data.toString();
            });
            // in close event we are sure that stream from child process is closed
            python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            console.log(dataToSend);
            // send data to browser
            return res.json(dataToSend);
            });
            
        }
        return res.json("INVALID API ")
    })
})

route.get("/documnetation" , isAuth , (req,res)=>{
    res.render("documnetation")
})

route.get("/logout",(req,res)=>{
    res.clearCookie("auth");
    return res.redirect("/login")
})

function isAuth(req,res,next) {
    const check =  req.cookies.auth;
    jwt.verify(check , 'secret',(err, data)=>{
        if(err){
            return res.json(err);
        }
        // }else if(data.user){
        //     req.user = data.user;
        //     next();
        // }
        next();
    })
}

function isNothAuth(req,res,next) {
    const check = req.cookies.auth;
    // var s = jwt.verify(check, 'secret');
    // console.log(s);
    if(!check){
        next()
    }
    else{
        return res.redirect("/home")
    }
}

function isinVerify(req,res,next) {
    const check = req.cookies.verify;
    jwt.verify(check , 'verify',(err,data)=>{
        if(err){
            return res.json(err);
        }
        next();
    })
}

module.exports = route;