
<div id="haut-de-page"></div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/1e78fb76-f71f-4d7d-b101-0b829d6c3bd8" alt="Description de l'image">
  <p style="margin-top: 20px;">
    <a href="https://trello.com/b/K5sGUke5/dunktheodds-projet-session-cid" 
       target="_blank" 
       style="text-decoration: none; color: #0066cc; font-size: 18px; font-weight: bold;">
      Accéder au Trello de l'équipe
    </a>
  </p>
</div>

<h1 align="center"><i> Epreuve Finale </i></h1>
<h2 align="center">Remis par Team JSON 4</h2>
<h2 align="center">Cindy Bragdon</h2>
<h2 align="center">Olivier Poirier</h2>
<h2 align="center">Jenna-Lee Lecavalier</h2>
<h2 align="center">Nissia Lesline Gansaore</h2>
<p align="center">
  <a href="https://github.com/cindybragdon">
    <img src="https://github.com/cindybragdon.png?size=64" width="64" height="64" alt="Cindy" style="border-radius: 50%; overflow: hidden;">
  </a>
  <a href="https://github.com/olivierpoirier">
    <img src="https://github.com/olivierpoirier.png?size=64" width="64" height="64" alt="Olivier" style="border-radius: 50%; overflow: hidden;">
  </a>
  <a href="https://github.com/JennaLeeL">
    <img src="https://github.com/JennaLeeL.png?size=64" width="64" height="64" alt="Jenna" style="border-radius: 50%; overflow: hidden;">
  </a>
  <a href="https://github.com/NotaroNissia">
    <img src="https://github.com/NotaroNissia.png?size=64" width="64" height="64" alt="Nissia" style="border-radius: 50%; overflow: hidden;">
  </a>
</p>
<h2 align="center">Développement d'une API RESTful, modèle de prédiction de statistique propres aux paris sur le Basketball</h2>
<h2 align="center">Dans le cadre du cours Collecte et Interpretation de données 420-514-MV</h2>
<h2 align="center">Enseigné par Sara Boumehraz, Cégep Marie-Victorin</h2>


---

## :label: Table des matières

- [Contexte du travail](#contexte-du-travail)
- [Outils et Technologies utilises](#outils-et-technologies-utilises)
- [Installation et mise en route](#installation-et-mise-en-route)
- [Tests](#tests)
- [Etapes deploiement](#etapes-deploiement)
- [Documentation](#documentation)


---

## Contexte du travail
:mortar_board: <br>
Développement d’un service de collecte, traitement et Stockage de données avec une API RESTful.  Une entreprise technologique souhaite développer un système permettant de collecter, analyser et stocker des données provenant d’un objet connecté ou d’une api ouverte. Ces données sont ensuite exposées via une API RESTful, qui est consommée par une application Web ou mobile. Votre mission consiste à implémenter ce service complet en respectant les exigences fonctionnelles et techniques, tout en assurant la sécurité, la fiabilité et la maintenabilité de l’ensemble du système.

---

## Outils et Technologies utilises
:toolbox: <br>
<table>
  <tr>
    <td><img src="https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual-studio-code&logoColor=white"></td>
    <td><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"></td>
    <td><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"></td>
    <td><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white"></td>
    <td><img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black"></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"></td>
    <td><img src="https://img.shields.io/badge/Supertest-339933?style=for-the-badge&logo=node.js&logoColor=white"></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white"></td>
    <td><img src="https://img.shields.io/badge/HTTPS-005F83?style=for-the-badge&logo=lets-encrypt&logoColor=white"></td>
  </tr>
  <tr>
    <td><img src="https://img.shields.io/badge/Artillery-FF5A00?style=for-the-badge&logo=artillery&logoColor=white"></td>
  </tr>
</table>

---

## Installation et mise en route
:test_tube: <br>
## **Prérequis**  

1. **Node.js** : Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine (version LTS recommandée).  
2. **MongoDB** : Installez et configurez MongoDB ([guide officiel](https://www.mongodb.com/docs/manual/installation/)).  
3. **Git** : Assurez-vous que Git est installé ([téléchargement ici](https://git-scm.com/downloads)).  
4. **Postman** : (Facultatif) Utilisez Postman pour tester les endpoints de l'API.  

---

## **Étapes d'installation du backend**  

### 1. **Cloner le dépôt**  
Clonez le projet depuis le dépôt GitHub :  

```bash
git clone [https://github.com/nom-utilisateur/projet.git](https://github.com/cindybragdon/DUNKtheODDS_projet_session_collecte_interpretation_donnees.git)
cd votre_projet
```

### 2. **Configurer l'environnement** 
Assurez-vous d'avoir Node.js et npm installés sur votre machine. Vérifiez avec :
```bash
node -v
npm -v
```

Installez les dépendances nécessaires en suivant les catégories ci-dessous. 


### 3. Installation des dépendances de base :
Créez un fichier Config.ts (si non présent) et installez les dépendances :

```bash
npm install dotenv
npm i --save-dev @types/node
```

Installez Express et autres dépendances générales :
```bash
npm install express fs https
```

### 4. Documentation Swagger :
Ajoutez les outils pour générer la documentation Swagger :
```bash
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-jsdoc
```

### 5. Connexion à la base de données et gestion des données :
Installez les bibliothèques pour la base de données et les utilitaires :
```bash
npm install mongoose
npm install rxjs
npm install cors
```

### 6. Configuration du TypeScript et outils de développement :
```bash
npm install ts-node --save-dev
npm install ts-node-dev --save-dev
npm install -g ts-node
npm install typescript ts-node-dev @types/node @types/express --save-dev
npm install --save-dev cross-env
```

### 7. Gestion des logs :
Installez la bibliothèque pour la gestion des logs :
```bash
npm install winston
```

### 8.  Sécurité :
Ajoutez les bibliothèques pour la gestion des tokens et le hachage des mots de passe :
```bash
npm install jsonwebtoken bcryptjs
npm i --save-dev @types/jsonwebtoken @types/bcryptjs
```

### 9.  Sécurité :
Installez Jest et d'autres outils pour les tests unitaires et fonctionnels :
```bash
npm install --save-dev jest ts-jest @types/jest
npm install supertest --save-dev
npm i --save-dev @types/supertest
```

### 10.  Initialisation du projet TypeScript :
Si ce n’est pas encore fait, initialisez le projet TypeScript avec :
```bash
npx tsc --init
```

Configurez le fichier tsconfig.json selon vos besoins, par exemple :
```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### 11.  Démarrage et vérification :
Ajoutez un script dans le fichier package.json pour démarrer le backend :
```json
"scripts": {
  "start": "ts-node src/index.ts",
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc"
}
```
Lancez le projet en mode développement :

```bash
npm run dev
```

Vérifiez que tout fonctionne correctement en testant votre API.
Complètez avec le frontend ici =>  https://github.com/cindybragdon/DUNKtheODDS_projet_session_collecte_interpretation_donnees_FE.git



[🔝 Retour en haut](#haut-de-page)

