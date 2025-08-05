const express = require('express');
const router = express.Router();
const Lieu = require('../models/Lieu');
const auth = require('../middleware/auth');

// Lister tous les lieux
router.get('/', async (req, res) => {
  try {
    const lieux = await Lieu.find();
    res.json(lieux);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Créer un lieu
router.post('/', auth, async (req, res) => {
  try {
    const { nom, description, image2d, vue360, tags } = req.body;
    const lieu = new Lieu({ nom, description, image2d, vue360, tags });
    await lieu.save();
    res.status(201).json(lieu);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Mettre à jour un lieu
router.put('/:id', auth, async (req, res) => {
  try {
    const { nom, description, image2d, vue360, tags } = req.body;
    const lieu = await Lieu.findByIdAndUpdate(req.params.id, { nom, description, image2d, vue360, tags }, { new: true });
    if (!lieu) return res.status(404).json({ message: 'Lieu non trouvé' });
    res.json(lieu);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Supprimer un lieu
router.delete('/:id', auth, async (req, res) => {
  try {
    const lieu = await Lieu.findByIdAndDelete(req.params.id);
    if (!lieu) return res.status(404).json({ message: 'Lieu non trouvé' });
    res.json({ message: 'Lieu supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;