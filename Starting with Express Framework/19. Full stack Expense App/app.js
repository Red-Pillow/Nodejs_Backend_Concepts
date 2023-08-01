const path  = require('path');
const express = require('express');
const userRoutes = require('./routes/expense');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');

const sequelize  = require('./util/database');
const User = require('./models/Expense')
var cors = require('cors');

const app = express();
app.use(cors());
app.set('view engine', 'ejs');
app.set('views','views');

//const adminRoutes = require('./routes/admin');

app.use(bodyParser.json({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

//app.use('/admin', adminRoutes);
//app.use(shopRoutes);

console.log("hello");
app.get("/",(req, res)=>{
    res.render('form.ejs')
});
app.use('/expense',userRoutes)


// app.use(errorController.get404);
sequelize.sync() //{force: true} every time you run it deletes al the record.
.then(result=>{
    app.listen(3000);
});
