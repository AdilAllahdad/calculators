
"use client"

import React, { useState, useEffect } from "react";
import UnitDropdown from "@/components/UnitDropdown";
import { convertValue, formatNumberWithCommas, formatCurrency } from "@/lib/utils";
import { getUnitsByValues } from "@/lib/utils";
import { CURRENCY_OPTIONS, CALCULATOR_UNITS } from "@/constants";

// Get the unit values for this calculator
const { length: lengthUnitValues, area: areaUnitValues, costArea: costAreaUnitValues } = CALCULATOR_UNITS.squareFootage;

export default function SquareFootageCalculator() {
  const [length, setLength] = useState<number | string>("");
  const [lengthFeet, setLengthFeet] = useState<number | string>("");
  const [lengthInches, setLengthInches] = useState<number | string>("");
  const [lengthMeters, setLengthMeters] = useState<number | string>("");
  const [lengthCentimeters, setLengthCentimeters] = useState<number | string>("");
  
  const [width, setWidth] = useState<number | string>("");
  const [widthFeet, setWidthFeet] = useState<number | string>("");
  const [widthInches, setWidthInches] = useState<number | string>("");
  const [widthMeters, setWidthMeters] = useState<number | string>("");
  const [widthCentimeters, setWidthCentimeters] = useState<number | string>("");
  
  const [lengthUnit, setLengthUnit] = useState("cm");
  const [widthUnit, setWidthUnit] = useState("cm");
  const [areaUnit, setAreaUnit] = useState("yd2");
  
  // Helper function to format displayed input values
  const formatInputValue = (value: number | string): string => {
    if (value === "" || value === undefined) return "";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return "";
    
    // Format with commas for large numbers and fewer decimals
    // Don't show excessive decimal places
    const isInteger = Number.isInteger(numValue);
    if (isInteger) {
      return numValue.toLocaleString('en-US');
    }
    
    // Round to max 2 decimal places for display
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };
  const [quantity, setQuantity] = useState<number | string>("1");
  const [unitPrice, setUnitPrice] = useState<number | string>("");
  const [unitPriceUnit, setUnitPriceUnit] = useState("m2");
  // Currency is always PKR
  const currency = CURRENCY_OPTIONS.find(c => c.value === 'PKR')?.value || 'PKR';
  const currencySymbol = CURRENCY_OPTIONS.find(c => c.value === 'PKR')?.symbol || 'PKR';
  const [area, setArea] = useState<number | undefined>(undefined);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // State for validation errors
  const [lengthError, setLengthError] = useState<string | null>(null);
  const [widthError, setWidthError] = useState<string | null>(null);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [unitPriceError, setUnitPriceError] = useState<string | null>(null);
  
  // State for collapsible sections
  const [dimensionsExpanded, setDimensionsExpanded] = useState<boolean>(true);
  const [costExpanded, setCostExpanded] = useState<boolean>(true);
  
  // Calculate area and cost in real-time
  const calculateRealTimeArea = () => {
    // Skip calculation if inputs aren't valid
    let lengthInMeters: number;
    let widthInMeters: number;
    
    // Handle different unit types for length
    if (lengthUnit === 'ft-in') {
      const feet = typeof lengthFeet === 'string' ? parseFloat(lengthFeet) || 0 : lengthFeet;
      const inches = typeof lengthInches === 'string' ? parseFloat(lengthInches) || 0 : lengthInches;
      // Convert to feet first
      const valueInFeet = feet + (inches / 12);
      // Then convert to meters
      lengthInMeters = convertValue(valueInFeet, 'ft', 'm');
      
      // Return if both fields are zero or empty
      if (feet <= 0 && inches <= 0) {
        return;
      }
    } else if (lengthUnit === 'm-cm') {
      const meters = typeof lengthMeters === 'string' ? parseFloat(lengthMeters) || 0 : lengthMeters;
      const centimeters = typeof lengthCentimeters === 'string' ? parseFloat(lengthCentimeters) || 0 : lengthCentimeters;
      // Convert to meters first
      lengthInMeters = meters + (centimeters / 100);
      
      // Return if both fields are zero or empty
      if (meters <= 0 && centimeters <= 0) {
        return;
      }
    } else {
      const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
      if (numLength <= 0) {
        return;
      }
      lengthInMeters = convertValue(numLength, lengthUnit, 'm');
    }
    
    // Handle different unit types for width
    if (widthUnit === 'ft-in') {
      const feet = typeof widthFeet === 'string' ? parseFloat(widthFeet) || 0 : widthFeet;
      const inches = typeof widthInches === 'string' ? parseFloat(widthInches) || 0 : widthInches;
      // Convert to feet first
      const valueInFeet = feet + (inches / 12);
      // Then convert to meters
      widthInMeters = convertValue(valueInFeet, 'ft', 'm');
      
      // Return if both fields are zero or empty
      if (feet <= 0 && inches <= 0) {
        return;
      }
    } else if (widthUnit === 'm-cm') {
      const meters = typeof widthMeters === 'string' ? parseFloat(widthMeters) || 0 : widthMeters;
      const centimeters = typeof widthCentimeters === 'string' ? parseFloat(widthCentimeters) || 0 : widthCentimeters;
      // Convert to meters first
      widthInMeters = meters + (centimeters / 100);
      
      // Return if both fields are zero or empty
      if (meters <= 0 && centimeters <= 0) {
        return;
      }
    } else {
      const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
      if (numWidth <= 0) {
        return;
      }
      widthInMeters = convertValue(numWidth, widthUnit, 'm');
    }
    
    const numQuantity = typeof quantity === 'string' ? parseFloat(quantity) || 0 : quantity || 1;
    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;

    // Calculate area in square meters
    const areaInSquareMeters = lengthInMeters * widthInMeters * numQuantity;
    
    // Convert to selected display unit
    const areaDisplay = convertValue(areaInSquareMeters, 'm2', areaUnit);
    
    setArea(areaDisplay);
    
    // Calculate cost based on unit price and unit
    if (numUnitPrice <= 0) {
      setTotalCost(null);
      return;
    }
    
    // Convert area to the unit used for pricing
    const areaInPricingUnit = convertValue(areaInSquareMeters, 'm2', unitPriceUnit);
    
    // Calculate total cost with more precision
    const cost = numUnitPrice * areaInPricingUnit;
    // Round to 2 decimal places for currency
    const roundedCost = Math.round(cost * 100) / 100;
    setTotalCost(roundedCost);
  };
  
  // Validate all inputs
  useEffect(() => {
    setLengthError(length !== "" && Number(length) < 0 ? "Length cannot be negative." : null);
    setWidthError(width !== "" && Number(width) < 0 ? "Width cannot be negative." : null);
    setQuantityError(quantity !== "" && Number(quantity) < 0 ? "Quantity cannot be negative." : null);
    setUnitPriceError(unitPrice !== "" && Number(unitPrice) < 0 ? "Unit price cannot be negative." : null);
  }, [length, width, quantity, unitPrice]);
  
  // Update area calculation whenever inputs change
  // Initial calculation and setup
  useEffect(() => {
    const shouldResetDependentValues = () => {
      // For regular units
      if (lengthUnit !== 'ft-in' && lengthUnit !== 'm-cm' && 
          widthUnit !== 'ft-in' && widthUnit !== 'm-cm' && 
          (!length || !width)) {
        return true;
      }
      
      // For ft-in units
      if ((lengthUnit === 'ft-in' && (!lengthFeet && !lengthInches)) || 
          (widthUnit === 'ft-in' && (!widthFeet && !widthInches))) {
        return true;
      }
      
      // For m-cm units
      if ((lengthUnit === 'm-cm' && (!lengthMeters && !lengthCentimeters)) || 
          (widthUnit === 'm-cm' && (!widthMeters && !widthCentimeters))) {
        return true;
      }
      
      return false;
    };
    
    if (shouldResetDependentValues()) {
      setQuantity("1");
      setUnitPrice("");
    }
    
    // Only calculate when values are valid (not negative)
    const hasNegativeValues = () => {
      // Regular units
      if (length !== "" && Number(length) < 0) return true;
      if (width !== "" && Number(width) < 0) return true;
      
      // ft-in units
      if (lengthFeet !== "" && Number(lengthFeet) < 0) return true;
      if (lengthInches !== "" && Number(lengthInches) < 0) return true;
      if (widthFeet !== "" && Number(widthFeet) < 0) return true;
      if (widthInches !== "" && Number(widthInches) < 0) return true;
      
      // m-cm units
      if (lengthMeters !== "" && Number(lengthMeters) < 0) return true;
      if (lengthCentimeters !== "" && Number(lengthCentimeters) < 0) return true;
      if (widthMeters !== "" && Number(widthMeters) < 0) return true;
      if (widthCentimeters !== "" && Number(widthCentimeters) < 0) return true;
      
      // Other fields
      if (quantity !== "" && Number(quantity) < 0) return true;
      if (unitPrice !== "" && Number(unitPrice) < 0) return true;
      
      return false;
    };
      
    if (!hasNegativeValues()) {
      calculateRealTimeArea();
    }
  }, [length, width, 
      lengthFeet, lengthInches, widthFeet, widthInches, 
      lengthMeters, lengthCentimeters, widthMeters, widthCentimeters, 
      quantity, lengthUnit, widthUnit, areaUnit, unitPrice, unitPriceUnit]);

  const handleLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = typeof length === 'string' ? parseFloat(length) || 0 : length;
    
    // Convert values when switching to compound unit modes
    if (newUnit === 'ft-in' && lengthUnit !== 'ft-in') {
      const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
      const valueInFeet = convertValue(numLength, lengthUnit, 'ft');
      const feet = Math.floor(valueInFeet);
      const inches = Math.round((valueInFeet - feet) * 12 * 100) / 100;
      setLengthFeet(feet);
      setLengthInches(inches);
      setLengthUnit(newUnit);
      // Calculate area after unit change
      setTimeout(() => calculateRealTimeArea(), 0);
      return;
    }
    if (newUnit === 'm-cm' && lengthUnit !== 'm-cm') {
      const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
      const valueInMeters = convertValue(numLength, lengthUnit, 'm');
      const meters = Math.floor(valueInMeters);
      const centimeters = Math.round((valueInMeters - meters) * 100 * 100) / 100;
      setLengthMeters(meters);
      setLengthCentimeters(centimeters);
      setLengthUnit(newUnit);
      // Calculate area after unit change
      setTimeout(() => calculateRealTimeArea(), 0);
      return;
    }
    // Converting from ft/in to a regular unit
    else if (lengthUnit === 'ft-in' && newUnit !== 'ft-in') {
      const feet = typeof lengthFeet === 'string' ? parseFloat(lengthFeet) || 0 : lengthFeet;
      const inches = typeof lengthInches === 'string' ? parseFloat(lengthInches) || 0 : lengthInches;
      // Convert to feet first
      const valueInFeet = feet + (inches / 12);
      // Then convert to the target unit
      setLength(convertValue(valueInFeet, 'ft', newUnit));
    } 
    // Converting from m/cm to a regular unit
    else if (lengthUnit === 'm-cm' && newUnit !== 'm-cm') {
      const meters = typeof lengthMeters === 'string' ? parseFloat(lengthMeters) || 0 : lengthMeters;
      const centimeters = typeof lengthCentimeters === 'string' ? parseFloat(lengthCentimeters) || 0 : lengthCentimeters;
      // Convert to meters first
      const valueInMeters = meters + (centimeters / 100);
      // Then convert to the target unit
      setLength(convertValue(valueInMeters, 'm', newUnit));
    } 
    // Regular unit to regular unit conversion
    else if (newUnit !== 'ft-in' && newUnit !== 'm-cm') {
      if (currentValue) {
        setLength(convertValue(currentValue, lengthUnit, newUnit));
      }
    }
    
    setLengthUnit(newUnit);
  };
  
  const handleWidthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = typeof width === 'string' ? parseFloat(width) || 0 : width;
    
    // Convert values when switching to compound unit modes
    if (newUnit === 'ft-in' && widthUnit !== 'ft-in') {
      const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
      const valueInFeet = convertValue(numWidth, widthUnit, 'ft');
      const feet = Math.floor(valueInFeet);
      const inches = Math.round((valueInFeet - feet) * 12 * 100) / 100;
      setWidthFeet(feet);
      setWidthInches(inches);
      setWidthUnit(newUnit);
      // Calculate area after unit change
      setTimeout(() => calculateRealTimeArea(), 0);
      return;
    }
    if (newUnit === 'm-cm' && widthUnit !== 'm-cm') {
      const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
      const valueInMeters = convertValue(numWidth, widthUnit, 'm');
      const meters = Math.floor(valueInMeters);
      const centimeters = Math.round((valueInMeters - meters) * 100 * 100) / 100;
      setWidthMeters(meters);
      setWidthCentimeters(centimeters);
      setWidthUnit(newUnit);
      // Calculate area after unit change
      setTimeout(() => calculateRealTimeArea(), 0);
      return;
    }
    // Converting from ft/in to a regular unit
    else if (widthUnit === 'ft-in' && newUnit !== 'ft-in') {
      const feet = typeof widthFeet === 'string' ? parseFloat(widthFeet) || 0 : widthFeet;
      const inches = typeof widthInches === 'string' ? parseFloat(widthInches) || 0 : widthInches;
      // Convert to feet first
      const valueInFeet = feet + (inches / 12);
      // Then convert to the target unit
      setWidth(convertValue(valueInFeet, 'ft', newUnit));
    } 
    // Converting from m/cm to a regular unit
    else if (widthUnit === 'm-cm' && newUnit !== 'm-cm') {
      const meters = typeof widthMeters === 'string' ? parseFloat(widthMeters) || 0 : widthMeters;
      const centimeters = typeof widthCentimeters === 'string' ? parseFloat(widthCentimeters) || 0 : widthCentimeters;
      // Convert to meters first
      const valueInMeters = meters + (centimeters / 100);
      // Then convert to the target unit
      setWidth(convertValue(valueInMeters, 'm', newUnit));
    } 
    // Regular unit to regular unit conversion
    else if (newUnit !== 'ft-in' && newUnit !== 'm-cm') {
      if (currentValue) {
        setWidth(convertValue(currentValue, widthUnit, newUnit));
      }
    }
    
    setWidthUnit(newUnit);
  };
  
  const handleAreaUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (area !== undefined && area > 0) {
      // Use the universal conversion function
      setArea(convertValue(area, areaUnit, newUnit));
    }
    setAreaUnit(newUnit);
    
    // Recalculate the total cost since area unit changed
    // This ensures total cost remains consistent with the current area and unit price
    setTimeout(() => calculateRealTimeArea(), 0);
  };
  
  const handleUnitPriceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
    
    if (numUnitPrice > 0) {
      // Use the universal conversion function to update the price
      const convertedPrice = convertValue(numUnitPrice, unitPriceUnit, newUnit);
      setUnitPrice(convertedPrice);
    }
    
    // Update the unit first, then recalculate after state is updated
    setUnitPriceUnit(newUnit);
    
    // Use setTimeout to ensure state changes are processed before recalculating
    setTimeout(() => calculateRealTimeArea(), 0);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use our real-time calculation function
    calculateRealTimeArea();
  };

  const resetCalculator = () => {
    setLength("");
    setWidth("");
    setLengthFeet("");
    setLengthInches("");
    setWidthFeet("");
    setWidthInches("");
    setLengthMeters("");
    setLengthCentimeters("");
    setWidthMeters("");
    setWidthCentimeters("");
    setLengthUnit("cm");
    setWidthUnit("cm");
    setAreaUnit("ft2");
    setQuantity("1");
    setUnitPrice("");
    setUnitPriceUnit("ft2");
    setArea(undefined);
    setTotalCost(null);
    setShowFeedback(false);
  };

  const clearAllChanges = () => {
    setLength("");
    setWidth("");
    setLengthFeet("");
    setLengthInches("");
    setWidthFeet("");
    setWidthInches("");
    setLengthMeters("");
    setLengthCentimeters("");
    setWidthMeters("");
    setWidthCentimeters("");
    setQuantity("1");
    setArea(undefined);
    setTotalCost(null);
  };

  const shareResult = () => {
    // This would typically use the Web Share API or copy to clipboard
    if (area !== undefined) {
      console.log(`Area: ${formatNumberWithCommas(area)} ${areaUnit}, Total Cost: ${currencySymbol} ${totalCost !== null ? formatCurrency(totalCost) : ""}`);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Square Footage Calculator</h1>
      
      {/* Dimensions Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-600"
          onClick={() => setDimensionsExpanded(!dimensionsExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {dimensionsExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Dimensions</span>
          </div>
        </button>
        
        {dimensionsExpanded && (
          <div className="p-4">
            {/* Width */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Width</label>
              </div>
              
              {/* Different input fields based on the selected unit */}
              {widthUnit === 'ft-in' ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={widthFeet || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setWidthFeet(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">ft</div>
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={widthInches || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setWidthInches(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">in</div>
                  </div>
                  <UnitDropdown
                    value={widthUnit}
                    onChange={handleWidthUnitChange}
                    unitValues={lengthUnitValues}
                    className="w-24 ml-1 rounded-md"
                  />
                </div>
              ) : widthUnit === 'm-cm' ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={widthMeters || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setWidthMeters(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">m</div>
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={widthCentimeters || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setWidthCentimeters(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">cm</div>
                  </div>
                  <UnitDropdown
                    value={widthUnit}
                    onChange={handleWidthUnitChange}
                    unitValues={lengthUnitValues}
                    className="w-24 ml-1 rounded-md"
                  />
                </div>
              ) : (
                <div className="flex">
                  <input 
                    type="text" 
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${widthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                    value={formatInputValue(width)}
                    onChange={(e) => {
                      // Remove any commas and non-numeric characters (except for decimal point)
                      const rawValue = e.target.value.replace(/,/g, '');
                      const value = rawValue === '' ? '' : Number(rawValue);
                      setWidth(value);
                      setWidthError(value !== '' && Number(value) < 0 ? "Width cannot be negative." : null);
                    }}
                    placeholder="0"
                  />
                  <UnitDropdown
                    value={widthUnit}
                    onChange={handleWidthUnitChange}
                    unitValues={lengthUnitValues}
                    className="w-24 rounded-l-none rounded-r-md border-l-0"
                  />
                </div>
              )}
              {widthError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {widthError}
                </div>
              )}
            </div>
            
            {/* Length */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Length</label>
              </div>
              
              {/* Different input fields based on the selected unit */}
              {lengthUnit === 'ft-in' ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={lengthFeet || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setLengthFeet(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">ft</div>
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={lengthInches || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setLengthInches(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">in</div>
                  </div>
                  <UnitDropdown
                    value={lengthUnit}
                    onChange={handleLengthUnitChange}
                    unitValues={lengthUnitValues}
                    className="w-24 ml-1 rounded-md"
                  />
                </div>
              ) : lengthUnit === 'm-cm' ? (
                <div className="flex">
                  <div className="flex-1 flex">
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={lengthMeters || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setLengthMeters(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">m</div>
                    <input 
                      type="number" 
                      className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={lengthCentimeters || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        setLengthCentimeters(value);
                      }}
                      placeholder="0"
                    />
                    <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">cm</div>
                  </div>
                  <UnitDropdown
                    value={lengthUnit}
                    onChange={handleLengthUnitChange}
                    unitValues={lengthUnitValues}
                    className="w-24 ml-1 rounded-md"
                  />
                </div>
              ) : (
                <div className="flex">
                  <input 
                    type="text" 
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${lengthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                    value={formatInputValue(length)}
                    onChange={(e) => {
                      // Remove any commas and non-numeric characters (except for decimal point)
                      const rawValue = e.target.value.replace(/,/g, '');
                      const value = rawValue === '' ? '' : Number(rawValue);
                      setLength(value);
                      setLengthError(value !== '' && Number(value) < 0 ? "Length cannot be negative." : null);
                    }}
                    placeholder="0"
                  />
                  <UnitDropdown
                    value={lengthUnit}
                    onChange={handleLengthUnitChange}
                    unitValues={lengthUnitValues}
                    className="w-24 rounded-l-none rounded-r-md border-l-0"
                  />
                </div>
              )}
              {lengthError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {lengthError}
                </div>
              )}
            </div>
            
            {/* Quantity */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Quantity <span title="How many rectangles do you have of this size?

" className="text-xs text-slate-400 cursor-help">&#9432;</span></label>
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${quantityError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                  value={formatInputValue(quantity)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, '');
                    const value = rawValue === '' ? '' : Number(rawValue);
                    setQuantity(value);
                    setQuantityError(value !== '' && Number(value) < 0 ? "Quantity cannot be negative." : null);
                  }}
                  placeholder="1"
                />
              </div>
              {quantityError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {quantityError}
                </div>
              )}
            </div>
            
            {/* Area */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Area</label>
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none"
                  value={area !== undefined ? formatNumberWithCommas(area) : ""}
                  readOnly
                />
                <UnitDropdown
                  value={areaUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    if (area !== undefined && area > 0) {
                      // Use the universal conversion function
                      setArea(convertValue(area, areaUnit, newUnit));
                    }
                    setAreaUnit(newUnit);
                  }}
                  unitValues={areaUnitValues}
                  className="w-24 rounded-l-none rounded-r-md border-l-0"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Cost Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-600"
          onClick={() => setCostExpanded(!costExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {costExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Cost of materials</span>
          </div>
        </button>
        
        {costExpanded && (
          <div className="p-4">
            {/* Unit price */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Unit price</label>
              </div>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-slate-300 rounded-l bg-slate-50 text-slate-600">
                  {currencySymbol}
                </div>
                <input 
                  type="text" 
                  className={`flex-1 border-t border-b px-3 py-2 focus:outline-none focus:ring-1 ${unitPriceError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                  value={formatInputValue(unitPrice)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, '');
                    const value = rawValue === '' ? '' : Number(rawValue);
                    setUnitPrice(value);
                    setUnitPriceError(value !== '' && Number(value) < 0 ? "Unit price cannot be negative." : null);
                    // Recalculate the total cost after updating the unit price
                    if (value !== '' && Number(value) >= 0) {
                      setTimeout(() => calculateRealTimeArea(), 0);
                    }
                  }}
                  placeholder="0"
                />
                <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">/</div>
                <UnitDropdown
                  value={unitPriceUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
                    
                    if (numUnitPrice > 0) {
                      // Use the universal conversion function to convert the price
                      const convertedPrice = convertValue(numUnitPrice, unitPriceUnit, newUnit);
                      setUnitPrice(convertedPrice);
                    }
                    
                    // Update the unit and recalculate
                    setUnitPriceUnit(newUnit);
                    
                    // Recalculate after state update
                    setTimeout(() => calculateRealTimeArea(), 0);
                  }}
                  unitValues={costAreaUnitValues}
                  className="w-24 rounded-l-none rounded-r-md border-l-0"
                />
              </div>
              {unitPriceError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {unitPriceError}
                </div>
              )}
            </div>
            
            {/* Total cost */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Total cost</label>
              </div>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-slate-300 rounded-l bg-slate-50 text-slate-600">
                  {currencySymbol}
                </div>
                <input 
                  type="text" 
                  className="w-full border-t border-r border-b border-slate-300 rounded-r px-3 py-2 bg-slate-50 text-blue-500 font-medium"
                  value={totalCost !== null ? formatCurrency(totalCost) : ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={resetCalculator}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded font-medium hover:bg-gray-300 transition"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={calculateRealTimeArea}
          className="flex-1 bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition"
        >
          Calculate
        </button>
      </div>
    </div>
  );
}
