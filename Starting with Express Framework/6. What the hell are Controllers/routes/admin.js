const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const router = express.Router();
const addProduct = require('../controllers/products');

router.get('/add-product',addProduct.getAddProduct);

router.post('/add-product',addProduct.postAddProduct);

//router.get('/contact-us',(req,res,next)=>{
//    res.sendFile(path.join(rootDir,'views','contact-us.html'));
//})

//router.post('/contact-us',(req,res,next)=>{ 
//    const name = req.body.name;
//    const email = req.body.email;
//    res.redirect('/success');

//})

module.exports = router;
