const User = require('../models/users');

function isstringvalidator(string){
    if (string==undefined || string.length===0 ){
        return true;
    } else{
        return false;
    }
}
const signup = async (req,res)=>{
    try{
        console.log("we are in sign up")
        
        if ((!req.body.name)|| (!req.body.email)||(!req.body.password)){
            
            return res.status(400).json({err:"Something is missing"})
            
            
        }
        
        const {name,email,password} = req.body;
        
    
    await User.create({name,email,password}).then(()=>{
        res.status(201).json({message:'successfully created new user'})
    })
   } catch(err){
        res.status(500).json(err);
    }
}
module.exports = {
    signup
}