# Application de Gestion des Besoins d'Affichage

Cette application web permet de gérer les besoins d'affichage pour différents prestataires. Elle est construite avec React, Express et MongoDB.

## Structure du Projet

```
site-fournisseurs/
├── src/
│   ├── components/
│   │   ├── DernieresRequetes.jsx
│   │   ├── FormulaireFournisseur.jsx
│   │   └── TableauBesoins.jsx
│   ├── pages/
│   │   ├── AdminLoginPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── TableauPage.jsx
│   ├── App.jsx
│   └── main.jsx
├── server/
│   └── index.js
├── .env.production
├── vite.config.js
├── eslint.config.js
└── package.json
```

## Fonctionnalités

### Interface Utilisateur
- **Formulaire de Saisie** : Interface intuitive pour la saisie des besoins d'affichage
- **Historique Local** : Affichage des dernières requêtes de l'utilisateur
- **Gestion des Sessions** : Conservation des données pendant 24h
- **Page 404** : Gestion élégante des routes non trouvées

### Interface Administration
- **Authentification** : Page de connexion sécurisée
- **Tableau de Bord** : Vue complète des besoins avec fonctionnalités de recherche
- **Export Excel** : Possibilité d'exporter les données au format XLSX
- **Gestion des Données** : Suppression individuelle ou complète des entrées

### Sécurité
- Protection des routes administratives
- Stockage sécurisé du mot de passe administrateur
- Validation des données côté serveur
- Gestion des CORS

## Technologies

### Frontend
- React 19
- React Router DOM 7
- Axios pour les requêtes HTTP
- TailwindCSS 4
- XLSX pour l'export Excel
- Vite comme bundler

### Backend
- Node.js avec Express 5
- MongoDB avec Mongoose 8
- CORS
- Validation des données

### Outils de Développement
- ESLint 9
- Configuration Vite optimisée
- Support du Hot Module Replacement

## Installation

1. **Cloner le dépôt**
```bash
git clone [url-du-repo]
cd site-fournisseurs
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration**
- Créer un fichier `.env.production` avec le mot de passe admin
- Vérifier la configuration MongoDB dans `server/index.js`

4. **Démarrer l'application**
```bash
# Démarrer le serveur backend
node server/index.js

# Démarrer le frontend en développement
npm run dev

# Ou construire pour la production
npm run build
```

## Configuration

### Environnement de Production
```env
admin_password=votre_mot_de_passe
```

### Proxy
Le serveur de développement est configuré avec un proxy vers le backend :
```javascript
{
  "/api": "http://localhost:5000"
}
```

## Performance et Optimisations
- Mise en cache des requêtes côté client
- Debounce sur la recherche
- Pagination côté serveur
- Optimisation des requêtes MongoDB
- Chunking automatique des bundles

## Maintenance
- Vérification régulière des dépendances
- Linting automatique avec ESLint
- Tests unitaires recommandés
- Documentation du code à jour