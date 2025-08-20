// Utility hooks for handling unit changes and value conversion in calculator forms
import { useCallback } from 'react';
import { convertUnit } from '@/lib/convert-units-wrapper';

/**
 * Returns a handler for unit changes that also converts the value to the new unit.
 * @param value Current value as string
 * @param setValue Setter for value
 * @param unit Current unit
 * @param setUnit Setter for unit
 * @returns (newUnit: string) => void
 */
export function useUnitChangeHandler(value: string, setValue: (v: string) => void, unit: string, setUnit: (u: string) => void) {
  return useCallback(
    (newUnit: string) => {
      if (value === '' || isNaN(Number(value))) {
        setUnit(newUnit);
        return;
      }
      const numericValue = parseFloat(value);
      // Convert the value to the new unit
      const valueInNewUnit = convertUnit(numericValue, unit, newUnit);
      setValue(valueInNewUnit === 0 ? '' : valueInNewUnit.toString());
      setUnit(newUnit);
    },
    [value, setValue, unit, setUnit]
  );
}
