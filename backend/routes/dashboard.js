const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
const auth = require('../middleware/auth');

// Récupérer les projets pour le tableau de bord
router.get('/', auth, async (req, res) => {
  try {
    const { client, date, type } = req.query;
    let query = {};
    if (client) query.clientId = client;
    if (date) query.date = { $gte: new Date(date) };
    if (type) query.type = type; // À définir si tu ajoutes un champ 'type' dans Projet

    const projets = await Projet.find(query).populate('lieuId clientId');
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;