const route = require('express').Router();
const User = require('../model/user')
const Crypto = require('../model/crypto')
const jwt = require('jsonwebtoken')
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
    var uname1  = use1.user.uname;
    console.log(uname1);
    var token = jwt.sign(uname1 , 'api');
    console.log(token);
    User.findOne({uname:uname1} , function(err , user){
        // if(err) throw err;
        user.ApiKey = token;
        user.save();
        var short = token.split('.')[2];
        var data = {
            "uname":user.uname,
            "email":user.email,
            "apikey":short,
            "AccessedTimes":AccessedTimes
        };
        return res.render("home",{data:data})
    })
    // return res.render("home");
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
        res.clearCookie("verify");
        return res.redirect("/login")
    })

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