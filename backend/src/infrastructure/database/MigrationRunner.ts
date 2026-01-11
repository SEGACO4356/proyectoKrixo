import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Database from './Database';

interface Migration {
  id: number;
  name: string;
  executed_at: Date;
}

interface MigrationFile {
  version: number;
  name: string;
  filename: string;
  sql: string;
}

/**
 * MigrationRunner - Sistema de migraciones automáticas para PostgreSQL
 * 
 * Similar a sistemas de migraciones en frameworks como Laravel, Rails, Django.
 * 
 * Características:
 * - Ejecuta migraciones en orden secuencial
 * - Trackea qué migraciones ya se aplicaron
 * - Solo ejecuta migraciones pendientes
 * - Rollback automático si falla una migración
 * - Compatible con Render y otras plataformas cloud
 */
export class MigrationRunner {
  private db: Database;
  private migrationsPath: string;

  constructor() {
    this.db = Database.getInstance();
    this.migrationsPath = join(__dirname, 'migrations');
  }

  /**
   * Ejecuta todas las migraciones pendientes
   */
  async runPendingMigrations(): Promise<void> {
    console.log('🔄 Checking for pending migrations...');

    try {
      // 1. Crear tabla de migraciones si no existe
      await this.ensureMigrationsTable();

      // 2. Obtener migraciones ejecutadas
      const executedMigrations = await this.getExecutedMigrations();
      console.log(`📊 Executed migrations: ${executedMigrations.length}`);

      // 3. Leer archivos de migraciones
      const migrationFiles = await this.loadMigrationFiles();
      console.log(`📁 Found migration files: ${migrationFiles.length}`);

      // 4. Filtrar migraciones pendientes
      const pendingMigrations = migrationFiles.filter(
        (file) => !executedMigrations.some((m) => m.name === file.name)
      );

      if (pendingMigrations.length === 0) {
        console.log('✅ No pending migrations - Database is up to date');
        return;
      }

      console.log(`🚀 Running ${pendingMigrations.length} pending migration(s)...`);

      // 5. Ejecutar cada migración pendiente
      for (const migration of pendingMigrations) {
        await this.executeMigration(migration);
      }

      console.log('✅ All migrations completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Crea la tabla de tracking de migraciones si no existe
   */
  private async ensureMigrationsTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.db.query(sql);
    console.log('✅ Migrations table ready');
  }

  /**
   * Obtiene la lista de migraciones ya ejecutadas
   */
  private async getExecutedMigrations(): Promise<Migration[]> {
    const result = await this.db.query(
      'SELECT id, name, executed_at FROM migrations ORDER BY id ASC'
    );
    return result.rows;
  }

  /**
   * Lee todos los archivos .sql de la carpeta migrations/
   * Formato esperado: XXX_description.sql (ej: 001_initial_schema.sql)
   */
  private async loadMigrationFiles(): Promise<MigrationFile[]> {
    const files = await readdir(this.migrationsPath);
    
    const sqlFiles = files
      .filter((file) => file.endsWith('.sql'))
      .sort(); // Ordenar alfabéticamente (001, 002, 003...)

    const migrations: MigrationFile[] = [];

    for (const filename of sqlFiles) {
      const version = this.extractVersion(filename);
      const name = this.extractName(filename);
      const filePath = join(this.migrationsPath, filename);
      const sql = await readFile(filePath, 'utf-8');

      migrations.push({
        version,
        name,
        filename,
        sql,
      });
    }

    return migrations.sort((a, b) => a.version - b.version);
  }

  /**
   * Ejecuta una migración dentro de una transacción
   * Si falla, hace rollback automático
   */
  private async executeMigration(migration: MigrationFile): Promise<void> {
    console.log(`⏳ Running migration: ${migration.filename}`);

    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // Ejecutar el SQL de la migración
      await client.query(migration.sql);

      // Registrar la migración como ejecutada
      await client.query(
        'INSERT INTO migrations (name) VALUES ($1)',
        [migration.name]
      );

      await client.query('COMMIT');
      console.log(`✅ Migration completed: ${migration.filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Migration failed: ${migration.filename}`, error);
      throw new Error(
        `Failed to execute migration ${migration.filename}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      client.release();
    }
  }

  /**
   * Extrae el número de versión del nombre del archivo
   * Ejemplo: "001_initial_schema.sql" -> 1
   */
  private extractVersion(filename: string): number {
    const match = filename.match(/^(\d+)_/);
    if (!match) {
      throw new Error(
        `Invalid migration filename format: ${filename}. Expected format: XXX_description.sql`
      );
    }
    return parseInt(match[1], 10);
  }

  /**
   * Extrae el nombre descriptivo del archivo
   * Ejemplo: "001_initial_schema.sql" -> "001_initial_schema"
   */
  private extractName(filename: string): string {
    return filename.replace('.sql', '');
  }

  /**
   * Obtiene el estado actual de las migraciones
   */
  async getStatus(): Promise<{
    executed: Migration[];
    pending: string[];
    total: number;
  }> {
    await this.ensureMigrationsTable();
    
    const executed = await this.getExecutedMigrations();
    const allFiles = await this.loadMigrationFiles();
    
    const pending = allFiles
      .filter((file) => !executed.some((m) => m.name === file.name))
      .map((file) => file.filename);

    return {
      executed,
      pending,
      total: allFiles.length,
    };
  }

  /**
   * Verifica la conexión a la base de datos
   */
  async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.db.healthCheck();
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }
}

export default MigrationRunner;
