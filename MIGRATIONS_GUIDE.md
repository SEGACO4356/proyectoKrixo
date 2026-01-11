# 🎯 Sistema de Migraciones Automáticas

## ¿Qué se implementó?

Un sistema de migraciones **profesional y robusto** similar a Laravel, Rails, Django y otros frameworks enterprise.

### ✅ Características

1. **Auto-ejecución**: Las migraciones se ejecutan automáticamente al iniciar el servidor
2. **Tracking**: Tabla `migrations` registra qué ya se ejecutó
3. **Transacciones**: Cada migración se ejecuta en una transacción (rollback si falla)
4. **Versionado**: Sistema de versiones con archivos `001_*.sql`, `002_*.sql`, etc.
5. **Idempotente**: Puedes reiniciar el servidor sin problemas, solo ejecuta lo nuevo
6. **Compatible con Render**: Funciona perfectamente en cualquier plataforma cloud

## 📁 Estructura

```
backend/src/infrastructure/database/
├── Database.ts                          # Pool de conexiones
├── MigrationRunner.ts                   # ⭐ Sistema de migraciones
├── index.ts                             # Exports
└── migrations/                          # ⭐ Carpeta de migraciones
    ├── README.md                        # Documentación de migraciones
    └── 001_initial_schema.sql          # Primera migración
```

## 🚀 Cómo Funciona

### Al iniciar el servidor:

1. ✅ Conecta a PostgreSQL
2. ✅ Crea tabla `migrations` (si no existe)
3. ✅ Lee archivos en `migrations/`
4. ✅ Compara con registros en tabla `migrations`
5. ✅ Ejecuta solo las migraciones pendientes
6. ✅ Registra cada migración exitosa
7. ✅ Inicia el servidor

### Logs que verás:

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
✅ Database migrations completed

🚀 Server running on http://localhost:3001
```

## 📝 Crear Nueva Migración

### Paso 1: Crear archivo

```bash
cd backend/src/infrastructure/database/migrations
touch 002_add_product_images.sql
```

### Paso 2: Escribir SQL

```sql
-- 002_add_product_images.sql
-- Agregar columna para imágenes de productos

ALTER TABLE products 
ADD COLUMN image_url VARCHAR(500);

CREATE INDEX idx_products_image 
ON products(image_url);
```

### Paso 3: Reiniciar servidor

```bash
npm run dev
```

¡Listo! La migración se ejecutará automáticamente.

## 🔍 Verificar Estado

### Script de status:

```bash
npm run migration:status
```

Salida:
```
📊 Checking migration status...

✅ Database connection: OK

📁 Total migrations: 2
✅ Executed: 1
⏳ Pending: 1

Executed migrations:
  ✅ 001_initial_schema (2026-01-11T10:30:00.000Z)

Pending migrations:
  ⏳ 002_add_product_images.sql

💡 Run the server to execute pending migrations
```

### SQL directo:

```bash
psql -U krixo -d krixo_inventory -c "SELECT * FROM migrations;"
```

## 🎯 Para Render

### ¿Qué hacer?

**¡NADA!** El sistema funciona automáticamente:

1. Crear PostgreSQL Database en Render
2. Copiar "Internal Database URL"
3. Configurar como `DATABASE_URL` en Web Service
4. Deploy

Render ejecutará:
```bash
npm install
npm run build
npm start
```

Y al ejecutar `npm start`:
- ✅ Se conecta a PostgreSQL
- ✅ Ejecuta migraciones automáticamente
- ✅ Inicia el servidor

### Primera vez:
```
🚀 Running 1 pending migration(s)...
✅ Migration completed: 001_initial_schema.sql
```

### Deploys siguientes:
```
✅ No pending migrations - Database is up to date
```

## 🔄 Workflow de Desarrollo

### Desarrollo local:

```bash
# 1. Levantar PostgreSQL
docker-compose up -d postgres

# 2. Configurar .env
cp .env.example .env
# Editar DATABASE_URL

# 3. Iniciar backend (ejecuta migraciones automáticamente)
npm run dev
```

### Agregar nueva feature con migración:

```bash
# 1. Crear migración
touch src/infrastructure/database/migrations/002_nueva_feature.sql

