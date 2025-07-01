# URL Shortener System

<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</div>

<br>

<div align="center">
  <p><strong>Um sistema robusto de encurtamento de URLs com autenticação multi-tenant</strong></p>
</div>

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Roadmap](#-roadmap)
- [Testes](#-testes)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🔍 Visão Geral

O URL Shortener System é uma aplicação completa para encurtamento de URLs com suporte a multi-tenancy e autenticação. O sistema permite criar URLs curtas, rastrear cliques e gerenciar usuários em diferentes tenants.

### Versões
- **v0.1.0**: Encurtador básico
- **v0.2.0**: Multi-tenancy
- **v0.3.0**: Sistema de autenticação ✅

## 🏗 Arquitetura

O projeto utiliza uma arquitetura de microserviços com dois serviços principais:

1. **URL Shortener Service**: Responsável pelo encurtamento de URLs e rastreamento de cliques
2. **Identity Service**: Gerencia autenticação, usuários e autorização

Ambos os serviços são construídos com NestJS e se comunicam entre si. O banco de dados PostgreSQL é compartilhado entre os serviços.

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  URL Shortener  │◄────┤  Identity       │
│  Service        │     │  Service        │
│  (porta 3001)   │     │  (porta 3002)   │
│                 │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────┐
│                                         │
│             PostgreSQL                  │
│                                         │
└─────────────────────────────────────────┘
```

## 🛠 Tecnologias

- **Backend**: NestJS, TypeScript, TypeORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Containerização**: Docker, Docker Compose
- **Testes**: Jest
- **Documentação**: Swagger/OpenAPI

## ✨ Funcionalidades

- ✅ Encurtamento de URLs
- ✅ Rastreamento de cliques
- ✅ Multi-tenancy
- ✅ Autenticação de usuários (registro/login)
- ✅ Autorização baseada em roles
- ✅ Dockerização completa
- ✅ Testes unitários

## 📋 Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose
- Git

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/Reche-Lab/url-shortener-system.git
cd url-shortener-system
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

3. **Inicie os serviços com Docker**

```bash
npm run docker:up
```

Isso iniciará todos os serviços necessários:
- PostgreSQL na porta 5432
- Identity Service na porta 3002
- URL Shortener Service na porta 3001

## 🖥 Uso

### Autenticação

```bash
# Registrar um novo usuário
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Resposta
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "roles": ["user"]
  }
}
```


### Encurtamento de URL

```bash
# Encurtar uma URL (anônimo)
curl -X POST http://localhost:3001/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://science.nasa.gov/universe/stars/types/"}'

# Resposta
{
  "id": "uuid-here",
  "shortCode": "abcDEF",
  "originalUrl": "https://science.nasa.gov/universe/stars/types/",
  "shortUrl": "http://localhost:3001/abcDEF"
}
```


### Redirecionamento

```
# Acessar URL encurtada (navegador ou curl)
http://localhost:3001/abcDEF
```

## 📡 API Endpoints

### Identity Service (porta 3002)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Registrar novo usuário | Não |
| POST | `/auth/login` | Login de usuário | Não |

### URL Shortener Service (porta 3001)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/shorten` | Encurtar URL | Não |
| GET | `/:shortCode` | Redirecionar para URL original | Não |
| POST | `/tenant` | Criar novo tenant | Não |
| GET | `/tenant` | Listar todos os tenants | Não |
| GET | `/tenant/:id` | Obter tenant por ID | Não |

## 📁 Estrutura do Projeto

```
url-shortener-system/
├── apps/
│   ├── identity-service/       # Serviço de autenticação
│   │   ├── src/
│   │   │   ├── auth/           # Módulo de autenticação
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── entities/       # Entidades do banco de dados
│   │   │   └── main.ts         # Ponto de entrada
│   │   └── Dockerfile
│   │
│   └── url-shortener-service/  # Serviço de encurtamento
│       ├── src/
│       │   ├── url/            # Módulo de URL
│       │   ├── tenant/         # Módulo de tenant
│       │   ├── click-event/    # Módulo de eventos de clique
│       │   └── main.ts         # Ponto de entrada
│       └── Dockerfile
│
├── nest-cli.json               # Configuração do NestJS
├── package.json                # Dependências e scripts
├── docker-compose.yml          # Configuração do Docker
└── .env                        # Variáveis de ambiente
```

## 🔐 Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_DATABASE=url_shortener_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Services Ports
URL_SHORTENER_PORT=3001
IDENTITY_SERVICE_PORT=3002

# Environment
NODE_ENV=development

# TypeORM Configuration
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true

# Identity Service Specific
IDENTITY_DB_SYNC=true
BCRYPT_ROUNDS=10
```

## 🗺 Roadmap

- [x] **v0.1.0**: Encurtador básico
  - [x] Criação de URLs curtas
  - [x] Redirecionamento

- [x] **v0.2.0**: Multi-tenancy
  - [x] Suporte a múltiplos tenants
  - [x] Isolamento de dados por tenant

- [x] **v0.3.0**: Sistema de autenticação
  - [x] Registro e login de usuários
  - [x] Autenticação JWT
  - [x] Autorização baseada em roles

- [ ] **v0.4.0**: Operações de usuário no encurtador
  - [ ] URLs associadas a usuários
  - [ ] Dashboard de usuário

- [ ] **v0.5.0**: Contabilização de acessos e relatórios
  - [ ] Estatísticas detalhadas de cliques
  - [ ] Relatórios por tenant e usuário

## 🧪 Testes

O projeto utiliza Jest para testes unitários:

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:cov

# Executar testes de um serviço específico
npm test -- apps/identity-service
npm test -- apps/url-shortener-service
```

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ por Bruno Reche**