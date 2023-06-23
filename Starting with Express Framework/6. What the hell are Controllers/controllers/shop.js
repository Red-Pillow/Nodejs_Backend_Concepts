const path = require('path');
const rootDir = require('../util/path');

exports.shopsController = (req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','shop.html')); //holds the absolute path
    
}