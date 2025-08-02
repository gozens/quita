

# 🌍 Quita - Plateforme interactive pour le tourisme local

Quita est une application web dédiée à la promotion du tourisme à travers une présentation enrichie des régions, villes, communes et personnalités locales. Les utilisateurs peuvent consulter des articles, interagir avec eux via des likes et commentaires (sans obligation de connexion), et tester leurs connaissances à travers des quiz ludiques sur leur région.

## 🚀 Technologies utilisées

* **Back-end** : Laravel (API RESTful)
* **Front-end** : React.js avec Inertia.js
* **Base de données** : MySQL / PostgreSQL
* **Authentification** : Sanctum ou JWT (optionnel pour les commentaires)
* **Quiz** : Gestion de QCM (questions à choix multiples)
* **Autres** : TailwindCSS, Vite, Eloquent ORM

---

## 📌 Objectifs du projet

* Mettre en valeur le patrimoine culturel et touristique.
* Créer un lien entre lieux et figures emblématiques.
* Offrir une expérience interactive avec des quiz.
* Permettre l’interaction libre des utilisateurs avec les contenus (sans obligation d’inscription).

---

## 🧠 Fonctionnalités principales

* 📝 **Articles** : rédigés par l’administration et liés à des personnalités, villes, communes, etc.
* 💬 **Commentaires** : libres d’accès, sans besoin de connexion.
* ❤️ **Likes** : disponibles pour chaque article, (uniquement pour lus utilisateur inscrit ).
* 🧪 **Quiz** : pour tester sa connaissance d’une ville, d’une région ou d’une personnalité.
* 🔎 **Navigation filtrée** : par pays, ville, région, commune, etc.

---

## 🗃️ Structure de la base de données

Voici un schéma ultra-détaillé :

### 🌍 Pays (`countries`)

| Champ       | Type       | Description              |
| ----------- | ---------- | ------------------------ |
| id          | UUID / int | Identifiant unique       |
| name        | string     | Nom du pays              |
| population  | integer    | Population estimée       |
| language    | string     | Langue(s) parlée(s)      |
| currency    | string     | Monnaie locale           |
| continent   | string     | Continent du pays        |
| timezone    | string     | Fuseau horaire principal |
| created\_at | timestamp  | Date de création         |
| updated\_at | timestamp  | Date de mise à jour      |

---

### 🏙️ Région (`regions`)

| Champ       | Type        | Description                    |
| ----------- | ----------- | ------------------------------ |
| id          | UUID / int  | Identifiant unique             |
| name        | string      | Nom de la région               |
| country\_id | foreign key | Clé étrangère vers `countries` |
| created\_at | timestamp   | Date de création               |
| updated\_at | timestamp   | Date de mise à jour            |

---

### 🏘️ Ville (`cities`)

| Champ       | Type        | Description                  |
| ----------- | ----------- | ---------------------------- |
| id          | UUID / int  | Identifiant unique           |
| name        | string      | Nom de la ville              |
| population  | integer     | Population estimée           |
| region\_id  | foreign key | Clé étrangère vers `regions` |
| created\_at | timestamp   | Date de création             |
| updated\_at | timestamp   | Date de mise à jour          |

---

### 🏡 Commune (`communes`)

| Champ       | Type        | Description                 |
| ----------- | ----------- | --------------------------- |
| id          | UUID / int  | Identifiant unique          |
| name        | string      | Nom de la commune           |
| city\_id    | foreign key | Clé étrangère vers `cities` |
| created\_at | timestamp   | Date de création            |
| updated\_at | timestamp   | Date de mise à jour         |

---

### 👤 Personnalité (`personalities`)

| Champ       | Type        | Description                               |
| ----------- | ----------- | ----------------------------------------- |
| id          | UUID / int  | Identifiant unique                        |
| first\_name | string      | Prénom                                    |
| last\_name  | string      | Nom de famille                            |
| nickname    | string      | Surnom ou nom connu                       |
| type        | string      | Rôle (maire, chef de village, artiste...) |
| biography   | text        | Brève biographie                          |
| birth\_date | date        | Date de naissance                         |
| city\_id    | foreign key | Ville d’origine ou associée               |
| created\_at | timestamp   | Date de création                          |
| updated\_at | timestamp   | Date de mise à jour                       |

