# 🚀 Sistema de Gestión de Leads - CrecIA

Sistema completo de gestión de leads con autenticación JWT, roles de usuario (ADMIN/VENDEDOR) y dashboard de métricas en tiempo real.

> **Prueba Técnica Fullstack Developer** - Implementación completa con Arquitectura Hexagonal, 67 tests automatizados y documentación Swagger.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Decisiones Técnicas](#-decisiones-técnicas)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Seguridad](#-seguridad)
- [Roadmap](#-roadmap)

---

## ✨ Características

### Funcionalidades Implementadas

- ✅ **Autenticación JWT** con roles (ADMIN/VENDEDOR)
- ✅ **CRUD completo de Leads** con validaciones de negocio
- ✅ **Gestión de Usuarios** (solo ADMIN)
- ✅ **Dashboard con 5 métricas clave**:
    - Total de leads
    - Distribución por estado (NUEVO/CONTACTADO/GANADO/PERDIDO)
    - Monto estimado total
    - Leads creados en últimos 7 días
    - Ranking de vendedores por monto ganado
- ✅ **67 tests automatizados** (Unit + Integration)
- ✅ **Documentación Swagger/OpenAPI** interactiva
- ✅ **Arquitectura Hexagonal** (Clean Architecture)

---

## 🛠️ Stack Tecnológico

### Backend

| Tecnología     | Versión | Propósito               |
| -------------- | ------- | ----------------------- |
| **Node.js**    | v24.x   | Runtime                 |
| **TypeScript** | ^5.x    | Tipado estático         |
| **Express**    | ^5.x    | Framework HTTP          |
| **Prisma**     | ^6.x    | ORM y migrations        |
| **PostgreSQL** | 14+     | Base de datos           |
| **JWT**        | ^9.x    | Autenticación stateless |
| **Bcrypt**     | ^6.x    | Hash de passwords       |
| **Vitest**     | ^4.x    | Testing framework       |
| **Swagger UI** | ^5.x    | Documentación API       |

### Herramientas de Desarrollo

- **tsx** - Ejecución TypeScript en desarrollo
- **Prettier** - Formateo de código
- **dotenv** - Gestión de variables de entorno
- **npm workspaces** - Monorepo management

---

## 🏗️ Arquitectura

### Hexagonal Architecture (Clean Architecture)

Implementamos **Arquitectura Hexagonal** para lograr:

- ✅ **Separación de responsabilidades**
- ✅ **Testabilidad** (mocks fáciles)
- ✅ **Independencia de frameworks**
- ✅ **Mantenibilidad a largo plazo**

```
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │    Prisma    │  │  Services    │      │
│  │  - Routes    │  │ - Repositories│ │ - Bcrypt     │      │
│  │  - Controllers│ │ - DB Access  │  │ - JWT        │      │
│  │  - Middleware│  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   APPLICATION LAYER                          │
│                   (Use Cases - Business Logic)               │
│  - RegisterUser    - CreateLead      - GetUserMetrics       │
│  - LoginUser       - UpdateLeadStatus - GetGlobalMetrics    │
│  - DeleteUser      - GetLeadsByUser                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     DOMAIN LAYER (Core)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Entities    │  │ Value Objects│  │ Interfaces   │      │
│  │  - User      │  │  - Email     │  │ - IUserRepo  │      │
│  │  - Lead      │  │  - UserRole  │  │ - ILeadRepo  │      │
│  │              │  │  - LeadStatus│  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de una Request

```
1. Cliente → POST /api/auth/login
   ↓
2. Express Router (auth.routes.ts)
   ↓
3. Middleware (authMiddleware si aplica)
   ↓
4. Controller extrae datos y llama Use Case
   ↓
5. Use Case ejecuta lógica de negocio
   - Busca en Repository (interface del Domain)
   - Valida con Domain entities
   - Retorna resultado
   ↓
6. Controller formatea response
   ↓
7. Error Handler (si hay error)
   ↓
8. Response al cliente
```

---

## 💡 Decisiones Técnicas

### 1. ¿Por qué TypeScript?

**Razón**: Type Safety + Mejor DX + Escalabilidad

✅ **Beneficios obtenidos**:

- Detección de errores en tiempo de compilación
- Autocompletado inteligente en IDE
- Refactoring seguro
- Documentación viva (los tipos son documentación)

```typescript
// Ejemplo: El compilador previene errores
const user: User = await userRepository.findById(id);
user.email.value; // ✓ TypeScript sabe que email es Email VO
user.email.invalid; // ✗ Error en compilación
```

### 2. ¿Por qué Prisma ORM?

**Razón**: Type-safety + DX + Repository Pattern

✅ **Ventajas**:

- Type-safety nativo con TypeScript
- Migrations automáticas y versionadas
- Query builder que previene SQL injection
- Excelente DX con Prisma Studio
- Facilita el Repository Pattern

```typescript
// Type-safety completo
const user = await prisma.user.findUnique({
    where: { email: "user@example.com" },
});
// TypeScript sabe que user es User | null
```

❌ **Alternativas descartadas**:

- **TypeORM**: Menos type-safe, decorators complicados
- **Sequelize**: No diseñado para TypeScript
- **SQL puro**: Sin type-safety, propenso a errores

### 3. ¿Por qué Arquitectura Hexagonal?

**Problema que resuelve**: Acoplamiento entre capas y dificultad para testear.

❌ **Sin Hexagonal** (arquitectura tradicional):

```typescript
// Use Case acoplado a Prisma
class LoginUser {
  constructor(private prisma: PrismaClient) {} // ¡Mal!
  async execute(data) {
    const user = await this.prisma.user.findUnique(...)
    // Si cambias de ORM, rompes esta clase
  }
}
```

✅ **Con Hexagonal**:

```typescript
// Use Case depende de abstracción
class LoginUser {
  constructor(private userRepo: IUserRepository) {} // Interface
  async execute(data) {
    const user = await this.userRepo.findByEmail(...)
    // Puedes cambiar de Prisma a MongoDB sin tocar esto
  }
}
```

**Beneficios obtenidos**:

- ✅ 67 tests con mocks sin levantar DB
- ✅ Cambiar de Express a Fastify: solo cambiar Infrastructure
- ✅ Reglas de negocio puras en Domain (testeables sin HTTP ni DB)
- ✅ Equipos pueden trabajar en paralelo (Frontend no espera a Backend)

### 4. ¿Por qué JWT para autenticación?

**Razón**: Stateless + Escalable + CORS-friendly

✅ **Stateless**: No necesita almacenar sesiones en el servidor  
✅ **Escalable**: Cada request es independiente  
✅ **CORS-friendly**: Funciona con frontend en otro dominio  
✅ **Portable**: El token se puede usar en móviles, APIs externas

**Implementación**:

```typescript
// Payload del token
{
  userId: 1,
  email: "user@example.com",
  rol: "VENDEDOR",
  iat: 1234567890,
  exp: 1234654290 // 7 días
}
```

❌ **Alternativas descartadas**:

- **Sessions (cookie-based)**: Requiere estado en servidor, no escala
- **OAuth 2.0**: Overkill para este caso (no hay third-party login)

### 5. ¿Por qué Bcrypt para passwords?

**Razón**: Estándar de la industria + Salting automático

- **Salting automático**: Cada hash es único aunque la password sea igual
- **Cost factor 10**: Balance entre seguridad y performance (100ms por hash)
- **Resistente a rainbow tables**: Salt aleatorio por password

```typescript
// Dos usuarios con password "123456" generan hashes diferentes:
// User 1: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
// User 2: $2b$10$anotherCompletelyDifferentHashHere...
```

❌ **Alternativas descartadas**:

- **SHA256**: No tiene salt, vulnerable a rainbow tables
- **Argon2**: Más seguro pero overkill para este caso

### 6. ¿Por qué Vitest para testing?

**Razón**: Velocidad + Compatibilidad + ESM nativo

✅ **Más rápido** que Jest (usa Vite, no Babel)  
✅ **Compatible** con Jest (misma API, migración fácil)  
✅ **ESM nativo**: No necesita transformaciones  
✅ **Watch mode inteligente**: Solo re-ejecuta tests afectados

**Coverage logrado**: 67 tests en 3 niveles:

- **Domain (52 tests)**: Value Objects, Entities - Sin dependencias externas
- **Application (8 tests)**: Use Cases con mocks - Lógica de negocio pura
- **Infrastructure (7 tests)**: Integración con DB real - E2E parcial

### 7. ¿Por qué Monorepo con npm workspaces?

**Razón**: Código compartido + Deploy independiente

```
monorepo-leads-test/
├── packages/
│   ├── backend/     ← API REST
│   └── frontend/    ← React app (futuro)
└── package.json     ← Root workspace
```

✅ **Ventajas**:

- Shared types entre backend y frontend (evita duplicación)
- Versioning unificado (una sola fuente de verdad)
- Deploy independiente de cada package
- Reutilización de código común (validaciones, constantes)

❌ **Alternativas descartadas**:

- **Repos separados**: Duplicación de tipos, sincronización manual
- **Turborepo/Nx**: Overkill para un proyecto pequeño

### 8. Database Design

**Modelo de datos**:

```prisma
User (1) ──────< (N) Lead
  - id              - id
  - email (unique)  - nombre
  - password        - email
  - nombre          - empresa
  - rol (enum)      - montoEstimado (Decimal)
  - timestamps      - estado (enum)
                    - userId (FK)
                    - timestamps
```

**Decisiones clave**:

✅ **Email NO único en Lead**: Un cliente puede generar múltiples leads  
✅ **Cascade delete**: Si borras un User, se borran sus Leads (integridad referencial)  
✅ **Indexes**: `userId`, `estado`, `createdAt` para optimizar queries comunes  
✅ **Decimal(12,2)**: Para montos hasta $9,999,999,999.99 sin pérdida de precisión  
✅ **Enums en DB**: `UserRole`, `LeadStatus` para integridad de datos

### 9. Error Handling Strategy

**Jerarquía de errores**:

```typescript
DomainError (base)
  ├── AuthErrors
  │   ├── InvalidEmailError
  │   ├── InvalidPasswordError
  │   └── InvalidCredentialsError
  ├── UserErrors
  │   ├── InvalidUserNameError
  │   └── NotFoundError
  └── LeadErrors
      └── InvalidLeadDataError
```

**Response format consistente**:

```json
{
    "success": false,
    "error": {
        "code": "INVALID_EMAIL",
        "message": "El formato del email es inválido"
    }
}
```

**Beneficios**:

- Frontend sabe exactamente qué salió mal (`error.code`)
- Mensajes en español para UX
- Centralizado en `errorHandler` middleware

### 10. API Design Decisions

**RESTful Conventions**:

- `GET` para lectura (idempotente)
- `POST` para creación
- `PATCH` para actualización parcial (solo el estado del lead)
- `DELETE` para eliminación (soft delete en el futuro)

**Response envelope** (consistencia):

```json
{
    "success": true,
    "data": {
        "lead": {
            /* objeto */
        }
    }
}
```

**Códigos HTTP semánticos**:

- `200 OK` - Éxito general
- `201 Created` - Recurso creado (POST exitoso)
- `400 Bad Request` - Validación fallida
- `401 Unauthorized` - No autenticado (falta token)
- `403 Forbidden` - No autorizado (rol incorrecto)
- `404 Not Found` - Recurso no existe
- `500 Internal Server Error` - Error del servidor

---

## 🚀 Instalación

### Prerrequisitos

- Node.js v24.x o superior
- PostgreSQL 14+
- npm v10.x o superior

### Paso 1: Clonar repositorio

```bash
git clone <repository-url>
cd monorepo-leads-test
```

### Paso 2: Instalar dependencias

```bash
npm install
```

Esto instalará las dependencias del workspace root y de todos los packages automáticamente.

### Paso 3: Configurar variables de entorno

```bash
cd packages/backend
cp .env.example .env
```

Editar `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/leads-test?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### Paso 4: Configurar base de datos

```bash
# Crear la base de datos PostgreSQL
createdb leads-test

# Ejecutar migraciones
cd packages/backend
npx prisma migrate dev

# (Opcional) Ver la base de datos con Prisma Studio
npx prisma studio
```

### Paso 5: Crear usuario admin inicial

```bash
cd packages/backend
npx tsx scripts/createAdmin.ts
```

**Credenciales generadas**:

- Email: `admin@leads.com`
- Password: `admin123`
- Rol: `ADMIN`

⚠️ **Importante**: Cambiar estas credenciales en producción.

---

## 🎮 Uso

### Desarrollo

```bash
# Backend
cd packages/backend
npm run dev
```

**Servicios disponibles**:

- API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

### Producción

```bash
# Build
cd packages/backend
npm run build

# Start
npm start
```

### Scripts disponibles

```bash
npm run dev           # Modo desarrollo con hot-reload
npm run build         # Compilar TypeScript
npm start             # Iniciar servidor (requiere build)
npm test              # Ejecutar tests
npm run test:ui       # Tests con interfaz visual
npm run test:coverage # Tests con coverage
npm run doc           # Regenerar documentación Swagger
```

---

## 🧪 Testing

### Ejecutar tests

```bash
cd packages/backend

# Todos los tests
npm test

# Tests con UI
npm run test:ui

# Tests con coverage
npm run test:coverage
```

### Cobertura de tests

**67 tests totales** (100% pasando):

```
Domain Layer (52 tests):
  ✓ Email Value Object (8 tests)
  ✓ UserRole Enum (5 tests)
  ✓ LeadStatus + Transitions (11 tests)
  ✓ User Entity (11 tests)
  ✓ Lead Entity (17 tests)

Application Layer (8 tests):
  ✓ RegisterUser Use Case (5 tests)
  ✓ LoginUser Use Case (3 tests)

Infrastructure Layer (7 tests):
  ✓ PrismaUserRepository (7 integration tests)
```

### Estrategia de testing

**Unit Tests (Domain + Application)** - 60 tests:

- Usan **mocks** (MockUserRepository, MockBcryptService)
- Muy rápidos (< 1ms por test)
- Prueban lógica de negocio pura
- No requieren DB ni servicios externos

**Integration Tests (Infrastructure)** - 7 tests:

- Usan **DB real** (PostgreSQL de desarrollo)
- Más lentos (~20ms por test)
- Prueban interacción con Prisma
- Cleanup automático entre tests

---

## 📚 API Documentation

### Swagger UI

Documentación interactiva disponible en:

```
http://localhost:3000/api-docs
```

**Features de Swagger**:

- ✅ Try it out (probar endpoints desde el navegador)
- ✅ Authorization (botón para agregar token JWT)
- ✅ Modelos de request/response
- ✅ Códigos de error documentados

### Endpoints principales

#### Authentication

```http
POST /api/auth/register  # Crear usuario (requiere admin)
POST /api/auth/login     # Login (retorna JWT)
```

#### Leads

```http
POST   /api/leads              # Crear lead
GET    /api/leads              # Listar leads del usuario
GET    /api/leads/:id          # Ver lead específico
PATCH  /api/leads/:id/status   # Actualizar estado
DELETE /api/leads/:id          # Eliminar lead
```

#### Users (Admin only)

```http
GET    /api/users        # Listar todos los usuarios
DELETE /api/users/:id    # Eliminar usuario
```

#### Dashboard

```http
GET /api/dashboard/user           # Métricas del usuario autenticado
GET /api/dashboard/user/:id       # Métricas de usuario (admin)
GET /api/dashboard/global         # Métricas globales (admin)
```

### Ejemplo de uso

**1. Login**:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@leads.com",
    "password": "admin123"
  }'
```

Response:

```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": 1,
            "email": "admin@leads.com",
            "nombre": "Admin User",
            "rol": "ADMIN"
        }
    }
}
```

**2. Crear Lead** (requiere token):

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@empresa.com",
    "empresa": "Tech Solutions",
    "montoEstimado": 50000
  }'
```

