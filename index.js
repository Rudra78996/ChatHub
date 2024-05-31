const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

// Create empty arrays to store user IDs
const users = [];

io.on('connection', (socket) => {
    const userId = socket.id; // Unique ID assigned by Socket.IO
    console.log(`User connected: ${userId}`);
    
    // Emit the unique ID back to the connected client
    socket.emit('userConnected', userId);

    // Add user ID to the users array
    users.push(userId);

    // Emit the list of users to all connected clients
    io.emit('userList', users);

    socket.on('Usermessage', (message) => {
        console.log(`Message from ${userId}: ${message}`);
        io.emit('message', { userId, message });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        // Remove the disconnected user from the users array
        const index = users.indexOf(userId);
        if (index !== -1) {
            users.splice(index, 1);
        }
        // Emit the updated list of users to all connected clients
        io.emit('userList', users);
    });
});

app.use(express.static(path.resolve("./public")));
server.listen(9000, () => console.log("Server started"));

app.get("/", (req, res) => {
    return res.sendFile("/public/index.html");
});
