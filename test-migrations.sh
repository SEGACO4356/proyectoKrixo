#!/bin/bash

echo "🧪 Testing Migration System..."
echo ""

# Variables
DB_NAME="krixo_test_$(date +%s)"
DB_USER="krixo"
DB_PASS="krixo_password"
DB_PORT=5432

echo "📦 Step 1: Creating test database..."

# Iniciar PostgreSQL si no está corriendo
if ! docker ps | grep -q krixo-postgres; then
  echo "⚠️  PostgreSQL not running. Starting with Docker..."
  docker run -d \
    --name krixo-postgres-test \
    -e POSTGRES_USER=$DB_USER \
    -e POSTGRES_PASSWORD=$DB_PASS \
    -e POSTGRES_DB=$DB_NAME \
    -p $DB_PORT:5432 \
    postgres:15-alpine
  
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 5
else
  echo "✅ PostgreSQL already running"
  
  # Crear base de datos de test
  docker exec krixo-postgres psql -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true
fi

echo ""
echo "📝 Step 2: Configuring test environment..."

# Crear .env temporal
cd backend
cat > .env.test << EOF
PORT=3001
NODE_ENV=test
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://$DB_USER:$DB_PASS@localhost:$DB_PORT/$DB_NAME
EOF

echo "✅ Test .env created"
echo ""

echo "🔧 Step 3: Running migration status script..."
npm run migration:status

echo ""
echo "🚀 Step 4: Starting server (this will run migrations)..."
echo "⏳ Server will start and run migrations automatically..."
echo ""

# Iniciar servidor en background
NODE_ENV=test npm run dev &
SERVER_PID=$!

# Esperar a que el servidor inicie
sleep 10

echo ""
echo "🔍 Step 5: Verifying migrations..."

# Verificar que las tablas existan
TABLES=$(docker exec krixo-postgres psql -U $DB_USER -d $DB_NAME -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null)

if echo "$TABLES" | grep -q "migrations"; then
  echo "✅ Table 'migrations' exists"
else
  echo "❌ Table 'migrations' NOT found"
fi

if echo "$TABLES" | grep -q "products"; then
  echo "✅ Table 'products' exists"
else
  echo "❌ Table 'products' NOT found"
fi

if echo "$TABLES" | grep -q "movements"; then
  echo "✅ Table 'movements' exists"
else
  echo "❌ Table 'movements' NOT found"
fi

if echo "$TABLES" | grep -q "sales"; then
  echo "✅ Table 'sales' exists"
else
  echo "❌ Table 'sales' NOT found"
fi

echo ""
echo "📊 Migration records:"
docker exec krixo-postgres psql -U $DB_USER -d $DB_NAME -c "SELECT name, executed_at FROM migrations;" 2>/dev/null

echo ""
echo "🧹 Cleanup..."

# Matar servidor
kill $SERVER_PID 2>/dev/null

# Eliminar .env.test
rm .env.test

# Eliminar base de datos de test
docker exec krixo-postgres psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null

echo ""
echo "✅ Test completed!"
echo ""
echo "💡 To test manually:"
echo "   1. docker-compose up -d postgres"
echo "   2. cp .env.example .env"
echo "   3. npm run dev"
echo "   4. Check logs for migration messages"