**3. Ver Dashboard**:

```bash
curl -X GET http://localhost:3000/api/dashboard/user \
  -H "Authorization: Bearer <token>"
```

---

## 📁 Estructura del Proyecto

```
monorepo-leads-test/
├── packages/
│   └── backend/
│       ├── src/
│       │   ├── domain/                    # ⭐ Capa de Dominio
│       │   │   ├── entities/              # User, Lead
│       │   │   ├── value-objects/         # Email, UserRole, LeadStatus
│       │   │   ├── repositories/          # Interfaces (IUserRepository, ILeadRepository)
│       │   │   └── errors/                # Domain errors
│       │   │
│       │   ├── application/               # ⭐ Capa de Aplicación
│       │   │   └── use-cases/             # Lógica de negocio
│       │   │       ├── auth/              # RegisterUser, LoginUser
│       │   │       ├── leads/             # CreateLead, UpdateLeadStatus, etc.
│       │   │       └── dashboard/         # GetUserMetrics, GetGlobalMetrics
│       │   │
│       │   ├── infrastructure/            # ⭐ Capa de Infraestructura
│       │   │   ├── in/http/express/       # Adaptador HTTP (Express)
│       │   │   │   ├── routes/            # Definición de rutas
│       │   │   │   ├── controllers/       # Controladores HTTP
│       │   │   │   ├── middlewares/       # Auth, Error handler
│       │   │   │   └── Server.ts          # Configuración de Express
│       │   │   │
│       │   │   └── out/                   # Adaptadores externos
│       │   │       ├── persistence/prisma/ # Implementación de repositorios
│       │   │       └── auth/              # BcryptService, JwtService
│       │   │
│       │   ├── shared/                    # Código compartido
│       │   │   ├── DependencyInjection.ts # Container de inyección
│       │   │   └── types.ts               # Tipos globales
│       │   │
│       │   └── index.ts                   # Entry point
│       │
│       ├── prisma/
│       │   ├── schema.prisma              # Definición del schema
│       │   └── migrations/                # Migraciones SQL
│       │
│       ├── scripts/
│       │   └── createAdmin.ts             # Script para crear admin
│       │
│       ├── swagger.js                     # Configuración de Swagger
│       ├── swagger-output.json            # Documentación generada
│       ├── .env                           # Variables de entorno
│       ├── tsconfig.json                  # Configuración TypeScript
│       ├── vitest.config.ts               # Configuración de tests
│       └── package.json
│
├── package.json                           # Workspace root
└── README.md                              # Este archivo
```

