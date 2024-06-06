import React, { useEffect, useState } from "react";
import "./ChatSection.css";
import { useSocket } from "../helper/socket";
import ChatBubble from "./ChatBubble";
import EmojiPicker from "emoji-picker-react";

const ChatSection = ({ matchFound }) => {
  const [showPicker, setShowPicker] = useState(false);
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

  const onEmojiClick = (emojiObject) => {
    setMessage((val) => {
      return val + emojiObject.emoji;
    });
  };

  return (
    <div className="chat-section">
      <div className="chat-section-messages">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} sender={msg.sender} message={msg.text} />
        ))}
      </div>
      <div className="chat-section-input-container">
        <i
          className="fa-regular fa-face-smile"
          style={{
            fontSize:"26px",
            borderRadius:"50%",
            margin:"10px",
            cursor:"pointer",
            color:"#ffffff"
          }}
          onClick={() => setShowPicker((val) => !val)}
        ></i>
        {showPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <input
          type="text"
          className="chat-section-chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="btn btn-primary"
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
