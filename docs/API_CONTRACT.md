# Contrat API Frontend ↔ Backend

Ce document décrit les appels API que le frontend effectue et les réponses attendues du backend.

---

## 📦 Structures de Données

### Besoin (DisplayNeed)

Le frontend attend les besoins dans ce format :

```typescript
interface DisplayNeed {
  id: string;              // Identifiant unique (MongoDB _id converti en string)
  createdAt: string;       // Date de création au format ISO (ex: "2024-12-23T14:30:00.000Z")
  advertiser: string;      // Nom de l'annonceur
  provider: string;        // Nom du prestataire
  format: string;          // Format d'affiche (ex: "120x176 (Abribus)")
  visibleFormat: string;   // Format visible (ex: "110x170")
  quantity: number;        // Nombre d'affiches
  deliveryAddress: string; // Adresse de livraison
  comments: string;        // Commentaires (peut être vide "")
  context?: string;        // Slug de la campagne associée (optionnel, ex: "salonhabitat")
}
```

### Campagne (Campaign)

```typescript
interface Campaign {
  slug: string;        // Identifiant unique URL-safe (ex: "salonhabitat")
  displayName: string; // Nom affiché (ex: "Salon de l'Habitat")
}
```

---

## 🔄 Mapping Backend → Frontend

Le backend MongoDB utilise des noms français, le frontend des noms anglais. Voici la correspondance :

| Backend (MongoDB)    | Frontend (TypeScript) |
|---------------------|----------------------|
| `_id`               | `id`                 |
| `dateCreation`      | `createdAt`          |
| `nomAnnonceur`      | `advertiser`         |
| `nomPrestataire`    | `provider`           |
| `format`            | `format`             |
| `formatVisible`     | `visibleFormat`      |
| `nombreAffiches`    | `quantity`           |
| `adresseLivraison`  | `deliveryAddress`    |
| `commentaires`      | `comments`           |
| `context`           | `context`            |

> **Note** : Le backend peut renvoyer les données en français et le frontend fera la transformation, OU le backend peut directement renvoyer en anglais. À définir.

---

## 📡 Endpoints API

### 1. Besoins (Needs)

#### `GET /besoins`
Récupère la liste des besoins.

**Query Parameters :**
| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `context` | string | Non | Filtre par slug de campagne |

**Exemples d'appel :**
```
GET /besoins                        → Tous les besoins
GET /besoins?context=salonhabitat   → Besoins de la campagne "salonhabitat"
```

**Réponse attendue (200 OK) :**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "nomAnnonceur": "Coca Cola",
    "nomPrestataire": "Agence Paris",
    "format": "120x176 (Abribus)",
    "formatVisible": "110x170",
    "nombreAffiches": 50,
    "adresseLivraison": "123 Avenue des Champs, 75008 Paris",
    "commentaires": "Livraison urgente",
    "context": "salonhabitat",
    "dateCreation": "2024-12-23T14:30:00.000Z"
  }
]
```

---

#### `POST /besoins`
Crée un nouveau besoin.

**Body attendu :**
```json
{
  "nomAnnonceur": "Nike",
  "nomPrestataire": "Print Services",
  "format": "320x240 (4x3)",
  "formatVisible": "320x240",
  "nombreAffiches": 10,
  "adresseLivraison": "Zone Industrielle Nord, Lyon",
  "commentaires": "",
  "context": "salonmoto"
}
```

**Réponse attendue (201 Created) :**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "nomAnnonceur": "Nike",
  "nomPrestataire": "Print Services",
  "format": "320x240 (4x3)",
  "formatVisible": "320x240",
  "nombreAffiches": 10,
  "adresseLivraison": "Zone Industrielle Nord, Lyon",
  "commentaires": "",
  "context": "salonmoto",
  "dateCreation": "2024-12-23T15:00:00.000Z"
}
```

**Erreurs possibles :**
- `400 Bad Request` : Données invalides (champs requis manquants)
- `500 Internal Server Error` : Erreur serveur

---

#### `DELETE /besoins/:id`
Supprime un besoin par son ID.

**Exemple d'appel :**
```
DELETE /besoins/507f1f77bcf86cd799439011
```

**Réponse attendue (200 OK) :**
```json
{
  "message": "Besoin supprimé avec succès"
}
```

