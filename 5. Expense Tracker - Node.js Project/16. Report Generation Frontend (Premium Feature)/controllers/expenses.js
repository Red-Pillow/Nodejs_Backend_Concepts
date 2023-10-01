const Expense = require('../models/expense');
const User = require('../models/users');
const sequelize = require('../util/database');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
const AWS = require('aws-sdk');
require('dotenv').config();

const addExpense = async (req,res)=>{
    const t = await sequelize.transaction();
    try{
        

        const amount = req.body.expenseAmount;
        const description = req.body.description;
        const category = req.body.category;
        
        
    if ((!amount)|| (!description)||(!category)){
        return res.status(400).json({err:"Something is missing"})
        }

            const expense = await Expense.create({amount,description,category,userId: req.user.id}, {transaction:t })
            const totalExpense = Number(req.user.totalExpenses)+Number(amount)
            
            await User.update({
                totalExpenses: totalExpense
            },{
                where: {id: req.user.id},
                 transaction:t 
            })
            await t.commit();
            res.status(201).json({expense,success:true})
            
            
            
        }catch(err){
            await t.rollback();
            return res.status(500).json({success: false, error: err})
        }
    }
    





const getExpense = async(req,res)=>{
    try{
        const expenses = await Expense.findAll({where : {userId: req.user.id}})
        
        
        if (expenses) {
            return res.status(200).json({expenses, success: true})
            }
        
    
    }
    catch(error){  
        res.status(500).json({error: error, success: false})
    }
    
}

const deleteExpense = async(req,res)=>{
    const t = await sequelize.transaction();
    try{
        if (req.params.expenseid=='undefined'){
            return res.status(400).json({err:'ID is missing'})
        }
        const uId = req.params.expenseid;

        const expense = await Expense.findByPk(uId, {transaction:t });
        
        amount = expense.amount
        id = expense.userId
        const user = await User.findByPk(id, {transaction:t });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

        user.totalExpenses -= amount;//err
        await user.save({transaction:t });

        
    
        
        
        // Save the updated user's record
        
        await expense.destroy({transaction:t });
        await t.commit();
        res.json({ message: 'Expense deleted and user totalExpenses updated' });
    }
    catch(err){
        await t.rollback();
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
}

function uploadToS3(data,filename){
    const BUCKET_NAME  = process.env.BUCKET_NAME;//'expensetrackingapp18';
    const IAM_USER_KEY=process.env.IAM_USER_KEY;//'AKIA3RDAL5WYNO4QKMGL';
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;//'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';
    

    let s3bucket   = new AWS.S3({
        region: 'us-east-1',
        accessKeyId: IAM_USER_KEY,
        SecretAccessKey: IAM_USER_SECRET
    })

    
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
     s3bucket.upload(params,(err,s3response)=>{
        if (err){
            console.log('Something went wrong', err)
        }else{
            console.log('success',s3response);
            return s3response.Location;
        }
     })
    

}

const downloadExpenses =  async (req, res) => {
    const expenses  = await req.user.getExpenses()
    console.log("ggggggggggggg")
    //console.log(expenses,"&*&&&*") //array
    const stringifiedExpenses = JSON.stringify(expenses) //string

    const userId  =req.user.id;
    const filename  = `Expense${userId}/${new Date()}.txt`;
    const fileURL = uploadToS3(stringifiedExpenses,filename)
    res.status(200).json({fileURL, success: true})

    
    
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadExpenses
}