import { Sale, SaleProps, SaleItemProps } from '../../domain/entities/Sale';
import { ISaleRepository } from '../../domain/repositories/ISaleRepository';
import Database from '../database/Database';

export class PostgresSaleRepository implements ISaleRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(): Promise<Sale[]> {
    const result = await this.db.query(
      'SELECT * FROM sales ORDER BY created_at DESC'
    );
    const sales: Sale[] = [];
    for (const row of result.rows) {
      const sale = await this.mapToSale(row);
      sales.push(sale);
    }
    return sales;
  }

  async findById(id: string): Promise<Sale | null> {
    const result = await this.db.query(
      'SELECT * FROM sales WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return await this.mapToSale(result.rows[0]);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    const result = await this.db.query(
      'SELECT * FROM sales WHERE created_at >= $1 AND created_at <= $2 ORDER BY created_at DESC',
      [startDate, endDate]
    );
    const sales: Sale[] = [];
    for (const row of result.rows) {
      const sale = await this.mapToSale(row);
      sales.push(sale);
    }
    return sales;
  }

  async findByCustomerEmail(email: string): Promise<Sale[]> {
    const result = await this.db.query(
      'SELECT * FROM sales WHERE LOWER(customer_email) = LOWER($1) ORDER BY created_at DESC',
      [email]
    );
    const sales: Sale[] = [];
    for (const row of result.rows) {
      const sale = await this.mapToSale(row);
      sales.push(sale);
    }
    return sales;
  }

  async save(sale: Sale): Promise<Sale> {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      const props = sale.toJSON();
      
      // Insert sale
      await client.query(
        `INSERT INTO sales (id, total, customer_name, customer_email, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          props.id,
          props.total,
          props.customerName || null,
          props.customerEmail || null,
          props.notes || null,
          props.createdAt,
        ]
      );

      // Insert sale items
      for (const item of props.items) {
        await client.query(
          `INSERT INTO sale_items (sale_id, product_id, product_name, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            props.id,
            item.productId,
            item.productName,
            item.quantity,
            item.unitPrice,
            item.subtotal,
          ]
        );
      }

      await client.query('COMMIT');
      return sale;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getTotalSales(startDate?: Date, endDate?: Date): Promise<number> {
    let query = 'SELECT COALESCE(SUM(total), 0) as total FROM sales';
    const params: any[] = [];

    if (startDate && endDate) {
      query += ' WHERE created_at >= $1 AND created_at <= $2';
      params.push(startDate, endDate);
    }

    const result = await this.db.query(query, params);
    return parseFloat(result.rows[0].total);
  }

  private async mapToSale(row: any): Promise<Sale> {
    // Get sale items
    const itemsResult = await this.db.query(
      'SELECT * FROM sale_items WHERE sale_id = $1',
      [row.id]
    );

    const items: SaleItemProps[] = itemsResult.rows.map((itemRow: any) => ({
      productId: itemRow.product_id,
      productName: itemRow.product_name,
      quantity: itemRow.quantity,
      unitPrice: parseFloat(itemRow.unit_price),
      subtotal: parseFloat(itemRow.subtotal),
    }));

    const props: SaleProps = {
      id: row.id,
      items,
      total: parseFloat(row.total),
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      notes: row.notes,
      createdAt: row.created_at,
    };

    return new Sale(props);
  }
}
