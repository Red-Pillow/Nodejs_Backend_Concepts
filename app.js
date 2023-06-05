const http = require('http');



const server = http.createServer((req,res) => {
    const url = req.url;
    if (url==='/home'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title> Home </title><head>');
        res.write('<body> <h1> Welcome home </h1> </body>');
        res.write('</html>');
        return res.end();
    }
    if (url==='/about'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title> About US </title><head>');
        res.write('<body> <h1> Welcome to About Us page </h1> </body>');
        res.write('</html>');
        return res.end();
    }
    if (url==='/node'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Node js</title><head>');
        res.write('<body> <h1> Welcome to my Node Js project </h1> </body>');
        res.write('</html>');
        return res.end();
    }
    //process.exet(); hard exit the event loop

});

server.listen(4000);
