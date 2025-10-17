# Dockerfile para producción de React con Node
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar aplicación
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
