const path  = require('path');
const express = require('express');
const productRoutes = require('./routes/product');
const bodyParser = require('body-parser');
//const errorController = require('./controllers/error');

const sequelize  = require('./util/database');
const Product = require('./models/product')
var cors = require('cors');

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views','views');


app.use(bodyParser.json({extended: false}));
app.use(express.static(path.join(__dirname,'public')));



console.log("hello");
app.get("/",(req, res)=>{
    res.render('form.ejs')
});
app.use('/product',productRoutes)



sequelize.sync() //{force: true} every time you run it deletes al the record.
.then(result=>{
    app.listen(3000);
});
