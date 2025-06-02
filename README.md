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
