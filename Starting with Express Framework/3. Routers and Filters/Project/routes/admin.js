const express = require('express');
const router = express.Router();

router.get('/add-product',(req,res,next)=>{
    res.send(
        '<form action="/add-product" method="POST"><input type="text" name="name" placeholder="Product Name" /><br /> <input type="text" name="size" placeholder="Product Size" /><br /><button type="submit">Add Product</button> </form>'
      );


})

router.post('/add-product',(req,res,next)=>{ 
    const name = req.body.name;
    const size = req.body.size;
    console.log(name);
    console.log(size);
    res.redirect('/');

})
module.exports = router;
