-- Base de données pour le Rotaract Club Abidjan Deux Plateaux
-- Créer la base de données
CREATE DATABASE IF NOT EXISTS rotaract_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rotaract_db;

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des actions
CREATE TABLE IF NOT EXISTS actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    date_activite DATE NOT NULL,    
    montant_collecte DECIMAL(15, 2) DEFAULT 0,
    montant_objectif DECIMAL(15, 2) DEFAULT 0,
    categorie VARCHAR(100),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date_activite (date_activite),
    INDEX idx_categorie (categorie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des actualités
CREATE TABLE IF NOT EXISTS actualites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contenu TEXT,
    image VARCHAR(500) NOT NULL,
    date_publication DATE NOT NULL,
    categorie VARCHAR(100),
    auteur VARCHAR(255) DEFAULT 'Par le Club',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date_publication (date_publication),
    INDEX idx_categorie (categorie)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des événements
CREATE TABLE IF NOT EXISTS evenements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    date_evenement DATE NOT NULL,
    heure TIME,
    lieu VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date_evenement (date_evenement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: L'administrateur sera créé via init-admin.php
-- Le mot de passe par défaut sera 'admin123' (hashé avec password_hash PHP)
-- Exécutez init-admin.php après avoir créé la base de données

