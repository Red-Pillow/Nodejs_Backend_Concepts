const path  = require('path');
const express = require('express');
const userRoutes = require('./routes/users');
const bodyParser = require('body-parser');


const sequelize  = require('./util/database');
const User = require('./models/users')
const cors = require('cors');
const app = express();


app.use(cors());
app.set('view engine', 'ejs');  
app.set('views','views');


app.use(bodyParser.json({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.get("/",(req, res)=>{
    res.render('signup.ejs')
});
app.use('/user',userRoutes)

//User.hasMany(Expense)
//Expense.belongsTo(User)

//app.set('view engine', 'ejs');



// app.use(errorController.get404);
sequelize.sync() //{force: true} every time you run it deletes al the record.
.then(result=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})
