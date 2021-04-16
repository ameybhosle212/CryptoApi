const route = require('express').Router();
const User = require('../model/user')
const crypto = require('../model/crypto')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
var PythonShell = require('python-shell').PythonShell;
var options = {
    mode: 'text',
    scriptPath: 'C:/Users/ameyb/Desktop/api_today/routes'
};

const saltRounds = 15;
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "@gmail.com", // generated ethereal user
      pass: "", // generated ethereal password
    },
});

route.get("/", isAuth ,(req,res)=>{
    const data1 = req.cookies.auth;
    var use1 = jwt.verify(data1 , 'secret')
    var Key = use1.user.ApiKey;
    var ShortKey = Key.slice(1,Key.length);
    var data = {
        "uname":use1.user.uname,
        "ApiKey":ShortKey
    }
    return res.render("home",{data:data});
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
            return res.redirect("/login")
        }
        return res.redirect("/register")
    })
})

route.get("/register",(req,res)=>{
    res.render("register")
})

route.post("/register",async(req,res)=>{
    const {uname , email , pass} = req.body;
    console.log(email);
    await User.findOne({email:req.body.email}).then(user =>{
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
                    user.vaild = true;
                    user.ApiKey = hash;     
                    user.save();
                });
            });
            console.log(user);
            res.clearCookie("verify");
            return res.redirect("/login")
        })
    })
})

route.get("/api/:apikey/crypto" ,async(req,res)=>{
    var apikey = "$" + req.params.apikey;
    console.log(apikey);
    await User.findOne({ApiKey:apikey},function(err , data){
        if(err){
            console.error(err);
        }
        console.log(data);
        if(data){
            PythonShell.run('test.py', options, function (err, results) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                data.AccessedTimes = data.AccessedTimes + 1 ;
                data.save();
                crypto.find({} , function(err, post) {
                    // if (err) return res.json(err);
                    console.log(post);
                    return res.status(200).json(post);
                });
            });            
        }
        else{
            return res.json("INVALID API ")
        }
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
    var s = jwt.verify(check, 'secret');
    console.log(s);
    // console.log(check);
    if(check != null){
        next()
    }
    else{
        return res.redirect("/")
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