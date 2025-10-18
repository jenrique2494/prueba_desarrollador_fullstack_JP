# Dockerfile para desarrollo de React
FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Copiar código fuente
COPY . .

# Instalar dependencias
RUN npm install

# Exponer puerto de desarrollo
EXPOSE 3000

# Ejecutar en modo desarrollo
CMD ["npm", "start"]
