import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this file exists
import Movies from './Movies/Movies';
import Header from './Parts/Header';
import Footer from './Parts/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './Parts/About';
import Single from './Movies/Single';

import Home from './Parts/Home';
import Admin from './Admin/Admin';
import AdminLogin from './Admin/AdminLogin';


function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header />
   
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/about" element={<About />} />
             <Route path="/movie/:id" element={<Single />} />
             <Route path='/admin' element={<Admin/>}></Route>
             <Route path='/admin-login' element={<AdminLogin/>}></Route>


          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
