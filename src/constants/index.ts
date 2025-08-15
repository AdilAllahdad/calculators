/**
 * Application constants
 */

import { UnitOption } from '@/types/calculator';

export const UNIT_OPTIONS: UnitOption[] = [
  // Length units
  { value: 'mm', label: 'millimeters (mm)', type: 'length' },
  { value: 'cm', label: 'centimeters (cm)', type: 'length' },
  { value: 'm', label: 'meters (m)', type: 'length' },
  { value: 'km', label: 'kilometers (km)', type: 'length' },
  { value: 'in', label: 'inches (in)', type: 'length' },
  { value: 'ft', label: 'feet (ft)', type: 'length' },
  { value: 'yd', label: 'yards (yd)', type: 'length' },
  { value: 'mi', label: 'miles (mi)', type: 'length' },
  { value: 'ft-in', label: 'feet / inches (ft / in)', type: 'length' },
  { value: 'm-cm', label: 'meters / centimeters (m / cm)', type: 'length' },
  
  // Area units
  { value: 'mm2', label: 'square millimeters (mm²)', type: 'area' },
  { value: 'cm2', label: 'square centimeters (cm²)', type: 'area' },
  { value: 'm2', label: 'square meters (m²)', type: 'area' },
  { value: 'ha', label: 'hectares (ha)', type: 'area' },
  { value: 'km2', label: 'square kilometers (km²)', type: 'area' },
  { value: 'in2', label: 'square inches (in²)', type: 'area' },
  { value: 'ft2', label: 'square feet (ft²)', type: 'area' },
  { value: 'yd2', label: 'square yards (yd²)', type: 'area' },
  { value: 'ac', label: 'acres (ac)', type: 'area' },
  { value: 'mi2', label: 'square miles (mi²)', type: 'area' },
  
  // Volume units
  { value: 'mm3', label: 'cubic millimeters (mm³)', type: 'volume' },
  { value: 'cm3', label: 'cubic centimeters (cm³)', type: 'volume' },
  { value: 'dm3', label: 'cubic decimeters (dm³)', type: 'volume' },
  { value: 'l', label: 'liters (l)', type: 'volume' },
  { value: 'm3', label: 'cubic meters (m³)', type: 'volume' },
  { value: 'in3', label: 'cubic inches (in³)', type: 'volume' },
  { value: 'cu in', label: 'cubic inches (cu in)', type: 'volume' },
  { value: 'ft3', label: 'cubic feet (ft³)', type: 'volume' },
  { value: 'cu ft', label: 'cubic feet (cu ft)', type: 'volume' },
  { value: 'yd3', label: 'cubic yards (yd³)', type: 'volume' },
  { value: 'cu yd', label: 'cubic yards (cu yd)', type: 'volume' },
  { value: 'in3', label: 'cubic inches (cu in)', type: 'volume' },
  { value: 'ft3', label: 'cubic feet (cu ft)', type: 'volume' },
  { value: 'yd3', label: 'cubic yards (cu yd)', type: 'volume' },
  { value: 'gal', label: 'gallons (US) (gal)', type: 'volume' },
  { value: 'gal-uk', label: 'gallons (UK) (gal)', type: 'volume' },
  
  // Weight units
  { value: 'µg', label: 'micrograms (µg)', type: 'weight' },
  { value: 'mg', label: 'milligrams (mg)', type: 'weight' },
  { value: 'g', label: 'grams (g)', type: 'weight' },
  { value: 'dag', label: 'decagrams (dag)', type: 'weight' },
  { value: 'kg', label: 'kilograms (kg)', type: 'weight' },
  { value: 't', label: 'metric tons (t)', type: 'weight' },
  { value: 'gr', label: 'grains (gr)', type: 'weight' },
  { value: 'dr', label: 'drachms (dr)', type: 'weight' },
  { value: 'oz', label: 'ounces (oz)', type: 'weight' },
  { value: 'lb', label: 'pounds (lb)', type: 'weight' },
  { value: 'st', label: 'stone (st)', type: 'weight' },
  { value: 'ton', label: 'tons (US) (ton)', type: 'weight' },
  { value: 'ton-uk', label: 'tons (UK) (ton)', type: 'weight' },

  // Time units
  { value: 'sec', label: 'seconds (sec)', type: 'time' },
  { value: 'min', label: 'minutes (min)', type: 'time' },
  { value: 'hr', label: 'hours (hr)', type: 'time' },

  //BTU Units
  { value: 'BTU', label: 'BTU', type: 'BTU' },
  { value: 'kW', label: 'kW', type: 'BTU' },
  { value: 'watts', label: 'Watts', type: 'BTU' },
  { value: 'hp(l)', label: 'hp(l)', type: 'BTU' },
  { value: 'hp(E)', label: 'hp(E)', type: 'BTU' },
  { value: 'tons', label: 'tons', type: 'BTU' },

  //Boiler Units
  { value: 'LPM', label: 'Liters per Minute (LPM)', type: 'boiler' },
  { value: 'GPM', label: 'Gallons per Minute (GPM)', type: 'boiler' },
  { value: 'kW', label: 'kW', type: 'boiler' },
  { value: 'hp', label: 'hp', type: 'boiler' },

  // Weight units
  { value: 'st', label: 'stones (st)', type: 'weight' },
  { value: 'US ton', label: 'US short tons (US ton)', type: 'weight' },
  { value: 'long ton', label: 'imperial tons (long ton)', type: 'weight' },
  
  // Density units
  { value: 't/m3', label: 'tons per cubic meter (t/m³)', type: 'density' },
  { value: 'kg/m3', label: 'kilograms per cubic meter (kg/m³)', type: 'density' },
  { value: 'kg/L', label: 'kilograms per liter (kg/L)', type: 'density' },
  { value: 'g/L', label: 'grams per liter (g/L)', type: 'density' },
  { value: 'g/mL', label: 'grams per milliliter (g/mL)', type: 'density' },
  { value: 'g/cm3', label: 'grams per cubic centimeter (g/cm³)', type: 'density' },
  { value: 'oz/in3', label: 'ounces per cubic inch (oz/cu in)', type: 'density' },
  { value: 'lb/in3', label: 'pounds per cubic inch (lb/cu in)', type: 'density' },
  { value: 'lb/ft3', label: 'pounds per cubic feet (lb/cu ft)', type: 'density' },
  { value: 'lb/yd3', label: 'pounds per cubic yard (lb/cu yd)', type: 'density' },
  { value: 'lb/US gal', label: 'pounds per gallon (US) (lb/US gal)', type: 'density' },
  { value: 'lb/UK gal', label: 'pounds per gallon (UK) (lb/UK gal)', type: 'density' }
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
