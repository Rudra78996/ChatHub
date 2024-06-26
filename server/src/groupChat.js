const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
require("dotenv").config();
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");

const MessageSchema = require("../Models/message");

app.use(cors());

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.URL);
}

const insertData = async (name, message, avatar) => {
  try {
    const newMessage = new MessageSchema({ name: name, message: message, avatar: avatar });
    await newMessage.save();
    console.log("New message saved:", newMessage);
  } catch (e) {
    console.log(e);
  }
};

app.get("/", (req, res) => {
  res.json({ status: "working" });
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await MessageSchema.find({});
    res.json(messages);
  } catch (error) {
    res.status(500).send("Error fetching messages");
  }
});

const port = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
  socket.join("group-chat");

  socket.on("join-room", (name) => {
    const avatar = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    onlineUsers.push({ name, id: socket.id, avatar });
    io.to("group-chat").emit("update-user-list", onlineUsers);
    console.log("Online users:", onlineUsers);
  });

  socket.on("message", (msg) => {
    const user = onlineUsers.find((el) => el.id === socket.id);
    if (user) {
      insertData(user.name, msg, user.avatar);
      io.to("group-chat").emit("message", {
        msg,
        user: user.name,
        avatar: user.avatar,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((el) => el.id !== socket.id);
    io.to("group-chat").emit("update-user-list", onlineUsers);
    console.log("User disconnected. Online users:", onlineUsers);
  });
});

server.listen(port, () =>
  console.log(`Server started at http://localhost:${port}/`)
);
