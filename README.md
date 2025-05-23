# Application de Gestion des Besoins d'Affichage

Cette application web permet de gérer les besoins d'affichage pour différents prestataires. Elle est construite avec la stack MERN (MongoDB, Express, React, Node.js).

## Structure du Projet

```
site-fournisseurs/
├── src/
│   ├── components/
│   │   ├── FormulaireFournisseur.jsx
│   │   └── TableauBesoins.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   └── index.js
└── vite.config.js
```

## Technologies Utilisées

- **Frontend:**
  - React 19
  - Tailwind CSS
  - Axios pour les requêtes HTTP
  - Vite comme bundler

- **Backend:**
  - Node.js avec Express
  - MongoDB avec Mongoose
  - Cors pour la gestion des requêtes cross-origin

## Fonctionnalités Principales

### 1. Formulaire de Saisie (FormulaireFournisseur.jsx)
- Saisie du nom du prestataire
- Sélection du format d'affichage (plusieurs options prédéfinies)
- Option pour spécifier un format personnalisé
- Champs pour le format visible, nombre d'affiches, adresse de livraison
- Zone de commentaires

### 2. Tableau des Besoins (TableauBesoins.jsx)
- Affichage des besoins enregistrés
- Possibilité de supprimer des entrées individuelles
- Affichage d'un message si aucune donnée n'est disponible

### 3. Gestion des Données (App.jsx)
- Chargement automatique des données au démarrage
- Ajout de nouveaux besoins
- Suppression de besoins individuels
- Option pour vider complètement la base de données

## API Backend

Le serveur Express expose les endpoints suivants :

- `GET /api/besoins` : Récupère tous les besoins
- `POST /api/besoins` : Crée un nouveau besoin
- `DELETE /api/besoins/:id` : Supprime un besoin spécifique
- `DELETE /api/besoins` : Supprime tous les besoins

## Configuration de la Base de Données

MongoDB est utilisé comme base de données avec le schéma suivant pour les besoins :
- nomPrestataire
- format
- formatSpecifique
- formatVisible
- nombreAffiches
- adresseLivraison
- commentaires
- dateCreation

## Installation et Démarrage

1. **Installation des dépendances:**
```bash
npm install
```

2. **Démarrage du serveur MongoDB:**
```bash
mongod
```

3. **Démarrage du serveur backend (depuis le dossier server):**
```bash
node index.js
```
ou depuis la racine du projet :
```bash
node server/index.js
```

4. **Démarrage du frontend:**
```bash
npm run dev
```

## Configuration du Développement

- Le serveur de développement frontend tourne sur le port 5173
- Le serveur backend tourne sur le port 5000
- Vite est configuré avec un proxy pour rediriger les requêtes `/api` vers le backend
- ESLint est configuré pour le linting du code React

## Sécurité et Performance

- Validation des données côté serveur
- Gestion des erreurs avec retours appropriés
- Utilisation de CORS pour la sécurité des requêtes
- Optimisation des requêtes MongoDB avec tri par date de création

## Notes de Maintenance

- Les versions des dépendances sont fixées pour la stabilité
- Le code est structuré de manière modulaire pour faciliter la maintenance
- Les composants React utilisent les hooks modernes (useState, useEffect)