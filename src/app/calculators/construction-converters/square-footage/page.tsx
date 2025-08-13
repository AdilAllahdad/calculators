"use client"

import React, { useState } from "react";
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
  
  // Update area calculation whenever inputs change
  // Initial calculation and setup
  React.useEffect(() => {
    if (!length || !width) {
      // setLength("500");
      // setWidth("500");
      setQuantity("1");
      setUnitPrice("");
    }
    
    calculateRealTimeArea();
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
      console.log(`Area: ${area.toFixed(2)} ${areaUnit}, Total Cost: ${currency} ${totalCost?.toFixed(2)}`);
      alert("Result copied to clipboard!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Square Footage Calculator</h1>
        <form onSubmit={handleCalculate} className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <label className="block text-slate-700 mb-1">Width</label>
            <div className="flex">
              <input
                type="number"
                min="0"
                step="any"
                value={width}
                onChange={e => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setWidth(value);
                }}
                className="w-full border border-slate-300 rounded-l px-3 py-2 focus:outline-none focus:border-blue-400"
                required
              />
              <UnitDropdown 
                value={widthUnit}
                onChange={handleWidthUnitChange}
                unitValues={lengthUnitValues}
                className="rounded-l-none rounded-r"
              />
            </div>
            <button type="button" className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
          <div className="relative">
            <label className="block text-slate-700 mb-1">Length</label>
            <div className="flex">
              <input
                type="number"
                min="0"
                step="any"
                value={length}
                onChange={e => {
                  const value = e.target.value === '' ? '' : Number(e.target.value);
                  setLength(value);
                }}
                className="w-full border border-slate-300 rounded-l px-3 py-2 focus:outline-none focus:border-blue-400"
                required
              />
              <UnitDropdown 
                value={lengthUnit}
                onChange={handleLengthUnitChange}
                unitValues={lengthUnitValues}
                className="rounded-l-none rounded-r"
              />
            </div>
            <button type="button" className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
          <div className="relative">
            <label className="block text-slate-700 mb-1">Quantity <span title="Number of identical areas" className="text-xs text-slate-400 cursor-help">&#9432;</span></label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={e => {
                const value = e.target.value === '' ? '' : Number(e.target.value);
                setQuantity(value);
              }}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              required
            />
            <button type="button" className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
          <div className="relative">
            <label className="block text-slate-700 mb-1">Area</label>
            <div className="flex">
              <input
                type="text"
                value={area !== undefined ? area.toFixed(1) : ""}
                readOnly
                className="w-full border border-slate-300 rounded-l px-3 py-2 bg-slate-50"
              />
              <UnitDropdown 
                value={areaUnit}
                onChange={handleAreaUnitChange}
                unitValues={areaUnitValues}
                className="rounded-l-none rounded-r"
              />
            </div>
            <button type="button" className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
        </div>

        {/* Cost of materials */}
        <div className="mt-6 border rounded-xl p-4 bg-white">
          <div className="flex items-center mb-4">
            <span className="font-medium text-slate-800 flex-1">Cost of materials</span>
            <button type="button" className="text-blue-500 hover:text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
              </svg>
            </button>
          </div>
          <div className="relative mb-4">
            <label className="block text-slate-700 mb-1">Unit price</label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 border border-slate-300 rounded-l bg-slate-50 text-slate-600">
                PKR
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
                className="w-full border-t border-b border-slate-300 px-3 py-2 focus:outline-none focus:border-blue-400"
              />
              <span className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">/</span>
              <UnitDropdown 
                value={unitPriceUnit}
                onChange={handleUnitPriceUnitChange}
                unitValues={costAreaUnitValues}
                className="rounded-l-none rounded-r"
              />
            </div>
            <button type="button" className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
          <div className="relative">
            <label className="block text-slate-700 mb-1">Total cost</label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 border border-slate-300 rounded-l bg-slate-50 text-slate-600">
                PKR
              </div>
              <input
                type="text"
                value={totalCost !== null ? totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : ""}
                readOnly
                className="w-full border-t border-r border-b border-slate-300 rounded-r px-3 py-2 bg-slate-50 text-blue-500 font-medium"
              />
            </div>
            <button type="button" className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600">
              <span className="text-xl">&#8942;</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-medium hover:bg-blue-700 transition mt-2"
        >
          Calculate
        </button>
        
      </form>
    </div>
  );
}
