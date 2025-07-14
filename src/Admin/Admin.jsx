import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', image: null, currentImage: '' });
  const [editingId, setEditingId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/admin-login');
    fetchMovies();
  }, [navigate]);

  const fetchMovies = () => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  };

  // Pagination helpers
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // rest unchanged...
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (form.image) formData.append('image', form.image);
    if (editingId && form.currentImage) formData.append('currentImage', form.currentImage);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    };

    const request = editingId
      ? axios.put(`http://localhost:5000/api/movies/${editingId}`, formData, config)
      : axios.post('http://localhost:5000/api/movies', formData, config);

    request.then(() => {
      fetchMovies();
      resetForm();
    }).catch(err => console.error(err));
  };

  const handleEdit = (movie) => {
    setForm({
      title: movie.title,
      description: movie.description,
      image: null,
      currentImage: movie.image
    });
    setEditingId(movie.id);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Delete this movie?')) {
      axios.delete(`http://localhost:5000/api/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => fetchMovies());
    }
  };

  const resetForm = () => {
    setForm({ title: '', description: '', image: null, currentImage: '' });
    setEditingId(null);
  };

  return (
    <div className="admin-hero">
      <div className="admin-container">
        <h2>Admin Dashboard</h2>
        <form onSubmit={handleSubmit} className="movie-form" encType="multipart/form-data">
          <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          {form.currentImage && !form.image && (
            <img src={`http://localhost:5000${form.currentImage}`} alt="Preview" width="120" />
          )}
          <button type="submit">{editingId ? 'Update' : 'Add'} Movie</button>
          {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>

        <div className="movies-table">
          <h3>Movies</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMovies.map(movie => (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.description}</td>
                  <td>
                    {movie.image && (
                      <img
                        src={`http://localhost:5000${movie.image}`}
                        alt={movie.title}
                        width="100"
                        className="zoom-image"
                      />
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(movie)}>Edit</button>
                    <button onClick={() => handleDelete(movie.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPage === idx + 1 ? 'active' : ''}
                  onClick={() => paginate(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
