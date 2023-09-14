const path  = require('path');
const express = require('express');
const userRoutes = require('./routes/users');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const bodyParser = require('body-parser');


const sequelize  = require('./util/database');
const User = require('./models/users')
const Expense = require('./models/expense')
const Order = require('./models/orders')

const cors = require('cors');
const app = express();


app.use(cors());
app.set('view engine', 'ejs');  
app.set('views','views');
app.set('views', path.join(__dirname, 'views')); // Specify the directory where your views are located


app.use(bodyParser.json({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.get("/expense",(req, res)=>{
    const expensePath = path.join(__dirname, 'views', 'expense.html');
    res.sendFile(expensePath);
});



app.get("/login",(req, res)=>{
    const loginPath = path.join(__dirname, 'views', 'login.html');
    res.sendFile(loginPath);
});

app.get("/",(req, res)=>{
    const signUpPath = path.join(__dirname, 'views', 'signup.html');
    res.sendFile(signUpPath);
});



// one usser can have multiple expenses but one expense can only belong to one user

app.use('/user',userRoutes)
app.use('/expense',expenseRoutes)
app.use('/purchase',purchaseRoutes)
User.hasMany(Expense)
Expense.belongsTo(User)


User.hasMany(Order)
Order.belongsTo(User)

//app.set('view engine', 'ejs');



// app.use(errorController.get404);
sequelize.sync( )//{force: true} // every time you run it deletes al the record.
.then(result=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})
