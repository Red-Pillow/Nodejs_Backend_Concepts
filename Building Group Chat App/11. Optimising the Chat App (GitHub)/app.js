const path  = require('path');
const express = require('express');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const sequelize  = require('./util/database');
const User = require('./models/users')
const bodyParser = require('body-parser');
const cors = require('cors');
//const cors = require('cors');




const app = express();

app.use(cors({
    origin: "*",
}));

//app.set('view engine', 'ejs');  
app.set('views','views');
app.set('views', path.join(__dirname, 'views')); // Specify the directory where your views are located


app.use(bodyParser.json({extended: true}));
app.use(express.static(path.join(__dirname,'public')));




app.get("/signup",(req, res)=>{
    const signUpPath = path.join(__dirname, 'views', 'signup.html');
    res.sendFile(signUpPath);  
});

app.get("/login",(req, res)=>{
    const loginPath = path.join(__dirname, 'views', 'login.html');
    res.sendFile(loginPath);  
});

app.get("/logout",(req, res)=>{
    const logoutPath = path.join(__dirname, 'views', 'logout.html');
    res.sendFile(logoutPath);  
});

app.get("/chat",(req, res)=>{
    const chatPath = path.join(__dirname, 'views', 'chat.html');
    res.sendFile(chatPath);  
});



app.use('/user',userRoutes)
app.use('/chat', chatRoutes);

// app.use(errorController.get404);
sequelize.sync()//{force: true} // every time you run it deletes al the record.
.then(result=>{
    app.listen(process.env.PORT||3000);
})
.catch(err=>{
    console.log(err);
})