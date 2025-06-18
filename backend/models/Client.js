const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  coordonnees: {
    type: Object, // Ex. : { téléphone: String, adresse: String }
    required: true,
  },
  historique: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projet',
  }],
});

module.exports = mongoose.model('Client', clientSchema);