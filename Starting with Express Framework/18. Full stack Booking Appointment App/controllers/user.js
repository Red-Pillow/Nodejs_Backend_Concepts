const User = require('../models/User');
const { use } = require('../routes/user');

const addUser = async(req,res)=>{
    console.log("we are in add user")
    console.log(req.body)
    try
    {
        if (!req.body.phonenumber){
            throw new Error('Phone number is mandatory')
        }
    const name = req.body.name;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const data = await User.create({name:name, email:email, phonenumber:phonenumber});
    res.status(201).json({newUserDetail: data});
} catch (err) {
    console.log(err)
    res.status(500).json({
        error: err
    })
}
}

 const getUsers = async (req,res, next) =>{
    try {
        console.log("we are in getUsers controllers")
        const users = await User.findAll();
        res.status(200).json({"allUser":users});
    } catch (error){
        console.log('Get user is failing', JSON.stringify(error));
        res.status(500).json({error: error});
    }
};
const updateUser = async(req, res, next)=>{
    try {
        if (req.params.id=='undefined'){
            return res.status(400).json({err:'ID is missing'});
        }
        const uId = req.params.id;
        const user = await User.findByPk(uId);
        const new_name = req.body.name
        const new_email = req.body.email
        const new_phonenumber = req.body.phonenumber
        user.name = new_name;
        user.email = new_email;
        user.phonenumber = new_phonenumber;
        await user.save();
        res.json({"updated_data":user});
    } catch (error){
        console.log('Update user failed', JSON.stringify(error));
        res.status(500).json({error: error});
    }
}
const deleteUser  = async(req,res, next)=>{
    try{
        if (req.params.id=='undefined'){
            return res.status(400).json({err:'ID is missing'});
        }
        const uId = req.params.id;
        await User.destroy({where:{id:uId}});
            res.status(200);
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    addUser,
    getUsers,
    deleteUser,
    updateUser
}