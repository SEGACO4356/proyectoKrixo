export class Quantity {
  private readonly _value: number;

  constructor(value: number) {
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  add(quantity: Quantity): Quantity {
    return new Quantity(this._value + quantity.value);
  }

  subtract(quantity: Quantity): Quantity {
    const result = this._value - quantity.value;
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return new Quantity(result);
  }

  equals(other: Quantity): boolean {
    return this._value === other.value;
  }

  isGreaterThan(other: Quantity): boolean {
    return this._value > other.value;
  }

  isLessThan(other: Quantity): boolean {
    return this._value < other.value;
  }

  isZero(): boolean {
    return this._value === 0;
  }

  toString(): string {
    return this._value.toString();
  }
}
