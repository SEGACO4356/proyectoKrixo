# 📦 Sistema de Inventario - Clean Architecture

Sistema completo de gestión de inventario desarrollado con **Clean Architecture**, **DDD (Domain-Driven Design)**, y principios **SOLID**. Incluye frontend responsive, backend RESTful, migraciones automáticas de base de datos y despliegue en producción.

## 🚀 Demo en Producción

> **Frontend:** https://frontend-production-ac8b.up.railway.app  
> **Backend API:** https://backend-production-0c9c.up.railway.app  
> **Health Check:** https://backend-production-0c9c.up.railway.app/api/health

**Desplegado en Railway** con PostgreSQL, Docker y migraciones automáticas.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Instalación Local](#-instalación-local)
- [Docker](#-docker)
- [Migraciones de Base de Datos](#-migraciones-de-base-de-datos)
- [API Endpoints](#-api-endpoints)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## ✨ Características

### Funcionalidades del Sistema
- ✅ **Dashboard en Tiempo Real**: Estadísticas, alertas de stock bajo, métricas de ventas e inventario
- ✅ **Gestión de Productos**: CRUD completo con SKU, precio, stock, categorías y validaciones
- ✅ **Control de Movimientos**: Registro de entradas y salidas con trazabilidad completa
- ✅ **Sistema de Ventas**: Ventas multi-producto con cálculo automático y actualización de stock
- ✅ **Alertas Inteligentes**: Notificaciones de productos con stock bajo o agotados
- ✅ **Búsqueda y Filtros**: Búsqueda por nombre, SKU o categoría en tiempo real

### Características Técnicas
- ✅ **Clean Architecture**: Separación clara en 4 capas (Domain, Application, Infrastructure, Presentation)
- ✅ **DDD**: Entidades con lógica de negocio encapsulada y repositorios abstractos
- ✅ **SOLID**: Todos los principios aplicados (SRP, OCP, LSP, ISP, DIP)
- ✅ **TypeScript Estricto**: Tipado end-to-end en frontend y backend
- ✅ **Migraciones Automáticas**: Sistema de versionado de BD tipo Laravel/Rails
- ✅ **Responsive Design**: UI móvil con drawer sidebar y grids adaptables
- ✅ **PostgreSQL**: Base de datos relacional con transacciones y connection pooling
- ✅ **Docker Ready**: Contenedores para desarrollo y producción
- ✅ **CI/CD**: Despliegue automático en Railway con GitHub

## 🛠 Tecnologías

### Frontend
- **Next.js 16** - Framework React con App Router y Turbopack
- **TypeScript 5** - Tipado estático estricto
- **Tailwind CSS 4** - Estilos utilitarios con modo responsive
- **React 19** - Hooks, Suspense y Server Components
- **Custom Hooks** - Gestión de estado y lógica reutilizable

### Backend
- **Node.js 20** - Runtime moderno de JavaScript
- **Express 5** - Framework web minimalista
- **TypeScript 5** - Tipado estático end-to-end
- **PostgreSQL** - Base de datos relacional con ACID
- **pg 8** - Cliente PostgreSQL nativo con connection pooling
- **dotenv** - Gestión de variables de entorno
- **UUID** - Identificadores únicos distribuidos

### DevOps & Deployment
- **Docker** - Contenerización de servicios
- **Docker Compose** - Orquestación multi-contenedor
- **Railway** - PaaS para frontend, backend y PostgreSQL
- **GitHub** - Control de versiones y CI/CD

## 🏗 Arquitectura

### Clean Architecture + DDD

El proyecto implementa **Clean Architecture** con 4 capas claramente separadas y **Domain-Driven Design** para encapsular la lógica de negocio.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  • React Components (UI, Layout)                                │
│  • Pages (Dashboard, Products, Movements, Sales)               │
│  • Responsive Design (Mobile drawer, adaptive grids)           │
├─────────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                            │
│  • Use Cases (CreateProduct, RegisterSale, etc.)              │
│  • Custom Hooks (useProducts, useSales, useDashboard)         │
│  • DTOs (Data Transfer Objects)                                │
├─────────────────────────────────────────────────────────────────┤
│                       DOMAIN LAYER                              │
│  • Entities (Product, Movement, Sale) + Business Rules        │
│  • Repository Interfaces (IProductRepository, etc.)            │
│  • Value Objects (validations, constraints)                    │
├─────────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                          │
│  • HTTP (Controllers, Routes, Middlewares)                     │
│  • Database (Connection Pool, Transactions)                    │
│  • Repository Implementations:                                 │
│    ├── In-Memory (para testing rápido)                        │
│    └── PostgreSQL (producción)                                │
│  • Migration System ⭐                                         │
│    ├── MigrationRunner (auto-ejecuta al iniciar)             │
│    ├── migrations/ (SQL versionados)                          │
│    └── migrations table (tracking)                            │
└─────────────────────────────────────────────────────────────────┘
```

### Flujo de Migraciones (Startup)

```
1. npm start
   ↓
2. Database.healthCheck()
   ↓
3. MigrationRunner.runPendingMigrations()
   ├── Crea tabla `migrations` si no existe
   ├── Lee archivos .sql ordenados (001, 002, ...)
   ├── Compara con ejecutadas
   ├── Ejecuta pendientes en transacción
   └── Rollback automático si falla
   ↓
4. Express server.listen()
```

### Principios SOLID Implementados

| Principio | Implementación en el Proyecto |
|-----------|-------------------------------|
| **S**ingle Responsibility | Cada caso de uso tiene una única responsabilidad (ej: `CreateProductUseCase`) |
| **O**pen/Closed | Entidades extendibles sin modificación (ej: `Product` puede agregar campos) |
| **L**iskov Substitution | `PostgresProductRepository` y `InMemoryProductRepository` son intercambiables |
| **I**nterface Segregation | Interfaces específicas (`IProductRepository`, `ISaleRepository`) |
| **D**ependency Inversion | Use cases dependen de abstracciones (`IProductRepository`), no implementaciones |

## 📦 Instalación Local

### Prerrequisitos
- **Node.js 20+** (con npm)
- **PostgreSQL 15+** (local o Docker)
- **Git**
- **Docker** (opcional, para ejecutar Postgres)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/SEGACO4356/proyectoKrixo.git
cd proyectoKrixo
```

### Paso 2: Configurar PostgreSQL

**Opción A: Con Docker (Recomendado)**

```bash
docker run -d \
  --name krixo-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=inventory_db \
  -p 5432:5432 \
  postgres:15-alpine
```

**Opción B: PostgreSQL Local**

```bash
# Crear base de datos
createdb -U postgres inventory_db
```

### Paso 3: Configurar Variables de Entorno

**Backend** - Crear `backend/.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend** - Crear `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Paso 4: Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Paso 5: Iniciar en Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

El backend iniciará en `http://localhost:3001` y ejecutará las migraciones automáticamente.

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend iniciará en `http://localhost:3000`.

### Paso 6: Verificar Instalación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/health
- **PostgreSQL**: Conectar a `localhost:5432`

### Comandos Útiles

```bash
# Ver estado de migraciones
cd backend
npm run migration:status

# Build de producción
npm run build

# Ejecutar en producción
npm start

# Linter/Type check
npm run type-check  # (si está configurado)
```

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

### Despliegue en Railway (Implementado)

Este proyecto está actualmente desplegado en **Railway** con los siguientes servicios:

**🟢 Servicios Activos:**
- **Frontend**: [frontend-production-ac8b.up.railway.app](https://frontend-production-ac8b.up.railway.app)
- **Backend**: [backend-production-0c9c.up.railway.app](https://backend-production-0c9c.up.railway.app/api)
- **PostgreSQL**: Base de datos administrada por Railway (us-west1)

### Configuración de Railway

#### 1. Backend Service

**Build & Deploy:**
- **Root Directory**: `backend`
- **Builder**: Dockerfile
- **Watch Paths**: `backend/**`

**Variables de Entorno:**
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://frontend-production-ac8b.up.railway.app
DATABASE_URL=${{Postgres.DATABASE_URL}}/api
```

⚠️ **Importante**: Railway proporciona `DATABASE_URL` automáticamente al agregar PostgreSQL. Asegúrate de agregar `/api` al final.

**Healthcheck:**
- Path: `/api/health`
- Method: GET
- Expected Response: `200 OK`

#### 2. Frontend Service

**Build & Deploy:**
- **Root Directory**: `frontend`
- **Builder**: Dockerfile
- **Watch Paths**: `frontend/**`

**Variables de Entorno:**
```env
NEXT_PUBLIC_API_URL=https://backend-production-0c9c.up.railway.app/api
```

#### 3. PostgreSQL Database

Railway provisiona automáticamente:
- PostgreSQL 15
- Almacenamiento persistente (SSD)
- Backups automáticos
- Variables de entorno inyectadas

### Flujo de Deployment

```
1. Push a main branch
   ↓
2. Railway detecta cambios en backend/ o frontend/
   ↓
3. Build Docker image
   ↓
4. Ejecuta migraciones automáticas (backend)
   ↓
5. Deploy con zero downtime
   ↓
6. Health check verification
```

### Comandos Railway CLI

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Seleccionar proyecto
railway link

# Ver logs en tiempo real
railway logs --service backend
railway logs --service frontend

# Ejecutar comandos en producción
railway run npm run migration:status

# Ver variables de entorno
railway variables

# Agregar/modificar variable
railway variables set CORS_ORIGIN=https://nuevo-url.railway.app
```

### Verificación de Deployment

```bash
# Backend health check
curl https://backend-production-0c9c.up.railway.app/api/health

# Ejemplo de respuesta exitosa:
# {"status":"ok","database":"connected"}

# Test de productos
curl https://backend-production-0c9c.up.railway.app/api/products
```

### Troubleshooting

#### Error: "CORS origin not allowed"
✅ Verificar que `CORS_ORIGIN` no tenga trailing slash:
```env
# ❌ Incorrecto
CORS_ORIGIN=https://frontend.railway.app/

# ✅ Correcto
CORS_ORIGIN=https://frontend.railway.app
```

#### Error: "database does not exist"
✅ Asegurarse que `DATABASE_URL` incluya `/api`:
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}/api
```

#### Error: "Cannot find module 'next'"
✅ Verificar que `package.json` esté copiado en Dockerfile runner stage:
```dockerfile
COPY --from=builder /app/package.json ./package.json
```

### Costos Estimados Railway

- **Starter Plan** (Hobby): $5/mes (500 horas ejecución)
- **Developer Plan**: $20/mes (uso ilimitado)
- PostgreSQL incluido en el plan

### Variables de Entorno Completas

**Backend (.env):**
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://frontend-production-ac8b.up.railway.app
DATABASE_URL=${{Postgres.DATABASE_URL}}/api
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://backend-production-0c9c.up.railway.app/api
```

## 📁 Estructura del Proyecto

```
proyectoKrixo/
├── backend/
│   ├── src/
│   │   ├── domain/                    # 🎯 Capa de Dominio (Reglas de Negocio)
│   │   │   ├── entities/
│   │   │   │   ├── Product.ts         # Entidad Producto
│   │   │   │   ├── Movement.ts        # Entidad Movimiento
│   │   │   │   └── Sale.ts            # Entidad Venta
│   │   │   ├── repositories/
│   │   │   │   ├── IProductRepository.ts
│   │   │   │   ├── IMovementRepository.ts
│   │   │   │   └── ISaleRepository.ts
│   │   │   └── value-objects/
│   │   │       ├── Money.ts           # Value Object para dinero
│   │   │       └── Quantity.ts        # Value Object para cantidad
│   │   │
│   │   ├── application/               # 🎯 Capa de Aplicación (Casos de Uso)
│   │   │   ├── dtos/
│   │   │   │   ├── CreateProductDto.ts
│   │   │   │   ├── RegisterMovementDto.ts
│   │   │   │   └── RegisterSaleDto.ts
│   │   │   └── use-cases/
│   │   │       ├── CreateProductUseCase.ts
│   │   │       ├── UpdateProductUseCase.ts
│   │   │       ├── DeleteProductUseCase.ts
│   │   │       ├── GetProductsUseCase.ts
│   │   │       ├── RegisterEntryUseCase.ts
│   │   │       ├── RegisterExitUseCase.ts
│   │   │       ├── RegisterSaleUseCase.ts
│   │   │       └── GetDashboardStatsUseCase.ts
│   │   │
│   │   ├── infrastructure/            # 🎯 Capa de Infraestructura (Implementaciones)
│   │   │   ├── database/
│   │   │   │   ├── Database.ts        # Connection Pool Manager
│   │   │   │   ├── MigrationRunner.ts # Sistema de migraciones automáticas
│   │   │   │   └── migrations/        # SQL migrations versionados
│   │   │   │       ├── 001_create_products.sql
│   │   │   │       ├── 002_create_movements.sql
│   │   │   │       └── 003_create_sales.sql
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   ├── InMemoryProductRepository.ts
│   │   │   │   ├── PostgresProductRepository.ts
│   │   │   │   ├── InMemoryMovementRepository.ts
│   │   │   │   ├── PostgresMovementRepository.ts
│   │   │   │   ├── InMemorySaleRepository.ts
│   │   │   │   └── PostgresSaleRepository.ts
│   │   │   │
│   │   │   └── http/
│   │   │       ├── controllers/
│   │   │       │   ├── HealthController.ts
│   │   │       │   ├── ProductController.ts
│   │   │       │   ├── MovementController.ts
│   │   │       │   ├── SaleController.ts
│   │   │       │   └── DashboardController.ts
│   │   │       ├── routes/
│   │   │       │   ├── index.ts       # Router principal
│   │   │       │   ├── productRoutes.ts
│   │   │       │   ├── movementRoutes.ts
│   │   │       │   ├── saleRoutes.ts
│   │   │       │   └── dashboardRoutes.ts
│   │   │       └── middlewares/
│   │   │           ├── errorHandler.ts
│   │   │           └── logger.ts
│   │   │
│   │   └── index.ts                   # Entry point - Configuración Express
│   │
│   ├── Dockerfile                     # Multi-stage build con migraciones
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── domain/                    # 🎯 Capa de Dominio (Tipos)
│   │   │   ├── entities/
│   │   │   │   ├── Product.ts
│   │   │   │   ├── Movement.ts
│   │   │   │   └── Sale.ts
│   │   │   └── types/
│   │   │       ├── ApiResponse.ts
│   │   │       └── PaginatedResponse.ts
│   │   │
│   │   ├── application/               # 🎯 Capa de Aplicación (Lógica)
│   │   │   └── hooks/
│   │   │       ├── useProducts.ts     # Hook para gestión de productos
│   │   │       ├── useMovements.ts    # Hook para movimientos
│   │   │       ├── useSales.ts        # Hook para ventas
│   │   │       └── useDashboard.ts    # Hook para dashboard
│   │   │
│   │   ├── infrastructure/            # 🎯 Capa de Infraestructura (API)
│   │   │   └── api/
│   │   │       ├── apiClient.ts       # Cliente HTTP (fetch wrapper)
│   │   │       ├── productService.ts
│   │   │       ├── movementService.ts
│   │   │       ├── saleService.ts
│   │   │       └── dashboardService.ts
│   │   │
│   │   ├── presentation/              # 🎯 Capa de Presentación (UI)
│   │   │   └── components/
│   │   │       ├── layout/
│   │   │       │   ├── AppShell.tsx   # Layout principal con drawer mobile
│   │   │       │   ├── Sidebar.tsx    # Sidebar responsive
│   │   │       │   └── Header.tsx     # Header con breadcrumbs
│   │   │       │
│   │   │       └── ui/                # Componentes reutilizables
│   │   │           ├── Button.tsx
│   │   │           ├── Card.tsx
│   │   │           ├── Modal.tsx
│   │   │           ├── Input.tsx      # Input con fix dark mode
│   │   │           ├── Select.tsx     # Select con fix dark mode
│   │   │           ├── Table.tsx
│   │   │           ├── Badge.tsx
│   │   │           └── Loading.tsx
│   │   │
│   │   └── app/                       # Next.js App Router
│   │       ├── layout.tsx             # Root layout con AppShell
│   │       ├── page.tsx               # Dashboard (/)
│   │       │
│   │       ├── products/
│   │       │   ├── page.tsx           # Lista de productos
│   │       │   └── [id]/
│   │       │       └── page.tsx       # Detalle de producto
│   │       │
│   │       ├── movements/
│   │       │   └── page.tsx           # Registro de movimientos
│   │       │
│   │       └── sales/
│   │           └── page.tsx           # Registro de ventas
│   │
│   ├── Dockerfile                     # Next.js standalone build
│   ├── next.config.ts                 # Configuración Next.js
│   ├── tailwind.config.ts             # Tailwind CSS 4
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local.example
│
├── docker-compose.yml                 # Orquestación completa (Backend + Frontend + Postgres)
├── docker-compose.dev.yml             # Ambiente de desarrollo
├── .gitignore
└── README.md
```

### Características Clave del Proyecto

✅ **Clean Architecture**: Separación en 4 capas (Domain, Application, Infrastructure, Presentation)  
✅ **SOLID Principles**: Interfaces, inversión de dependencias, single responsibility  
✅ **Domain-Driven Design**: Entidades ricas, Value Objects, Repository Pattern  
✅ **Migraciones Automáticas**: MigrationRunner ejecuta SQL al iniciar  
✅ **Responsive Design**: Mobile-first con drawer sidebar  
✅ **Dark Mode Support**: Fixed input/select text color  
✅ **TypeScript**: Type-safety en frontend y backend  
✅ **Docker**: Multi-stage builds optimizados  
✅ **Railway Deployment**: CI/CD automático con PostgreSQL  

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

Desarrollado con ❤️ usando Clean Architecture, DDD y SOLID
# proyectoKrixo
