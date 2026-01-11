import { Product, ProductProps } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import Database from '../database/Database';

export class PostgresProductRepository implements IProductRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(): Promise<Product[]> {
    const result = await this.db.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows.map((row: any) => this.mapToProduct(row));
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.db.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapToProduct(result.rows[0]);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const result = await this.db.query(
      'SELECT * FROM products WHERE sku = $1',
      [sku]
    );
    if (result.rows.length === 0) return null;
    return this.mapToProduct(result.rows[0]);
  }

  async findByCategory(category: string): Promise<Product[]> {
    const result = await this.db.query(
      'SELECT * FROM products WHERE LOWER(category) = LOWER($1) ORDER BY name',
      [category]
    );
    return result.rows.map((row: any) => this.mapToProduct(row));
  }

  async findLowStock(): Promise<Product[]> {
    const result = await this.db.query(
      'SELECT * FROM products WHERE stock <= min_stock ORDER BY stock ASC'
    );
    return result.rows.map((row: any) => this.mapToProduct(row));
  }

  async save(product: Product): Promise<Product> {
    const props = product.toJSON();
    await this.db.query(
      `INSERT INTO products (id, name, description, sku, price, stock, min_stock, category, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        props.id,
        props.name,
        props.description,
        props.sku,
        props.price,
        props.stock,
        props.minStock,
        props.category,
        props.createdAt,
        props.updatedAt,
      ]
    );
    return product;
  }

  async update(product: Product): Promise<Product> {
    const props = product.toJSON();
    const result = await this.db.query(
      `UPDATE products 
       SET name = $2, description = $3, sku = $4, price = $5, 
           stock = $6, min_stock = $7, category = $8, updated_at = $9
       WHERE id = $1
       RETURNING *`,
      [
        props.id,
        props.name,
        props.description,
        props.sku,
        props.price,
        props.stock,
        props.minStock,
        props.category,
        new Date(),
      ]
    );
    if (result.rows.length === 0) {
      throw new Error(`Product with id ${props.id} not found`);
    }
    return this.mapToProduct(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM products WHERE id = $1', [id]);
  }

  async existsBySku(sku: string): Promise<boolean> {
    const result = await this.db.query(
      'SELECT COUNT(*) as count FROM products WHERE sku = $1',
      [sku]
    );
    return parseInt(result.rows[0].count) > 0;
  }

  private mapToProduct(row: any): Product {
    const props: ProductProps = {
      id: row.id,
      name: row.name,
      description: row.description,
      sku: row.sku,
      price: parseFloat(row.price),
      stock: row.stock,
      minStock: row.min_stock,
      category: row.category,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
    return new Product(props);
  }
}
