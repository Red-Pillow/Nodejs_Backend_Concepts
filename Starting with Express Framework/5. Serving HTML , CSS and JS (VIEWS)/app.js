const path = require('path');

const express = require('express');


const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const successRoutes = require('./routes/success');



app.use(bodyParser.urlencoded({extended: false})); //only parses the body with something send through a form. 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/',shopRoutes);
app.use('/admin',adminRoutes);
app.use('/success',successRoutes);


app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})


app.listen(3000);
