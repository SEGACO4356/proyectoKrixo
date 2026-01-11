# 🚀 Guía de Despliegue - Sistema de Inventario Krixo

Esta guía detalla cómo desplegar la aplicación en diferentes plataformas cloud.

## 📋 Pre-requisitos

- Cuenta en la plataforma elegida (Railway, Render, Vercel, etc.)
- Repositorio Git con el código (GitHub, GitLab, Bitbucket)
- Archivo `.env` configurado correctamente

---

## 🎯 Opción 1: Railway (Recomendado para Full-Stack)

Railway es la opción más sencilla ya que soporta monorepos y PostgreSQL automáticamente.

### Paso 1: Instalar Railway CLI

```bash
npm i -g @railway/cli
railway login
```

### Paso 2: Crear Proyecto

```bash
cd proyectoKrixo
railway init
```

### Paso 3: Agregar PostgreSQL

```bash
railway add postgresql
```

Railway automáticamente creará una variable `DATABASE_URL` que el backend usará.

### Paso 4: Desplegar Backend

```bash
cd backend
railway up

# Configurar variables de entorno
railway variables set PORT=3001
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://tu-frontend.railway.app
```

### Paso 5: Desplegar Frontend

```bash
cd ../frontend
railway up

# Configurar variable de entorno
railway variables set NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
```

### Paso 6: Obtener URLs Públicas

```bash
railway open
```

Railway generará URLs públicas para ambos servicios.

---

## 🎨 Opción 2: Vercel (Frontend) + Railway (Backend)

Vercel es excelente para Next.js, Railway para el backend.

### Frontend en Vercel

1. Ir a https://vercel.com
2. Importar repositorio Git
3. Configurar:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.railway.app/api
   ```
5. Deploy

### Backend en Railway

Seguir pasos de la Opción 1, solo para backend.

Actualizar CORS en Railway:
```bash
railway variables set CORS_ORIGIN=https://tu-app.vercel.app
```

---

## 🌐 Opción 3: Render (Full-Stack)

Render es una alternativa gratuita similar a Heroku.

### Paso 1: Crear PostgreSQL Database

1. Ir a https://render.com
2. New → PostgreSQL
3. Configurar:
   - **Name**: krixo-db
   - **Database**: krixo_inventory
   - **User**: krixo
   - Plan gratuito
4. Crear
5. Copiar "Internal Database URL"

### Paso 2: Desplegar Backend

1. New → Web Service
2. Conectar repositorio Git
3. Configurar:
   - **Name**: krixo-backend
   - **Environment**: Node
   - **Region**: Frankfurt (o el más cercano)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Variables de entorno:
   ```
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=<internal-database-url-copiado>
   CORS_ORIGIN=https://krixo-frontend.onrender.com
   ```
5. Crear Web Service

### Paso 3: Desplegar Frontend

1. New → Static Site
2. Conectar mismo repositorio
3. Configurar:
   - **Name**: krixo-frontend
   - **Branch**: main
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out` (si usas output: 'export' en next.config.js)
4. Variables de entorno:
   ```
   NEXT_PUBLIC_API_URL=https://krixo-backend.onrender.com/api
   ```
5. Crear Static Site

**Nota**: El plan gratuito de Render apaga servicios después de 15 minutos de inactividad. La primera petición puede tardar ~30 segundos.

---

## 🐳 Opción 4: Docker en VPS (DigitalOcean, Linode, AWS EC2)

Para mayor control, despliega con Docker en tu propio servidor.

### Paso 1: Configurar VPS

```bash
# Conectar por SSH
ssh root@tu-servidor-ip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Paso 2: Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/proyectoKrixo.git
cd proyectoKrixo
```

### Paso 3: Configurar Variables de Entorno

```bash
# Backend
cp backend/.env.example backend/.env
nano backend/.env
```

