import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About This App 🎬</h1>
      <p className="about-description">
        This movie application allows users to browse a collection of movies fetched from a database. 
        Each movie comes with a title, description, and image. You can also view more details on a separate page.
      </p>

      <p className="about-description">
        The frontend is built using <strong>React</strong>, with routing handled by <strong>React Router</strong>. 
        Movie data is retrieved from a REST API built with <strong>Express</strong> and served from a <strong>MySQL</strong> database.
      </p>

      <p className="about-description">
        Designed with a clean, user-friendly interface for an enjoyable browsing experience.
      </p>

      <Link to="/" className="about-home-link">← Back to Home</Link>
    </div>
  );
};

export default About;
