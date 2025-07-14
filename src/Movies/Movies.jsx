import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleMovieClick = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="movies-container">
      <h2 className="movies-title">🎬 Movies List</h2>

      <div className="movies-grid">
        {currentMovies.map(movie => (
          <div
            className="movie-card"
            key={movie.id}
            onClick={() => handleMovieClick(movie.id)}
            role="button"
            tabIndex={0}
            onKeyPress={e => e.key === 'Enter' && handleMovieClick(movie.id)}
          >
            <img
              src={movie.image ? `http://localhost:5000${movie.image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={movie.title}
              className="movie-img"
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          ◀ Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Movies;
