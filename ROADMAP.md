# 🗺️ Roadmap de Desenvolvimento: Sistema de Encurtamento de URLs

Este documento detalha as fases e marcos do desenvolvimento do nosso sistema de encurtamento de URLs.

---

## 🚀 **Fase 1: Configuração e Funcionalidade Core (API)**
*Foco: Estabelecer a base do projeto e a funcionalidade essencial de encurtamento.*

#### **Configuração Inicial do Monorepo** ⚙️
- [x] Criação do monorepo (`url-shortener-system`).
- [x] Configuração do `docker-compose` para PostgreSQL.
- [x] Criação do serviço `url-shortener-service` (NestJS).
- [x] Conexão do `url-shortener-service` com o DB.
- [x] **Git Tag: `v0.0.1` (Base Monorepo)**

#### **Funcionalidade de Encurtamento e Redirecionamento** 🔗
- [x] Definição da entidade `Url` (originalUrl, shortCode, clicks, userId, timestamps).
- [x] Implementação do `ShortCodeService` (geração de códigos de 6 caracteres).
- [x] Implementação do `UrlService.shortenUrl` (persistência no DB, tratamento de colisão).
- [x] Implementação do `UrlService.findByShortCode` (busca por código curto).
- [x] Criação do endpoint `POST /shorten` (recebe URL, retorna encurtada).
- [x] Criação do endpoint `GET /:shortCode` (redireciona para URL original).
- [x] Validação de entrada (`class-validator`).
- [x] **TDD:** Testes unitários para `ShortCodeService`, `UrlService`, `UrlController`.
- [x] **Git Tag: `v0.1.0` (Encurtador Criado)**

---

## 📈 **Fase 2: Contabilização e Autenticação (API)**
*Foco: Adicionar métricas detalhadas e gerenciamento de usuários.*

#### **Preparação para Multi-Tenancy** 🏢
- [x] Criar a entidade `Tenant`.
- [x] Adicionar `tenantId` à entidade `Url`.
- [x] Adicionar `tenantId` à entidade `ClickEvent`.
- [x] Atualizar o `UrlService` para lidar com o `tenantId` na criação e busca de URLs.
- [x] Atualizar o `UrlController` para usar o `tenantId` padrão.
- [x] Atualizar os testes do `UrlService` e `UrlController` para incluir `tenantId`.

#### **Contabilização Detalhada de Cliques** 📊
- [x] Criação da entidade `ClickEvent` (urlId, clickedAt, ipAddress, userAgent - opcional).
- [x] Atualização do `UrlService.findByShortCode` para registrar `ClickEvent` e incrementar `Url.clicks`.
- [x] **TDD:** Testes unitários para `ClickEvent` persistência e `UrlService` atualização de cliques.
- [ ] **Git Tag: `v0.2.0` (Contabilização de Acessos)**

#### **Sistema de Autenticação e Autorização** 🔐
- [ ] Criação de um novo serviço: `identity-service` (NestJS).
- [ ] Definição da entidade `User` (email, password, roles, timestamps).
- [ ] Implementação de cadastro de usuário.
- [ ] Implementação de login (email/senha) e geração de `Bearer Token` (JWT).
- [ ] Guards e Interceptors para proteção de rotas.
- [ ] **TDD:** Testes unitários para `UserService`, `AuthService`, `AuthGuard`.
- [ ] **Git Tag: `v0.3.0` (Autenticação)**

---

## 📝 **Fase 3: Gerenciamento de Usuários e API Gateway (API)**
*Foco: Habilitar usuários a gerenciar suas URLs e orquestrar serviços.*

#### **Gerenciamento de URLs por Usuário** 📝
- [ ] Atualização do `UrlService.shortenUrl` para associar `userId` (se autenticado).
- [ ] Endpoint para listar URLs encurtadas por usuário (`GET /url/my-urls`).
- [ ] Endpoint para editar `originalUrl` de uma URL encurtada (`PATCH /url/:id`).
- [ ] Endpoint para exclusão lógica de URL (`DELETE /url/:id`).
- [ ] **TDD:** Testes unitários para as novas funcionalidades CRUD e autorização.
- [ ] **Git Tag: `v0.4.0` (Operações de Usuário no Encurtador)**

