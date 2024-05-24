import React from "react";
import Home from "./Pages/Home";
import Room from "./Pages/Room";
import { SocketProvider } from "./helper/socket";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </SocketProvider>
  );
};

export default App;
