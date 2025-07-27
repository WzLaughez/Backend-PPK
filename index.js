const express = require('express');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const dataKesehatanRoute = require("./routes/dataKesehatanRoutes");
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const edukasiRoutes = require('./routes/edukasiRoutes');
const galeriRoutes = require('./routes/galeriRoutes');
const subgaleriRoutes = require('./routes/subgaleriRoutes');
const { verifyToken } = require('./middlewares/verifyToken');
const path = require("path");
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use('/api/login', authRoutes); // Auth route for user login
app.use('/api/users', userRoutes); // User management routes
app.use("/api/kesehatan", dataKesehatanRoute); // Health data routes
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/edukasi', edukasiRoutes); // Edukasi routes
app.use('/api/galeri', galeriRoutes); // Galeri routes
app.use('/api/subgaleri', subgaleriRoutes); // Galeri routes
// Tidak sync agar tidak ubah struktur DB
if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true }) // drop dan recreate tabel (hati-hati)
    .then(() => {
      console.log('Database synced (forced)');
      return sequelize.authenticate();
    })
    .then(() => {
      console.log('Database connected');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database error:', err.message);
    });
} else {
  sequelize.authenticate()
    .then(() => {
      console.log('Database connected (production, no sync)');
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database error:', err.message);
    });
}


