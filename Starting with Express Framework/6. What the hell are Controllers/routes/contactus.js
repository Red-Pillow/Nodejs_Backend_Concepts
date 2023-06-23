
const express = require('express');

const router = express.Router();

const contactuscontroller = require('../controllers/contactus'); // changed

router.get('/',contactuscontroller.contactUsController); //changed

router.post('/',(req,res,next)=>{
    res.redirect('/success');
})

module.exports = router;
