const User = require('../models/users');


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


const login = async (req,res)=>{
    try{
        //console.log(req.body.email, req.body.password)
        
        if ((!req.body.email)||(!req.body.password)){
            
            return res.status(400).json({err:"Something is missing"})
        }
        const entered_email = req.body.email;
        const entered_password = req.body.password;
        

        const user = await User.findOne({ where: { email: entered_email } });
      

      if (user) {
        if (entered_password===user.password){
            //console.log('User login sucessful')
          return res.status(200).json({message:'User login sucessful'});
        }else {
            //console.log('User not authorized. Incorrect password')
          return res.status(401).json({message:'User not authorized. Incorrect password'});
        }
        
        
      } else {
        //console.log('User not found')
        return res.status(404).json({message: 'User not found'}); // If user doesn't exist, return a message
      
      }

    
   } catch(err){
    
        res.status(500).json({message:'Server error'});
    }
}

module.exports = {
    signup,
    login
}