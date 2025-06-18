const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Lieu = require('./models/Lieu');
const Projet = require('./models/Projet');
const Client = require('./models/Client');

const app = express();

// Middleware
app.use(express.json());

// Connexion à MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scenography_saas_db';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Test des modèles (exemple d'insertion)
const testData = async () => {
  try {
    // Supprimer les données existantes (pour test)
    await User.deleteMany();
    await Lieu.deleteMany();
    await Projet.deleteMany();
    await Client.deleteMany();

    // Créer un utilisateur
    const user = new User({
      email: 'admin@example.com',
      password: 'password123', // À hasher dans une version réelle
      role: 'admin',
    });
    await user.save();

    // Créer un lieu
    const lieu = new Lieu({
      nom: 'Théâtre National',
      description: 'Un lieu historique pour les spectacles',
      image2d: 'http://example.com/image1.jpg',
      vue360: 'http://example.com/vue360_1.jpg',
      tags: ['Théâtre', 'Historique'],
    });
    await lieu.save();

    // Créer un projet
    const projet = new Projet({
      titre: 'Spectacle 2025',
      lieuId: lieu._id,
      clientId: user._id,
      date: new Date(),
      imageBase: 'http://example.com/projet_image.jpg',
    });
    await projet.save();

    // Créer un client
    const client = new Client({
      nom: 'Agence Lumière',
      coordonnees: { téléphone: '123456789', adresse: 'Paris' },
      historique: [projet._id],
    });
    await client.save();

    console.log('Données de test insérées avec succès');
  } catch (err) {
    console.error('Erreur lors de l\'insertion des données :', err);
  }
};

testData();

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});