import React from "react";
import "./ChatBubble.css";


const ChatBubble = ({ message, sender }) => {
  return (
    <>
    <div className={`chat-bubble chat-bubble-${sender ? "own" : "other"}`}>
      <div className="chat-bubble-message">{message}</div>
    </div>
    <br />
    </>
  );
};

export default ChatBubble;
