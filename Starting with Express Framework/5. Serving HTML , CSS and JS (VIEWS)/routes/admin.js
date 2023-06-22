const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const router = express.Router();


router.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','add-product.html'));
})

router.post('/add-product',(req,res,next)=>{ 
    const name = req.body.name;
    const size = req.body.size;
    res.redirect('/');

})

router.get('/contact-us',(req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','contact-us.html'));
})

router.post('/contact-us',(req,res,next)=>{ 
    const name = req.body.name;
    const email = req.body.email;
    res.redirect('/success');

})

module.exports = router;
