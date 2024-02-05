const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const ForgotPassword = require('../models/forgotpassword');
const nodemailer = require('nodemailer');
//const config = require('../config/config');
require('dotenv').config();

const sendResetPasswordMail=async(name,email,id)=>{
    try{
        console.log("sendResetPasswordMailId",id)
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS:true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPassword
            }
        });
        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        }
        console.log("sendResetPasswordMail")
        transporter.sendMail(mailOptions, function(error,info){
            if (error){
                console.log(error)
            }
            else{
                console.log("Mail has been sent", info.response)
            }
        })
    }catch(error){
        throw new Error(error.message);
    }
}

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            const userId = user._id;
            
            const CreateForgotPasswordEntry = await ForgotPassword.create({ active: true, expiresBy: new Date(), userId });
            console.log(CreateForgotPasswordEntry,"CreateForgotPasswordEntry")
            const createdForgotPasswordObjectId=CreateForgotPasswordEntry._id
            console.log(createdForgotPasswordObjectId,"createdForgotPasswordObjectId")
            const createdForgotPasswordtId=createdForgotPasswordObjectId.toString()
            console.log(createdForgotPasswordtId)
            //const createdForgotPasswordObjectId = await ForgotPassword.findById(CreateForgotPasswordEntry._id);
            
            //const createdForgotPasswordId=createdForgotPasswordObjectId.toString();
            
            //console.log(createdForgotPasswordId,"createdForgotPasswordId");
            await sendResetPasswordMail(user.name, user.email, createdForgotPasswordtId);
            res.status(200).send({ success: true, msg: "Please check your mail" });
        } else {
            res.status(200).send({ success: true, msg: "The mail doesn't exist" });
        }
    } catch (err) {
        console.error(err);
        return res.json({ message: err, success: false });
    }
};

const resetpassword = (req, res) => {
    console.log("-id-2")
    const id = req.params.id;
    console.log(id,"-id-2")
    
    ForgotPassword.findOneAndUpdate({ id: id }, { $set: { active: false } }, { new: true })
        .then(() => {
            
            const forgotpasswordrequest = ForgotPassword.findOne({ id: id });
            console.log("forgotpasswordrequest122",id)
            
            if (forgotpasswordrequest) {
                const htmlContent = `
                <html>
                    <script>
                        function formsubmitted(e) {
                            e.preventDefault();
                            console.log('called');
                        }
                    </script>
                    <form action="/password/updatepassword/${id}" method="get">
                        <label for="newpassword">Enter New password</label>
                        <input name="newpassword" type="password" required></input>
                        <button>reset password</button>
                    </form>
                </html>`
                res.status(200).send(htmlContent);
                res.end();
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error, success: false });
        });
};

const updatepassword = async(req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        console.log("resetpasswordid",resetpasswordid)
        console.log("newpassword",newpassword)
        const ForgotPasswordEntry=await ForgotPassword.findOne({ _id: resetpasswordid })
        console.log(ForgotPasswordEntry,"ForgotPasswordEntry")
        const UserObjectId=ForgotPasswordEntry.userId
        console.log("UserObjectId",UserObjectId)
        const UserId = UserObjectId.toString()
        if (UserId){

            const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            User.findOneAndUpdate({ _id: UserId }, { $set: { password: hash } })
                            .then(()=>{
                                res.status(201).json({ message: 'Successfully updated the new password' });
                            })

                            
                        });
                    });

        }
        else{
            res.status(404).json({ error: 'No user exists', success: false });   
        }
        // console.log("resetpasswordid",resetpasswordid,"newpassword",newpassword)
        // ForgotPassword.findOne({ id: resetpasswordid })
        //     .then((resetpasswordrequest) => {
        //         console.log("resetpasswordrequest123",resetpasswordrequest)
        //         if (resetpasswordrequest) {
        //             console.log("resetpasswordrequest.userId",resetpasswordrequest.userId)
        //             User.findOneAndUpdate({ _id: resetpasswordrequest.userId }, { $set: { password: newpassword } })
        //                 .then(() => {
        //                     res.status(201).json({ message: 'Successfully updated the new password' });
        //                 })
        //                 .catch((err) => {
        //                     console.error(err);
        //                     res.status(500).json({ error: err.message, success: false });
        //                 });
        //         } else {
        //             res.status(404).json({ error: 'No user exists', success: false });
        //         }
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         res.status(403).json({ error, success: false });
        //     });
    } catch (error) {
        console.error(error);
        res.status(403).json({ error, success: false });
    }
};

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword,
};