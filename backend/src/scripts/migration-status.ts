/**
 * Script para verificar el estado de las migraciones
 * 
 * Uso:
 *   npm run migration:status
 * 
 * O directamente:
 *   npx ts-node src/scripts/migration-status.ts
 */

import dotenv from 'dotenv';
import MigrationRunner from '../infrastructure/database/MigrationRunner';

dotenv.config();

async function checkMigrationStatus() {
  console.log('📊 Checking migration status...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in .env file');
    process.exit(1);
  }

  try {
    const runner = new MigrationRunner();

    // Verificar conexión
    const connected = await runner.checkDatabaseConnection();
    if (!connected) {
      console.error('❌ Cannot connect to database');
      process.exit(1);
    }

    // Obtener estado
    const status = await runner.getStatus();

    console.log('✅ Database connection: OK\n');
    console.log(`📁 Total migrations: ${status.total}`);
    console.log(`✅ Executed: ${status.executed.length}`);
    console.log(`⏳ Pending: ${status.pending.length}\n`);

    if (status.executed.length > 0) {
      console.log('Executed migrations:');
      status.executed.forEach((m) => {
        console.log(`  ✅ ${m.name} (${m.executed_at.toISOString()})`);
      });
      console.log('');
    }

    if (status.pending.length > 0) {
      console.log('Pending migrations:');
      status.pending.forEach((name) => {
        console.log(`  ⏳ ${name}`);
      });
      console.log('');
      console.log('💡 Run the server to execute pending migrations');
    } else {
      console.log('✅ Database is up to date!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMigrationStatus();
