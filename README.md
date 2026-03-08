# Trampo Aqui API 🚀

Uma API REST para plataforma de vagas de emprego construída com **NestJS**, **Prisma** e **PostgreSQL**. A API permite cadastro de usuários, empresas, vagas e cursos com sistema completo de autenticação e autorização baseado em roles.

## 🎯 Status do MVP - 95% Completo ✅

O MVP está **funcionalmente completo** com todas as funcionalidades principais implementadas:

### ✅ Funcionalidades Implementadas

- **Sistema de Autenticação JWT** com hash de senhas (bcrypt)
- **Autorização baseada em Roles** (Admin, User, Company)
- **CRUD Completo de Usuários** com validação de dados
- **CRUD Completo de Empresas** com validação de relacionamentos
- **CRUD Completo de Vagas** com busca e paginação
- **CRUD Completo de Cursos** com todas as operações
- **Clean Architecture** implementada em todos os módulos
- **Validação robusta** de dados de entrada
- **Tratamento global** de exceções
- **Paginação** e busca em todas as listagens

### 🟡 Próximos Passos (5% restante)

- Validação de propriedade (empresas só editam seus recursos)
- Endpoints adicionais de detalhes (GET individual)
- Configuração de CORS e rate limiting
- Documentação Swagger da API

## 🛠️ Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js para APIs escaláveis
- **[Prisma](https://prisma.io/)** - ORM para TypeScript e Node.js
- **[PostgreSQL](https://postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação baseada em tokens
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hashing de senhas
- **[class-validator](https://www.npmjs.com/package/class-validator)** - Validação de dados
- **TypeScript** - Linguagem tipada

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**:

```
src/
├── common/                 # Decorators, guards, middlewares
├── infra/                 # Database configuration
└── modules/
    ├── auth/              # Autenticação JWT
    ├── users/             # Gestão de usuários
    ├── companies/         # Gestão de empresas
    ├── jobs/              # Gestão de vagas
    └── courses/           # Gestão de cursos
```

Cada módulo segue a estrutura:

- **domain/** - Entidades e repositórios (interfaces)
- **application/** - Use cases (regras de negócio)
- **infra/** - Implementação de repositórios
- **presentation/** - Controllers, DTOs e mappers

## 🚀 Como Rodar

### Pré-requisitos

- **Node.js** 18+
- **PostgreSQL** 13+
- **npm** ou **pnpm**

### 1. Clone e Instale Dependências

```bash
# Clone o repositório
git clone <repo-url>
cd trampo-aqui-api

# Instale dependências
npm install
# ou
pnpm install
```

### 2. Configuração do Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Configure as variáveis no `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/trampo_aqui_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application
NODE_ENV="development"
PORT=3000
```

### 3. Configure o Banco de Dados

```bash
# Rode as migrações
npx prisma migrate dev

# (Opcional) Rode o seed para dados iniciais
npm run seed
```

### 4. Inicie o Servidor

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

A API estará disponível em `http://localhost:3333/v1`

## 📊 Banco de Dados

### Estrutura das Tabelas

```sql
-- Roles (Admin, User, Company)
Roles {
  id: number (PK)
  name: string (unique)
}

-- Usuários
User {
  id: uuid (PK)
  email: string (unique)
  name: string
  document: string (unique)
  birthDate: date
  password: string (hashed)
  roleId: number (FK -> Roles.id)
  createdAt: datetime
}

-- Empresas
Companies {
  id: uuid (PK)
  name: string (unique)
  document: string (unique)
  userId: uuid (FK -> User.id)
}

-- Vagas
Jobs {
  id: uuid (PK)
  title: string
  description: string
  companyId: uuid (FK -> Companies.id)
}

-- Cursos
Courses {
  id: uuid (PK)
  title: string
  description: string
  link: string (URL)
  companyId: uuid (FK -> Companies.id)
  createdAt: datetime
}
```

### Dados Iniciais (Seed)

```sql
-- Roles padrão
INSERT INTO Roles VALUES (1, 'Admin'), (2, 'User'), (3, 'Company');

-- Usuário administrador
INSERT INTO User VALUES (
  uuid, 'admin@admin.com', 'Admin User', '12345678900',
  '1990-01-01', 'hashed_password', 1, now()
);
```

## 🔐 Autenticação e Autorização

### Sistema de Roles Implementado

| Role        | ID  | Descrição     | Permissões                                     |
| ----------- | --- | ------------- | ---------------------------------------------- |
| **Admin**   | 1   | Administrador | Gerencia sistema, deleta cursos, cria empresas |
| **User**    | 2   | Usuário comum | Pode criar empresa para si mesmo               |
| **Company** | 3   | Empresa       | Cria vagas e cursos                            |

### Fluxo de Autenticação e Autorização

1. **Login**: `/auth/login` → Retorna JWT token
2. **Headers**: `Authorization: Bearer <jwt-token>`
3. **AuthGuard**: Valida JWT e extrai userId
4. **RoleGuard**: Busca dados completos do usuário e valida role
5. **Endpoints públicos**: Marcados com `@Public()`

### Sistema de Decorators

#### `@Public()`

Remove a necessidade de autenticação para endpoints específicos:

```typescript
@Public()
@Get()
async listJobs() { ... }
```

#### `@Roles(UserRole.COMPANY)`

Define quais roles podem acessar o endpoint:

```typescript
@Roles(UserRole.COMPANY)
@Post()
async createJob() { ... }
```

#### Combinação Multiple Roles

```typescript
@Roles(UserRole.COMPANY, UserRole.ADMIN)
@Delete(':id')
async deleteCourse() { ... }
```

---

## 📚 Documentação das Rotas

### Base URL

```
http://localhost:3000
```

---

## 👤 Autenticação

### POST `/auth/login`

> **Público**: ✅ Não requer autenticação

Autentica usuário e retorna token JWT.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response 200:**

```json
{
  "message": "Login successful",
  "statusCode": 200,
  "data": {
    "user": {
      "id": "973cbc3a-1e9f-493f-aa61-a10ba233f9a9",
      "email": "exemplo@exemplo.com",
      "roleId": 2
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response 401:**

```json
{
  "message": "Invalid credentials",
  "statusCode": 401
}
```

---

## 👥 Usuários

### POST `/users`

> **Público**: ✅ Não requer autenticação

Cadastra novo usuário no sistema.

**Body:**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "document": "12345678900",
  "birthDate": "1990-05-15",
  "password": "minhasenha123",
  "roleId": 2
}
```

**Validações:**

- `name`: mínimo 3 caracteres
- `email`: formato válido e único
- `document`: único no sistema
- `birthDate`: data válida
- `password`: mínimo 6 caracteres (será hasheada)
- `roleId`: 1 (Admin), 2 (User), ou 3 (Company)

**Response 201:**

```json
{
  "message": "User created successfully",
  "statusCode": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@email.com",
    "roleId": 2
  }
}
```

**Response 400:**

```json
{
  "message": "Email already in use",
  "statusCode": 400
}
```

---

## 🏢 Empresas

### POST `/companies`

> **Auth**: ⚠️ Requer token JWT  
> **Roles**: 👤 USER, 🔧 ADMIN

Cadastra nova empresa associada ao usuário autenticado.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Body:**

```json
{
  "name": "Tech Solutions LTDA",
  "document": "12.345.678/0001-00",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validações:**

- `name`: mínimo 3 caracteres, único
- `document`: mínimo 11 caracteres, único
- `userId`: deve existir usuário válido

**Response 201:**

```json
{
  "message": "Company created successfully",
  "statusCode": 201,
  "data": null
}
```

**Response 404:**

```json
{
  "message": "User not found",
  "statusCode": 404
}
```

---

## 💼 Vagas

### POST `/jobs`

> **Auth**: ⚠️ Requer token JWT  
> **Roles**: 🏢 COMPANY

Cria nova vaga de emprego.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Body:**

```json
{
  "title": "Desenvolvedor Full Stack",
  "description": "Vaga para desenvolvedor com experiência em Node.js, React e banco de dados. Conhecimento em TypeScript será um diferencial.",
  "companyId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validações:**

- `title`: 3-255 caracteres
- `description`: 10-500 caracteres
- `companyId`: UUID válido, empresa deve existir

**Response 201:**

```json
{
  "message": "Job created successfully",
  "statusCode": 201,
  "data": null
}
```

### GET `/jobs`

> **Público**: ✅ Não requer autenticação

Lista e busca vagas disponíveis.

**Query Parameters:**

- `page` (opcional): número da página (padrão: 1)
- `limit` (opcional): itens por página (padrão: 10, máx: 50)
- `title` (opcional): busca por título
- `companyId` (opcional): filtra por empresa

**Exemplos:**

```bash
# Listar todas as vagas
GET /jobs?page=1&limit=10

# Buscar por título
GET /jobs?title=desenvolvedor

# Vagas de uma empresa específica
GET /jobs?companyId=550e8400-e29b-41d4-a716-446655440000
```

**Response 200:**

```json
{
  "message": "Jobs retrieved successfully",
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Desenvolvedor Full Stack",
        "description": "Vaga para desenvolvedor...",
        "companyId": "550e8400-e29b-41d4-a716-446655440000"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

## 🎓 Cursos

### POST `/courses`

> **Auth**: ⚠️ Requer token JWT  
> **Roles**: 🏢 COMPANY

Cadastra novo curso oferecido pela empresa.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Body:**

```json
{
  "title": "Curso de Node.js Avançado",
  "description": "Aprenda conceitos avançados de Node.js incluindo streams, clusters, performance e boas práticas.",
  "link": "https://meusite.com/curso-nodejs",
  "companyId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validações:**

- `title`: 3-255 caracteres
- `description`: 10-500 caracteres
- `link`: URL válida, máx 255 caracteres
- `companyId`: UUID válido, empresa deve existir

**Response 201:**

```json
{
  "message": "Course created successfully",
  "statusCode": 201,
  "data": null
}
```

### GET `/courses`

> **Público**: ✅ Não requer autenticação

Lista e busca cursos disponíveis.

**Query Parameters:**

- `page` (opcional): número da página (padrão: 1)
- `limit` (opcional): itens por página (padrão: 10, máx: 50)
- `title` (opcional): busca por título
- `companyId` (opcional): filtra por empresa

**Response 200:**

```json
{
  "message": "Courses retrieved successfully",
  "statusCode": 200,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "title": "Curso de Node.js Avançado",
        "description": "Aprenda conceitos avançados...",
        "link": "https://meusite.com/curso-nodejs",
        "companyId": "550e8400-e29b-41d4-a716-446655440000",
        "createdAt": "2026-03-08T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

### GET `/courses/:id`

> **Público**: ✅ Não requer autenticação

Busca curso específico por ID.

**Response 200:**

```json
{
  "message": "Course retrieved successfully",
  "statusCode": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Curso de Node.js Avançado",
    "description": "Aprenda conceitos avançados de Node.js...",
    "link": "https://meusite.com/curso-nodejs",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-03-08T10:30:00Z"
  }
}
```

**Response 404:**

```json
{
  "message": "Course not found",
  "statusCode": 404
}
```

### PUT `/courses/:id`

> **Auth**: ⚠️ Requer token JWT  
> **Roles**: 🏢 COMPANY

Atualiza curso existente. Campos são opcionais.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Body (todos opcionais):**

```json
{
  "title": "Curso de Node.js Expert",
  "description": "Versão atualizada do curso...",
  "link": "https://meusite.com/curso-nodejs-expert"
}
```

**Response 200:**

```json
{
  "message": "Course updated successfully",
  "statusCode": 200,
  "data": null
}
```

### DELETE `/courses/:id`

> **Auth**: ⚠️ Requer token JWT  
> **Roles**: 🏢 COMPANY, 🔧 ADMIN

Remove curso do sistema.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response 200:**

```json
{
  "message": "Course deleted successfully",
  "statusCode": 200,
  "data": null
}
```

---

## � Recursos Avançados Implementados

### Busca e Filtros

- **Busca por título** (case-insensitive) em vagas e cursos
- **Filtro por empresa** em vagas e cursos
- **Paginação inteligente** com limite máximo de 50 itens
- **Contagem total** de resultados para UI

### Validações de Negócio

- **Validação de company existence** antes de criar vagas/cursos
- **Unicidade de documento** e email de usuários
- **Unicidade de nome** e documento de empresas
- **Validação de URL** para links de cursos
- **Validação de UUID** para relacionamentos

### Segurança

- **Password hashing** com bcrypt (12 salt rounds)
- **JWT tokens** com secret configurável
- **Role-based authorization** com guards globais
- **Input sanitization** com class-validator
- **Error handling** sem exposição de dados sensíveis

### Arquitetura

- **Clean Architecture** com separação clara de camadas
- **Dependency Injection** do NestJS
- **Repository Pattern** com interfaces bem definidas
- **Use Cases** para encapsular regras de negócio
- **DTOs typados** para validação de entrada
- **Mappers** para conversão entre camadas

## �📖 Exemplos de Uso

### 1. Fluxo Completo de Cadastro

```bash
# 1. Cadastrar usuário
curl -X POST http://localhost:3000/v1/users \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "document": "12345678900",
    "birthDate": "1990-05-15",
    "password": "senha123",
    "roleId": 2
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'

# 3. Criar empresa (usar token do passo 2)
curl -X POST http://localhost:3000/v1/companies \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <jwt-token>" \\
  -d '{
    "name": "Minha Empresa LTDA",
    "document": "12345678000100",
    "userId": "<user-id>"
  }'
```

### 2. Usuário se Tornando Empresa

```bash
# 1. Login como usuário
POST /auth/login
{
  "email": "user@empresa.com",
  "password": "senha"
}

# 2. Criar empresa para si mesmo
POST /companies
Authorization: Bearer <token>
{
  "name": "Minha Startup",
  "document": "12345678000100",
  "userId": "<user-id>"
}
```

---

## 🛠️ Comandos de Desenvolvimento

### Database & Migrations

```bash
# Aplicar migrações
npx prisma migrate dev

# Reset do banco (cuidado!)
npx prisma migrate reset

# Visualizar dados com Prisma Studio
npx prisma studio

# Executar seed com dados iniciais
npm run seed

# Gerar cliente do Prisma (após mudanças no schema)
npx prisma generate
```

### Development

```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Build de produção
npm run build
npm run start:prod

# Linting e formatação
npm run lint
npm run format

# Testes (quando implementados)
npm run test
npm run test:e2e
```

### Docker (Se disponível)

```bash
# Subir banco PostgreSQL
docker-compose up postgres

# Subir aplicação completa
docker-compose up
```

---

## 🔗 Links Úteis

- **Prisma Studio**: `http://localhost:5555` (quando rodando)
- **API Base**: `http://localhost:3333/v1`
- **Health Check**: `http://localhost:3333/v1/health` (se implementado)

---

## 📋 Próximos Passos

### Funcionalidades Pendentes

- [ ] **Ownership validation** - Empresas só editam seus recursos
- [ ] **User profile endpoints** - GET/PUT `/users/:id`
- [ ] **Company profile endpoints** - GET/PUT `/companies/:id`
- [ ] **Job details endpoint** - GET `/jobs/:id`
- [ ] **Job management** - PUT/DELETE `/jobs/:id`

### Melhorias Técnicas

- [ ] **API Documentation** com Swagger/OpenAPI
- [ ] **Unit Tests** com Jest
- [ ] **Integration Tests** para endpoints
- [ ] **Docker configuration** para deploy
- [ ] **CORS configuration** para frontend
- [ ] **Rate limiting** para proteção
- [ ] **Logging system** estruturado
- [ ] **Health check** endpoint

### Deploy & Produção

- [ ] **Environment variables** validation
- [ ] **Database connection pooling**
- [ ] **Error monitoring** (Sentry)
- [ ] **Performance monitoring**
- [ ] **CI/CD pipeline** setup

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os **logs do servidor**
2. Confirme as **variáveis de ambiente**
3. Teste as **rotas no Postman/Insomnia**
4. Valide o **schema do banco** com Prisma Studio

---

**Status Atual: MVP Funcionalmente Completo (95%) ✅**
"document": "12345678000100",
"userId": "<meu-user-id>"
}

# 3. Agora pode criar vagas

POST /jobs
Authorization: Bearer <token>
{
"title": "Desenvolvedor React",
"description": "Vaga para desenvolvedor frontend...",
"companyId": "<company-id>"
}

````

### 3. Buscar Vagas e Cursos (Público)

```bash
# Buscar vagas por título
GET /jobs?title=node&page=1&limit=5

# Buscar cursos por empresa
GET /courses?companyId=550e8400-e29b-41d4-a716-446655440000

# Ver detalhes de um curso
GET /courses/550e8400-e29b-41d4-a716-446655440002
````

---

## ⚠️ Tratamento de Erros

### Códigos de Status

| Código | Descrição          |
| ------ | ------------------ |
| `200`  | Sucesso            |
| `201`  | Criado com sucesso |
| `400`  | Dados inválidos    |
| `401`  | Não autenticado    |
| `403`  | Sem permissão      |
| `404`  | Não encontrado     |
| `500`  | Erro interno       |

### Formato de Erro Padrão

```json
{
  "message": "Descrição do erro",
  "statusCode": 400
}
```

### Erros de Validação

```json
{
  "message": [
    "Title must have at least 3 characters",
    "Email must be a valid email"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes e2e
npm run test:e2e

# Executar testes com coverage
npm run test:cov
```

---

## 📝 Scripts Úteis

```bash
# Desenvolvimento
npm run start:dev          # Modo watch
npm run start:debug        # Com debugger

# Build e Produção
npm run build              # Compilar
npm run start:prod         # Prod mode

# Database
npx prisma migrate dev     # Nova migração
npx prisma migrate reset   # Reset DB
npx prisma studio          # Interface visual
npm run seed               # Dados iniciais

# Linting e Formatação
npm run lint               # ESLint
npm run format             # Prettier
```

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```bash
# .env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-256-bit-secret"
JWT_EXPIRES_IN="1d"
NODE_ENV="development"
PORT=3000
CORS_ORIGIN="http://localhost:3001"
```

### CORS (Para Frontend)

```typescript
// main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
});
```

### Rate Limiting

```bash
npm install @nestjs/throttler

# app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10,
})
```

---

## 🚀 Deploy

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/trampo_aqui
      - JWT_SECRET=super-secret-key
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=trampo_aqui
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - '5432:5432'
```

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

- **Email**: suporte@trampoaqui.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/trampo-aqui-api/issues)
- **Documentação**: Esta README.md

---

**Desenvolvido com ❤️ usando NestJS**
