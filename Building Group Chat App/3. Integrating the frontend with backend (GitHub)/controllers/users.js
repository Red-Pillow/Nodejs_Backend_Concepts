const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, name, ispremiumuser){
    return jwt.sign({userId:id, name: name, ispremiumuser}, 'secretkey')
}


const signup = async (req,res)=>{
    try{
        console.log("we are in sign up")
        
        const {name,email,phonenumber,password} = req.body;
        console.log(name,email,phonenumber,password);
        if ((!name)|| (!email)||(!phonenumber)||(!password)){
            
            return res.status(400).json({err:"Something is missing"})
            
            
        }

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(403).json({ err: "User with this email already exists" });
        }

    saltrounds = 10
    bcrypt.hash(password,saltrounds, async(err,hash)=>{
        await User.create({name,email,phonenumber,password: hash}).then(()=>{
            res.status(201).json({message:'successfully created a new user'})
        })
    })
    
   } catch(err){
    console.log("new ERROR 505")
        return res.status(500).json(err);
    }
}


module.exports = {
    signup,
    generateAccessToken
}