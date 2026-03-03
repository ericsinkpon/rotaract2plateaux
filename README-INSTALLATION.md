# Guide d'installation - Rotaract Club Abidjan Deux Plateaux

## Installation de la base de données

### 1. Créer la base de données

1. Ouvrez phpMyAdmin (http://localhost/phpMyAdmin)
2. Importez le fichier `database.sql` ou exécutez les commandes SQL suivantes :

```sql
-- Créer la base de données
CREATE DATABASE IF NOT EXISTS rotaract_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE rotaract_db;

-- Puis exécutez le reste du fichier database.sql
```

### 2. Configurer la connexion

Modifiez le fichier `config/database.php` si nécessaire :
- `DB_HOST` : généralement 'localhost'
- `DB_USER` : votre utilisateur MySQL (par défaut 'root' pour MAMP)
- `DB_PASS` : votre mot de passe MySQL (par défaut 'root' pour MAMP)
- `DB_NAME` : 'rotaract_db'

### 3. Initialiser l'administrateur

Accédez à `init-admin.php` dans votre navigateur :
- URL : http://localhost/RTC/init-admin.php
- Cela créera l'administrateur par défaut :
  - Username : `admin`
  - Password : `admin123`

**Important :** Changez le mot de passe après la première connexion !

## Utilisation

### Accès à l'administration

1. Accédez à `admin.html` dans votre navigateur
2. Connectez-vous avec :
   - Username : `admin`
   - Password : `admin123`

### Fonctionnalités

- **Onglet Actions** : Gérer les actions d'intérêt public
- **Onglet Actualités** : Gérer les actualités du club
- **Onglet Événements** : Gérer les événements à venir

### Pages publiques

Les pages suivantes affichent automatiquement les données depuis la base de données :
- `index.html` : Page d'accueil avec sections dynamiques
- `actions.html` : Liste de toutes les actions
- `actualites.html` : Liste de toutes les actualités

## Structure de la base de données

### Table `admins`
- Gestion des administrateurs

### Table `actions`
- Actions d'intérêt public du club
- Champs : titre, description, image, date_activite, montants, catégorie

### Table `actualites`
- Actualités et nouvelles du club
- Champs : titre, description, contenu, image, date_publication, catégorie, auteur

### Table `evenements`
- Événements à venir
- Champs : titre, description, image, date_evenement, heure, lieu

## Notes importantes

- Les données sont stockées dans MySQL (plus robuste que localStorage)
- L'authentification utilise des sessions PHP
- Les mots de passe sont hashés avec `password_hash()`
- Les API sont protégées (seuls les admins authentifiés peuvent modifier)

