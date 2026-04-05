# Étape 1 : Build du Frontend
FROM node:18-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ .
# Pas de build nécessaire pour du HTML pur, mais on prépare la structure

# Étape 2 : Build du Backend et Image Finale
FROM node:18-slim
WORKDIR /app

# Installation des outils système nécessaires pour SQLite
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copie des fichiers backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copie du reste du code
COPY backend/ . /app/backend/
COPY --from=frontend-builder /app/frontend /app/frontend

# Exposition des ports (5000 pour l'API/Socket)
EXPOSE 5000

# Commande de lancement
CMD ["node", "server.js"]
