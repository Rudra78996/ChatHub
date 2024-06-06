import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./GroupChat.css";
import PromptDialog from "../Components/PromptDialog";
import { useNavigate } from "react-router-dom";
import ChatBubble from "../Components/ChatBubble";

const socket = io("https://groupchat-backend-upox.onrender.com");

const GroupChat = () => {
  const [promptOpen, setPromptOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.msg]);
    });

    socket.on("update-user-list", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("update-user-list");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePromptSubmit = async (nameOfUser) => {
    try {
      socket.emit("join-room", nameOfUser);
      const response = await axios.get("https://groupchat-backend-upox.onrender.com/messages");
      response.data.forEach((element) => {
        setMessages((prevMessages) => [...prevMessages, element["message"]]);
      });
      setPromptOpen(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const redirectHandler = () => {
    navigate("/");
  };

  const sendMessageHandler = () => {
    if (message.trim().length > 0) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="group-chat">
      <PromptDialog
        open={promptOpen}
        onClose={redirectHandler}
        onSubmit={handlePromptSubmit}
      />
      <div id="group-chat-heading">
        <h1 id="group-chat-heading1">
          <div className="groupChat-chat">Chat</div>
          <div className="groupChat-hub">Hub</div>
        </h1>
      </div>

      <div className="group-chat-main-content">
        <div className="group-chat-online-users">
          <h3>Online Users</h3>
          <ul>
            {onlineUsers.map((user, index) => (
              <li key={index}>
                {/* <img src={user.avatar} alt="avatar" className="avatar" /> */}
                {user.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="group-chat-chat-section">
          <div className="group-chat-messages">
            {messages.map((msg, index) => (
              <ChatBubble key={index} sender={false} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="group-chat-message-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === "Enter" && sendMessageHandler()}
            />
            <button onClick={sendMessageHandler}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
