import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">
          <Link to="/" onClick={closeMenu}>
            🎬 MovieVerse
          </Link>
        </h1>

        <button className="menu-btn" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`nav ${isOpen ? "show" : ""}`}>
          <ul>
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/movies"
                className={location.pathname === "/movies" ? "active" : ""}
                onClick={closeMenu}
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={location.pathname === "/about" ? "active" : ""}
                onClick={closeMenu}
              >
                About
              </Link>

             
            </li>
            <Link
                to="/admin"
                className={location.pathname === "/admin" ? "active" : ""}
                onClick={closeMenu}
              >
                Admin
              </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
