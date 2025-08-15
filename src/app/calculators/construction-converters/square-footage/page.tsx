
"use client"

import React, { useState, useEffect } from "react";
import UnitDropdown from "@/components/UnitDropdown";
import { convertValue } from "@/lib/utils";

// Define the unit values needed for each dropdown
const lengthUnitValues = ['cm', 'm', 'in', 'ft', 'yd', 'ft-in', 'm-cm'];
const areaUnitValues = ['cm2', 'm2', 'in2', 'ft2', 'yd2'];
const costAreaUnitValues = ['m2', 'ft2', 'yd2'];

export default function SquareFootageCalculator() {
  const [length, setLength] = useState<number | string>("");
  const [width, setWidth] = useState<number | string>("");
  const [lengthUnit, setLengthUnit] = useState("cm");
  const [widthUnit, setWidthUnit] = useState("cm");
  const [areaUnit, setAreaUnit] = useState("yd2");
  const [quantity, setQuantity] = useState<number | string>("1");
  const [unitPrice, setUnitPrice] = useState<number | string>("");
  const [unitPriceUnit, setUnitPriceUnit] = useState("m2");
  // Currency is always PKR
  const currency = "PKR";
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
    const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
    const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
    const numQuantity = typeof quantity === 'string' ? parseFloat(quantity) || 0 : quantity || 1;
    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
    
    if (numLength <= 0 || numWidth <= 0) {
      return;
    }

    // Convert length and width to meters first for consistent calculation
    const lengthInMeters = convertValue(numLength, lengthUnit, 'm');
    const widthInMeters = convertValue(numWidth, widthUnit, 'm');
    
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
    
    // Calculate total cost
    const cost = numUnitPrice * areaInPricingUnit;
    setTotalCost(cost);
  };
  
  // Format number with commas for thousands separators
  const formatNumberWithCommas = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };
  
  // Format currency values with 2 decimal places
  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    if (!length || !width) {
      setQuantity("1");
      setUnitPrice("");
    }
    
    // Only calculate when values are valid (not negative)
    const hasNegativeValues = 
      (length !== "" && Number(length) < 0) || 
      (width !== "" && Number(width) < 0) || 
      (quantity !== "" && Number(quantity) < 0) || 
      (unitPrice !== "" && Number(unitPrice) < 0);
      
    if (!hasNegativeValues) {
      calculateRealTimeArea();
    }
  }, [length, width, quantity, lengthUnit, widthUnit, areaUnit, unitPrice, unitPriceUnit]);

  const handleLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
    if (numLength) {
      // Use the universal conversion function
      setLength(convertValue(numLength, lengthUnit, newUnit));
    }
    setLengthUnit(newUnit);
  };
  
  const handleWidthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
    if (numWidth) {
      // Use the universal conversion function
      setWidth(convertValue(numWidth, widthUnit, newUnit));
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
  };
  
  const handleUnitPriceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
    if (numUnitPrice > 0) {
      // Use the universal conversion function
      setUnitPrice(convertValue(numUnitPrice, unitPriceUnit, newUnit));
    }
    setUnitPriceUnit(newUnit);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use our real-time calculation function
    calculateRealTimeArea();
  };

  const resetCalculator = () => {
    setLength("");
    setWidth("");
    setLengthUnit("cm");
    setWidthUnit("ft");
    setAreaUnit("ft2");
    setQuantity("");
    setUnitPrice("");
    setUnitPriceUnit("ft2");
    setArea(undefined);
    setTotalCost(null);
    setShowFeedback(false);
  };

  const clearAllChanges = () => {
    setLength("");
    setWidth("");
    setQuantity("");
    setArea(undefined);
    setTotalCost(null);
  };

  const shareResult = () => {
    // This would typically use the Web Share API or copy to clipboard
    if (area !== undefined) {
      console.log(`Area: ${formatNumberWithCommas(area)} ${areaUnit}, Total Cost: ${currency} ${totalCost !== null ? formatCurrency(totalCost) : ""}`);
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
                <button className="text-blue-500 text-xs">•••</button>
              </div>
              <div className="flex">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${widthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                  value={width || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setWidth(value);
                    setWidthError(value !== '' && Number(value) < 0 ? "Width cannot be negative." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                  value={widthUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
                    if (numWidth) {
                      // Use the universal conversion function
                      setWidth(convertValue(numWidth, widthUnit, newUnit));
                    }
                    setWidthUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
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
                <button className="text-blue-500 text-xs">•••</button>
              </div>
              <div className="flex">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 ${lengthError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                  value={length || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setLength(value);
                    setLengthError(value !== '' && Number(value) < 0 ? "Length cannot be negative." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                  value={lengthUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
                    if (numLength) {
                      // Use the universal conversion function
                      setLength(convertValue(numLength, lengthUnit, newUnit));
                    }
                    setLengthUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
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
                <label className="text-base font-medium text-gray-700">Quantity <span title="Number of identical areas" className="text-xs text-slate-400 cursor-help">&#9432;</span></label>
                <button className="text-blue-500 text-xs">•••</button>
              </div>
              <div className="flex">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${quantityError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                  value={quantity || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
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
                <button className="text-blue-500 text-xs">•••</button>
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none"
                  value={area !== undefined ? formatNumberWithCommas(area) : ""}
                  readOnly
                />
                <select 
                  className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                  value={areaUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    if (area !== undefined && area > 0) {
                      // Use the universal conversion function
                      setArea(convertValue(area, areaUnit, newUnit));
                    }
                    setAreaUnit(newUnit);
                  }}
                >
                  {areaUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
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
                <button className="text-blue-500 text-xs">•••</button>
              </div>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-slate-300 rounded-l bg-slate-50 text-slate-600">
                  PKR
                </div>
                <input 
                  type="number" 
                  className={`flex-1 border-t border-b px-3 py-2 focus:outline-none focus:ring-1 ${unitPriceError ? 'border-red-500' : 'focus:ring-blue-500'}`}
                  value={unitPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setUnitPrice(value);
                    setUnitPriceError(value !== '' && Number(value) < 0 ? "Unit price cannot be negative." : null);
                  }}
                  placeholder="0"
                />
                <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">/</div>
                <select 
                  className="w-24 px-3 py-2 border border-l-0 rounded-r-md bg-white text-blue-500 focus:outline-none"
                  value={unitPriceUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
                    if (numUnitPrice > 0) {
                      // Use the universal conversion function
                      setUnitPrice(convertValue(numUnitPrice, unitPriceUnit, newUnit));
                    }
                    setUnitPriceUnit(newUnit);
                  }}
                >
                  {costAreaUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
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
                <button className="text-blue-500 text-xs">•••</button>
              </div>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-slate-300 rounded-l bg-slate-50 text-slate-600">
                  PKR
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
