import React from 'react';

type LengthUnitType = 'mm' | 'cm' | 'm' | 'in' | 'ft';

interface LengthInputProps {
  value: number;
  onValueChange: (value: number) => void;
  unit: LengthUnitType;
  onUnitChange: (unit: LengthUnitType) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export function LengthInput({
  value,
  onValueChange,
  unit,
  onUnitChange,
  className = '',
  placeholder,
  required,
  min,
  max,
}: LengthInputProps) {
  // Conversion factors relative to mm
  const conversionFactors: Record<LengthUnitType, number> = {
    'mm': 1,
    'cm': 10,
    'm': 1000,
    'in': 25.4,
    'ft': 304.8,
  };

  const handleUnitChange = (newUnit: LengthUnitType) => {
    if (value !== 0 && !isNaN(value)) {
      // Convert current value from old unit to new unit
      const valueInMM = value * conversionFactors[unit]; // Convert to mm first
      const newValue = valueInMM / conversionFactors[newUnit]; // Then convert to new unit
      onValueChange(Number(newValue.toFixed(6)));
    }
    onUnitChange(newUnit);
  };

  return (
    <div className={`flex ${className}`}>
      <input
        type="number"
        value={value === 0 ? '' : value}
        onChange={(e) => onValueChange(e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
      />
      <select
        value={unit}
        onChange={(e) => handleUnitChange(e.target.value as LengthUnitType)}
        className="px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="mm">mm</option>
        <option value="cm">cm</option>
        <option value="m">m</option>
        <option value="in">in</option>
        <option value="ft">ft</option>
      </select>
    </div>
  );
}
