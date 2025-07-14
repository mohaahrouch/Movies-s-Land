// createAdmin.js
const bcrypt = require('bcryptjs');
const db = require('./db'); // ensure this exports your database connection

(async () => {
  try {
    const password = await bcrypt.hash('admin123', 10);
    const email = 'admin@example.com';

    db.query('INSERT INTO movieland_admin (email, password) VALUES (?, ?)', [email, password], (err, result) => {
      if (err) {
        console.error('Error inserting admin:', err);
      } else {
        console.log('Admin user created successfully!');
      }
      process.exit(); // exit script
    });
  } catch (err) {
    console.error('Hashing error:', err);
    process.exit(1);
  }
})();
