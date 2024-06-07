import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../helper/socket";
import PeerService from "../helper/peerService";
import "./Room.css";
import ChatSection from "../Components/ChatSection";
import NavBar from "../Components/NavBarRoom";
import VideoSection from "../Components/VideoSection";
import {  toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";   
import { Link } from "react-router-dom";

const Room = () => {
  const [loaderId, setLoaderId] = useState(null);
  const [disable, setDisable] = useState(false);
  const { socket } = useSocket();
  const [foundMatch, setFoundMatch] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const navigate = useNavigate();
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const localStreamHandler = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      if (videoRef1.current) {
        videoRef1.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  }, []);

  useEffect(() => {
    if (myStream) {
      const tracks = myStream.getTracks();
      try {
        tracks.forEach((track) => {
          PeerService.peer.addTrack(track, myStream);
        });
      } catch (e) {
        console.log("Error adding tracks:", e);
      }
    }
  }, [myStream]);

  useEffect(() => {
    localStreamHandler();

    const matchFoundHandler = async (data) => {
      setFoundMatch(true);
      if (data.createReq) {
        const offer = await PeerService.getOffer();
        socket.emit("offer", { offer });
      }
    };

    const offerHandler = async (offer) => {
      const ans = await PeerService.getAnswer(offer);
      socket.emit("answer", ans);
    };

    const answerHandler = async (ans) => {
      await PeerService.setRemoteDescription(ans);
    };

    const waitHandler = () => {
      setTimeout(() => {
        socket.emit("find-match");
      }, 1000);
    };

    socket.on("ice-candidate", async (candidate) => {
      try {
        await PeerService.peer.addIceCandidate(candidate);
      } catch (e) {
        console.error("Error adding received ice candidate", e);
      }
    });

    PeerService.peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
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
      socket.off("icecandidate");
    };
  }, [socket, localStreamHandler]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await PeerService.getOffer();
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
          // console.log("The connection has become successfully established.");
          break;
        case "disconnected":
          toast.error("disconnected", {
            position: "top-center",
          });
          setTimeout(()=>{
            videoRef2.current.srcObject = null;
            location.reload();
            PeerService.peer.close();
          },500)
          break;
        case "failed":
          toast.error("connection failed", {
            position: "top-center",
          });
          setTimeout(()=>{
            videoRef2.current.srcObject = null;
            location.reload();
            PeerService.peer.close();
          },500)
          // console.log("The connection has failed.");
          break;
        case "closed":
          // console.log("The connection has been closed.");
          toast.error("connection close", {
            position: "top-center",
          });
          setTimeout(()=>{
            videoRef2.current.srcObject = null;
            location.reload();
            PeerService.peer.close();
          },500)
          break;
        default:
          // console.log(
          //   `Connection state changed to: ${PeerService.peer.connectionState}`
          // );
          break;
      }
    });
  }, []);

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
        const remoteStream = ev.streams[0];
        setRemoteStream(remoteStream);
        if (videoRef2.current) {
          videoRef2.current.srcObject = remoteStream;
        }
      });
    }
  }, []);

  const joinCallHandler = () => {
    const id = toast.loading("Finding Match", {
      position: "top-center",
      className: "toast-message",
    });
    setLoaderId(id);
    socket.emit("join-room");
    socket.emit("find-match");
    setDisable(true);
  };

  const endCallHandler = () => {
    location.reload();
    PeerService.peer.close();
  };

  const exitHandler = () => {
    if (myStream) {
      myStream.getTracks().forEach(function (track) {
        track.stop();
      });
      if (videoRef1.current) {
        videoRef1.current.srcObject = null;
      }
    }
    PeerService.peer.close();
    toast.update(loaderId, { render: "Error", type: "error", isLoading: false, autoClose: 2000,hideProgressBar:true} );
    navigate("/");
  };

  useEffect(()=>{
    if(foundMatch){
      if(loaderId){
        toast.update(loaderId, { render: "Match found", type: "success", isLoading: false, autoClose: 3000,hideProgressBar:true});
      }
    }
  }, [foundMatch])

  return (
    <div className="room">
      <NavBar exitHandler={exitHandler} />
      <div className="room-main-content">
        <VideoSection
          remoteStream={videoRef2}
          localStream={videoRef1}
          joinCallHandler={joinCallHandler}
          disable={foundMatch}
          endCallHandler={endCallHandler}
          joinDisable={disable}
        />
        <ChatSection matchFound={foundMatch} />
      </div>
    </div>
  );
};

export default Room;
