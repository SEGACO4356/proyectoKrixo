import { Movement, MovementProps, MovementType } from '../../domain/entities/Movement';
import { IMovementRepository } from '../../domain/repositories/IMovementRepository';
import Database from '../database/Database';

export class PostgresMovementRepository implements IMovementRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async findAll(): Promise<Movement[]> {
    const result = await this.db.query(
      'SELECT * FROM movements ORDER BY created_at DESC'
    );
    return result.rows.map((row: any) => this.mapToMovement(row));
  }

  async findById(id: string): Promise<Movement | null> {
    const result = await this.db.query(
      'SELECT * FROM movements WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) return null;
    return this.mapToMovement(result.rows[0]);
  }

  async findByProductId(productId: string): Promise<Movement[]> {
    const result = await this.db.query(
      'SELECT * FROM movements WHERE product_id = $1 ORDER BY created_at DESC',
      [productId]
    );
    return result.rows.map((row: any) => this.mapToMovement(row));
  }

  async findByType(type: MovementType): Promise<Movement[]> {
    const result = await this.db.query(
      'SELECT * FROM movements WHERE type = $1 ORDER BY created_at DESC',
      [type]
    );
    return result.rows.map((row: any) => this.mapToMovement(row));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Movement[]> {
    const result = await this.db.query(
      'SELECT * FROM movements WHERE created_at >= $1 AND created_at <= $2 ORDER BY created_at DESC',
      [startDate, endDate]
    );
    return result.rows.map((row: any) => this.mapToMovement(row));
  }

  async save(movement: Movement): Promise<Movement> {
    const props = movement.toJSON();
    await this.db.query(
      `INSERT INTO movements (id, product_id, type, quantity, reason, reference, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        props.id,
        props.productId,
        props.type,
        props.quantity,
        props.reason,
        props.reference || null,
        props.createdAt,
      ]
    );
    return movement;
  }

  private mapToMovement(row: any): Movement {
    const props: MovementProps = {
      id: row.id,
      productId: row.product_id,
      type: row.type as MovementType,
      quantity: row.quantity,
      reason: row.reason,
      reference: row.reference,
      createdAt: row.created_at,
    };
    return new Movement(props);
  }
}
