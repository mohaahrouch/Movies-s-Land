const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db'); // Your db.js should export the connection

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_secret_key'; // use env in production

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ---------------- AUTH ----------------

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM movieland_admin WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  });
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token missing' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.admin = decoded;
    next();
  });
};

// ---------------- MOVIE ROUTES ----------------

app.get('/api/movies', (req, res) => {
  db.query('SELECT * FROM movie', (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
});

app.post('/api/movies', verifyToken, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = 'INSERT INTO movie (title, description, image) VALUES (?, ?, ?)';
  db.query(sql, [title, description, image], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ id: result.insertId, title, description, image });
  });
});

app.put('/api/movies/:id', verifyToken, upload.single('image'), (req, res) => {
  const { title, description, currentImage } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : currentImage;

  const sql = 'UPDATE movie SET title = ?, description = ?, image = ? WHERE id = ?';
  db.query(sql, [title, description, image, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Movie updated' });
  });
});

app.delete('/api/movies/:id', verifyToken, (req, res) => {
  const movieId = req.params.id;

  db.query('SELECT image FROM movie WHERE id = ?', [movieId], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: 'Movie not found' });

    const imagePath = result[0].image;

    db.query('DELETE FROM movie WHERE id = ?', [movieId], (err) => {
      if (err) return res.status(500).json(err);

      if (imagePath && fs.existsSync(`.${imagePath}`)) {
        fs.unlinkSync(`.${imagePath}`);
      }

      res.json({ message: 'Movie deleted' });
    });
  });
});
app.get('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;

  db.query('SELECT * FROM movie WHERE id = ?', [movieId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(result[0]);
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
