const path = require('path');

const express = require('express');


const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop');
const successRoutes = require('./routes/success');
const contactUsRoutes = require('./routes/contactus');




app.use(bodyParser.urlencoded({extended: false})); //only parses the body with something send through a form. 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/',shopRoutes);
app.use('/admin',adminRoutes);
app.use('/success',successRoutes);
app.use('/contact-us',contactUsRoutes);

const errorController = require('./controllers/error404');
app.use(errorController.get404Controller);



app.listen(3000);
