const path = require('path');
const rootDir = require('../util/path');


exports.successController = (req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','success.html')); //holds the absolute path
    
}