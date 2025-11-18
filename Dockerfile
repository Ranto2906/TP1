# Exemple de Dockerfile pour Node.js (Express)
# Adapter selon votre technologie (Python/Flask, Java/Spring, PHP, etc.)

FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]


# ===============================================
# Pour Python/Flask, utiliser plutôt :
# ===============================================
# FROM python:3.11-slim
#
# WORKDIR /app
#
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
#
# COPY . .
#
# EXPOSE 5000
#
# CMD ["python", "app.py"]


# ===============================================
# Pour Java/Spring Boot, utiliser plutôt :
# ===============================================
# FROM openjdk:17-slim
#
# WORKDIR /app
#
# COPY target/*.jar app.jar
#
# EXPOSE 8080
#
# ENTRYPOINT ["java", "-jar", "app.jar"]
