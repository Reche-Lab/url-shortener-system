FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build identity-service

# Expor porta
EXPOSE 3002

# Comando para iniciar
CMD ["node", "dist/apps/identity-service/main"]
