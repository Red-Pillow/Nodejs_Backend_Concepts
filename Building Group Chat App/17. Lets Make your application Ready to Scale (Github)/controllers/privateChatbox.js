const path = require('path');
//const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { UploadFileToS3 } = require("../services/awss3");
const mimetypes = require('mime-types');
//const {getFileTypeByMagicNumber}=require("../services/fileTypeDetector")
 //const mimetypes = require('mimetypes');
// const ffmpeg = require('fluent-ffmpeg');
// const { default: fileType } = import('file-type');
// to determine file type:
//const { fileTypeFromFile } = require('file-type');
//const { fromFile } = require('file-type')

//models:
const User = require('../models/user');
const privateMessage = require('../models/privateChatbox')
//const checkFileType = require('../services/fileTypeDetector'); // Adjust the path accordingly


function invalidInput(input) {
    if (input === undefined || input.length === 0) {
         return true;
    }
    else {
         return false;
    }
}

//private chat window
exports.privateChatPage=async(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','views','privateChat.html'));
};


exports.privateChatHeading = async(req,res,next)=>{
    console.log("heading from backend")
    console.log(req.params)
    const {userId}=req.params;
    console.log(userId,'userId')
    try {
        const user = await User.findOne({
          attributes: ['name'], // Specify the attributes you want to retrieve
          where: {
            id: userId,
          },
        });
        console.log(user,"user")
        if (user) {
          res.status(200).json({'userName':user})
        } else {
          res.status(400).json({ message: "No message found", success: false })
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        
      }
    }
    
exports.listOfUsers =async(req,res,next)=>{
    try{
        const usersArr=await User.findAll({
            attributes: ['id', 'name'],
        
        });   
        res.status(200).json(usersArr);
    }
    catch(err){
        res.status(500).json({message:'Get Users: something went wrong'});
    }
}



exports.postPrivateMsg = async(req,res,next)=>{
    try{

        const file = req.file;
        const {receiverId,senderId,message}=req.body
        const senderRow = await User.findOne({ where: { id: senderId } });
        const receiverRow = await User.findOne({ where: { id: receiverId } });
        const senderName= senderRow.name
        const receiverName= receiverRow.name
        
        
        
        // const buffer = req.file.buffer;
        // const fileType=await getFileTypeByMagicNumber(buffer)
        // console.log(fileType,"fileType-999")
        // const fileInfo = await fileType.fromBuffer(buffer);
        // const fileTypeMime=fileInfo.mime;
        // console.log(fileTypeMime,"fileType")
        
        
        

        let fileUrl=""
        let multimediaType=""

        if (file){
            const fileExtension = file.originalname.split('.').pop();  
            const mimeType = mimetypes.lookup(fileExtension);
            console.log(mimeType.startsWith('image/'),"image")
            if (mimeType.startsWith('image/')) {
              multimediaType='Image'
            }else if(mimeType.startsWith('video/')){
              multimediaType='Video'
            }
          //console.log(multimediaType==='Image',"1multimediaType")
        }

        if (file && (multimediaType==='Image' || multimediaType==='Video')){
          
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10); // Format date as YYYY-MM-DD
            const formattedTime = currentDate.toISOString().slice(11, 19).replace(/:/g, ''); // Format time as HHmmss without colons
            const filename = `${formattedDate}_${formattedTime}_${file.originalname}`;
            const buffer = file.buffer;
            fileUrl = await UploadFileToS3(filename, buffer);
            
        } 
        
        const saveToDb=await privateMessage.create({

            message:message,
            multimedia:fileUrl,
            multimediaType:multimediaType,
            senderId:senderId,
            senderName:senderName,
            receiverId: receiverId,
            receiverName:receiverName,

        });
        console.log("successful")
        res.status(201).json(saveToDb);
    }
    catch(err){
        console.log(err)
        return res.status(403).json({ message: "Post Message: unothorized!", success: false });
    }   
}


exports.getAllPrivateMsgs = async(req,res,next)=>{
    try{
        const {receiverId,senderId}=req.params;
        const latestMessages = await privateMessage.findAll({
            attributes: ['senderId', 'senderName', 'receiverId', 'receiverName', 'message','multimedia','multimediaType'],
            where: {
              [Op.or]: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId },
              ],
            },
            order: [['createdAt', 'DESC']],
            limit: 20,
          });
          console.log(latestMessages.length,"length")
          res.status(200).json({ latestMessages: latestMessages, success: true });
    }
    catch(err){
        return res.status(403).json({ message: "Get All Message: unothorized!", success: false });
    }
}


exports.getNewPrivateMsgs = async(req,res,next)=>{
    try{
      console.log("yes get backend working")
      const {receiverId,senderId}=req.params;
        const lastMessage = await privateMessage.findOne({
            where: {
              [Op.or]: [
                {
                  senderId: senderId,
                  receiverId: receiverId,
                },
                {
                  senderId: receiverId,
                  receiverId: senderId,
                },
              ],
            },
            order: [['createdAt', 'DESC']], // Assuming your table has a 'createdAt' column
          });
          
          if (lastMessage) {
                res.status(201).json({ 'lastMessage': lastMessage });
          } else {
                console.log('No Message Found');
                res.status(404).json({ message: 'No message found', success: false });
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error', success: false });
        }
      };
