// const Expense = require('/models/expense');
// const User = require('/models/users');
// const sequelize = require('/util/database');
// const { BlobServiceClient } = require('@azure/storage-blob');
// const { v1: uuidv1} = require('uuid');
const AWS = require('aws-sdk');
require('dotenv').config();

//c://Users/chetan/.aws/credentials
//c://Users/chetan/.aws/config

 const BUCKET_NAME  ='expensetrackingapp18';
 const IAM_USER_KEY='AKIA3RDAL5WYJPSACWVY';
 const IAM_USER_SECRET='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';

let s3   = new AWS.S3({
    //profile:'watan',
    region: 'us-east-1',
    accessKeyId: IAM_USER_KEY,
    SecretAccessKey: IAM_USER_SECRET
})
s3.putObject({
    Bucket: BUCKET_NAME,
    Key: 'dummy.txt',//filename, //file name
    Body: 'Hello Watan'//data
},(error,success)=>{
    if (error){
        console.log(error)
    }
    else{
        console.log(success)
    }
    
})