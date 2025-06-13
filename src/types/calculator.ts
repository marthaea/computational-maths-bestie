export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForOperand: boolean;
  memory: number;
  history: string[];
  isAdvancedMode: boolean;
}

export interface UnitConversion {
  category: string;
  from: string;
  to: string;
  factor: number;
}

export interface StatisticalData {
  values: number[];
  mean?: number;
  median?: number;
  stdDev?: number;
  variance?: number;
}