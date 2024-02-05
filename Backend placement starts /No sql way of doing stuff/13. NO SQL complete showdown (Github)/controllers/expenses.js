const Expense = require('../models/expense');
const User = require('../models/users');
const { ObjectId } = require('mongoose').Types;
const { Op, Sequelize } = require('sequelize');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');
const AWS = require('aws-sdk');
const mongoose = require('mongoose');
require('dotenv').config();

const addExpense = async (req,res)=>{
    try{
        const expenseAmount = Number(req.body.expenseAmount);
        const description = req.body.description;
        const category = req.body.category;
        //console.log(typeof(expenseAmount),"expenseAmount")
        
    if ((!expenseAmount)|| (!description)||(!category)){
        return res.status(400).json({err:"Something is missing"})
        }

           // Create a new expense document
        const expense = await Expense.create({
          amount: expenseAmount,
          description,
          category,
          user: req.user.id,
      });
      ///console.log(req.user.id,ObjectId(req.user.id),"req.user.id")
      console.log('created 100')
      
      // Update totalExpenses for the user
      const totalExpense = req.user.totalExpenses + expenseAmount;
      console.log(typeof(req.user.totalExpenses),"req.user.totalExpenses")
      await User.findByIdAndUpdate(req.user.id, { totalExpenses: totalExpense });
      res.status(201).json({ expense, success: true });

  } catch (err) {
      res.status(500).json({ success: false, error: err.message || "Server error" });
  }
};

    




  const getExpense = async (req, res) => {
    try {
      console.log("get expense")
        const page = parseInt(req.query.page, 10) || 1;
        const ITEMS_PER_PAGE = parseInt(req.query.itemsPerPage, 10);

        const skip = (page - 1) * ITEMS_PER_PAGE;
        //console.log(req.user.id,"req.user.id")
        const expenses = await Expense.find({ user: req.user.id })
            .skip(skip)
            .limit(ITEMS_PER_PAGE);

        const count = await Expense.countDocuments({ user: req.user.id });
        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        // console.log(expenses,"20000")
        if (expenses.length > 0) {
            // console.log(expenses, "<----expenses");
            return res.status(200).json({
                expenses,
                totalPages,
                currentPage: page,
                success: true
            });
        } else {
            return res.status(200).json({
                expenses: [],
                totalPages,
                currentPage: page,
                success: true
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
};




const deleteExpense = async (req, res) => {
  try {
    console.log(req.params.expenseid,"req.params.expenseid")
      if (!req.params.expenseid) {
          return res.status(400).json({ err: 'ID is missing' });
      }

      const expenseId = req.params.expenseid;

      const expense = await Expense.findById(expenseId);

      console.log(expense,"remove this")
      if (!expense) {
          return res.status(404).json({ message: 'Expense not found' });
      }

      const userId = expense.user;

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.totalExpenses -= expense.amount;
      await user.save();

      await Expense.deleteOne({ _id: expenseId });
      

      res.json({ message: 'Expense deleted and user totalExpenses updated' });
  } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


async function uploadToS3(data,filename){
    const BUCKET_NAME  = 'expensetrackingapp18';//process.env.BUCKET_NAME;//
    const IAM_USER_KEY='AKIA3RDAL5WYJPSACWVY';// process.env.IAM_USER_KEY;//'AKIA3RDAL5WYNO4QKMGL';
    const IAM_USER_SECRET='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';// process.env.IAM_USER_SECRET;//'cELRdpargfIQeKOZmBG9VbzGbNcyi4/ru6oxBfeM';
    const AWS_REGION = 'us-east-1';
    
    AWS.config.update({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        region: AWS_REGION
    });

    let s3bucket   = new AWS.S3()

    
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
            if (err){
                console.log('Something went wrong', err)
                reject(err);
            }else{
                console.log('s3response',s3response);
                resolve(s3response.Location);
            }
         })
    })  
    
    

}

const downloadExpenses =  async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);

    res.status(200).json({ fileURL, success: true });
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error', error: err });
}
};



// controllers/expenses.js
// const Expense = require('../models/expense');
// const User = require('../models/user');

const getMonthlyExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    let month = parseInt(req.params.month);
    let year = parseInt(req.params.year);
    let startDate = new Date(year, month - 1, 1);
    let lastDay = new Date(year, month, 0);
    let endDate = new Date(year, month - 1, lastDay.getDate());

    const listOfExpenses = await Expense.find({
      user: userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).select('-__v');

    const totalAmountSum = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmountSum: { $sum: '$amount' },
        },
      },
    ]);

    const amountSum = totalAmountSum.length > 0 ? totalAmountSum[0].totalAmountSum : 0;
    
    return res.status(200).json({
      listOfExpenses,
      totalExpenses: amountSum,
    });

  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};




const getYearlyExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        let year = parseInt(req.params.year);

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const listOfExpenses = await Expense.find({
            user: new mongoose.Types.ObjectId(userId),
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        }).select('-__v');

        const totalAmountSum = await Expense.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalAmountSum: { $sum: '$amount' },
                },
            },
        ]);

        const amountSum = totalAmountSum.length > 0 ? totalAmountSum[0].totalAmountSum : 0;

        return res.status(200).json({
            listOfExpenses: listOfExpenses,
            totalExpenses: amountSum,
        });

    } catch (error) {
        console.error('Error fetching yearly expenses:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// module.exports = { getYearlyExpenses };


  //  const getYearlyExpenses=async(req,res)=>{
  //       try{const userId = req.user.id;
        
            
  //           let year = parseInt(req.params.year);// check from below
            
  //           const listOfExpenses = await Expense.findAll({
  //               where: {
  //                 userId: userId,
  //                 createdAt: {
  //                   [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`],
  //                 },
  //               },
                
  //             });
  //           const totalAmountSum = await Expense.findAll({
  //               where: {
  //                 userId: userId,
  //                 createdAt: {
  //                   [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`],
  //                 },
  //               },
  //               attributes: [
  //                 [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmountSum'],
  //               ],
  //               raw: true,
  //             });
            
  //            const amountSum =totalAmountSum[0]['totalAmountSum']
             
  //            if (amountSum>0){
  //               return res.status(200).json({
  //                   listOfExpenses: listOfExpenses,
  //                   totalExpenses: amountSum,
  //                 });
  //            }else{
  //               return res.status(200).json({
  //                   listOfExpenses: [],
  //                   totalExpenses: 0,
  //                 });
                  
  //            }
             
              
  //           } catch (error) {
  //             console.error('Error fetching monthly expenses:', error);
  //             return res.status(500).json({ error: 'Internal Server Error' });
  //           }
  //  }
module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadExpenses,
    getMonthlyExpenses,
    getYearlyExpenses
}
