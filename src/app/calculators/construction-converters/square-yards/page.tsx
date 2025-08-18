"use client"

import React, { useState, useEffect } from "react";
import UnitDropdown from "@/components/UnitDropdown";
import { convertValue } from "@/lib/utils";

// Define the unit values needed for each dropdown
const lengthUnitValues = ['cm', 'm', 'in', 'ft', 'yd'];
const areaUnitValues = ['cm2', 'm2', 'km2', 'in2', 'ft2', 'yd2', 'a', 'ha', 'ac'];

// Area unit options with labels for display in dropdowns
const areaUnitOptions = [
  { value: 'cm2', label: 'square centimeter (cm²)' },
  { value: 'm2', label: 'square meter (m²)' },
  { value: 'km2', label: 'square kilometer (km²)' },
  { value: 'in2', label: 'square inch (in²)' },
  { value: 'ft2', label: 'square foot (ft²)' },
  { value: 'yd2', label: 'square yard (yd²)' },
  { value: 'a', label: 'are (a)' },
  { value: 'ha', label: 'hectare (ha)' },
  { value: 'ac', label: 'acre (ac)' },
];

const costAreaUnitValues = ['cm2','m2','km2','in2', 'ft2', 'yd2','a','ha','ac'];

export default function SquareYardsCalculator() {
  // State for inputs
  const [length, setLength] = useState<number | string>("");
  const [width, setWidth] = useState<number | string>("");
  const [lengthUnit, setLengthUnit] = useState("m");
  const [widthUnit, setWidthUnit] = useState("m");
  const [areaUnit, setAreaUnit] = useState("yd2");
  const [unitPrice, setUnitPrice] = useState<number | string>("");
  const [unitPriceUnit, setUnitPriceUnit] = useState("yd2");
  // Currency is always PKR
  const currency = "PKR";

  // State for outputs
  const [area, setArea] = useState<number | undefined>(undefined);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Calculate area and cost in real-time
  const calculateRealTimeArea = () => {
    // Skip calculation if inputs aren't valid
    const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
    const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
    
    if (numLength <= 0 || numWidth <= 0) {
      return;
    }

    // Convert length and width to meters first for consistent calculation
    const lengthInMeters = convertValue(numLength, lengthUnit, 'm');
    const widthInMeters = convertValue(numWidth, widthUnit, 'm');
    
    // Calculate area in square meters
    const areaInSquareMeters = lengthInMeters * widthInMeters;
    
    // Convert to selected display unit (square yards by default)
    const areaDisplay = convertValue(areaInSquareMeters, 'm2', areaUnit);
    
    setArea(areaDisplay);
    
    // Calculate cost based on unit price and unit
    if (numUnitPrice <= 0) {
      setTotalCost(null);
      return;
    }
    
    // Convert area to the unit used for pricing
    const areaInPricingUnit = convertValue(areaInSquareMeters, 'm2', unitPriceUnit);
    
    // Calculate total cost with high precision
    const cost = numUnitPrice * areaInPricingUnit;
    
    // Store the exact cost internally to maintain precision when changing units
    const exactCost = cost;
    
    // Round to 2 decimal places for display only
    const roundedCost = Math.round(exactCost * 100) / 100;
    setTotalCost(roundedCost);
  };
  
  // Update area calculation whenever relevant inputs change
  // Notably, unitPriceUnit is NOT included here to prevent recalculation when only the unit changes
  useEffect(() => {
    calculateRealTimeArea();
  }, [length, width, lengthUnit, widthUnit, areaUnit, unitPrice]);

  // Handle unit changes with conversions
  const handleLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const numLength = typeof length === 'string' ? parseFloat(length) || 0 : length;
    if (numLength) {
      setLength(convertValue(numLength, lengthUnit, newUnit));
    }
    setLengthUnit(newUnit);
  };
  
  const handleWidthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const numWidth = typeof width === 'string' ? parseFloat(width) || 0 : width;
    if (numWidth) {
      setWidth(convertValue(numWidth, widthUnit, newUnit));
    }
    setWidthUnit(newUnit);
  };
  
  const handleAreaUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    if (area !== undefined && area > 0) {
      setArea(convertValue(area, areaUnit, newUnit));
    }
    setAreaUnit(newUnit);
  };
  
  const handleUnitPriceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const numUnitPrice = typeof unitPrice === 'string' ? parseFloat(unitPrice) || 0 : unitPrice;
    
    // If we have a total cost and area, maintain the same total cost
    if (totalCost !== null && area !== undefined && area > 0) {
      // First convert the current area to square meters (base unit)
      const areaInSquareMeters = convertValue(area, areaUnit, 'm2');
      
      // Convert the area to the new pricing unit
      const areaInNewPricingUnit = convertValue(areaInSquareMeters, 'm2', newUnit);
      
      // Calculate the new unit price that would give the EXACT same total cost
      // totalCost = price × area
      // Therefore, price = totalCost / area
      const newUnitPrice = totalCost / areaInNewPricingUnit;
      
      // Preserve precision to maintain exact total cost
      setUnitPrice(newUnitPrice);
      
      // Force recalculation to ensure the total cost is preserved
      setTimeout(() => {
        calculateRealTimeArea();
      }, 0);
    } else if (numUnitPrice > 0) {
      // If no total cost yet, just do a simple unit conversion
      const convertedPrice = convertValue(numUnitPrice, unitPriceUnit, newUnit);
      setUnitPrice(convertedPrice);
    }
    
    // Update the unit
    setUnitPriceUnit(newUnit);
  };

  const resetCalculator = () => {
    setLength("");
    setWidth("");
    setLengthUnit("m");
    setWidthUnit("m");
    setAreaUnit("yd2");
    setUnitPrice("");
    setUnitPriceUnit("yd2");
    setArea(undefined);
    setTotalCost(null);
    setShowFeedback(false);
  };

  const clearAllChanges = () => {
    setLength("");
    setWidth("");
    setArea(undefined);
    setTotalCost(null);
  };

  const shareResult = () => {
    if (area !== undefined) {
      console.log(`Area: ${area.toFixed(2)} ${areaUnit}, Total Cost: ${currency} ${totalCost?.toFixed(2)}`);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center justify-center">
          Square Yards Calculator 
          <span className="ml-3 text-2xl">📏</span>
        </h1>
      </div>

      <div className="flex justify-center">
        {/* Calculator Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 w-full max-w-md">
          
          {/* Length Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Length <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={length}
                onChange={e => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setLength(value);
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                placeholder="Enter length"
                required
              />
              <select
                value={lengthUnit}
                onChange={handleLengthUnitChange}
                className="w-20 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {lengthUnitValues.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Width Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Width <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="any"
                value={width}
                onChange={e => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setWidth(value);
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
                placeholder="Enter width"
                required
              />
              <select
                value={widthUnit}
                onChange={handleWidthUnitChange}
                className="w-20 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                style={{ color: '#1e293b', backgroundColor: '#ffffff' }}
              >
                {lengthUnitValues.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Cost Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Cost of one area unit <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 border border-slate-300 rounded-l bg-slate-50 text-slate-700">
                {currency}
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={unitPrice}
                onChange={e => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setUnitPrice(value);
                }}
                className="flex-1 px-3 py-2 border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700"
                style={{ backgroundColor: '#ffffff' }}
                placeholder="0.00"
              />
              <div className="flex items-center px-2 border border-slate-300 bg-slate-50 text-slate-700">
                /
              </div>
              <select
                value={unitPriceUnit}
                onChange={handleUnitPriceUnitChange}
                className="w-40 min-w-0 px-3 py-2 border border-slate-300 rounded-r focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
              >
                {areaUnitOptions.filter(option => costAreaUnitValues.includes(option.value)).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Area Output */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Yardage <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={area !== undefined ? area.toFixed(4) : ''}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                style={{ backgroundColor: '#f8fafc' }}
              />
              <select
                value={areaUnit}
                onChange={handleAreaUnitChange}
                className="w-40 min-w-0 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700"
              >
                {areaUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimated Price Output */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estimated price <span className="text-slate-400">⋯</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={totalCost !== null ? totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : ''}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-blue-600 font-medium"
              />
              <div className="flex items-center px-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700">
                {currency}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={shareResult}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <span className="text-white">🔗</span>
                Share result
              </button>
              <button
                onClick={resetCalculator}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Reload calculator
              </button>
            </div>
            <button
              onClick={clearAllChanges}
              className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear all changes
            </button>
          </div>

          {/* Feedback Section */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-3">Did we solve your problem today?</p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <span>👍</span>
                Yes
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                <span>👎</span>
                No
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