#### **API Gateway (KrakendD)** 🛣️
- [ ] Configuração do `docker-compose` para incluir KrakendD.
- [ ] Definição de rotas no KrakendD para rotear requisições para `url-shortener-service` e `identity-service`.
- [ ] Configuração de autenticação JWT no KrakendD (pass-through ou validação básica).
- [ ] **Git Tag: `v0.5.0` (API Gateway Integrado)**

---

## 🖥️ **Fase 4: Frontend e Documentação (API & Frontend)**
*Foco: Construir a interface do usuário e documentar a API.*

#### **Desenvolvimento do Frontend (React/Next.js)** 🖥️
- [ ] Criação de um novo serviço: `url-shortener-frontend` (React/Next.js) no monorepo.
- [ ] Configuração do `docker-compose` para o frontend.
- [ ] Páginas: Home (encurtar anônimo), Login, Cadastro, Dashboard do Usuário (listar/gerenciar URLs).
- [ ] Consumo da API (encurtar, listar, editar, excluir).
- [ ] **TDD:** Testes de componentes e integração para o frontend.
- [ ] **Git Tag: `v0.6.0` (Frontend Básico)**

#### **Documentação da API (Swagger/OpenAPI)** 📄
- [ ] Integração do Swagger com NestJS (`@nestjs/swagger`).
- [ ] Documentação de todos os endpoints (parâmetros, respostas, segurança).
- [ ] **Git Tag: `v0.7.0` (API Documentada)**

---

## ✅ **Fase 5: Observabilidade, Testes Avançados e Deploy (Infra & Qualidade)**
*Foco: Garantir a robustez, monitoramento e preparação para produção.*

#### **Observabilidade** 📈
- [ ] Configuração de Logs (Winston/Pino).
- [ ] Configuração de Métricas (Prometheus/Grafana - abstração).
- [ ] Configuração de Rastreamento (OpenTelemetry/Jaeger - abstração).
- [ ] Variáveis de ambiente para ativar/desativar instrumentação.
- [ ] **Git Tag: `v0.8.0` (Observabilidade)**

#### **Testes Avançados e Qualidade de Código** ✅
- [ ] Testes de integração entre serviços (via Docker Compose).
- [ ] Configuração de pré-commit/pre-push hooks (Husky/Lint-staged).
- [ ] Configuração de linting (ESLint) e formatação (Prettier).
- [ ] **Git Tag: `v0.9.0` (Qualidade de Código e Testes Integrados)**

#### **Deploy e Infraestrutura como Código** 🚀
- [ ] Criação de `Dockerfile` para cada serviço NestJS.
- [ ] Atualização do `docker-compose.yml` para incluir os serviços NestJS.
- [ ] **README/CONTRIBUTING:** Como rodar o projeto localmente.
- [ ] **Git Tag: `v1.0.0` (Deploy Local Completo)**
- [ ] **Diferencial:** Construção de artefatos Terraform para deploy em Cloud Provider (AWS/GCP/Azure).
- [ ] **Diferencial:** Construção de deployments Kubernetes.
- [ ] **Diferencial:** GitHub Actions para CI/CD (lint, testes automatizados).
- [ ] **Diferencial:** Deploy em Cloud Provider e link no README.

---

## ✨ **Fase 6: Otimização e Funcionalidades Avançadas (Melhoria Contínua)**
*Foco: Escalar, otimizar e adicionar valor extra.*

#### **Relatórios Avançados e Multi-tenancy** 📊 (Continuação)
- [ ] Filtros por data, IP, navegador, etc.
- [ ] Visualização de gráficos no frontend.

#### **Otimização de Performance** ⚡
- [ ] Cache (Redis) para URLs mais acessadas.
- [ ] Otimização de consultas ao banco de dados.

#### **Funcionalidades Adicionais (Sugestões)** ✨
- [ ] Códigos curtos personalizados.
- [ ] Expiração de URLs.
- [ ] Proteção por senha.
- [ ] Geração de QR Code.
- [ ] Encurtamento em massa.
- [ ] Domínios personalizados.

#### **Escalabilidade Horizontal** 🌐
- [ ] Discussão e documentação de pontos de melhoria para escala horizontal.

#### **Changelog e Versões** 📝
- [ ] Manutenção do changelog e tags de versão.

#### **Código Tolerante a Falhas** 🛡️
- [ ] Implementação de padrões de resiliência (circuit breaker, retry).

---
