export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'USD') {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    this._amount = Math.round(amount * 100) / 100; // Round to 2 decimal places
    this._currency = currency.toUpperCase();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.validateCurrency(other);
    return new Money(this._amount + other.amount, this._currency);
  }

  subtract(other: Money): Money {
    this.validateCurrency(other);
    const result = this._amount - other.amount;
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return new Money(result, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other.amount && this._currency === other.currency;
  }

  private validateCurrency(other: Money): void {
    if (this._currency !== other.currency) {
      throw new Error('Cannot operate on different currencies');
    }
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}
