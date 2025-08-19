import React from 'react';
import { UnitOption } from '@/types/calculator';
import { getUnitsByType, getUnitsByValues } from '@/lib/utils';

interface UnitDropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  unitType?: string | string[];
  unitValues?: string[];
  className?: string;
  id?: string;
  name?: string;
}

/**
 * Universal Unit Dropdown component
 * Displays unit options filtered by type or specific values
 */
const UnitDropdown: React.FC<UnitDropdownProps> = ({
  value,
  onChange,
  unitType,
  unitValues,
  className = '',
  id,
  name,
}) => {
  // Get units based on provided criteria
  const units: UnitOption[] = unitValues 
    ? getUnitsByValues(unitValues)
    : unitType 
      ? getUnitsByType(unitType) 
      : [];

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`border border-slate-300 rounded px-2 py-2 bg-white ${className}`}
    >
      {units.map(unit => (
        <option key={unit.value} value={unit.value}>
          {unit.value}
        </option>
      ))}
    </select>
  );
};

export default UnitDropdown;
