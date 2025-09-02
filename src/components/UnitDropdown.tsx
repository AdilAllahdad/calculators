import React, { useMemo } from 'react';
// Using local UnitOption interface instead of import
import { getUnitsByType, getUnitsByValues } from '@/lib/utils';

interface UnitOption {
  value: string;
  label: string;
}

interface UnitDropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  unitType?: string | string[];
  unitValues?: string[];
  options?: UnitOption[];
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
  options,
  className = '',
  id,
  name,
}) => {
  // Get units based on provided criteria
  const units: UnitOption[] = options || (unitValues
    ? getUnitsByValues(unitValues).map(u => ({ value: u.value, label: u.value }))
    : unitType
      ? getUnitsByType(unitType).map(u => ({ value: u.value, label: u.value }))
      : []);

  // Generate a unique identifier for this dropdown instance
  const dropdownId = useMemo(() => id || Math.random().toString(36).substr(2, 9), [id]);

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`border border-slate-300 rounded px-2 py-2 bg-white ${className}`}
    >
      {units.map((unit, index) => (
        <option key={`${dropdownId}-${index}-${unit.value}`} value={unit.value}>
          {unit.label}
        </option>
      ))}
    </select>
  );
};

export default UnitDropdown;
