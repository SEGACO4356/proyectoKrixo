# 🚀 Guía de Despliegue en Render

Esta guía te llevará paso a paso para desplegar el Sistema de Inventario Krixo en Render.

## ✅ Ventajas de Render

- ✅ Plan gratuito generoso
- ✅ PostgreSQL incluido (750 horas/mes gratis)
- ✅ Auto-deploy desde Git
- ✅ SSL/HTTPS automático
- ✅ Fácil configuración

## 📋 Pre-requisitos

1. Cuenta en [Render.com](https://render.com) (gratis)
2. Repositorio Git (GitHub, GitLab, o Bitbucket)
3. Código pusheado al repositorio

## 🗄️ Paso 1: Crear Base de Datos PostgreSQL

### 1.1 Crear PostgreSQL Database

1. Ir a https://dashboard.render.com
2. Click en **"New +"** → **"PostgreSQL"**
3. Configurar:
   - **Name**: `krixo-inventory-db`
   - **Database**: `krixo_inventory`
   - **User**: `krixo` (opcional, se auto-genera)
   - **Region**: Elegir más cercano (ej: Frankfurt, Oregon)
   - **PostgreSQL Version**: 15
   - **Plan**: Free
4. Click **"Create Database"**
5. Esperar ~2 minutos mientras se crea

### 1.2 Obtener Connection String

1. Ir a la base de datos creada
2. En el dashboard, buscar **"Connections"**
3. Copiar **"Internal Database URL"** (no External)
   - Formato: `postgresql://user:password@dpg-xxxxx/dbname`
   - ⚠️ Usar Internal URL (conexión más rápida dentro de Render)

**Ejemplo**:
```
postgresql://krixo:xyzABC123@dpg-ch9abc123-a.frankfurt-postgres.render.com/krixo_inventory
```

✅ **Guardar esta URL**, la necesitarás en el Paso 2

---

## 🖥️ Paso 2: Desplegar Backend

### 2.1 Crear Web Service

1. Dashboard de Render → **"New +"** → **"Web Service"**
2. Conectar repositorio Git:
   - Si es primera vez, autorizar GitHub/GitLab
   - Buscar tu repositorio: `tu-usuario/proyectoKrixo`
   - Click **"Connect"**

### 2.2 Configurar Web Service

**Build & Deploy:**
- **Name**: `krixo-backend`
- **Region**: Mismo que la base de datos (ej: Frankfurt)
- **Branch**: `main` (o `master`)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```

**Plan**: Free

### 2.3 Variables de Entorno

Scroll a **"Environment Variables"** y agregar:

| Key | Value |
|-----|-------|
| `PORT` | `3001` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | `<pegar-internal-url-del-paso-1>` |
| `CORS_ORIGIN` | `https://krixo-frontend.onrender.com` (ajustar después) |

**Ejemplo de DATABASE_URL**:
```
postgresql://krixo:xyzABC123@dpg-ch9abc123-a.frankfurt-postgres.render.com/krixo_inventory
```

⚠️ **Importante**: Usar la Internal Database URL, NO la External

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render empezará a construir automáticamente
3. Ver logs en tiempo real
4. Esperar mensajes de éxito:
   ```
   🔌 Connecting to PostgreSQL...
   ✅ PostgreSQL connected successfully
   🔄 Running database migrations...
   ✅ Migrations table ready
   📊 Executed migrations: 0
   📁 Found migration files: 1
   🚀 Running 1 pending migration(s)...
   ⏳ Running migration: 001_initial_schema.sql
   ✅ Migration completed: 001_initial_schema.sql
   ✅ All migrations completed successfully
   
   🚀 Server running on http://localhost:3001
   ```

### 2.5 Obtener URL del Backend

1. Una vez deployado, ir a la página del servicio
2. En la parte superior verás la URL:
   - **URL**: `https://krixo-backend.onrender.com`
3. ✅ **Copiar esta URL** para el frontend

### 2.6 Verificar Backend

Probar en navegador:
```
https://krixo-backend.onrender.com/api/health
```

Debe retornar:
```json
{"status":"ok","timestamp":"2026-01-11T..."}
```

---

## 🎨 Paso 3: Desplegar Frontend

### 3.1 Crear Static Site

1. Dashboard → **"New +"** → **"Static Site"**
2. Conectar mismo repositorio
3. Click **"Connect"**

### 3.2 Configurar Static Site

**Build & Deploy:**
- **Name**: `krixo-frontend`
- **Region**: Mismo que backend (Frankfurt)
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Publish Directory**: `.next`

**Plan**: Free

### 3.3 Variables de Entorno

En **"Environment Variables"**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://krixo-backend.onrender.com/api` |

⚠️ Usar la URL del backend del Paso 2.5

### 3.4 Deploy

1. Click **"Create Static Site"**
2. Esperar el build (~3-5 minutos)
3. Ver logs hasta ver:
   ```
   Route (app)                              Size     First Load JS
   ┌ ○ /                                    ...
   ├ ○ /movements                           ...
   ├ ○ /products                            ...
   └ ○ /sales                               ...
   
   ✓ Compiled successfully
   ```

### 3.5 Obtener URL del Frontend

1. En la página del servicio, ver la URL:
   - **URL**: `https://krixo-frontend.onrender.com`

---

## 🔄 Paso 4: Actualizar CORS en Backend

Ahora que tienes la URL del frontend, actualizar el backend:

### 4.1 Actualizar Variable de Entorno

1. Ir al servicio **krixo-backend**
2. Tab **"Environment"**
3. Editar variable `CORS_ORIGIN`
4. Cambiar a: `https://krixo-frontend.onrender.com`
5. Click **"Save Changes"**

Render automáticamente re-desplegará el backend.

---

## ✅ Paso 5: Verificar Funcionamiento

### 5.1 Probar Backend

```bash
# Health check
curl https://krixo-backend.onrender.com/api/health

# Productos (debe mostrar 5 productos de ejemplo)
curl https://krixo-backend.onrender.com/api/products
```

### 5.2 Probar Frontend

1. Abrir en navegador: `https://krixo-frontend.onrender.com`
2. Verificar:
   - ✅ Dashboard carga
   - ✅ Se muestran productos
   - ✅ Crear producto funciona
   - ✅ Movimientos y ventas funcionan

---

## 🎯 URLs Finales

Actualiza el README.md con tus URLs:

```markdown
## 🚀 Demo en Producción

- **Frontend**: https://krixo-frontend.onrender.com
- **Backend API**: https://krixo-backend.onrender.com/api
```

---

## 🔧 Troubleshooting

### ❌ Error: "Application failed to respond"

**Causa**: El backend tarda en iniciar (cold start en plan gratuito)

**Solución**: 
- Esperar 30-60 segundos
- Refresh la página
- Primera petición siempre es lenta

### ❌ Error: CORS en consola del navegador

**Causa**: `CORS_ORIGIN` no coincide con URL del frontend

**Solución**:
1. Verificar que `CORS_ORIGIN` en backend = URL exacta del frontend
2. Re-desplegar backend después de cambiar

### ❌ Error: "Failed to connect to PostgreSQL"

**Causa**: `DATABASE_URL` incorrecta

**Solución**:
1. Verificar que usas **Internal Database URL**
2. Copiar de nuevo desde dashboard de PostgreSQL
3. Verificar formato: `postgresql://user:pass@host/dbname`

### ❌ Frontend muestra error de red

**Causa**: `NEXT_PUBLIC_API_URL` incorrecta

**Solución**:
1. Verificar variable en frontend
2. Debe ser: `https://tu-backend.onrender.com/api` (con `/api` al final)
3. Re-desplegar frontend

### ❌ Migraciones no se ejecutan

**Causa**: Error de conexión a base de datos

**Solución**:
1. Ver logs del backend en Render
2. Verificar mensaje: "PostgreSQL connected successfully"
3. Si falla, revisar DATABASE_URL

### ⚠️ Servicio se apaga después de 15 minutos

**Causa**: Plan gratuito de Render apaga servicios inactivos

**Comportamiento normal**:
- Después de 15 min sin tráfico → servicio se apaga
- Primera petición después → tarda ~30 seg en iniciar
- Peticiones siguientes → normales

**Solución para mantener activo** (opcional):
- Usar servicio como [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos
- Configurar ping a: `https://tu-backend.onrender.com/api/health`

---

## 🔄 Actualizar Aplicación

Render auto-despliega en cada push a la rama configurada:

```bash
# Hacer cambios en código
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Render detecta el push y re-despliega automáticamente
```

Ver progreso en dashboard de Render → Events

---

## 💰 Costos

### Plan Gratuito Incluye:

**PostgreSQL Database**:
- ✅ 1 GB de storage
- ✅ 750 horas/mes (suficiente para 1 app)
- ✅ Backup automático
- ⚠️ Se apaga después de 90 días de inactividad

**Web Service (Backend)**:
- ✅ 750 horas/mes
- ✅ 512 MB RAM
- ⚠️ Se apaga después de 15 min de inactividad

**Static Site (Frontend)**:
- ✅ Ilimitado
- ✅ CDN global
- ✅ SSL incluido

### Limitaciones Plan Gratuito:

- ⚠️ Cold starts (~30 seg primera petición)
- ⚠️ Servicios se apagan con inactividad
- ⚠️ Solo 1 base de datos gratis por cuenta

**Para producción real**: Considerar plan de pago ($7/mes backend + $7/mes database)

---

## 📊 Monitoreo

### Ver Logs

**Backend**:
1. Dashboard → krixo-backend
2. Tab "Logs"
3. Ver en tiempo real

**Frontend**:
1. Dashboard → krixo-frontend
2. Tab "Logs"

### Métricas

Dashboard muestra:
- ✅ CPU usage
- ✅ Memory usage
- ✅ Request count
- ✅ Response times

---

## 🎉 ¡Listo!

Tu aplicación está desplegada en:
- 🎨 **Frontend**: `https://krixo-frontend.onrender.com`
- 🖥️ **Backend**: `https://krixo-backend.onrender.com`
- 🗄️ **Database**: PostgreSQL con migraciones automáticas

### Próximos Pasos:

1. ✅ Actualizar README.md con las URLs públicas
2. ✅ Probar todas las funcionalidades
3. ✅ Compartir el link para la prueba técnica
4. ✅ (Opcional) Configurar dominio personalizado

---

**¿Necesitas ayuda?** 
- 📖 [Documentación de Render](https://render.com/docs)
- 💬 [Discord de Render](https://discord.gg/render)
