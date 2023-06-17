const http = require('http');
const express = require('express');
const fs = require('fs');
const app = express();

const bodyParser = require("body-parser");
//const { userInfo } = require('os');


app.use(bodyParser.urlencoded({extended:false}));


// Login GET and PUT
app.get('/login',(req,res,next)=> {
    res.send(
        `<form action="/login" method="POST" onSubmit="localStorage.setItem('username', this.username.value)">
        <input type = "text" name = "username" placeholder = "username" id = "username">
        <br /> 
        <button type="submit">Login</button> 
        </form>`
      );    
})

 
app.post('/login',(req,res,next)=> {
    let username = req.body.name;
    
    res.redirect('/');
})


//chat Messages - GET and PUT
app.get('/', (req,res,next) =>{
    fs.readFile('username.txt',(err, data)=>{

        if (err){
            console.log(err)
            data = "No chat exists."
        }
        
        res.send(
            
        `${data}<form action="/" method = "POST" onSubmit = "document.getElementById('username').value = localStorage.getItem('username')">
                <input type = "text" name = "message" id = "message">
                <input type = "hidden" name = "username" id="username">
                <br/>
                <button type = "submit">Send</button>
            </form>`
        );

        })
    });
    

app.post('/',(req,res,next)=>{
    console.log(req.body.username)
    console.log(req.body.message)
    fs.writeFile("username.txt", `${req.body.username}: ${req.body.message + " "}`, {flag: 'a'},(err)=>
        err ? console.log(err) : res.redirect("/"),
        
    )   
});
    // extract the body of the message
    


app.listen(3000);