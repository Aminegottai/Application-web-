const express = require('express');
const router = express.Router();
const Projet = require('../models/Projet');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const projets = await Projet.find().populate('lieuId clientId');
    res.json(projets);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { titre, lieuId, clientId, date, imageBase } = req.body;
    const projet = new Projet({ titre, lieuId, clientId, date, imageBase });
    await projet.save();
    res.status(201).json(projet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { titre, lieuId, clientId, date, imageBase } = req.body;
    const projet = await Projet.findByIdAndUpdate(req.params.id, { titre, lieuId, clientId, date, imageBase }, { new: true }).populate('lieuId clientId');
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json(projet);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if (!projet) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json({ message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;