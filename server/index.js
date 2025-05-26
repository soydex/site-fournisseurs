import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import process from "process";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/besoins_affichage";

// Middleware de sécurité
app.use(helmet());
app.use(express.static('dist')); // Servir les fichiers statiques de production

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*'
}));
app.use(express.json());

// Connexion à MongoDB optimisée
mongoose
  .connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Gestion des événements de connexion
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erreur de connexion MongoDB:"));
db.on("disconnected", () => console.log("MongoDB déconnecté"));

// Modèle de données avec validation
const BesoinSchema = new mongoose.Schema(
  {
    nomAnnonceur: {
      type: String,
      required: true,
      trim: true,
    },
    nomPrestataire: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      required: true,
    },
    formatSpecifique: String,
    formatVisible: String,
    nombreAffiches: {
      type: Number,
      min: 1,
      required: true,
    },
    adresseLivraison: {
      type: String,
      required: true,
    },
    commentaires: String,
    dateCreation: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

// Index pour améliorer les performances de tri
BesoinSchema.index({ dateCreation: -1 });

const Besoin = mongoose.model("Besoin", BesoinSchema);

// Routes API avec gestion d'erreurs améliorée
app.get("/api/besoins", async (req, res) => {
  try {
    // Ajouter mise en cache avec Redis ou utiliser .cache() de mongoose
    const besoins = await Besoin.find()
      .select('-__v') // Exclure les champs non nécessaires
      .sort({ dateCreation: -1 })
      .limit(100) // Limiter le nombre de résultats
      .lean()
      .exec();
    
    // Ajouter les headers de cache
    res.set('Cache-Control', 'public, max-age=30');
    res.json(besoins);
  } catch (err) {
    console.error("Erreur lors de la récupération des besoins:", err);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des besoins"
    });
  }
});

app.post("/api/besoins", async (req, res) => {
  try {
    const nouveauBesoin = new Besoin(req.body);
    const besoinSauvegarde = await nouveauBesoin.save();
    res.status(201).json(besoinSauvegarde);
  } catch (err) {
    console.error("Erreur lors de la création du besoin:", err);
    if (err.name === "ValidationError") {
      res.status(400).json({
        message: "Données invalides",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    } else {
      res.status(500).json({
        message: "Erreur serveur lors de la création du besoin",
      });
    }
  }
});

app.delete("/api/besoins/:id", async (req, res) => {
  try {
    const besoinSupprime = await Besoin.findByIdAndDelete(req.params.id);
    if (!besoinSupprime) {
      return res.status(404).json({ message: "Besoin non trouvé" });
    }
    res.json({ message: "Besoin supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression du besoin:", err);
    res.status(500).json({
      message: "Erreur serveur lors de la suppression du besoin",
    });
  }
});

app.delete("/api/besoins", async (req, res) => {
  try {
    const result = await Besoin.deleteMany({});
    res.json({
      message: `${result.deletedCount} besoin(s) supprimé(s) avec succès`,
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de tous les besoins:", err);
    res.status(500).json({
      message: "Erreur serveur lors de la suppression des besoins",
    });
  }
});

// Gestion gracieuse de l'arrêt
process.on("SIGINT", async () => {
  console.log("Arrêt du serveur en cours...");
  await mongoose.connection.close();
  console.log("Connexion MongoDB fermée");
  process.exit(0);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
