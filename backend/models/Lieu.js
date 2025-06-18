const mongoose = require('mongoose');

const lieuSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image2d: {
    type: String, // URL ou chemin du fichier
    required: true,
  },
  vue360: {
    type: String, // URL ou chemin de l'image équirectangulaire
    required: true,
  },
  tags: {
    type: [String], // Tableau de tags
    default: [],
  },
});

module.exports = mongoose.model('Lieu', lieuSchema);