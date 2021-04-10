const route = require('express').Router();
const User = require('../model/user')
const Crypto = require('../model/crypto')
const jwt = require('jsonwebtoken')

route.get("/", isAuth ,(req,res)=>{
    res.render("home")
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
                return res.json("true")
            }
            return res.json("false")
        }
        return res.redirect("/register")
    })
})

route.get("/register",(req,res)=>{
    res.render("register")
})

route.post("/register",async(req,res)=>{
    const {uname , email , pass} = req.body;
    await User.findOne({email:email}).then(user =>{
        if(!user){
            var newUser = User({uname:uname,email:email,password:pass})
            newUser.save();
        }
        return res.redirect("/login")
    })
})

function isAuth(req,res,next) {
    const check = req.cookies.auth;
    jwt.verify(check , 'secret',(err, data)=>{
        if(err){
            res.json(err);
        }else if(data.user){
            req.user = data.user;
            next();
        }
        next();
    })
}

module.exports = route;