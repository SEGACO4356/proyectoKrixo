# ✅ Checklist de Despliegue en Render

Este documento te guía paso a paso para desplegar tu aplicación en Render. Marca cada paso a medida que lo completes.

---

## 📋 Pre-Despliegue

### Git y Repositorio
- [ ] Código está en repositorio Git (GitHub/GitLab/Bitbucket)
- [ ] Branch `main` o `master` está actualizado
- [ ] Último commit incluye todas las migraciones
- [ ] `.gitignore` está configurado (no sube `.env`, `node_modules`, etc.)

### Verificación Local
- [ ] `cd backend && npm install` funciona sin errores
- [ ] `cd backend && npm run build` funciona sin errores
- [ ] `cd frontend && npm install` funciona sin errores
- [ ] `cd frontend && npm run build` funciona sin errores
- [ ] PostgreSQL local funciona (opcional, pero recomendado probar)

### Cuenta Render
- [ ] Cuenta creada en [render.com](https://render.com)
- [ ] Email verificado
- [ ] Repositorio Git conectado a Render

---

## 🗄️ Parte 1: Base de Datos PostgreSQL

### Crear Database
- [ ] En Render Dashboard, click "New +" → "PostgreSQL"
- [ ] Name: `krixo-inventory-db`
- [ ] Database: `krixo_inventory`
- [ ] Region: `Frankfurt` (o el más cercano)
- [ ] PostgreSQL Version: `15`
- [ ] Plan: `Free`
- [ ] Click "Create Database"
- [ ] Esperar ~2 minutos hasta que status = "Available"

### Obtener Connection String
- [ ] Ir a la base de datos creada
- [ ] En "Connections" section
- [ ] Copiar **"Internal Database URL"** (¡NO External!)
- [ ] Formato debe ser: `postgresql://user:pass@dpg-xxxxx/dbname`
- [ ] Guardar en un lugar seguro (notepad, etc.)

**✅ Internal Database URL copiada:**
```
postgresql://___________________
```

---

## 🖥️ Parte 2: Backend (Web Service)

### Crear Web Service
- [ ] Dashboard → "New +" → "Web Service"
- [ ] Click "Connect Repository"
- [ ] Seleccionar tu repositorio
- [ ] Click "Connect"

### Configuración Básica
- [ ] **Name**: `krixo-backend` (o el que prefieras)
- [ ] **Region**: Mismo que database (ej: Frankfurt)
- [ ] **Branch**: `main` (o `master`)
- [ ] **Root Directory**: `backend`
- [ ] **Runtime**: `Node`

### Build Settings
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`

### Plan
- [ ] **Plan**: `Free`

### Variables de Entorno
Agregar estas 4 variables (click "Add Environment Variable"):

- [ ] `PORT` = `3001`
- [ ] `NODE_ENV` = `production`
- [ ] `DATABASE_URL` = `<pegar Internal Database URL del Paso 1>`
- [ ] `CORS_ORIGIN` = `https://krixo-frontend.onrender.com` (ajustar después)

### Deploy Backend
- [ ] Click "Create Web Service"
- [ ] Esperar build (3-5 minutos)
- [ ] Ver logs hasta ver: "🚀 Server running on http://localhost:3001"
- [ ] Verificar logs muestran:
  ```
  ✅ PostgreSQL connected successfully
  ✅ Migration completed: 001_initial_schema.sql
  ✅ All migrations completed successfully
  ```

### Obtener URL Backend
- [ ] Status del servicio = "Live" (verde)
- [ ] Copiar URL en la parte superior (ej: `https://krixo-backend.onrender.com`)

**✅ Backend URL:**
```
https://___________________
```

### Verificar Backend
- [ ] Abrir en navegador: `https://tu-backend.onrender.com/api/health`
- [ ] Debe retornar: `{"status":"ok","timestamp":"..."}`
- [ ] Abrir: `https://tu-backend.onrender.com/api/products`
- [ ] Debe retornar array con 5 productos

---

## 🎨 Parte 3: Frontend (Static Site)

### Crear Static Site
- [ ] Dashboard → "New +" → "Static Site"
- [ ] Seleccionar mismo repositorio
- [ ] Click "Connect"

### Configuración Básica
- [ ] **Name**: `krixo-frontend` (o el que prefieras)
- [ ] **Region**: Mismo que backend (Frankfurt)
- [ ] **Branch**: `main` (o `master`)
- [ ] **Root Directory**: `frontend`

### Build Settings
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Publish Directory**: `.next`

### Plan
- [ ] **Plan**: `Free`

### Variables de Entorno
- [ ] `NEXT_PUBLIC_API_URL` = `https://tu-backend.onrender.com/api` (URL del Paso 2)

### Deploy Frontend
- [ ] Click "Create Static Site"
- [ ] Esperar build (3-5 minutos)
- [ ] Ver logs hasta ver: "✓ Compiled successfully"

### Obtener URL Frontend
- [ ] Status = "Live" (verde)
- [ ] Copiar URL (ej: `https://krixo-frontend.onrender.com`)

**✅ Frontend URL:**
```
https://___________________
```

---

## 🔄 Parte 4: Actualizar CORS

Ahora que tienes la URL del frontend, actualiza el backend:

### Actualizar Backend
- [ ] Ir al servicio `krixo-backend` en Render
- [ ] Tab "Environment"
- [ ] Editar variable `CORS_ORIGIN`
- [ ] Cambiar a URL del frontend (ej: `https://krixo-frontend.onrender.com`)
- [ ] Click "Save Changes"
- [ ] Esperar re-deploy automático (~2 min)
- [ ] Verificar status = "Live"

---

## ✅ Parte 5: Verificación Final

### Verificar Backend
- [ ] `curl https://tu-backend.onrender.com/api/health` retorna OK
- [ ] `curl https://tu-backend.onrender.com/api/products` retorna productos

### Verificar Frontend
Abrir `https://tu-frontend.onrender.com` y probar:

- [ ] ✅ Dashboard carga sin errores
- [ ] ✅ Se muestran estadísticas (productos, movimientos, ventas)
- [ ] ✅ Productos se muestran en la tabla
- [ ] ✅ Crear nuevo producto funciona
- [ ] ✅ Editar producto funciona
- [ ] ✅ Eliminar producto funciona
- [ ] ✅ Registrar entrada funciona
- [ ] ✅ Registrar salida funciona
- [ ] ✅ Registrar venta funciona
- [ ] ✅ No hay errores en consola del navegador (F12)

### Verificar Migraciones
En logs del backend, debe aparecer:

- [ ] `✅ PostgreSQL connected successfully`
- [ ] `✅ Migrations table ready`
- [ ] `✅ Migration completed: 001_initial_schema.sql`
- [ ] `✅ All migrations completed successfully`

---

## 📝 Parte 6: Actualizar Documentación

### README.md
- [ ] Abrir `README.md`
- [ ] Buscar sección "🚀 Demo en Producción"
- [ ] Actualizar con tus URLs:
  ```markdown
  ## 🚀 Demo en Producción
  
  - **Frontend**: https://tu-frontend.onrender.com
  - **Backend API**: https://tu-backend.onrender.com/api
  ```
- [ ] Commit y push:
  ```bash
  git add README.md
  git commit -m "docs: add production URLs"
  git push origin main
  ```

### Compartir
- [ ] Copiar URL del frontend
- [ ] Enviar URL para la prueba técnica
- [ ] (Opcional) Crear README.md con instrucciones de uso

---

## 🎉 ¡Despliegue Completo!

### URLs Finales:

**Frontend (para compartir):**
```
https://___________________
```

**Backend API:**
```
https://___________________/api
```

**Database:**
```
PostgreSQL en Render (Internal Database URL)
```

---

## 🐛 Troubleshooting

### ❌ Backend no inicia
**Síntomas**: Status = "Deploy failed" o logs muestran errores

**Soluciones**:
- [ ] Verificar `DATABASE_URL` está correcta (Internal, no External)
- [ ] Verificar formato: `postgresql://user:pass@host/dbname`
- [ ] En Render, click "Manual Deploy" → "Clear build cache & deploy"

### ❌ Frontend muestra "Failed to fetch"
**Síntomas**: Frontend carga pero no muestra datos, errores en consola

**Soluciones**:
- [ ] Verificar `NEXT_PUBLIC_API_URL` en frontend = `https://tu-backend.onrender.com/api`
- [ ] Verificar `CORS_ORIGIN` en backend = `https://tu-frontend.onrender.com`
- [ ] Re-deploy frontend: "Manual Deploy" → "Clear build cache & deploy"

### ❌ Error CORS en navegador
**Síntomas**: Consola muestra "blocked by CORS policy"

**Soluciones**:
- [ ] Verificar `CORS_ORIGIN` en backend coincide EXACTAMENTE con URL del frontend
- [ ] No incluir `/` al final: ✅ `https://app.onrender.com` | ❌ `https://app.onrender.com/`
- [ ] Re-deploy backend después de cambiar

### ⚠️ Servicios lentos (cold start)
**Síntomas**: Primera petición tarda 30+ segundos

**Explicación**: Plan gratuito apaga servicios después de 15 min de inactividad

**Soluciones**:
- [ ] Es comportamiento normal en plan gratuito
- [ ] Peticiones siguientes serán rápidas
- [ ] Para mantener activo: usar [UptimeRobot](https://uptimerobot.com) (gratis)

### ❌ Migraciones no se ejecutan
**Síntomas**: Logs no muestran mensajes de migraciones

**Soluciones**:
- [ ] Verificar conexión a base de datos en logs
- [ ] Verificar `DATABASE_URL` está configurada
- [ ] Verificar archivos en `backend/src/infrastructure/database/migrations/`
- [ ] Verificar formato: `001_description.sql`

---

## 📊 Métricas Post-Despliegue

### Días 1-7
- [ ] Verificar servicios funcionan correctamente
- [ ] Monitorear logs en Render
- [ ] Probar todas las funcionalidades
- [ ] Corregir cualquier bug encontrado

### Optimizaciones Futuras
- [ ] Considerar plan de pago si necesitas:
  - Sin cold starts
  - Más RAM/CPU
  - Base de datos con más storage
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar monitoreo (UptimeRobot, etc.)
- [ ] Agregar analytics (Google Analytics, Plausible, etc.)

---

## 💡 Recursos Útiles

- 📖 [Documentación de Render](https://render.com/docs)
- 📖 [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Guía detallada
- 📖 [MIGRATIONS_GUIDE.md](MIGRATIONS_GUIDE.md) - Sistema de migraciones
- 💬 [Discord de Render](https://discord.gg/render)
- 💬 [Comunidad de Render](https://community.render.com)

---

**¿Todo funcionando?** ¡Felicitaciones! 🎉

Tu aplicación está desplegada y lista para usar. Comparte la URL del frontend y disfruta de tu trabajo.

**¿Problemas?** Revisa la sección de Troubleshooting o consulta [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) para más detalles.
