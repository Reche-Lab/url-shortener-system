# 🔗 URL Shortener System

<div align="center">

![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)
![NestJS](https://img.shields.io/badge/nestjs-%5E10.0.0-red.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%5E15.0-blue.svg)
![Docker](https://img.shields.io/badge/docker-%5E24.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Sistema completo de encurtamento de URLs com arquitetura de microserviços, autenticação JWT e multi-tenancy**

[Documentação da API](#-documentação-da-api) • [Instalação](#-instalação) • [Uso](#-uso) • [Arquitetura](#-arquitetura) • [Contribuição](#-contribuição)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Desenvolvimento](#-desenvolvimento)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O **URL Shortener System** é uma solução empresarial completa para encurtamento de URLs, desenvolvida com arquitetura de microserviços usando NestJS, TypeScript e PostgreSQL. O sistema oferece funcionalidades avançadas como autenticação JWT, multi-tenancy, análise de cliques e relatórios detalhados.

Este projeto foi desenvolvido seguindo as melhores práticas de desenvolvimento de software, incluindo Test-Driven Development (TDD), Clean Architecture, SOLID principles e containerização com Docker.

### 🎯 Objetivos do Projeto

O sistema foi projetado para atender às necessidades de empresas que precisam de uma solução robusta e escalável para gerenciamento de URLs encurtadas, oferecendo:

- **Escalabilidade**: Arquitetura de microserviços permite escalonamento independente de cada componente
- **Segurança**: Autenticação JWT robusta com controle de acesso baseado em roles
- **Multi-tenancy**: Isolamento completo de dados entre diferentes organizações
- **Observabilidade**: Rastreamento detalhado de cliques e análise de comportamento
- **Facilidade de Deploy**: Containerização completa com Docker Compose

---

## ✨ Características

### 🔐 Sistema de Autenticação
- **Registro e Login**: Cadastro seguro de usuários com validação de email
- **JWT Tokens**: Autenticação stateless com tokens JWT seguros
- **Controle de Acesso**: Sistema de roles (user, admin, super-admin)
- **Proteção de Rotas**: Guards automáticos para endpoints protegidos

### 🏢 Multi-Tenancy
- **Isolamento de Dados**: Separação completa entre diferentes organizações
- **Gestão de Tenants**: Administração centralizada de inquilinos
- **Controle Granular**: Permissões específicas por tenant e usuário

### 🔗 Encurtamento de URLs
- **Algoritmo Otimizado**: Geração eficiente de códigos curtos únicos
- **URLs Personalizadas**: Suporte a códigos customizados (futuro)
- **Validação Robusta**: Verificação completa de URLs de destino
- **Redirecionamento Rápido**: Performance otimizada para redirecionamentos

### 📊 Análise e Relatórios
- **Rastreamento de Cliques**: Captura detalhada de cada acesso
- **Geolocalização**: Identificação de país e cidade dos visitantes
- **Análise de Dispositivos**: Detecção de user agents e dispositivos
- **Relatórios Temporais**: Análise por períodos customizáveis

### 🐳 Containerização
- **Docker Compose**: Orquestração completa do ambiente
- **Ambiente Isolado**: Containers independentes para cada serviço
- **Configuração Simplificada**: Setup com um único comando
- **Escalabilidade Horizontal**: Preparado para múltiplas instâncias

---


## 🛠️ Tecnologias

### Backend Framework
- **[NestJS](https://nestjs.com/)** `^10.0.0` - Framework Node.js progressivo para aplicações server-side escaláveis
- **[TypeScript](https://www.typescriptlang.org/)** `^5.0.0` - Superset tipado do JavaScript
- **[Node.js](https://nodejs.org/)** `>=18.0.0` - Runtime JavaScript assíncrono orientado a eventos

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** `^15.0` - Sistema de gerenciamento de banco de dados relacional avançado
- **[TypeORM](https://typeorm.io/)** `^0.3.0` - ORM para TypeScript e JavaScript

### Autenticação e Segurança
- **[Passport.js](http://www.passportjs.org/)** - Middleware de autenticação para Node.js
- **[JWT](https://jwt.io/)** - JSON Web Tokens para autenticação stateless
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Biblioteca para hash de senhas

### Validação e Documentação
- **[class-validator](https://github.com/typestack/class-validator)** - Validação baseada em decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação automática de APIs

### Containerização e Deploy
- **[Docker](https://www.docker.com/)** `^24.0.0` - Plataforma de containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de múltiplos containers

### Desenvolvimento e Testes
- **[Jest](https://jestjs.io/)** - Framework de testes JavaScript
- **[ESLint](https://eslint.org/)** - Linter para identificação de padrões problemáticos
- **[Prettier](https://prettier.io/)** - Formatador de código opinativo

---

## 🏗️ Arquitetura

### Visão Geral da Arquitetura

O sistema utiliza uma arquitetura de microserviços bem definida, onde cada serviço tem responsabilidades específicas e se comunica através de APIs REST bem documentadas.

```
┌─────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER                            │
│                   (Nginx/Traefik)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
              ┌───────┴───────┐
              │               │
    ┌─────────▼─────────┐   ┌─▼──────────────────┐
    │  Identity Service │   │ URL Shortener      │
    │     (Port 3002)   │   │    Service         │
    │                   │   │   (Port 3001)      │
    │ • Authentication  │   │ • URL Shortening   │
    │ • User Management │   │ • Click Tracking   │
    │ • JWT Generation  │   │ • Analytics        │
    │ • Role Management │   │ • Redirects        │
    └─────────┬─────────┘   └─┬──────────────────┘
              │               │
              └───────┬───────┘
                      │
            ┌─────────▼─────────┐
            │   PostgreSQL      │
            │   Database        │
            │                   │
            │ • Users Table     │
            │ • URLs Table      │
            │ • Click Events    │
            │ • Tenants Table   │
            └───────────────────┘
```

### Microserviços

#### 1. Identity Service (Porta 3002)
Responsável por toda a gestão de identidade e autenticação no sistema.

**Responsabilidades:**
- Registro e autenticação de usuários
- Geração e validação de tokens JWT
- Gerenciamento de roles e permissões
- Controle de acesso multi-tenant
- Validação de sessões ativas

**Endpoints Principais:**
- `POST /auth/register` - Cadastro de novos usuários
- `POST /auth/login` - Autenticação e geração de token
- `GET /auth/profile` - Obtenção do perfil do usuário autenticado

#### 2. URL Shortener Service (Porta 3001)
Serviço principal responsável pelo encurtamento de URLs e análise de cliques.

**Responsabilidades:**
- Encurtamento de URLs com algoritmo otimizado
- Redirecionamento rápido e confiável
- Rastreamento detalhado de cliques
- Geração de relatórios e analytics
- Gestão de URLs por tenant e usuário

**Endpoints Principais:**
- `POST /shorten` - Encurtamento de URLs
- `GET /:shortCode` - Redirecionamento para URL original
- `GET /analytics/:shortCode` - Estatísticas de uma URL específica
- `GET /my-urls` - URLs do usuário autenticado

### Modelo de Dados

#### Entidade User (Identity Service)
```typescript
{
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  roles: string[] (user, admin, super-admin)
  tenantId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

#### Entidade URL (URL Shortener Service)
```typescript
{
  id: string (UUID)
  shortCode: string (unique)
  originalUrl: string
  tenantId: string
  userId: string
  clickCount: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

#### Entidade ClickEvent (URL Shortener Service)
```typescript
{
  id: string (UUID)
  urlId: string
  ipAddress: string
  userAgent: string
  referer: string
  country: string
  city: string
  clickedAt: Date
}
```

### Fluxo de Autenticação

1. **Registro**: Usuário se cadastra via Identity Service
2. **Login**: Credenciais são validadas e JWT é gerado
3. **Autorização**: JWT é incluído no header das requisições
4. **Validação**: Cada serviço valida o JWT independentemente
5. **Acesso**: Recursos são liberados baseados nas permissões

### Estratégia Multi-Tenant

O sistema implementa multi-tenancy através de isolamento por tenant ID, garantindo que:
- Cada usuário pertence a um tenant específico
- URLs são isoladas por tenant
- Relatórios respeitam os limites do tenant
- Administradores só acessam dados do seu tenant

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

### Requisitos Obrigatórios

- **Node.js** `>=18.0.0` - [Download](https://nodejs.org/)
- **npm** `>=8.0.0` (incluído com Node.js)
- **Docker** `>=24.0.0` - [Download](https://www.docker.com/get-started)
- **Docker Compose** `>=2.0.0` (incluído com Docker Desktop)
- **Git** - [Download](https://git-scm.com/)

### Verificação dos Pré-requisitos

Execute os comandos abaixo para verificar se todas as dependências estão instaladas corretamente:

```bash
# Verificar Node.js
node --version
# Deve retornar v18.x.x ou superior

# Verificar npm
npm --version
# Deve retornar 8.x.x ou superior

# Verificar Docker
docker --version
# Deve retornar 24.x.x ou superior

# Verificar Docker Compose
docker compose version
# Deve retornar 2.x.x ou superior

# Verificar Git
git --version
# Deve retornar 2.x.x ou superior
```

### Recursos do Sistema

**Mínimos:**
- RAM: 4GB
- Armazenamento: 2GB livres
- CPU: 2 cores

**Recomendados:**
- RAM: 8GB ou mais
- Armazenamento: 5GB livres
- CPU: 4 cores ou mais

---

## 🚀 Instalação

### Método 1: Instalação Completa com Docker (Recomendado)

Este é o método mais simples e recomendado para executar o projeto completo.

#### Passo 1: Clonar o Repositório

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/url-shortener-system.git

# Navegar para o diretório
cd url-shortener-system
```

#### Passo 2: Configurar Variáveis de Ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar as variáveis conforme necessário
nano .env  # ou use seu editor preferido
```

#### Passo 3: Instalar Dependências

```bash
# Instalar todas as dependências
npm install
```

#### Passo 4: Executar o Sistema

```bash
# Subir todos os serviços com Docker
npm run docker:up

# Aguardar alguns segundos para inicialização completa
# Os serviços estarão disponíveis em:
# - Identity Service: http://localhost:3002
# - URL Shortener Service: http://localhost:3001
# - PostgreSQL: localhost:5432
```

#### Passo 5: Verificar a Instalação

```bash
# Verificar se todos os containers estão rodando
docker ps

# Deve mostrar 3 containers:
# - url-shortener-db (PostgreSQL)
# - identity-service
# - url-shortener-service

# Testar os serviços
curl http://localhost:3002/auth/register
curl http://localhost:3001/health
```

### Método 2: Desenvolvimento Local

Para desenvolvimento ativo, você pode executar os serviços localmente.

#### Passo 1-3: Seguir os mesmos passos do Método 1

#### Passo 4: Subir apenas o Banco de Dados

```bash
# Subir apenas o PostgreSQL
docker compose up postgres -d
```

#### Passo 5: Executar os Serviços Localmente

```bash
# Terminal 1 - Identity Service
npm run start:identity:dev

# Terminal 2 - URL Shortener Service
npm run start:url-shortener:dev
```

---


## ⚙️ Configuração

### Variáveis de Ambiente

O sistema utiliza variáveis de ambiente para configuração. Todas as variáveis estão documentadas no arquivo `.env.example`.

#### Configurações Essenciais

| Variável | Descrição | Valor Padrão | Obrigatório |
|----------|-----------|--------------|-------------|
| `DB_HOST` | Host do banco PostgreSQL | `localhost` | ✅ |
| `DB_PORT` | Porta do banco PostgreSQL | `5432` | ✅ |
| `DB_USERNAME` | Usuário do banco | `user` | ✅ |
| `DB_PASSWORD` | Senha do banco | `password` | ✅ |
| `DB_DATABASE` | Nome do banco | `url_shortener_db` | ✅ |
| `JWT_SECRET` | Chave secreta para JWT | - | ✅ |
| `JWT_EXPIRES_IN` | Tempo de expiração do JWT | `7d` | ❌ |
| `NODE_ENV` | Ambiente de execução | `development` | ❌ |

#### Configurações de Serviços

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `URL_SHORTENER_PORT` | Porta do serviço de URLs | `3001` |
| `IDENTITY_SERVICE_PORT` | Porta do serviço de identidade | `3002` |
| `TYPEORM_SYNCHRONIZE` | Sincronização automática do banco | `true` |
| `TYPEORM_LOGGING` | Logs do TypeORM | `true` |
| `BCRYPT_ROUNDS` | Rounds do bcrypt para hash | `10` |

### Configuração de Produção

Para ambiente de produção, certifique-se de:

1. **Alterar o JWT_SECRET**: Use uma chave forte e única
2. **Configurar TYPEORM_SYNCHRONIZE=false**: Evita alterações automáticas no schema
3. **Configurar NODE_ENV=production**: Otimiza performance
4. **Usar HTTPS**: Configure SSL/TLS para comunicação segura
5. **Configurar Rate Limiting**: Implemente limitação de requisições

```bash
# Exemplo de configuração de produção
JWT_SECRET=sua-chave-super-secreta-de-256-bits-aqui
NODE_ENV=production
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=false
```

---

## 📖 Uso

### Fluxo Básico de Uso

#### 1. Registro de Usuário

```bash
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "minhasenha123"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 604800,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@exemplo.com",
    "roles": ["user"],
    "tenantId": "default-tenant"
  }
}
```

#### 2. Login

```bash
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "password": "minhasenha123"
  }'
```

#### 3. Encurtar URL

```bash
curl -X POST http://localhost:3001/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "originalUrl": "https://www.exemplo.com/pagina-muito-longa"
  }'
```

**Resposta:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "shortCode": "abc123",
  "originalUrl": "https://www.exemplo.com/pagina-muito-longa",
  "shortUrl": "http://localhost:3001/abc123",
  "clickCount": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 4. Acessar URL Encurtada

```bash
# Redirecionamento automático
curl -L http://localhost:3001/abc123

# Ou apenas verificar o redirecionamento
curl -I http://localhost:3001/abc123
```

#### 5. Obter Perfil do Usuário

```bash
curl -X GET http://localhost:3002/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Casos de Uso Avançados

#### Listar URLs do Usuário

```bash
curl -X GET http://localhost:3001/my-urls \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### Obter Analytics de uma URL

```bash
curl -X GET http://localhost:3001/analytics/abc123 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

#### Gerenciamento de Usuários (Admin)

```bash
# Listar usuários do tenant (apenas admins)
curl -X GET http://localhost:3002/users \
  -H "Authorization: Bearer TOKEN_ADMIN_AQUI"
```

---

## 📚 Documentação da API

### Swagger/OpenAPI

O sistema inclui documentação interativa completa usando Swagger/OpenAPI 3.0. Após executar o sistema, acesse:

- **Identity Service**: [http://localhost:3002/api-docs](http://localhost:3002/api-docs)
- **URL Shortener Service**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### Endpoints Principais

#### Identity Service (Porta 3002)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/auth/register` | Cadastrar novo usuário | ❌ |
| `POST` | `/auth/login` | Fazer login | ❌ |
| `GET` | `/auth/profile` | Obter perfil do usuário | ✅ |

#### URL Shortener Service (Porta 3001)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| `POST` | `/shorten` | Encurtar URL | ✅ |
| `GET` | `/:shortCode` | Redirecionamento | ❌ |
| `GET` | `/my-urls` | Listar URLs do usuário | ✅ |
| `GET` | `/analytics/:shortCode` | Analytics da URL | ✅ |

### Códigos de Status HTTP

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| `200` | OK | Requisição bem-sucedida |
| `201` | Created | Recurso criado com sucesso |
| `301` | Moved Permanently | Redirecionamento de URL |
| `400` | Bad Request | Dados de entrada inválidos |
| `401` | Unauthorized | Token JWT inválido ou ausente |
| `403` | Forbidden | Sem permissão para o recurso |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito (ex: email já existe) |
| `500` | Internal Server Error | Erro interno do servidor |

### Autenticação JWT

O sistema utiliza JWT (JSON Web Tokens) para autenticação. Após o login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Estrutura do Token JWT

```json
{
  "sub": "user-id",
  "email": "usuario@exemplo.com",
  "roles": ["user"],
  "tenantId": "tenant-id",
  "iat": 1640995200,
  "exp": 1641600000
}
```

### Tratamento de Erros

Todos os erros seguem um formato padronizado:

```json
{
  "statusCode": 400,
  "message": "Descrição do erro ou array de erros de validação",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/register"
}
```

---

## 📁 Estrutura do Projeto

```
url-shortener-system/
├── apps/                           # Microserviços
│   ├── identity-service/           # Serviço de autenticação
│   │   ├── src/
│   │   │   ├── auth/              # Módulo de autenticação
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── dto/               # Data Transfer Objects
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   ├── entities/          # Entidades do banco
│   │   │   │   └── user.entity.ts
│   │   │   ├── identity-service.module.ts
│   │   │   └── main.ts
│   │   ├── test/                  # Testes
│   │   ├── Dockerfile
│   │   └── tsconfig.app.json
│   │
│   └── url-shortener-service/     # Serviço principal
│       ├── src/
│       │   ├── url/               # Módulo de URLs
│       │   │   ├── entities/
│       │   │   │   ├── url.entity.ts
│       │   │   │   ├── click-event.entity.ts
│       │   │   │   └── tenant.entity.ts
│       │   │   ├── services/
│       │   │   │   └── short-code.service.ts
│       │   │   ├── url.controller.ts
│       │   │   ├── url.service.ts
│       │   │   └── url.module.ts
│       │   ├── url-shortener-service.module.ts
│       │   └── main.ts
│       ├── test/
│       ├── Dockerfile
│       └── tsconfig.app.json
│
├── dist/                          # Arquivos compilados
├── node_modules/                  # Dependências
├── .env.example                   # Exemplo de variáveis de ambiente
├── .gitignore                     # Arquivos ignorados pelo Git
├── docker-compose.yml             # Orquestração Docker
├── nest-cli.json                  # Configuração do NestJS CLI
├── package.json                   # Dependências e scripts
├── README.md                      # Este arquivo
├── ROADMAP.md                     # Roadmap do projeto
└── tsconfig.json                  # Configuração TypeScript
```

### Descrição dos Diretórios

- **`apps/`**: Contém todos os microserviços do sistema
- **`apps/identity-service/`**: Serviço responsável por autenticação e gestão de usuários
- **`apps/url-shortener-service/`**: Serviço principal para encurtamento de URLs
- **`dist/`**: Código TypeScript compilado para JavaScript
- **`test/`**: Testes unitários e de integração

---

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:identity:dev          # Identity Service em modo watch
npm run start:url-shortener:dev     # URL Shortener Service em modo watch

# Build
npm run build                       # Build de todos os serviços
npm run build identity-service      # Build específico do Identity Service
npm run build url-shortener-service # Build específico do URL Shortener

# Testes
npm run test                        # Executar todos os testes
npm run test:watch                  # Testes em modo watch
npm run test:cov                    # Testes com coverage

# Linting e Formatação
npm run lint                        # Verificar problemas de código
npm run format                      # Formatar código com Prettier

# Docker
npm run docker:up                   # Subir todos os serviços
npm run docker:down                 # Parar todos os serviços
npm run docker:build               # Build das imagens Docker
npm run docker:logs                # Ver logs dos containers
```

### Configuração do Ambiente de Desenvolvimento

#### 1. Configurar IDE

**VS Code (Recomendado):**
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**Extensões Recomendadas:**
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Docker
- Thunder Client (para testes de API)

#### 2. Configurar Git Hooks

```bash
# Instalar husky para git hooks
npm install --save-dev husky

# Configurar pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"
```

#### 3. Debugging

**VS Code Launch Configuration:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Identity Service",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/dist/apps/identity-service/main.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Padrões de Código

#### Estrutura de Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

**Exemplos:**
```bash
feat(auth): add JWT token refresh functionality
fix(url): resolve short code generation collision
docs: update API documentation for v0.3.0
test(identity): add unit tests for AuthService
```

#### Padrões de Nomenclatura

- **Arquivos**: kebab-case (`user.service.ts`)
- **Classes**: PascalCase (`UserService`)
- **Métodos/Variáveis**: camelCase (`getUserById`)
- **Constantes**: UPPER_SNAKE_CASE (`JWT_SECRET`)
- **Interfaces**: PascalCase com prefixo I (`IUserRepository`)

---


## 🧪 Testes

O projeto segue a metodologia Test-Driven Development (TDD) com cobertura abrangente de testes.

### Tipos de Testes

#### Testes Unitários
Testam componentes isolados como services, controllers e utilities.

```bash
# Executar todos os testes unitários
npm run test

# Executar testes de um serviço específico
npm run test -- --testPathPattern=identity-service

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:cov
```

#### Testes de Integração
Testam a integração entre diferentes componentes e serviços.

```bash
# Executar testes e2e
npm run test:e2e

# Testes e2e para serviço específico
npm run test:e2e -- --testPathPattern=identity-service
```

### Estrutura de Testes

```
apps/identity-service/
├── src/
│   ├── auth/
│   │   ├── auth.service.spec.ts      # Testes unitários do AuthService
│   │   ├── auth.controller.spec.ts   # Testes unitários do AuthController
│   │   └── jwt.strategy.spec.ts      # Testes da estratégia JWT
│   └── entities/
│       └── user.entity.spec.ts       # Testes da entidade User
└── test/
    └── app.e2e-spec.ts               # Testes end-to-end
```

### Cobertura de Testes

O projeto mantém uma cobertura mínima de **80%** em:
- Statements
- Branches
- Functions
- Lines

### Executando Testes com Docker

```bash
# Executar testes em ambiente containerizado
docker compose -f docker-compose.test.yml up --build

# Executar testes específicos
docker compose exec identity-service npm run test
```

### Mocks e Fixtures

```typescript
// Exemplo de mock para testes
const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

// Fixture de usuário para testes
const userFixture = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'hashedPassword',
  roles: ['user'],
  tenantId: 'default-tenant',
};
```

---

## 🚀 Deploy

### Deploy com Docker (Recomendado)

#### Produção com Docker Compose

```bash
# 1. Clonar o repositório no servidor
git clone https://github.com/seu-usuario/url-shortener-system.git
cd url-shortener-system

# 2. Configurar variáveis de produção
cp .env.example .env
# Editar .env com valores de produção

# 3. Build e deploy
docker compose -f docker-compose.prod.yml up -d --build

# 4. Verificar status
docker compose ps
```

#### Deploy em Kubernetes

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: identity-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: identity-service
  template:
    metadata:
      labels:
        app: identity-service
    spec:
      containers:
      - name: identity-service
        image: url-shortener/identity-service:latest
        ports:
        - containerPort: 3002
        env:
        - name: DB_HOST
          value: "postgres-service"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
```

### Deploy em Cloud Providers

#### AWS ECS

```bash
# 1. Build e push para ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

docker build -t url-shortener/identity-service .
docker tag url-shortener/identity-service:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/url-shortener/identity-service:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/url-shortener/identity-service:latest

# 2. Deploy via ECS CLI ou Console
```

#### Google Cloud Run

```bash
# 1. Build e deploy
gcloud builds submit --tag gcr.io/PROJECT-ID/identity-service
gcloud run deploy --image gcr.io/PROJECT-ID/identity-service --platform managed
```

#### Azure Container Instances

```bash
# 1. Build e push para ACR
az acr build --registry myregistry --image url-shortener/identity-service .

# 2. Deploy
az container create --resource-group myResourceGroup --name identity-service --image myregistry.azurecr.io/url-shortener/identity-service:latest
```

### Configurações de Produção

#### Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/url-shortener
server {
    listen 80;
    server_name yourdomain.com;

    location /auth/ {
        proxy_pass http://localhost:3002/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### SSL/TLS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d yourdomain.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Monitoramento e Logs

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  loki:
    image: grafana/loki
    ports:
      - "3100:3100"
```

---

## 🗺️ Roadmap

### Versão Atual: v0.3.0 ✅
- [x] Sistema de autenticação JWT
- [x] Encurtamento básico de URLs
- [x] Multi-tenancy
- [x] Documentação Swagger
- [x] Containerização Docker

### v0.4.0 - Operações de Usuário (Em Desenvolvimento)
- [ ] Dashboard do usuário
- [ ] Gestão de URLs por usuário
- [ ] Edição e exclusão de URLs
- [ ] Configurações de perfil
- [ ] Histórico de atividades

### v0.5.0 - Analytics Avançado
- [ ] Relatórios detalhados de cliques
- [ ] Geolocalização de visitantes
- [ ] Análise de dispositivos e browsers
- [ ] Exportação de dados (CSV, PDF)
- [ ] Gráficos interativos

### v0.6.0 - Funcionalidades Premium
- [ ] URLs customizadas
- [ ] Expiração de URLs
- [ ] Proteção por senha
- [ ] QR Codes automáticos
- [ ] Integração com redes sociais

### v0.7.0 - Escalabilidade
- [ ] Cache Redis
- [ ] Rate limiting avançado
- [ ] Load balancing
- [ ] Métricas de performance
- [ ] Auto-scaling

### v0.8.0 - Integrações
- [ ] API webhooks
- [ ] Integração Slack/Discord
- [ ] Plugin WordPress
- [ ] Extensão Chrome
- [ ] Mobile app (React Native)

### v1.0.0 - Produção
- [ ] Auditoria de segurança
- [ ] Backup automático
- [ ] Disaster recovery
- [ ] SLA 99.9%
- [ ] Suporte 24/7

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Este projeto segue as melhores práticas de desenvolvimento colaborativo.

### Como Contribuir

#### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/url-shortener-system.git
cd url-shortener-system

# Adicionar upstream
git remote add upstream https://github.com/original-repo/url-shortener-system.git
```

#### 2. Criar Branch

```bash
# Criar branch para sua feature
git checkout -b feature/nova-funcionalidade

# Ou para correção de bug
git checkout -b fix/correcao-bug
```

#### 3. Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar testes
npm run test

# Executar linting
npm run lint

# Executar em modo desenvolvimento
npm run docker:up
```

#### 4. Commit e Push

```bash
# Adicionar arquivos
git add .

# Commit seguindo padrão conventional
git commit -m "feat(auth): add password reset functionality"

# Push para seu fork
git push origin feature/nova-funcionalidade
```

#### 5. Pull Request

1. Acesse seu fork no GitHub
2. Clique em "New Pull Request"
3. Preencha o template de PR
4. Aguarde review

### Diretrizes de Contribuição

#### Código
- Seguir padrões ESLint e Prettier
- Manter cobertura de testes acima de 80%
- Documentar funções públicas
- Usar TypeScript strict mode

#### Commits
- Seguir [Conventional Commits](https://www.conventionalcommits.org/)
- Commits atômicos e descritivos
- Referenciar issues quando aplicável

#### Pull Requests
- Título claro e descritivo
- Descrição detalhada das mudanças
- Screenshots para mudanças visuais
- Testes passando
- Documentação atualizada

### Reportar Bugs

Use o template de issue para reportar bugs:

```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [ex: Ubuntu 20.04]
- Node.js: [ex: 18.17.0]
- Docker: [ex: 24.0.5]
```

### Sugerir Funcionalidades

Use o template de feature request:

```markdown
**Sua solicitação de funcionalidade está relacionada a um problema?**
Descrição clara do problema.

**Descreva a solução que você gostaria**
Descrição clara da funcionalidade desejada.

**Descreva alternativas consideradas**
Outras soluções ou funcionalidades consideradas.

**Contexto adicional**
Qualquer outro contexto sobre a solicitação.
```

### Código de Conduta

Este projeto adere ao [Contributor Covenant](https://www.contributor-covenant.org/). Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2024 URL Shortener System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Suporte

### Documentação
- **Swagger Identity Service**: http://localhost:3002/api-docs
- **Swagger URL Shortener**: http://localhost:3001/api-docs
- **Wiki do Projeto**: [GitHub Wiki](https://github.com/seu-usuario/url-shortener-system/wiki)

### Comunidade
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/url-shortener-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/seu-usuario/url-shortener-system/discussions)
- **Discord**: [Servidor da Comunidade](https://discord.gg/url-shortener)

### Contato
- **Email**: suporte@url-shortener-system.com
- **LinkedIn**: [Perfil do Desenvolvedor](https://linkedin.com/in/desenvolvedor)
- **Twitter**: [@URLShortenerSys](https://twitter.com/URLShortenerSys)

---

<div align="center">

**Desenvolvido com ❤️ por [Manus AI](https://github.com/manus-ai)**

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!

[⬆ Voltar ao topo](#-url-shortener-system)

</div>

