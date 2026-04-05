FROM node:18

# Installation des outils de compilation pour SQLite
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Installation des dépendances backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install && npm rebuild better-sqlite3

# Copie de tout le projet
WORKDIR /app
COPY . .

# Lancement
WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "server.js"]
