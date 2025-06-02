import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import process from "process";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

// Pour gérer les chemins avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const MONGODB_URI_netlify = "mongodb+srv://comadmin:comymedia2025*@cluster0.ewmfj56.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGODB_URI = MONGODB_URI_netlify || "mongodb://localhost:27017/besoins_affichage";

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://site-fournisseurs.onrender.com',
    'http://localhost:5173',
    'http://localhost:4173'
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  retryWrites: true,
}).then(() => {
  console.log("✅ Connexion à MongoDB réussie");
  console.log("URI:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
}).catch((err) => {
  console.error("❌ Erreur de connexion à MongoDB:", err);
  process.exit(1);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion MongoDB:"));
db.on("disconnected", () => console.log("MongoDB déconnecté"));

// Schéma
const BesoinSchema = new mongoose.Schema({
  nomAnnonceur: { type: String, required: true, trim: true },
  nomPrestataire: { type: String, required: true, trim: true },
  format: { type: String, required: true },
  formatSpecifique: String,
  formatVisible: String,
  nombreAffiches: { type: Number, min: 1, required: true },
  adresseLivraison: { type: String, required: true },
  commentaires: String,
  dateCreation: { type: Date, default: Date.now },
}, { timestamps: true });

BesoinSchema.index({ dateCreation: -1 });
const Besoin = mongoose.model("Besoin", BesoinSchema);

// === ROUTES API ===
app.get("/api/besoins", async (req, res) => {
  try {
    const besoins = await Besoin.find()
      .select('-__v')
      .sort({ dateCreation: -1 })
      .limit(100)
      .lean()
      .exec();
    res.set('Cache-Control', 'public, max-age=30');
    res.json(besoins);
  } catch (err) {
    console.error("Erreur GET /api/besoins:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des besoins" });
  }
});

app.post("/api/besoins", async (req, res) => {
  try {
    const besoin = new Besoin(req.body);
    const saved = await besoin.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Erreur POST /api/besoins:", err);
    if (err.name === "ValidationError") {
      res.status(400).json({
        message: "Données invalides",
        errors: Object.values(err.errors).map(e => e.message),
      });
    } else {
      res.status(500).json({ message: "Erreur serveur lors de la création du besoin" });
    }
  }
});

// Ajout d'une validation des routes
app.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide" });
  }
  next();
});

// Modification de la route de suppression
app.delete("/api/besoins/:id", async (req, res) => {
  try {
    const deleted = await Besoin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Besoin non trouvé" });
    res.json({ message: "Besoin supprimé avec succès" });
  } catch (err) {
    console.error("Erreur DELETE /api/besoins/:id:", err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du besoin" });
  }
});

app.delete("/api/besoins", async (req, res) => {
  try {
    const result = await Besoin.deleteMany({});
    res.json({ message: `${result.deletedCount} besoin(s) supprimé(s) avec succès` });
  } catch (err) {
    console.error("Erreur DELETE /api/besoins:", err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression des besoins" });
  }
});

app.get('/api/test-connection', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: 'success', message: 'Connecté à MongoDB', database: mongoose.connection.name });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Erreur MongoDB', error: error.message });
  }
});

// === SERVE REACT APP ===
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// === STOP GRACIEUX ===
process.on("SIGINT", async () => {
  console.log("Arrêt du serveur...");
  await mongoose.connection.close();
  console.log("MongoDB fermé");
  process.exit(0);
});

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});