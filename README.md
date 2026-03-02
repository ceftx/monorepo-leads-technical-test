# 📊 Sistema de Gestión de Leads

Sistema completo de gestión de leads con notificaciones en tiempo real, bot de Telegram, y dashboard de métricas.

## ✨ Características

- ✅ **Autenticación JWT** con roles (ADMIN/VENDEDOR)
- ✅ **CRUD de Leads** con validaciones
- ✅ **Dashboard con métricas** (total leads, distribución por estado, monto estimado, ranking de vendedores)
- ✅ **Notificaciones en Tiempo Real** (WebSocket con Socket.IO)
- ✅ **Bot de Telegram** para consultas externas (`/stats`, `/users`, `/leads`, `/monto`, `/ranking`)
- ✅ **Búsqueda local** de leads
- ✅ **Arquitectura limpia** (Clean Architecture / Hexagonal)

## 🛠️ Stack

**Backend**: Node.js, TypeScript, Express, Prisma, PostgreSQL, Socket.IO, Telegram Bot API  
**Frontend**: React 18, TypeScript, Vite, Material-UI, Socket.IO Client

## 🚀 Setup Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia los ejemplos y edita con tus valores:

**Backend** (`packages/backend/.env`):

```bash
cp packages/backend/.env.example packages/backend/.env
```

Edita el archivo con tu info de PostgreSQL, JWT secret, y (opcional) token de Telegram Bot.

**Frontend** (`packages/frontend/.env`):

```bash
cp packages/frontend/.env.example packages/frontend/.env
```

### 3. Setup base de datos

```bash
cd packages/backend
npx prisma migrate deploy
npx prisma db seed  # (opcional) datos de prueba
```

### 4. Ejecutar en desarrollo

```bash
# Desde la raíz (ejecuta backend + frontend)
npm run dev

# O por separado:
npm run dev:backend   # http://localhost:3000
npm run dev:frontend  # http://localhost:5173
```

## 📚 Documentación API

**Swagger**: `http://localhost:3000/api-docs`

### Endpoints principales

```http
POST   /api/auth/login                    # Login
POST   /api/auth/register                 # Registro (admin only)

GET    /api/leads                         # Listar leads
POST   /api/leads                         # Crear lead
PATCH  /api/leads/:id/status              # Actualizar estado
DELETE /api/leads/:id                     # Eliminar lead

GET    /api/dashboard/user                # Métricas del usuario
GET    /api/dashboard/global              # Métricas globales (admin)

GET    /api/notifications                 # Listar notificaciones
POST   /api/notifications/:id/read        # Marcar como leída
POST   /api/notifications/read-all        # Marcar todas como leídas
```

### WebSocket

**Conexión**: Automática al hacer login (usa token JWT)

**Eventos**:

- `connected` - Confirmación de conexión
- `notification` - Nueva notificación en tiempo real

**Tipos de notificaciones**:

- `LEAD_CREATED` - Nuevo lead
- `LEAD_STATUS_CHANGED` - Estado actualizado
- `LEAD_DELETED` - Lead eliminado

### Bot de Telegram

Comandos disponibles (sin autenticación):

```
/start      # Bienvenida
/stats      # Estadísticas generales
/users      # Total de usuarios
/leads      # Info de leads
/monto      # Monto estimado total
/ranking    # Top 5 vendedores
```

Para crear tu bot:

1. Busca [@BotFather](https://t.me/BotFather) en Telegram
2. Envía `/newbot` y sigue las instrucciones
3. Copia el token y agrégalo al `.env`

## 🏗️ Arquitectura

### Backend - Clean Architecture

```
packages/backend/src/
├── domain/              # Entidades y lógica de negocio
├── application/         # Casos de uso y servicios
│   ├── services/
│   │   └── NotificationService.ts
│   └── use-cases/
├── infrastructure/      # Implementaciones técnicas
│   ├── in/http/         # Controllers, routes, middlewares
│   ├── out/prisma/      # Repositorios
│   ├── websockets/      # Socket.IO server
│   └── telegram/        # Telegram bot
└── shared/              # DI, utilidades
```

### Frontend

```
packages/frontend/src/
├── api/                 # Clientes HTTP
├── contexts/            # React Context (Auth, etc)
├── hooks/               # useSocket, useNotifications, etc
├── services/            # socket.service.ts
├── layout/              # MainLayout, Header, NotificationSection
└── views/               # Páginas (dashboard, leads, login)
```

## 🚢 Deploy

### Railway

**Backend**:

1. Root Directory: `packages/backend`
2. Add PostgreSQL service
3. Set env vars: `JWT_SECRET`, `CORS_ORIGIN`, `TELEGRAM_BOT_TOKEN` (opcional)

**Frontend**:

1. Root Directory: `packages/frontend`
2. Set env var: `VITE_API_URL` (URL del backend en Railway)

## 🔐 Roles y Permisos

**ADMIN**:

- Ve todos los leads
- Puede gestionar usuarios
- Dashboard global
- Recibe todas las notificaciones

**VENDEDOR**:

- Ve solo sus leads
- Dashboard personal
- Recibe notificaciones de sus leads

**Usuario por defecto**:

```
Email: admin@leads.com
Password: admin123
Rol: ADMIN
```

## 🛠️ Scripts

```bash
npm run dev              # Backend + Frontend
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend
npm run build            # Build all
npm run format           # Prettier
```

## 📝 Decisiones Técnicas

**¿Por qué Clean Architecture?**  
Separación clara de responsabilidades, testeable, escalable.

**¿Por qué Socket.IO?**  
Bidireccional, reconexión automática, rooms para notificaciones targeted.

**¿Por qué Prisma?**  
Type-safety, migraciones automáticas, excelente DX.

**¿Por qué Monorepo?**  
Compartir tipos entre frontend/backend, versionado único, deploy coordinado.

**¿Por qué tsx en producción (backend)?**  
Prisma usa `require()` dinámico que no se puede bundlear. `tsx` evita problemas de compatibilidad ESM.

## 📄 Licencia

MIT
