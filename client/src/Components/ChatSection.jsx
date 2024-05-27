import React, { useEffect, useState } from "react";
import "./ChatSection.css";
import { useSocket } from "../helper/socket";
import ChatBubble from "./ChatBubble";

const ChatSection = ({ matchFound }) => {
  const { socket } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim().length > 0 && matchFound) {
      socket.emit("message", message);
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          { id: prevMessages.length + 1, text: message, sender: true },
        ];
      });
      setMessage("");
    }
  };

  const handleIncomingMessage = (msg) => {
    setMessages((prevMessages) => {
      return [
        ...prevMessages,
        { id: prevMessages.length + 1, text: msg, sender: false },
      ];
    });
  };

  useEffect(() => {
    socket.on("private-message", handleIncomingMessage);

    return () => {
      socket.off("private-message", handleIncomingMessage);
    };
  }, [socket]);

  return (
    <div className="chat-section">
      <div className="chat-section-messages">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.sender} message={msg.text} />
        ))}
      </div>
      <div className="chat-section-input-container">
        <input
          type="text"
          className="chat-section-chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="chat-section-send-button"
          onClick={handleSend}
          disabled={!matchFound}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
