import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./GroupChat.css";
import PromptDialog from "../Components/PromptDialog";
import { useNavigate } from "react-router-dom";
import ChatBubble from "../Components/ChatBubble";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

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
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: data.msg,
          avatar: data.avatar,
          name: data.user,
        },
      ]);
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePromptSubmit = async (nameOfUser) => {
    try {
      setPromptOpen(false);
      const id = toast.loading("Loading chat...", {
        position: "top-center",
        className: "toast-message",
      });
      socket.emit("join-room", nameOfUser);
      const response = await axios.get(
        "https://groupchat-backend-upox.onrender.com/messages"
      );
      response.data.forEach((element) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            message: element["message"],
            avatar: element["avatar"],
            name: element["name"],
          },
        ]);
      });
      toast.update(id, {
        render: "Chat loaded",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        hideProgressBar: true,
      });
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
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 id="group-chat-heading1">
            <div className="groupChat-chat">Chat</div>
            <div className="groupChat-hub">Hub</div>
          </h1>
        </Link>
      </div>

      <div className="group-chat-main-content">
        <div className="group-chat-online-users">
          <div className="online-users-tittle">Online Users</div>
          <hr />
          <ul>
            {onlineUsers.map((user, index) => (
              <li key={index}>
                <img src={user.avatar} alt="avatar" className="avatar" />
                <span>{user.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="group-chat-chat-section">
          <div className="group-chat-messages">
            <div className="group-chat-title">Group Chat</div>
            {messages.map((el, index) => (
              <span key={index}>
                <img src={el.avatar} alt="avatar" className="chat-avatar" />
                <ChatBubble sender={false} message={el.message} />
              </span>
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
