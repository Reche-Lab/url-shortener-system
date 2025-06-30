FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build url-shortener-service

# Expor porta
EXPOSE 3001

# Comando para iniciar
CMD ["node", "dist/apps/url-shortener-service/main"]
