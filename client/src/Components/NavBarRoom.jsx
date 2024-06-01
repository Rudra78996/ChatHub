import React from "react";
import "./NavBarRoom.css";

const NavBar = ({ exitHandler }) => {
  return (
    <div className="room-navbar">
      <img src="./Images/logo.png" height={200} className="room-logo" />
      <button className="btn btn-danger room-leave-btn" onClick={exitHandler}>
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </div>
  );
};

export default NavBar;
