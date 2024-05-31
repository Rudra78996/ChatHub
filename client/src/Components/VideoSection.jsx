import React from "react";
import "./VideoSection.css";
import Video from "./Video";

const VideoSection = ({remoteStream, localStream, joinCallHandler, endCallHandler, disable}) => {
  return (
    <div className="video-section">
      <Video stream={localStream} muted={true}/>
      <Video stream={remoteStream} muted={false}/>
      <div className="video-buttons">
        <button className="btn btn-danger" onClick={endCallHandler} disabled={!disable}>End</button>
        <button onClick={joinCallHandler}  className="btn btn-primary">
          Join
        </button>
      </div>
    </div>
  );
};

export default VideoSection;
