# 📦 Sistema de Inventario - Clean Architecture

Aplicación completa de gestión de inventario desarrollada con **Clean Architecture**, **DDD (Domain-Driven Design)**, y principios **SOLID**.

## 🚀 Demo en Producción

> **URL Pública:** [[Inventario]](https://frontend-production-ac8b.up.railway.app/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Docker](#-docker)
- [API Endpoints](#-api-endpoints)
- [Uso de IA](#-uso-de-ia)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## ✨ Características

### Gestión de Inventario
- ✅ **Productos**: CRUD completo de productos con SKU, precio, stock y categorías
- ✅ **Entradas**: Registro de entradas de inventario con trazabilidad
- ✅ **Salidas**: Registro de salidas con validación de stock disponible
- ✅ **Ventas**: Sistema de ventas con múltiples productos
- ✅ **Dashboard**: Estadísticas en tiempo real del inventario
- ✅ **Alertas de Stock Bajo**: Notificación de productos con stock mínimo

### Arquitectura y Buenas Prácticas
- ✅ **Clean Architecture**: Separación clara de capas (Domain, Application, Infrastructure)
- ✅ **DDD**: Entidades de dominio con reglas de negocio encapsuladas
- ✅ **SOLID**: Principios aplicados en toda la base de código
- ✅ **TypeScript**: Tipado estricto en frontend y backend
- ✅ **Migraciones Automáticas**: Sistema de migraciones tipo Laravel/Rails

## 🛠 Tecnologías

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **React Hooks** - Estado y efectos personalizados

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 5** - Framework web
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos relacional con migraciones automáticas
- **pg** - Cliente de PostgreSQL para Node.js
- **UUID** - Generación de identificadores únicos

### DevOps
- **Docker** - Contenerización
- **Docker Compose** - Orquestación de servicios

## 🏗 Arquitectura

### Clean Architecture + Migraciones Automáticas

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION                             │
│  (React Components, Pages, UI)                                  │
├─────────────────────────────────────────────────────────────────┤
│                        APPLICATION                               │
│  (Use Cases, Hooks, Services)                                   │
├─────────────────────────────────────────────────────────────────┤
│                          DOMAIN                                  │
│  (Entities, Repositories Interfaces, Value Objects)            │
├─────────────────────────────────────────────────────────────────┤
│                      INFRASTRUCTURE                              │
│  (API Clients, Repository Implementations, Controllers)        │
│                                                                  │
│  📦 Database Layer:                                             │
│    ├── Database.ts (Connection Pool)                           │
│    ├── MigrationRunner.ts (Auto-migrations) ⭐                 │
│    ├── PostgresRepositories                                     │
│    └── migrations/                                              │
│         ├── 001_initial_schema.sql                             │
│         └── 00X_future_migrations.sql                          │
└─────────────────────────────────────────────────────────────────┘

Flow de Migraciones al Iniciar:
1. Server starts → 2. Connect to DB → 3. Run migrations → 4. Start API
```

### Principios SOLID Aplicados

| Principio | Aplicación |
|-----------|------------|
| **S**ingle Responsibility | Cada caso de uso tiene una única responsabilidad |
| **O**pen/Closed | Entidades abiertas a extensión, cerradas a modificación |
| **L**iskov Substitution | Repositorios implementan interfaces del dominio |
| **I**nterface Segregation | Interfaces específicas para cada repositorio |
| **D**ependency Inversion | Dependencia hacia abstracciones (interfaces) |

## 📦 Instalación

### Prerrequisitos
- Node.js 20+
- npm o yarn
- Docker (opcional)

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd proyectoKrixo
```

2. **Instalar dependencias del Backend**
```bash
cd backend
npm install
```

3. **Instalar dependencias del Frontend**
```bash
cd ../frontend
npm install
```

4. **Configurar variables de entorno**

Backend (`.env`):
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database (PostgreSQL)
DATABASE_URL=postgresql://krixo:krixo_password@localhost:5432/krixo_inventory

# Para desarrollo sin base de datos (In-Memory):
# Deja DATABASE_URL vacío o comenta la línea
```

Frontend (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. **Iniciar PostgreSQL (con Docker)**

```bash
# Opción 1: Solo PostgreSQL
docker run -d \
  --name krixo-postgres \
  -e POSTGRES_USER=krixo \
  -e POSTGRES_PASSWORD=krixo_password \
  -e POSTGRES_DB=krixo_inventory \
  -p 5432:5432 \
  postgres:15-alpine

# Opción 2: Usar Docker Compose
docker-compose up -d postgres
```

**Nota**: Las migraciones se ejecutan automáticamente al iniciar el backend. No necesitas ejecutar scripts SQL manualmente.

6. **Iniciar en desarrollo**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

7. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- API: http://localhost:3001/api

## 🐳 Docker

### Construcción y Ejecución con PostgreSQL

```bash
# Construir y ejecutar todos los servicios (Backend + Frontend + PostgreSQL)
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (borra la base de datos)
docker-compose down -v
```

### Puertos Expuestos
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### Persistencia de Datos

Los datos de PostgreSQL se persisten en un volumen Docker llamado `postgres_data`. Para reiniciar con datos limpios:

```bash
docker-compose down -v
docker-compose up --build
```

## 🔄 Migraciones de Base de Datos

El proyecto incluye un sistema de migraciones automáticas similar a Laravel/Rails que ejecuta cambios en la base de datos al iniciar el servidor.

### Características

- ✅ **Auto-ejecución**: Las migraciones se ejecutan automáticamente al iniciar
- ✅ **Tracking**: Tabla `migrations` registra qué ya se ejecutó
- ✅ **Transacciones**: Rollback automático si falla
- ✅ **Versionado**: Archivos `001_*.sql`, `002_*.sql`, etc.
- ✅ **Compatible con Render**: Funciona en cualquier plataforma cloud

### Ver estado de migraciones

```bash
cd backend
npm run migration:status
```

### Crear nueva migración

```bash
# 1. Crear archivo en migrations/
touch src/infrastructure/database/migrations/002_nueva_feature.sql

# 2. Escribir SQL
echo "ALTER TABLE products ADD COLUMN new_field VARCHAR(100);" > src/infrastructure/database/migrations/002_nueva_feature.sql

# 3. Reiniciar servidor (ejecuta automáticamente)
npm run dev
```

📖 **Ver [MIGRATIONS_GUIDE.md](MIGRATIONS_GUIDE.md) para documentación completa**

## 📡 API Endpoints

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar todos los productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| GET | `/api/products/low-stock` | Productos con stock bajo |
| GET | `/api/products/category/:category` | Productos por categoría |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |

### Movimientos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/movements` | Listar movimientos |
| GET | `/api/movements/product/:productId` | Movimientos por producto |
| POST | `/api/movements/entry` | Registrar entrada |
| POST | `/api/movements/exit` | Registrar salida |

### Ventas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/sales` | Listar ventas |
| GET | `/api/sales/:id` | Obtener venta por ID |
| POST | `/api/sales` | Registrar venta |

### Dashboard
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Estadísticas generales |

### Health Check
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |

## 🤖 Uso de IA

Este proyecto fue desarrollado con apoyo de **GitHub Copilot (Claude)** como asistente de IA. A continuación se detalla dónde y cómo se utilizó:

### Áreas donde se usó IA

| Área | Descripción |
|------|-------------|
| **Arquitectura** | Diseño de la estructura de carpetas siguiendo Clean Architecture |
| **Entidades de Dominio** | Creación de entidades Product, Movement, Sale con validaciones |
| **Casos de Uso** | Implementación de CreateProduct, RegisterEntry, RegisterSale, etc. |
| **Repositorios** | Definición de interfaces y implementación in-memory |
| **Controladores** | Implementación de endpoints REST |
| **Componentes UI** | Diseño de componentes reutilizables con Tailwind |
| **Hooks Personalizados** | Lógica de estado y comunicación con API |
| **Docker** | Configuración de Dockerfiles y docker-compose |
| **Documentación** | Generación del README |

### Beneficios del uso de IA
- ⚡ **Velocidad**: Desarrollo acelerado de boilerplate y estructura
- 📐 **Consistencia**: Código coherente siguiendo patrones establecidos
- 📚 **Mejores Prácticas**: Implementación de Clean Architecture correctamente
- 🐛 **Menos Errores**: Detección temprana de problemas de tipado

## 🌐 Despliegue

### Opciones de Despliegue Recomendadas

#### 1. Railway (Recomendado)
```bash
# 1. Instalar Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Crear proyecto
railway init

# 4. Agregar PostgreSQL
railway add postgresql

# 5. Configurar variables de entorno
railway variables set PORT=3001
railway variables set CORS_ORIGIN=https://tu-frontend-url.railway.app

# 6. Deploy
railway up
```

#### 2. Render
1. Conectar repositorio GitHub
2. Crear PostgreSQL Database
3. Crear Web Service para Backend
   - Environment: Node
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     - `DATABASE_URL` (auto-configurado)
     - `CORS_ORIGIN=https://tu-frontend-url.onrender.com`
4. Crear Static Site para Frontend
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/out`

#### 3. Docker en VPS (DigitalOcean, Linode, AWS EC2)
```bash
# Clonar repositorio
git clone <tu-repo>
cd proyectoKrixo

# Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores

# Ejecutar con Docker Compose
docker-compose up -d --build

# Configurar nginx como reverse proxy (opcional)
```

### Variables de Entorno para Producción

**Backend:**
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://tu-frontend-url.com
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://tu-backend-url.com/api
```

## 📁 Estructura del Proyecto

```
proyectoKrixo/
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/          # Product, Movement, Sale
│   │   │   ├── repositories/      # Interfaces de repositorios
│   │   │   └── value-objects/     # Money, Quantity
│   │   ├── application/
│   │   │   ├── dtos/              # Data Transfer Objects
│   │   │   └── use-cases/         # Casos de uso
│   │   ├── infrastructure/
│   │   │   ├── database/          # PostgreSQL (Database, init.sql)
│   │   │   ├── repositories/      # Implementaciones (In-Memory y Postgres)
│   │   │   └── http/
│   │   │       ├── controllers/   # Controladores Express
│   │   │       ├── routes/        # Definición de rutas
│   │   │       └── middlewares/   # Error handling, logging
│   │   └── index.ts               # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/          # Tipos e interfaces
│   │   │   └── types/             # ApiResponse, etc.
│   │   ├── application/
│   │   │   └── hooks/             # useProducts, useSales, etc.
│   │   ├── infrastructure/
│   │   │   └── api/               # API Client y servicios
│   │   ├── presentation/
│   │   │   └── components/
│   │   │       ├── layout/        # Sidebar, Header
│   │   │       └── ui/            # Button, Card, Modal, etc.
│   │   └── app/
│   │       ├── page.tsx           # Dashboard
│   │       ├── products/          # Gestión de productos
│   │       ├── movements/         # Movimientos de inventario
│   │       └── sales/             # Registro de ventas
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

Desarrollado con ❤️ usando Clean Architecture, DDD y SOLID
# proyectoKrixo
