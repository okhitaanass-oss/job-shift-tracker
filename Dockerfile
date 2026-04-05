FROM node:18

# 1. Installation des outils de compilation pour SQLite
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. On prépare le dossier backend séparément
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# 3. On copie le reste du code SANS écraser les modules
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# 4. Lancement depuis le bon dossier
WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "server.js"]