---

## 🔒 Seguridad

### Medidas implementadas

✅ **Password hashing**: Bcrypt con 10 rounds (100ms por hash)  
✅ **JWT tokens**: Expiración de 7 días, secret configurable  
✅ **Role-based access**: ADMIN vs VENDEDOR (middleware `roleMiddleware`)  
✅ **Input validation**: En Domain layer (Email, nombres, montos)  
✅ **SQL injection prevention**: Prisma ORM con prepared statements  
✅ **CORS configurado**: Solo orígenes permitidos (`FRONTEND_URL`)

### Mejoras para producción

⚠️ **Falta implementar** (no crítico para el test técnico):

- **Rate Limiting**: Prevenir brute force attacks en `/login`
- **Helmet.js**: Security headers HTTP (XSS, clickjacking, etc.)
- **HTTPS obligatorio**: Redirect HTTP → HTTPS
- **Refresh tokens**: JWT de corta duración + refresh token
- **Environment secrets**: Usar AWS Secrets Manager / Railway vars
- **Audit logs**: Registrar acciones críticas (deletes, cambios de rol)
- **2FA**: Two-factor authentication para admins

---

## 🚀 Roadmap / Mejoras Futuras

### Performance

- [ ] Redis para cache de dashboard metrics (5 min TTL)
- [ ] Pagination en endpoints de listado (`?page=1&limit=20`)
- [ ] Database indexes adicionales basados en queries reales
- [ ] Connection pooling optimizado (actualmente usa defaults de Prisma)

