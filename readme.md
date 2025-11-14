Prerequis
Node.js installe
MongoDB demarre et accessible sur localhost:27017
port 3000 disponible

Installer les dependances :
npm install

Verifier que le fichier .env existe avec les variables suivantes :
PORT=3000
MONGODB_URI=mongodb://localhost:27017/oktogone_articles
JWT_SECRET=mon_super_secret_token
NODE_ENV=development

Lancer l'application :
npm run serve
Ou en mode production 
npm run dev
l'application sera accessible sur http://localhost:3000
tests unitaires :
npm test
pm2 start ecosystem.config.js
Endpoints :
Users
POST /api/users/register - Creer un utilisateur (public)
POST /login - Se connecter (public
GET /api/users - Liste des utilisateurs
GET /api/users/:id - Details d'un utilisateur
GET /api/users/:userId/articles - articles d'un utilisateur 
PUT /api/users/:id - Modifier un utilisateur
DELETE /api/users/:id - Supprimer un utilisateur
Articles
POST /api/articles - Creer un article (authentification requise)
PUT /api/articles/:id - Modifier un article (admin seulement)
DELETE /api/articles/:id - suprimer un article (admin seulement)

erreur ERR_SERVER_ALREADY_LISTEN :le bug a ete corrige dans server.js

