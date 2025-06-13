import { MATHEMATICAL_CONSTANTS } from './constants';

export class Calculator {
  static add(a: number, b: number): number {
    return a + b;
  }

  static subtract(a: number, b: number): number {
    return a - b;
  }

  static multiply(a: number, b: number): number {
    return a * b;
  }

  static divide(a: number, b: number): number {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }

  static power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  static sqrt(n: number): number {
    if (n < 0) throw new Error('Square root of negative number');
    return Math.sqrt(n);
  }

  static factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer');
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  static sin(angle: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const radians = angleMode === 'deg' ? angle * Math.PI / 180 : angle;
    return Math.sin(radians);
  }

  static cos(angle: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const radians = angleMode === 'deg' ? angle * Math.PI / 180 : angle;
    return Math.cos(radians);
  }

  static tan(angle: number, angleMode: 'deg' | 'rad' = 'rad'): number {
    const radians = angleMode === 'deg' ? angle * Math.PI / 180 : angle;
    return Math.tan(radians);
  }

  static log(n: number): number {
    if (n <= 0) throw new Error('Logarithm of non-positive number');
    return Math.log10(n);
  }

  static ln(n: number): number {
    if (n <= 0) throw new Error('Natural logarithm of non-positive number');
    return Math.log(n);
  }

  static exp(n: number): number {
    return Math.exp(n);
  }

  static abs(n: number): number {
    return Math.abs(n);
  }

  static percent(value: number, total: number): number {
    return (value / total) * 100;
  }

  static combination(n: number, r: number): number {
    if (r > n || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
      throw new Error('Invalid combination parameters');
    }
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }

  static permutation(n: number, r: number): number {
    if (r > n || r < 0 || !Number.isInteger(n) || !Number.isInteger(r)) {
      throw new Error('Invalid permutation parameters');
    }
    return this.factorial(n) / this.factorial(n - r);
  }
}

export class Statistics {
  static mean(values: number[]): number {
    if (values.length === 0) throw new Error('Cannot calculate mean of empty array');
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  static median(values: number[]): number {
    if (values.length === 0) throw new Error('Cannot calculate median of empty array');
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  static variance(values: number[]): number {
    if (values.length === 0) throw new Error('Cannot calculate variance of empty array');
    const mean = this.mean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return this.mean(squaredDiffs);
  }

  static standardDeviation(values: number[]): number {
    return Math.sqrt(this.variance(values));
  }

  static min(values: number[]): number {
    if (values.length === 0) throw new Error('Cannot find minimum of empty array');
    return Math.min(...values);
  }

  static max(values: number[]): number {
    if (values.length === 0) throw new Error('Cannot find maximum of empty array');
    return Math.max(...values);
  }
}

export function formatNumber(num: number, precision: number = 10): string {
  if (isNaN(num) || !isFinite(num)) return 'Error';
  
  const rounded = Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  
  if (Math.abs(rounded) >= 1e6 || (Math.abs(rounded) < 1e-4 && rounded !== 0)) {
    return rounded.toExponential(6);
  }
  
  return rounded.toString();
}