const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const users = [];

io.on('connection', (socket) => {
    const userId = socket.id; 
    console.log(`User connected: ${userId}`);
    
    socket.emit('userConnected', userId);

    users.push(userId);

    io.emit('userList', users);

    socket.on('Usermessage', (message) => {
        console.log(`Message from ${userId}: ${message}`);
        io.emit('message', { userId, message });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        const index = users.indexOf(userId);
        if (index !== -1) {
            users.splice(index, 1);
        }
        io.emit('userList', users);
    });
});

app.use(express.static(path.resolve("./public")));
server.listen(9000, () => console.log("Server started"));

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
});
