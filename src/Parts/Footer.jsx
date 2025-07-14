import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-section brand">
        <h2>🎬 MovieVerse</h2>
        <p>Your ultimate movie companion. Discover, explore, and enjoy!</p>
      </div>

      <div className="footer-section links">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>

      <div className="footer-section social">
        <h4>Follow Us</h4>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2025 MovieVerse. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
