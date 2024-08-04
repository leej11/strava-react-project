import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import AuthorizationButton from "../components/AuthorizationButton";

function Navbar() {
  return (
    <div className="navbar">
      <div className="links">
        <div>
          <Link to="/"> Home </Link>
          <Link to="/about"> About </Link>
        </div>
        <AuthorizationButton />
      </div>
    </div>
  );
}

export default Navbar;