# 2. Escribir SQL
# ...

# 3. Probar localmente
npm run dev

# 4. Verificar
npm run migration:status

# 5. Commit y push
git add .
git commit -m "feat: add nueva_feature migration"
git push

# 6. Render auto-despliega y ejecuta migración
```

## 🛡️ Seguridad y Robustez

### Transacciones automáticas:

Cada migración se ejecuta así:

```typescript
BEGIN;
  -- Tu SQL aquí
  INSERT INTO migrations (name) VALUES ('001_initial_schema');
COMMIT;
```

Si algo falla → **ROLLBACK automático**

### Protección contra ejecución duplicada:

La tabla `migrations` tiene restricción `UNIQUE`:

```sql
name VARCHAR(255) NOT NULL UNIQUE
```

Si intentas ejecutar dos veces la misma migración → **ERROR**, no corrupción.

### Orden garantizado:

Los archivos se ejecutan en orden alfabético:
- 001_... primero
- 002_... segundo
- 003_... tercero

## 📊 Comparación con otras opciones

| Feature | GORM (Go) | Prisma | TypeORM | **Nuestro Sistema** |
|---------|-----------|--------|---------|---------------------|
| Auto-migrations | ✅ | ✅ | ✅ | ✅ |
| SQL control | ❌ | ⚠️ | ⚠️ | ✅ Full control |
| Transacciones | ✅ | ✅ | ✅ | ✅ |
| Rollback | ✅ | ✅ | ✅ | ✅ |
| Learning curve | Media | Alta | Alta | **Baja** |
| Setup time | Rápido | Medio | Medio | **Muy rápido** |
| Clean Architecture | ✅ | ⚠️ | ⚠️ | ✅ Sin refactor |
| Raw SQL | ❌ | ⚠️ | ⚠️ | ✅ |

## 🐛 Troubleshooting

### Migración falla y se queda "stuck"

**Síntoma**: La migración falla pero se registró en tabla `migrations`

**Solución**:
```sql
-- Eliminar registro de migración fallida
DELETE FROM migrations WHERE name = '00X_nombre_migración';
-- Corregir el SQL
-- Reiniciar servidor
```

### Quiero ejecutar migración manualmente

```bash
# Opción 1: Usar psql
psql -U krixo -d krixo_inventory -f src/infrastructure/database/migrations/001_initial_schema.sql

# Opción 2: Dejar que el sistema lo haga
npm run dev
```

### Error: Cannot find module 'fs/promises'

**Causa**: Node.js < 14

**Solución**: Actualizar Node.js a v14+

### Migraciones no se detectan

**Causa**: Archivos no siguen el formato `XXX_*.sql`

**Solución**: Renombrar:
```bash
# ❌ Mal
initial_schema.sql
1_schema.sql

# ✅ Bien
001_initial_schema.sql
002_add_users.sql
```

## 💡 Mejores Prácticas

1. ✅ **Nunca edites migraciones ya ejecutadas** → Crea nueva migración
2. ✅ **Una migración = Un cambio** → No mezcles features
3. ✅ **Prueba localmente primero** → Antes de push
4. ✅ **Incluye comentarios** → Explica el propósito
5. ✅ **Backup en producción** → Antes de migraciones grandes
6. ✅ **Migrations reversibles** → Considera cómo deshacer cambios

### Ejemplo de migración reversible:

```sql
-- 003_add_user_avatar.sql

-- Forward migration (aplicar cambio)
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);

-- Si necesitas revertir, crea:
-- 004_rollback_user_avatar.sql
-- ALTER TABLE users DROP COLUMN avatar_url;
```

## 🎉 Resumen

Ahora tienes un sistema de migraciones:

- ✅ **Automático**: Se ejecuta al iniciar
- ✅ **Robusto**: Transacciones + rollback
- ✅ **Versionado**: Control de cambios
- ✅ **Production-ready**: Compatible con Render
- ✅ **Sin dependencias**: No necesita ORMs externos
- ✅ **Clean Architecture**: No rompe tu estructura

¡Listo para desplegar en Render! 🚀