### Observability

- [ ] Logging estructurado con Winston/Pino
- [ ] Métricas con Prometheus (request duration, error rate)
- [ ] APM con New Relic / Datadog
- [ ] Error tracking con Sentry
- [ ] Distributed tracing con OpenTelemetry

### Features

- [ ] Soft deletes (no destruir datos, usar `deletedAt`)
- [ ] API versioning (`/api/v1/`, `/api/v2/`)
- [ ] Webhooks para eventos de leads
- [ ] Email notifications (Nodemailer) cuando lead es GANADO
- [ ] Export de datos (CSV, Excel)
- [ ] Filtros avanzados en listados (búsqueda, ordenamiento)
- [ ] Búsqueda full-text con PostgreSQL FTS

### DevOps

- [ ] Docker Compose para desarrollo local
- [ ] CI/CD con GitHub Actions (lint, test, deploy)
- [ ] Deploy automatizado a Railway/Render
- [ ] Database backups automatizados
- [ ] Health checks detallados (DB connection, memory, CPU)
- [ ] Staging environment separado de producción

---

## 👨‍💻 Autor

Desarrollado como prueba técnica para **CrecIA**.

**Tiempo invertido**: ~12 horas

- Backend + Arquitectura: 6h
- Tests: 2h
- Swagger Docs: 1h
- Documentación: 3h

---

## 📄 Licencia

ISC

---

## 🙏 Agradecimientos

Gracias por revisar este proyecto. Cualquier feedback es bienvenido.

**Para dudas o consultas**: [Contactar al autor]