Editar:
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://tu-dominio.com
DATABASE_URL=postgresql://krixo:krixo_password@postgres:5432/krixo_inventory
```

### Paso 4: Ejecutar con Docker Compose

```bash
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Verificar estado
docker-compose ps
```

### Paso 5: Configurar Nginx como Reverse Proxy

```bash
# Instalar Nginx
sudo apt update
sudo apt install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/krixo
```

Contenido:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/krixo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configurar SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 🔒 Opción 5: Fly.io

Fly.io ofrece despliegue global con buen tier gratuito.

### Paso 1: Instalar Fly CLI

```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
```

### Paso 2: Crear App para Backend

```bash
cd backend
fly launch --name krixo-backend

# Agregar PostgreSQL
fly postgres create --name krixo-db
fly postgres attach krixo-db -a krixo-backend

# Configurar variables
fly secrets set NODE_ENV=production
fly secrets set CORS_ORIGIN=https://krixo-frontend.fly.dev
```

### Paso 3: Crear App para Frontend

```bash
cd ../frontend
fly launch --name krixo-frontend

# Configurar variable
fly secrets set NEXT_PUBLIC_API_URL=https://krixo-backend.fly.dev/api
```

### Paso 4: Deploy

```bash
# Backend
cd backend
fly deploy

# Frontend
cd ../frontend
fly deploy
```

---

## ✅ Verificación Post-Despliegue

### 1. Verificar Backend
```bash
curl https://tu-backend-url/api/health
# Debe retornar: {"status":"ok","timestamp":"..."}
```

### 2. Verificar Base de Datos
```bash
curl https://tu-backend-url/api/products
# Debe retornar: array de productos
```

### 3. Verificar Frontend
Abrir en navegador: `https://tu-frontend-url`
- ✅ Dashboard carga correctamente
- ✅ Productos se muestran
- ✅ Crear producto funciona
- ✅ Movimientos y ventas funcionan

---

## 🐛 Troubleshooting

### Error: CORS
**Síntoma**: Frontend no puede conectarse a backend, error CORS en consola.

**Solución**: Verificar que `CORS_ORIGIN` en backend tiene la URL correcta del frontend.

```bash
# Railway
railway variables set CORS_ORIGIN=https://tu-frontend.railway.app

# Render
# Actualizar variable en dashboard de Render
```

### Error: Database Connection
**Síntoma**: Backend responde 500, logs muestran "failed to connect to PostgreSQL".

**Solución**: Verificar `DATABASE_URL` está correctamente configurada.

```bash
# Railway
railway variables
# Verificar DATABASE_URL existe y tiene formato correcto

# Render
# Verificar Internal Database URL en variables
```

### Error: Build Failed
**Síntoma**: Despliegue falla durante el build.

**Solución**:
```bash
# Verificar localmente primero
cd backend
npm install
npm run build

cd ../frontend
npm install
npm run build
```

### Error: Port Already in Use
**Síntoma**: En VPS, Docker no puede iniciar servicios.

**Solución**:
```bash
# Verificar puertos ocupados
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Matar procesos
sudo kill -9 <PID>

# O cambiar puertos en docker-compose.yml
```

---

## 📊 Monitoreo y Logs

### Railway
```bash
railway logs
railway logs --follow
```

### Render
Dashboard → Service → Logs

### Fly.io
```bash
fly logs
fly logs --follow
```

### Docker VPS
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f postgres
```

---

## 🔄 Actualizar Aplicación Desplegada

### Railway / Render / Vercel
Los deploys automáticos están activados por defecto. Solo hacer push:

```bash
git add .
git commit -m "Update: nueva funcionalidad"
git push origin main
```

### Fly.io
```bash
fly deploy
```

### Docker VPS
```bash
ssh root@tu-servidor
cd proyectoKrixo
git pull
docker-compose down
docker-compose up -d --build
```

---

## 💡 Recomendaciones Finales

1. **Railway**: Mejor opción para desarrollo y demos rápidos
2. **Vercel + Railway**: Mejor opción para performance (Vercel edge)
3. **Render**: Mejor opción gratuita si no te importa cold starts
4. **VPS + Docker**: Mejor control y costo predecible para producción
5. **Fly.io**: Mejor para despliegue global multi-región

¡Éxito con tu despliegue! 🚀
