import React from "react";
import "./NavBarRoom.css";
import { Link } from "react-router-dom";

const NavBar = ({ exitHandler }) => {
  return (
    <div className="room-navbar">
      <Link to="/" style={{ textDecoration: "none", color:"white" }}>
        <div className="room-logo">ChatHub</div>
      </Link>
      <button className="btn btn-danger room-leave-btn" onClick={exitHandler}>
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </div>
  );
};

export default NavBar;
