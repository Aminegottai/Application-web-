const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
  },
  lieuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lieu',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ou 'Client' si tu utilises un modèle séparé
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  imageBase: {
    type: String, // URL ou chemin de l'image de base
    required: true,
  },
  // Champs pour l'éditeur visuel (à ajouter plus tard si nécessaire)
});

module.exports = mongoose.model('Projet', projetSchema);