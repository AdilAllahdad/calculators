/**
 * Type definitions for the calculator application
 */

export interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  href: string;
}

export interface CalculatorCategory {
  id: string;
  name: string;
  path: string;
  icon?: string;
  calculators: Calculator[];
}

export interface UnitOption {
  value: string;
  label: string;
  type: 'length' | 'area' | 'volume' | 'weight' | 'density' | 'currency';
}

export interface CalculationResult {
  value: number;
  unit: string;
  formatted: string;
}

export interface BoardFootInputs {
  numPieces: number;
  thickness: number;
  thicknessUnit: string;
  width: number;
  widthUnit: string;
  length: number;
  lengthUnit: string;
  price: number;
  currency: string;
}

export interface BoardFootResult {
  totalBoardFeet: number;
  totalCost: number;
  pricePerBoardFoot: number;
}
