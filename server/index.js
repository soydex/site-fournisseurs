import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import process from 'process';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/besoins_affichage', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Modèle de données
const BesoinSchema = new mongoose.Schema({
  nomPrestataire: String,
  format: String,
  formatSpecifique: String,
  formatVisible: String,
  nombreAffiches: Number,
  adresseLivraison: String,
  commentaires: String,
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

const Besoin = mongoose.model('Besoin', BesoinSchema);

// Routes API
app.get('/api/besoins', async (req, res) => {
  try {
    const besoins = await Besoin.find().sort({ dateCreation: -1 });
    res.json(besoins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/besoins', async (req, res) => {
  try {
    const nouveauBesoin = new Besoin(req.body);
    const besoinSauvegarde = await nouveauBesoin.save();
    res.status(201).json(besoinSauvegarde);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/besoins/:id', async (req, res) => {
  try {
    await Besoin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Besoin supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/besoins', async (req, res) => {
  try {
    await Besoin.deleteMany({});
    res.json({ message: 'Tous les besoins ont été supprimés' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
