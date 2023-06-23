const path = require('path');
const rootDir = require('../util/path');


exports.contactUsController = (req,res)=>{
    res.sendFile(path.join(rootDir, 'views','contact-us.html'));
}