**Erreurs possibles :**
- `400 Bad Request` : ID invalide (pas un ObjectId MongoDB)
- `404 Not Found` : Besoin non trouvé
- `500 Internal Server Error` : Erreur serveur

---

#### `DELETE /besoins`
Supprime plusieurs besoins (tous ou filtrés par campagne).

**Query Parameters :**
| Param | Type | Requis | Description |
|-------|------|--------|-------------|
| `context` | string | Non | Supprime uniquement les besoins de cette campagne |

**Exemples d'appel :**
```
DELETE /besoins                       → Supprime TOUS les besoins
DELETE /besoins?context=salonhabitat  → Supprime les besoins de "salonhabitat"
```

**Réponse attendue (200 OK) :**
```json
{
  "message": "15 besoin(s) supprimé(s) avec succès"
}
```

---

### 2. Campagnes (Campaigns)

#### `GET /campagnes`
Récupère la liste de toutes les campagnes.

**Réponse attendue (200 OK) :**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "slug": "salonhabitat",
    "displayName": "Salon de l'Habitat"
  },
  {
    "_id": "507f1f77bcf86cd799439021",
    "slug": "salonmoto",
    "displayName": "Salon de la Moto"
  }
]
```

---

#### `POST /campagnes`
Crée une nouvelle campagne.

**Body attendu :**
```json
{
  "slug": "salonauto",
  "displayName": "Salon de l'Automobile"
}
```

> **Note** : Le `slug` doit être unique, en minuscules, sans accents ni espaces (ex: "salondelhabitat" ou "salon-habitat")

**Réponse attendue (201 Created) :**
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "slug": "salonauto",
  "displayName": "Salon de l'Automobile"
}
```

**Erreurs possibles :**
- `400 Bad Request` : Slug déjà existant ou données invalides
- `500 Internal Server Error` : Erreur serveur

---

#### `DELETE /campagnes/:slug`
Supprime une campagne par son slug.

**Exemple d'appel :**
```
DELETE /campagnes/salonauto
```

**Réponse attendue (200 OK) :**
```json
{
  "message": "Campagne supprimée"
}
```

> **Note** : Supprimer une campagne ne supprime PAS les besoins associés. Les besoins gardent leur `context` mais la campagne n'apparaît plus dans la liste.

**Erreurs possibles :**
- `404 Not Found` : Campagne non trouvée
- `500 Internal Server Error` : Erreur serveur

---

### 3. Authentification (Optionnel)

Le frontend gère actuellement l'auth en local avec un simple mot de passe. Si tu veux ajouter une vraie auth backend :

#### `POST /auth/login`
Authentifie un administrateur.

**Body attendu :**
```json
{
  "password": "motdepasse123"
}
```

**Réponse attendue (200 OK) :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse erreur (401 Unauthorized) :**
```json
{
  "success": false,
  "message": "Mot de passe incorrect"
}
```

---

## 🔐 Headers Requis

Pour toutes les requêtes (si auth activée) :
```
Authorization: Bearer <token>
Content-Type: application/json
```

Pour les requêtes publiques (POST /besoins depuis le formulaire) :
```
Content-Type: application/json
```

---

## ⚠️ Points d'Attention

1. **Transformation des IDs** : MongoDB retourne `_id`, le frontend attend `id`. Le frontend peut gérer cette transformation.

2. **Format des dates** : Toujours en ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

3. **Champ `context`** : Optionnel. S'il n'est pas fourni, le besoin n'est associé à aucune campagne.

4. **CORS** : Le backend doit autoriser les requêtes depuis le domaine du frontend.

5. **Validation** : Le backend doit valider :
   - `nombreAffiches` ≥ 1
   - `nomAnnonceur`, `nomPrestataire`, `format`, `adresseLivraison` non vides
   - `slug` unique et au format valide (alphanumeric + tirets)

---

## 📋 Checklist Backend

- [ ] Ajouter champ `context` dans le schema Besoins
- [ ] Créer schema Campagne (slug, displayName)
- [ ] Créer route GET /campagnes
- [ ] Créer route POST /campagnes
- [ ] Créer route DELETE /campagnes/:slug
- [ ] Modifier GET /besoins pour supporter `?context=`
- [ ] Modifier DELETE /besoins pour supporter `?context=`
- [ ] Configurer CORS pour le frontend
- [ ] (Optionnel) Créer route POST /auth/login
