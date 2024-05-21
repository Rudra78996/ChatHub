const express = require('express');
const http = require('http');
const {Server}= require('socket.io');



const port = 8080 || process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:true,
});

app.get('/', (req, res)=>{
    res.send("working");
})


io.on('connection', Socket => {
    console.log("connected");
});

server.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});




