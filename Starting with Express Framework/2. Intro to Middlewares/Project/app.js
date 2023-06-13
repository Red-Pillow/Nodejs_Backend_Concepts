const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false})); //only parses the body with something send through a form. 

app.get('/add-product',(req,res,next)=>{
    res.send(
        '<form action="/add-product" method="POST"><input type="text" name="name" placeholder="Product Name" /><br /> <input type="text" name="size" placeholder="Product Size" /><br /><button type="submit">Add Product</button> </form>'
      );


})

app.post('/add-product',(req,res,next)=>{ 
    const name = req.body.name;
    const size = req.body.size;
    console.log(name);
    console.log(size);
    res.redirect('/');

})

app.use('/',(req,res,next)=>{
 
    res.send('<h1>Hello from express ! </h1>');
    
})

app.listen(3000);
