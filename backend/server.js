const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const lieuxRoutes = require('./routes/lieux');
const projetsRoutes = require('./routes/projets');
const dashboardRoutes = require('./routes/dashboard');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Connexion à la base de données
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lieux', lieuxRoutes);
app.use('/api/projets', projetsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});