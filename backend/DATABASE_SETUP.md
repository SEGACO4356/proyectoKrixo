# Database Setup Guide

## Option 1: Using Docker Compose (Recommended)

The easiest way is to use Docker Compose which automatically sets up PostgreSQL:

```bash
docker-compose up -d postgres
```

The database will be initialized with the schema from `init.sql`.

## Option 2: Local PostgreSQL Installation

### Prerequisites
- PostgreSQL 12+ installed locally
- psql command-line tool

### Setup Steps

1. **Create Database and User**

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create user and database
CREATE USER krixo WITH PASSWORD 'krixo_password';
CREATE DATABASE krixo_inventory OWNER krixo;
GRANT ALL PRIVILEGES ON DATABASE krixo_inventory TO krixo;
\q
```

2. **Initialize Schema**

```bash
# Run the initialization script
psql -U krixo -d krixo_inventory -f src/infrastructure/database/init.sql
```

3. **Verify Installation**

```bash
# Connect to database
psql -U krixo -d krixo_inventory

# List tables
\dt

# Check products table
SELECT * FROM products;

# Exit
\q
```

4. **Update .env file**

```env
DATABASE_URL=postgresql://krixo:krixo_password@localhost:5432/krixo_inventory
```

## Option 3: Cloud PostgreSQL (Production)

### Railway

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL plugin
4. Copy DATABASE_URL from variables
5. Update your .env with the DATABASE_URL

### Render

1. Go to https://render.com
2. Create new PostgreSQL database
3. Copy Internal Database URL
4. Update your .env with the DATABASE_URL

### Heroku

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Get DATABASE_URL
heroku config:get DATABASE_URL

# Run migrations (if needed)
heroku run "cd backend && npm run migrate"
```

## Troubleshooting

### Connection refused
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Check port 5432 is not blocked by firewall
- Verify DATABASE_URL format

### Authentication failed
- Check username and password in DATABASE_URL
- Verify user has permissions: `GRANT ALL PRIVILEGES ON DATABASE krixo_inventory TO krixo;`

### Schema not created
- Manually run init.sql: `psql -U krixo -d krixo_inventory -f init.sql`
- Check for syntax errors in init.sql

### No data after restart
- Check if using In-Memory mode (DATABASE_URL not set)
- Verify Docker volume persists: `docker volume ls`
- Check PostgreSQL data directory has correct permissions

## Database Maintenance

### Backup

```bash
# Backup to file
pg_dump -U krixo -d krixo_inventory > backup.sql

# Restore from file
psql -U krixo -d krixo_inventory < backup.sql
```

### Reset Database

```bash
# Drop and recreate
psql -U krixo -d postgres -c "DROP DATABASE krixo_inventory;"
psql -U krixo -d postgres -c "CREATE DATABASE krixo_inventory OWNER krixo;"
psql -U krixo -d krixo_inventory -f src/infrastructure/database/init.sql
```

### Monitor Connections

```sql
-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'krixo_inventory';

-- Kill connection
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'krixo_inventory';
```
