# Database Migrations

Este directorio contiene las migraciones de la base de datos en orden secuencial.

## Formato de Archivos

Cada migración debe seguir el formato:

```
XXX_description.sql
```

Donde:
- `XXX` es un número de versión de 3 dígitos (001, 002, 003...)
- `description` es una descripción corta en snake_case
- `.sql` es la extensión del archivo

### Ejemplos válidos:
- ✅ `001_initial_schema.sql`
- ✅ `002_add_user_roles.sql`
- ✅ `003_add_product_images.sql`

### Ejemplos inválidos:
- ❌ `initial_schema.sql` (falta número de versión)
- ❌ `1_schema.sql` (número debe ser 3 dígitos)
- ❌ `001-initial-schema.sql` (usar underscore, no guiones)

## Orden de Ejecución

Las migraciones se ejecutan en orden alfabético (que coincide con orden numérico):
1. 001_initial_schema.sql
2. 002_add_user_roles.sql
3. 003_add_product_images.sql

## Crear una Nueva Migración

1. Determina el siguiente número de versión
2. Crea el archivo con el formato correcto
3. Escribe el SQL necesario
4. Las migraciones se ejecutarán automáticamente al iniciar el servidor

### Ejemplo:

```bash
# Crear nueva migración
touch src/infrastructure/database/migrations/002_add_product_images.sql
```

```sql
-- 002_add_product_images.sql
ALTER TABLE products ADD COLUMN image_url VARCHAR(500);
CREATE INDEX idx_products_image ON products(image_url);
```

## Tracking de Migraciones

El sistema usa una tabla `migrations` para trackear qué migraciones ya se ejecutaron:

```sql
CREATE TABLE migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Rollback

Si una migración falla:
- ❌ Se hace rollback automático de esa migración
- ❌ Las migraciones siguientes NO se ejecutan
- ✅ Las migraciones anteriores permanecen aplicadas
- ⚠️ Debes corregir el error y reiniciar el servidor

## Ver Estado de Migraciones

```bash
# En desarrollo - verificar qué migraciones se ejecutaron
psql -U krixo -d krixo_inventory -c "SELECT * FROM migrations ORDER BY id;"
```

## Buenas Prácticas

1. ✅ **Nunca modifiques una migración ya ejecutada** - Crea una nueva migración
2. ✅ **Prueba localmente primero** - Antes de desplegar a producción
3. ✅ **Una migración = Un cambio lógico** - No mezcles cambios no relacionados
4. ✅ **Incluye comentarios** - Explica cambios complejos
5. ✅ **Usa transacciones** - El sistema ya las maneja automáticamente
6. ✅ **Backups antes de migrar** - Especialmente en producción

## Migraciones Actuales

### 001_initial_schema.sql
- Crea tabla `products`
- Crea tabla `movements`
- Crea tabla `sales`
- Crea tabla `sale_items`
- Crea índices para optimización
- Inserta datos de ejemplo (5 productos)

## Solución de Problemas

### Error: "Invalid migration filename format"
El nombre del archivo no sigue el formato `XXX_description.sql`

**Solución**: Renombrar archivo siguiendo el formato correcto

### Error: "Migration failed"
El SQL de la migración tiene errores

**Solución**: 
1. Revisar logs para ver el error específico
2. Corregir el SQL
3. Si la migración ya se registró parcialmente, eliminar el registro:
   ```sql
   DELETE FROM migrations WHERE name = '00X_nombre_migración';
   ```
4. Reintentar

### Migraciones no se ejecutan
Verificar que DATABASE_URL esté configurado

**Solución**: Revisar archivo `.env`

### Tabla migrations no existe
El sistema la crea automáticamente, pero si hay problemas de permisos puede fallar

**Solución**: Crear manualmente:
```sql
CREATE TABLE migrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
