import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import {
  InMemoryProductRepository,
  InMemoryMovementRepository,
  InMemorySaleRepository,
  PostgresProductRepository,
  PostgresMovementRepository,
  PostgresSaleRepository,
} from './infrastructure/repositories';

import {
  createProductRoutes,
  createMovementRoutes,
  createSaleRoutes,
  createDashboardRoutes,
} from './infrastructure/http/routes';

import { errorHandler, requestLogger } from './infrastructure/http/middlewares';
import Database from './infrastructure/database/Database';
import MigrationRunner from './infrastructure/database/MigrationRunner';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(requestLogger);

// Initialize repositories based on environment
let productRepository;
let movementRepository;
let saleRepository;

if (process.env.DATABASE_URL) {
  console.log('🔵 Using PostgreSQL repositories');
  productRepository = new PostgresProductRepository();
  movementRepository = new PostgresMovementRepository();
  saleRepository = new PostgresSaleRepository();
} else {
  console.log('⚪ Using In-Memory repositories');
  productRepository = new InMemoryProductRepository();
  movementRepository = new InMemoryMovementRepository();
  saleRepository = new InMemorySaleRepository();
}

// Routes
app.use('/api/products', createProductRoutes(productRepository));
app.use('/api/movements', createMovementRoutes(movementRepository, productRepository));
app.use('/api/sales', createSaleRoutes(saleRepository, productRepository, movementRepository));
app.use('/api/dashboard', createDashboardRoutes(productRepository, saleRepository, movementRepository));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Database initialization and server start
const startServer = async () => {
  if (process.env.DATABASE_URL) {
    try {
      console.log('🔌 Connecting to PostgreSQL...');
      const db = Database.getInstance();
      await db.healthCheck();
      console.log('✅ PostgreSQL connected successfully');

      // Ejecutar migraciones automáticamente
      console.log('🔄 Running database migrations...');
      const migrationRunner = new MigrationRunner();
      await migrationRunner.runPendingMigrations();
      console.log('✅ Database migrations completed');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      console.error('💡 Check DATABASE_URL and database connection');
      process.exit(1);
    }
  } else {
    console.log('⚠️  DATABASE_URL not set - using In-Memory storage (data will not persist)');
  }

  app.listen(PORT, () => {
    console.log('');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`🔍 Health check at http://localhost:${PORT}/api/health`);
    console.log('');
  });
};

startServer();

export default app;
