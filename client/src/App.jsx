import React from "react";
import Home from "./Pages/Home";
import { SocketProvider } from "./helper/socket";
import { PeerProvider } from "./helper/peer";

const App = () => {
  return (
    <PeerProvider>
      <SocketProvider>
        <Home />
      </SocketProvider>
    </PeerProvider>
  );
};

export default App;
