import React, { useState, useEffect, useRef } from "react";
import "./RandomChat.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ChatBubble from "../Components/ChatBubble";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";

const socket = io("https://randomchat-backend.onrender.com");

const RandomChat = () => {
    const [loaderId, setLoaderId] = useState(null);
    const [foundMatch, setFoundMatch] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const [showPicker, setShowPicker] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const matchFoundHandler = (data) => {
            setFoundMatch(true);
        };

        const waitHandler = () => {
            setTimeout(() => {
                socket.emit("find-match");
            }, 1000);
        };

        const matchLostHandler = () => {
            toast.error("disconnected");
            setTimeout(() => {
                endCallHandler();
            }, 2000);
        };

        const messageHandler = (msg) => {
            setMessages((prevMessages) => [
                { self: false, text: msg },
                ...prevMessages,
            ]);
        };

        socket.on("match-found", matchFoundHandler);
        socket.on("wait", waitHandler);
        socket.on("private-message", messageHandler);
        socket.on("match-lost", matchLostHandler);

        return () => {
            socket.off("match-found", matchFoundHandler);
            socket.off("wait", waitHandler);
            socket.off("private-message", messageHandler);
            socket.off("match-lost", matchLostHandler);
        };
    }, []);

    const endCallHandler = () => {
        location.reload();
    };

    const exitHandler = () => {
        toast.update(loaderId, {
            render: "Error",
            type: "error",
            isLoading: false,
            autoClose: 2000,
            hideProgressBar: true,
        });
        navigate("/");
    };

    const joinCallHandler = () => {
        socket.emit("join-room");
        socket.emit("find-match");
        const id = toast.loading("Finding Match", {
            position: "top-center",
            className: "randomChat-toast-message",
        });
        setLoaderId(id);
        setDisable(true);
    };

    const sendMessage = () => {
        if (message.trim() !== "") {
            socket.emit("message", message);
            setMessages((prevMessages) => [
                { self: true, text: message },
                ...prevMessages,
            ]);
            setMessage("");
        }
    };

    useEffect(() => {
        if (foundMatch) {
            if (loaderId) {
                toast.update(loaderId, {
                    render: "Match found",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                    hideProgressBar: true,
                });
            }
        }
    }, [foundMatch, loaderId]);

    const onEmojiClick = (emojiObject) => {
        setMessage((val) => {
            return val + emojiObject.emoji;
        });
    };

    return (
        <div className="randomChat-container">
            <nav className="randomChat-navbar">
                <div className="randomChat-logo">
                    <div id="heading">
                    <Link to="/" style={{ textDecoration: "none"}}>
                        <h1 id="heading1">
                            <div className="chat">Chat</div>
                            <div className="hub">Hub</div>
                        </h1>
                      </Link>
                    </div>
                </div>
                <div className="randomChat-button">
                    {foundMatch ? (
                        <button className="btn btn-danger" onClick={endCallHandler}>
                            End
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={joinCallHandler}
                            disabled={disable}
                        >
                            Join
                        </button>
                    )}
                    <button
                        className="btn btn-danger room-leave-btn"
                        onClick={exitHandler}
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </div>
            </nav>
            <div className="randomChat-chat-container">
                <div className="randomChat-messages" ref={messagesEndRef}>
                    {messages.map((msg, index) => (
                        <ChatBubble key={index} sender={msg.self} message={msg.text} />
                    ))}
                </div>
                <div className="randomChat-input-container">
                    <i
                         id="emj"
                        className="fa-regular fa-face-smile"
                        style={{
                            fontSize: "26px",
                            color: "grey",
                            borderRadius: "50%",
                            margin: "10px",
                            cursor: "pointer",
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
                        className="randomChat-chat-input"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        id="btn"
                        className="btn btn-primary"
                        onClick={sendMessage}
                        disabled={!foundMatch}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RandomChat;