---

### 📰 Article (`articles`)

| Champ         | Type       | Description         |
| ------------- | ---------- | ------------------- |
| id            | UUID / int | Identifiant unique  |
| title         | string     | Titre de l’article  |
| content       | text       | Contenu complet     |
| image\_url    | string     | Image de couverture |
| published\_at | datetime   | Date de publication |
| slug          | string     | URL friendly        |
| created\_at   | timestamp  | Date de création    |
| updated\_at   | timestamp  | Date de mise à jour |

#### Liens d'association (relations many-to-many) :

* `article_personality` (article\_id, personality\_id)
* `article_city` (article\_id, city\_id)
* `article_commune` (article\_id, commune\_id)

---

### ❤️ Like (`likes`)

| Champ       | Type        | Description                 |
| ----------- | ----------- | --------------------------- |
| id          | UUID / int  | Identifiant unique          |
| article | foreign key | Article liké                |
| user\_id | string      |  ID de l’utilisateur |
| created\_at | timestamp   | Date du like                |

---

### 💬 Commentaire (`comments`)

| Champ       | Type        | Description                       |
| ----------- | ----------- | --------------------------------- |
| id          | UUID / int  | Identifiant unique                |
| article\_id | foreign key | Article concerné                  |
| pseudo      | string      | Nom/pseudo libre de l’utilisateur |
| content     | text        | Contenu du commentaire            |
| ip\_address | string      | Adresse IP (modération possible)  |
| user\_id | string      |  ID de l’utilisateur |
| created\_at | timestamp   | Date du commentaire               |

---

### ❓ Quiz (`quizzes`)

| Champ       | Type        | Description        |
| ----------- | ----------- | ------------------ |
| id          | UUID / int  | Identifiant unique |
| title       | string      | Titre du quiz      |
| city\_id    | foreign key | Ville concernée    |
| created\_at | timestamp   | Date de création   |

### ✅ Questions (`quiz_questions`)

| Champ    | Type        | Description                  |
| -------- | ----------- | ---------------------------- |
| id       | UUID / int  | Identifiant unique           |
| quiz\_id | foreign key | Clé étrangère vers `quizzes` |
| question | text        | Contenu de la question       |

### 📌 Réponses (`quiz_answers`)

| Champ        | Type        | Description                         |
| ------------ | ----------- | ----------------------------------- |
| id           | UUID / int  | Identifiant unique                  |
| question\_id | foreign key | Clé étrangère vers `quiz_questions` |
| answer       | string      | Proposition de réponse              |
| is\_correct  | boolean     | Si la réponse est correcte ou non   |

---

## ⚠️ Contraintes et défis à anticiper

### Techniques

* **Commentaires anonymes** : éviter le spam via une stratégie d’IP + CAPTCHA.
* **Relation multiple** : certains articles peuvent être liés à plusieurs entités (villes, personnalités, communes).
* **Performances** : jointures complexes avec relations `many-to-many` nécessitent des index bien pensés.
* **Pagination / Lazy loading** : pour articles et commentaires afin de maintenir les performances.
* **Sécurité** : modération obligatoire pour les commentaires publics (filtrage des mots-clés, signalement).

### UX / Produit

* **Adaptabilité mobile** : responsive design indispensable.
* **Quiz attractifs** : design visuel soigné pour encourager la participation.
* **Contenu dynamique** : SEO friendly avec génération de `slug`, meta title, etc.

---

## ✅ Améliorations futures possibles

* 🔐 Ajout d’un espace membre (pour commenter, créer des quiz, etc.).
* 🧭 Géolocalisation des villes/personnalités.
* 🧠 Statistiques sur la participation aux quiz.
* 📸 Galerie photo ou vidéos touristiques.
* 🌐 Multilingue : ajout de la traduction automatique ou manuelle.

---

## 🏁 Lancer le projet en local

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/quita.git
cd quita

# Installer le backend Laravel
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed