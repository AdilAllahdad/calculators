/**
 * Application constants
 */

import { UnitOption } from '@/types/calculator';

export const UNIT_OPTIONS: UnitOption[] = [
  { value: 'mm', label: 'millimeters (mm)', type: 'length' },
  { value: 'cm', label: 'centimeters (cm)', type: 'length' },
  { value: 'm', label: 'meters (m)', type: 'length' },
  { value: 'in', label: 'inches (in)', type: 'length' },
  { value: 'ft', label: 'feet (ft)', type: 'length' },
  { value: 'ft/in', label: 'feet / inches (ft / in)', type: 'length' }
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'PKR', label: 'Pakistani Rupee', symbol: '₨' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' }
];

export const CALCULATOR_CATEGORIES = [
  {
    id: 'construction-converters',
    name: 'Construction Converters',
    path: '/calculators/construction-converters',
    icon: '🔄'
  },
  {
    id: 'construction-materials',
    name: 'Construction Materials Calculators',
    path: '/calculators/construction-materials',
    icon: '🧱'
  },
  {
    id: 'cement-concrete',
    name: 'Cement and Concrete Calculators',
    path: '/calculators/cement-concrete',
    icon: '🏗️'
  },
  {
    id: 'home-garden',
    name: 'Home and Garden Calculators',
    path: '/calculators/home-garden',
    icon: '🏠'
  },
  {
    id: 'roofing',
    name: 'Roofing Calculators',
    path: '/calculators/roofing',
    icon: '🏠'
  },
  {
    id: 'water-tank-vessels',
    name: 'Water Tank and Vessels Calculators',
    path: '/calculators/water-tank-vessels',
    icon: '🚰'
  },
  {
    id: 'materials-specifications',
    name: 'Materials Specifications Calculators',
    path: '/calculators/materials-specifications',
    icon: '📋'
  },
  {
    id: 'other',
    name: 'Other Calculators',
    path: '/calculators/other',
    icon: '🔧'
  }
];

export const DEFAULT_BOARD_FOOT_VALUES = {
  numPieces: 1,
  thickness: 1,
  thicknessUnit: 'in',
  width: 10,
  widthUnit: 'in',
  length: 8,
  lengthUnit: 'ft',
  price: 4.15,
  currency: 'USD'
};
