import React from "react";
import "./NavBarRoom.css";

const NavBar = ({ exitHandler }) => {
  return (
    <div className="room-navbar">
      <div className="room-logo">ChatHub</div>
      <button className="btn btn-danger room-leave-btn" onClick={exitHandler}>
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </div>
  );
};

export default NavBar;
