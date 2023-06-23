const path = require('path');
const rootDir = require('../util/path');


exports.getAddProduct = (req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','add-product.html'));
}

exports.postAddProduct = (req,res,next)=>{ 
    const name = req.body.name;
    const size = req.body.size;
    res.redirect('/');

}