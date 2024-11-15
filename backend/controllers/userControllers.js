const asynchandler= require("express-async-handler")
const User = require("../models/userModel")
const generateToken= require("../config/generateToken")

const registerUser=asynchandler(async(req,res)=>{

    const {name,email,password,pic}=req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new error("please enter the field")
    }
    const userExists= await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new error("User already exists");
    }
        const user= await User.create({
            name,
            email,
            password,
            pic,
        });
        if(user){
            res.status(201).json({
                _id: user._id,
                name:user.name,
                password:user.password,
                pic:user.pic,
                token:generateToken(user._id),
            });

        }else{
            res.status(400);
            throw new error("failded to create user");
        }
});


const authUser=asynchandler(async(req,res)=>{
        const {email,password}=req.body;
        const user=await User.findOne({email});

        if(user && (await user.matchPassword(password))){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id)
            });
        }else{
            res.status(401);
            throw new error("Invalid Credentials");
        }
});
 
 // /api/user?search=ali
const allUsers =asynchandler(async(req,res)=>{
    const keyword= req.query.search ? {
        $or: [
            {name: { $regex:req.query.search, $options: "i"}},
            {email: { $regex:req.query.search, $options: "i"}},
        ],
    }
    
        : {};

     const users= await User.find(keyword).find({ _id: {$ne :req.user._id}});
     res.send(users);  
    


});

module.exports={ registerUser , authUser ,allUsers };