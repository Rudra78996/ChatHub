import React from "react";
import "./VideoSection.css";
import Video from "./Video";

const VideoSection = ({remoteStream, localStream, joinCallHandler, sendStreams, disable}) => {
  return (
    <div className="video-section">
      <Video stream={localStream} muted={true}/>
      <Video stream={remoteStream} muted={false}/>
      <div className="video-buttons">
        <button className="btn btn-primary" onClick={sendStreams} disabled={!disable}>Send Stream</button>
        <button onClick={joinCallHandler}  className="btn btn-primary">
          Join
        </button>
      </div>
    </div>
  );
};

export default VideoSection;
