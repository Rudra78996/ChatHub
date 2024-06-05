import React from "react";
import Home from "./Pages/Home";
import Room from "./Pages/Room";
import { SocketProvider } from "./helper/socket";
import { Routes, Route } from "react-router-dom";
import GroupChat from "./Pages/GroupChat";

const App = () => {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/groupChat" element={<GroupChat />} />
      </Routes>
    </SocketProvider>
  );
};

export default App;
