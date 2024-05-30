import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../helper/socket";
import PeerService from "../helper/peerService";
import "./Room.css";
import ChatSection from "../Components/ChatSection";
import NavBar from "../Components/NavBarRoom";
import VideoSection from "../Components/VideoSection";
import toast, { Toaster } from "react-hot-toast";

const Room = () => {
  const [disable, setDisable] = useState(false);
  const { socket } = useSocket();
  const [foundMatch, setFoundMatch] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState();

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const localStreamHandler = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    if (videoRef1.current) {
      videoRef1.current.srcObject = stream;
    }
  }, []);

  const sendStreams = () => {
    const tracks = myStream.getTracks();
    try {
      tracks.forEach((track) => {
        PeerService.peer.addTrack(track, myStream);
      });
    } catch (e) {
      console.log("?????", e);
    }
  };

  useEffect(() => {
    if (myStream) {
      console.log('myStream updated:', myStream);
      sendStreams();
    }
  }, [myStream]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).then((stream)=>{
      setMyStream(stream);
      if (videoRef1.current) {
        videoRef1.current.srcObject = stream;
      }
    });
    const matchFoundHandler = async (data) => {
      setDisable(true);
      setFoundMatch(true);
      toast.success("User Connected");
      if (data.createReq) {
        const offer = await PeerService.getOffer();
        console.log("offer generated", offer);
        socket.emit("offer", { offer });
      }
    };

    const offerHandler = async (offer) => {
      console.log("offer received", offer);
      const ans = await PeerService.getAnswer(offer);
      console.log("answer generated", ans);
      socket.emit("answer", ans);
    };

    const answerHandler = async (ans) => {
      console.log("answer received", ans);
      await PeerService.setRemoteDescription(ans);
      sendStreams();
      setTimeout(() => {
        sendStreams();
      }, 5000);
    };

    const waitHandler = () => {
      setTimeout(() => {
        socket.emit("find-match");
      }, 1000);
    };

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
    console.log("nego offer generated", offer);
    socket.emit("peer:nego:needed", { offer });
  }, [socket]);
  useEffect(() => {
    PeerService.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      PeerService.peer.removeEventListener(
        "negotiationneeded",
        handleNegoNeeded
      );
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    PeerService.peer.addEventListener("connectionstatechange", (event) => {
      switch (PeerService.peer.connectionState) {
        case "connected":
          console.log("The connection has become successfully established.");
          break;
        case "disconnected":
          console.log("disconnected");
          toast.error("disconnected");
          videoRef2.current.srcObject = null;
          // setFoundMatch(false);
          // setRemoteStream(null);
          break;
        case "failed":
          toast.error("connection failed");
          console.log("The connection has failed.");
          break;
        case "closed":
          console.log("The connection has been closed.");
          break;
        default:
          console.log(
            `Connection state changed to: ${PeerService.peer.connectionState}`
          );
          break;
      }
    });
  }, []);

  // useEffect(() => {
  //   if (myStream) {
  //     sendStreams();
  //   }
  // }, [myStream, sendStreams]);

  const handleNegoNeedIncoming = useCallback(
    async ({ offer }) => {
      console.log("nego offer received", offer);
      const ans = await PeerService.getAnswer(offer);
      console.log("nego answer generated", ans);
      socket.emit("peer:nego:done", { ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    console.log("nego answer received", ans);
    await PeerService.setRemoteDescription(ans);
  }, []);

  useEffect(() => {
    if (PeerService.peer) {
      PeerService.peer.addEventListener("track", (ev) => {
        console.log(ev.streams[0]);
        const remoteStream = ev.streams[0];
        console.log("GOT TRACKS!!");
        setRemoteStream(remoteStream);
        videoRef2.current.srcObject = remoteStream;
      });
    }
  }, []);

  const joinCallHandler = () => {
    socket.emit("join-room");
    socket.emit("find-match");
    setDisable(true);
  };

  return (
    <div className="room">
      <Toaster position="room-top-center" reverseOrder={false} />
      <NavBar />
      <div className="room-main-content">
        <VideoSection
          remoteStream={videoRef2}
          localStream={videoRef1}
          joinCallHandler={joinCallHandler}
          sendStreams={sendStreams}
          disable={foundMatch}
        />
        <ChatSection matchFound={foundMatch} />
      </div>
    </div>
  );
};

export default Room;
