FROM oven/bun:latest

WORKDIR /app

# Installer les dépendances système si nécessaires
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     python3 \
#     make \
#     g++ \
#     && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de dépendances
COPY package.json bun.lock ./

# Installer les dépendances avec Bun
RUN bun install --frozen-lockfile

# Copier le reste des fichiers
COPY . .

# Build de l'application
RUN bun run build

# Exposer le port de l'application
EXPOSE 3000

# Commande de démarrage
CMD ["bun", "run", "start"]
