import React from "react";
import Home from "./Pages/Home";
import Room from "./Pages/Room";
import { SocketProvider } from "./helper/socket";
import { Routes, Route } from "react-router-dom";
import GroupChat from "./Pages/GroupChat";
import RandomChat from "./Pages/RandomChat";

const App = () => {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/groupChat" element={<GroupChat />} />
        <Route path="/chat" element={<RandomChat />} />
      </Routes>
    </SocketProvider>
  );
};

export default App;
