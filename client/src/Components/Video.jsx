import React from "react";
import "./Video.css"

const Video = ({ stream, muted }) => {
  return (
    <>
      <video ref={stream} muted={muted} autoPlay className="room-video" ></video>
    </>
  );
};

export default Video;
