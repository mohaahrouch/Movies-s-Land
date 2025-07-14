import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Single.css';

const Single = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!movie) return <div className="single-loading">Loading...</div>;

  return (
    <div className="single-container">
      <Link to="/movies" className="back-link">← Back to Movies</Link>
      <div className="single-card">
       <img
  src={movie.image ? `http://localhost:5000${movie.image}` : 'https://via.placeholder.com/500x300?text=No+Image'}
  alt={movie.title}
  className="single-img"
/>

        <div className="single-info">
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Single;
