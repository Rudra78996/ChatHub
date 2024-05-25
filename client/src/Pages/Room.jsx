import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../helper/socket";
import ReactPlayer from 'react-player';
import PeerService from "../helper/peerService";
import "./Room.css"


const Room = () => {
  const [disable, setDisable] = useState(false);
  const { socket } = useSocket();
  const [foundMatch, setFoundMatch] = useState(false);
  const [message, setMessage] = useState("");
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const localStreamHandler =useCallback( async () =>{
    const stream = await navigator.mediaDevices.getUserMedia ({audio:true, video:true});
    setMyStream(stream);
   }, []);

   const sendStreams = useCallback(() => {
    if (myStream) {
      const tracks = myStream.getTracks();
      tracks.forEach(track => {
        PeerService.peer.addTrack(track, myStream);
      });
    }
  }, [myStream]);

  useEffect(() => {
    localStreamHandler();
    const matchFoundHandler = async (data) => {
      setDisable(true);
      setFoundMatch(true);
      if(data.createReq){
        const offer = await PeerService.getOffer();
        socket.emit("offer", {offer});
      }
    };

    const offerHandler = async (offer) =>{
      const ans = await PeerService.getAnswer(offer);
      socket.emit("answer", ans);
    }

    const answerHandler = async (ans) =>{
      await PeerService.setRemoteDescription(ans);
    }


    const waitHandler = () => {
      setTimeout(() => {
        socket.emit("find-match");
      }, 1000);
    };

    socket.on("private-message", (msg) => {
      console.log(msg);
    });
    socket.on("match-found", matchFoundHandler);
    socket.on("wait", waitHandler);
    socket.on("offer", offerHandler);
    socket.on("answer", answerHandler);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);


    return () => {
      socket.off("match-found", matchFoundHandler);
      socket.off("wait", waitHandler);
      socket.off("offer", offerHandler);
      socket.off("answer", answerHandler);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [socket]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await PeerService.getOffer();
    socket.emit("peer:nego:needed", { offer});
  }, [socket]);
  useEffect(()=>{
    PeerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      PeerService.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);
  
  useEffect(()=>{
    PeerService.peer.addEventListener('icecandidate', event => {
      if (event.candidate) {
        console.log(`New ICE candidate: ${event.candidate.candidate}`);
      } else {
        console.log('All ICE candidates have been sent.');
      }
    });
  }, []);

  useEffect(()=>{
    PeerService.peer.addEventListener('icecandidateerror', event => {
      console.error(`ICE candidate error: ${event.errorText}`);
    });
  }, []);

  useEffect(()=>{
    PeerService.peer.addEventListener('connectionstatechange', (event) => {
      switch(PeerService.peer.connectionState) {
          case 'connected':
              console.log('The connection has become successfully established.');
              break;
          case 'disconnected':
            console.log('disconnected');
              // setFoundMatch(false);
              // setRemoteStream(null);
              break;
          case 'failed':
              console.log('The connection has failed.');
              break;
          case 'closed':
              console.log('The connection has been closed.');
              break;
          default:
              console.log(`Connection state changed to: ${PeerService.peer.connectionState}`);
              break;
      }
  });
  }, [])


  useEffect(() => {
    if (myStream) {
      sendStreams();
    }
  }, [myStream, sendStreams]);


  const handleNegoNeedIncoming = useCallback(
    async ({ offer }) => {
      const ans = await PeerService.getAnswer(offer);
      socket.emit("peer:nego:done", { ans });
    },
    [socket]
  );


  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await PeerService.setRemoteDescription(ans);
  }, []);


  useEffect(() => {
    if (PeerService.peer) {
      PeerService.peer.addEventListener("track", (ev) => {
        console.log(ev.streams[0]);
        const remoteStream = ev.streams[0];
        console.log("GOT TRACKS!!");
        setRemoteStream(remoteStream);
      });
    }
  }, []);


  const joinCallHandler = () => {
    socket.emit("join-room");
    socket.emit("find-match");
    setDisable(true);
  };

  const sendPrivateMessage = () => {
    socket.emit("message", message);
    setMessage("");
  };


  return (
    <div>
      <button onClick={joinCallHandler} disabled={disable}>
        Join
      </button>
      {foundMatch && (
        <div>
          <p>Match found</p>
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button onClick={sendPrivateMessage}>Send</button>
        </div>
      )}
      <div>
      <ReactPlayer 
        url={myStream}
        playing 
        muted
        height="300px"
        width="300px"

      />

      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            height="300px"
            width="300px"
            url={remoteStream}
          />
        </>
      )}
      </div>
      <button onClick={sendStreams}>Send my stream</button>
    </div>
  );
};

export default Room;
