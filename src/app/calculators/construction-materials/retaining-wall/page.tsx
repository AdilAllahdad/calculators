"use client"

import React, { useState, useEffect } from "react";
import UnitDropdown from "@/components/UnitDropdown";
import { convertValue } from "@/lib/utils";

// Define the unit values needed for each dropdown
const lengthUnitValues = ['cm', 'm', 'in', 'ft', 'yd'];
const volumeUnitValues = [
  { value: 'cm3', label: 'cubic centimeters (cm³)' },
  { value: 'dm3', label: 'cubic decimeters (dm³)' },
  { value: 'l', label: 'liters (L)' },
  { value: 'm3', label: 'cubic meters (m³)' },
  { value: 'in3', label: 'cubic inches (in³)' },
  { value: 'ft3', label: 'cubic feet (ft³)' },
  { value: 'yd3', label: 'cubic yards (yd³)' },
  { value: 'gal', label: 'US gallons (gal)' },
  { value: 'gal-uk', label: 'UK gallons (gal)' }
];
const weightUnitValues = [
  { value: 'kg', label: 'kilograms (kg)' },
  { value: 't', label: 'metric tons (t)' },
  { value: 'lb', label: 'pounds (lb)' },
  { value: 'US ton', label: 'US tons' },
  { value: 'long ton', label: 'long tons' }
];

export default function RetainingWallCalculator() {
  // Wall dimensions
  const [wallHeight, setWallHeight] = useState<number | string>("");
  const [wallLength, setWallLength] = useState<number | string>("");
  const [wallHeightUnit, setWallHeightUnit] = useState("m");
  const [wallLengthUnit, setWallLengthUnit] = useState("m");
  
  // Block dimensions
  const [blockHeight, setBlockHeight] = useState<number | string>("");
  const [blockLength, setBlockLength] = useState<number | string>("");
  const [blockHeightUnit, setBlockHeightUnit] = useState("cm");
  const [blockLengthUnit, setBlockLengthUnit] = useState("cm");
  
  // Cap row
  const [hasCap, setHasCap] = useState(true);
  
  // Gravel for backfill
  const [backfillThickness, setBackfillThickness] = useState<number | string>("30");
  const [backfillLength, setBackfillLength] = useState<number | string>("");
  const [backfillHeight, setBackfillHeight] = useState<number | string>("");
  const [backfillThicknessUnit, setBackfillThicknessUnit] = useState("cm");
  const [backfillLengthUnit, setBackfillLengthUnit] = useState("m");
  const [backfillHeightUnit, setBackfillHeightUnit] = useState("m");
  const [backfillVolume, setBackfillVolume] = useState<number | undefined>(undefined);
  const [backfillVolumeUnit, setBackfillVolumeUnit] = useState("m3");
  const [backfillWeight, setBackfillWeight] = useState<number | undefined>(undefined);
  const [backfillWeightUnit, setBackfillWeightUnit] = useState("kg");
  
  // Costs
  const [wallBlockPrice, setWallBlockPrice] = useState<number | string>("");
  const [capBlockPrice, setCapBlockPrice] = useState<number | string>("");
  const [gravelPrice, setGravelPrice] = useState<number | string>("");
  const [gravelPriceUnit, setGravelPriceUnit] = useState("kg");
  const currency = "PKR";
  
  // Results
  const [numWallBlocks, setNumWallBlocks] = useState<number | undefined>(undefined);
  const [numCapBlocks, setNumCapBlocks] = useState<number | undefined>(undefined);
  const [totalWallBlocksCost, setTotalWallBlocksCost] = useState<number | undefined>(undefined);
  const [totalCapBlocksCost, setTotalCapBlocksCost] = useState<number | undefined>(undefined);
  const [totalGravelCost, setTotalGravelCost] = useState<number | undefined>(undefined);
  const [totalExpenses, setTotalExpenses] = useState<number | undefined>(undefined);
  
  // State for validation errors
  const [wallHeightError, setWallHeightError] = useState<string | null>(null);
  const [wallLengthError, setWallLengthError] = useState<string | null>(null);
  const [blockHeightError, setBlockHeightError] = useState<string | null>(null);
  const [blockLengthError, setBlockLengthError] = useState<string | null>(null);
  const [backfillThicknessError, setBackfillThicknessError] = useState<string | null>(null);
  const [backfillLengthError, setBackfillLengthError] = useState<string | null>(null);
  const [backfillHeightError, setBackfillHeightError] = useState<string | null>(null);
  const [wallBlockPriceError, setWallBlockPriceError] = useState<string | null>(null);
  const [capBlockPriceError, setCapBlockPriceError] = useState<string | null>(null);
  const [gravelPriceError, setGravelPriceError] = useState<string | null>(null);
  
  // State for collapsible sections
  const [wallDimensionsExpanded, setWallDimensionsExpanded] = useState<boolean>(true);
  const [blockDimensionsExpanded, setBlockDimensionsExpanded] = useState<boolean>(true);
  const [materialsNeededExpanded, setMaterialsNeededExpanded] = useState<boolean>(true);
  const [backfillExpanded, setBackfillExpanded] = useState<boolean>(true);
  const [costsExpanded, setCostsExpanded] = useState<boolean>(true);
  
  // Add new state for displayed gravel price
  const [displayedGravelPrice, setDisplayedGravelPrice] = useState<number | string>("");

  // Add new state for base price (always in kg)
  const [baseGravelPrice, setBaseGravelPrice] = useState<number | string>("");

  // Format number with commas for thousands separators
  const formatNumberWithCommas = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };
  
  // Format currency values with 2 decimal places
  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  // Helper for error message rendering
  const renderError = (error: string | null, label: string) =>
    error ? (
      <div className="mt-1 flex items-center text-red-600 text-xs">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        Please ensure positive value for {label}.
      </div>
    ) : null;
  
  // Validate all inputs
  useEffect(() => {
    setWallHeightError(wallHeight !== "" && Number(wallHeight) <= 0 ? "Height must be positive." : null);
    setWallLengthError(wallLength !== "" && Number(wallLength) <= 0 ? "Length must be positive." : null);
    setBlockHeightError(blockHeight !== "" && Number(blockHeight) <= 0 ? "Height must be positive." : null);
    setBlockLengthError(blockLength !== "" && Number(blockLength) <= 0 ? "Length must be positive." : null);
    setBackfillThicknessError(backfillThickness !== "" && Number(backfillThickness) <= 0 ? "Thickness must be positive." : null);
    setBackfillLengthError(backfillLength !== "" && Number(backfillLength) <= 0 ? "Length must be positive." : null);
    setBackfillHeightError(backfillHeight !== "" && Number(backfillHeight) <= 0 ? "Height must be positive." : null);
    setWallBlockPriceError(wallBlockPrice !== "" && Number(wallBlockPrice) < 0 ? "Price cannot be negative." : null);
    setCapBlockPriceError(capBlockPrice !== "" && Number(capBlockPrice) < 0 ? "Price cannot be negative." : null);
    setGravelPriceError(gravelPrice !== "" && Number(gravelPrice) < 0 ? "Price cannot be negative." : null);
  }, [wallHeight, wallLength, blockHeight, blockLength, backfillThickness, backfillLength, backfillHeight, wallBlockPrice, capBlockPrice, gravelPrice]);
  
  // Calculate materials needed
  const calculateMaterials = () => {
    // Skip calculation if required inputs aren't valid
    const numWallHeight = typeof wallHeight === 'string' ? parseFloat(wallHeight) || 0 : wallHeight;
    const numWallLength = typeof wallLength === 'string' ? parseFloat(wallLength) || 0 : wallLength;
    const numBlockHeight = typeof blockHeight === 'string' ? parseFloat(blockHeight) || 0 : blockHeight;
    const numBlockLength = typeof blockLength === 'string' ? parseFloat(blockLength) || 0 : blockLength;

    if (numWallHeight <= 0 || numWallLength <= 0 || numBlockHeight <= 0 || numBlockLength <= 0) {
      return;
    }

    // Convert all dimensions to meters for calculations
    const wallHeightInMeters = convertValue(numWallHeight, wallHeightUnit, 'm');
    const wallLengthInMeters = convertValue(numWallLength, wallLengthUnit, 'm');
    const blockHeightInMeters = convertValue(numBlockHeight, blockHeightUnit, 'm');
    const blockLengthInMeters = convertValue(numBlockLength, blockLengthUnit, 'm');

    let rowsInWall = 0;
    let blocksPerRow = 0;
    let totalWallBlocks = 0;
    let totalCapBlocks = 0;

    if (hasCap) {
      // Cap row: number of rows = floor, blocks per row = ceil, wall blocks = (rows-1)*blocksPerRow, cap blocks = blocksPerRow
      rowsInWall = Math.floor(wallHeightInMeters / blockHeightInMeters);
      blocksPerRow = Math.ceil(wallLengthInMeters / blockLengthInMeters);
      totalWallBlocks = (rowsInWall - 1) * blocksPerRow;
      totalCapBlocks = blocksPerRow;
      // Prevent negative wall blocks if wall is too short
      if (totalWallBlocks < 0) totalWallBlocks = 0;
    } else {
      // No cap row: number of rows = ceil, blocks per row = ceil, wall blocks = rows*blocksPerRow, no cap blocks
      rowsInWall = Math.ceil(wallHeightInMeters / blockHeightInMeters);
      blocksPerRow = Math.ceil(wallLengthInMeters / blockLengthInMeters);
      totalWallBlocks = rowsInWall * blocksPerRow;
      totalCapBlocks = 0;
    }

    setNumWallBlocks(totalWallBlocks);
    setNumCapBlocks(totalCapBlocks);
    
    // Calculate backfill volume if dimensions are available
    const numBackfillThickness = typeof backfillThickness === 'string' ? parseFloat(backfillThickness) || 0 : backfillThickness;
    const numBackfillLength = typeof backfillLength === 'string' ? parseFloat(backfillLength) || 0 : backfillLength;
    const numBackfillHeight = typeof backfillHeight === 'string' ? parseFloat(backfillHeight) || 0 : backfillHeight;
    
    // --- Backfill volume and weight calculation (OmniCalculator reference) ---
    // Use density: 1346 kg/m³ (metric), 84.03 lb/ft³ (imperial)
    // Use correct units for volume and weight

    // Calculate backfill volume in m³
    let backfillVolumeInM3 = 0;
    let backfillWeightInKg = 0;
    if (numBackfillThickness > 0 && numBackfillLength > 0 && numBackfillHeight > 0) {
      const backfillThicknessInMeters = convertValue(numBackfillThickness, backfillThicknessUnit, 'm');
      const backfillLengthInMeters = convertValue(numBackfillLength, backfillLengthUnit, 'm');
      const backfillHeightInMeters = convertValue(numBackfillHeight, backfillHeightUnit, 'm');
      backfillVolumeInM3 = backfillThicknessInMeters * backfillLengthInMeters * backfillHeightInMeters;
      // Use density 1346 kg/m³ for gravel
      backfillWeightInKg = backfillVolumeInM3 * 1346;
      // Display in selected units
      setBackfillVolume(convertValue(backfillVolumeInM3, 'm3', backfillVolumeUnit));
      setBackfillWeight(convertValue(backfillWeightInKg, 'kg', backfillWeightUnit));
    } else {
      setBackfillVolume(undefined);
      setBackfillWeight(undefined);
    }

    // --- Cost calculation ---
    // Wall/cap block cost (already correct)
    const numWallBlockPrice = typeof wallBlockPrice === 'string' ? parseFloat(wallBlockPrice) || 0 : wallBlockPrice;
    const numCapBlockPrice = typeof capBlockPrice === 'string' ? parseFloat(capBlockPrice) || 0 : capBlockPrice;
    const numGravelPrice = typeof baseGravelPrice === 'string' ? parseFloat(baseGravelPrice) || 0 : baseGravelPrice;

    // Wall blocks cost
    if (numWallBlockPrice > 0) {
      setTotalWallBlocksCost(totalWallBlocks * numWallBlockPrice);
    } else {
      setTotalWallBlocksCost(undefined);
    }

    // Cap blocks cost
    if (hasCap && numCapBlockPrice > 0) {
      setTotalCapBlocksCost(totalCapBlocks * numCapBlockPrice);
    } else {
      setTotalCapBlocksCost(undefined);
    }

    // --- Total cost of gravel for backfill ---
    // Always use backfillWeightInKg and price per kg (ignore display unit)
    if (numGravelPrice > 0 && backfillWeightInKg > 0) {
      setTotalGravelCost(backfillWeightInKg * numGravelPrice);
    } else {
      setTotalGravelCost(undefined);
    }

    // --- Total expenses ---
    const wallCost = numWallBlockPrice > 0 ? totalWallBlocks * numWallBlockPrice : 0;
    const capCost = hasCap && numCapBlockPrice > 0 ? totalCapBlocks * numCapBlockPrice : 0;
    const gravelCost = (numGravelPrice > 0 && backfillWeightInKg > 0) ? backfillWeightInKg * numGravelPrice : 0;
    const total = wallCost + capCost + gravelCost;
    setTotalExpenses(total > 0 ? total : undefined);
  };
  
  // Update calculations when inputs change
  useEffect(() => {
    const hasRequiredValues = 
      wallHeight && Number(wallHeight) > 0 &&
      wallLength && Number(wallLength) > 0 &&
      blockHeight && Number(blockHeight) > 0 &&
      blockLength && Number(blockLength) > 0;
    
    if (hasRequiredValues) {
      calculateMaterials();
    }
  }, [
    wallHeight, wallLength, blockHeight, blockLength,
    wallHeightUnit, wallLengthUnit, blockHeightUnit, blockLengthUnit,
    hasCap, backfillThickness, backfillLength, backfillHeight,
    backfillThicknessUnit, backfillLengthUnit, backfillHeightUnit,
    wallBlockPrice, capBlockPrice, gravelPrice // <-- REMOVE gravelPriceUnit
  ]);

  const resetCalculator = () => {
    // Reset wall dimensions
    setWallHeight("");
    setWallLength("");
    setWallHeightUnit("m");
    setWallLengthUnit("m");
    
    // Reset block dimensions
    setBlockHeight("");
    setBlockLength("");
    setBlockHeightUnit("cm");
    setBlockLengthUnit("cm");
    
    // Reset cap option
    setHasCap(true);
    
    // Reset backfill inputs
    setBackfillThickness("30");
    setBackfillLength("");
    setBackfillHeight("");
    setBackfillThicknessUnit("cm");
    setBackfillLengthUnit("m");
    setBackfillHeightUnit("m");
    setBackfillVolume(undefined);
    setBackfillVolumeUnit("m3");
    setBackfillWeight(undefined);
    setBackfillWeightUnit("kg");
    
    // Reset costs
    setWallBlockPrice("");
    setCapBlockPrice("");
    setGravelPrice("");
    setGravelPriceUnit("kg");
    
    // Reset results
    setNumWallBlocks(undefined);
    setNumCapBlocks(undefined);
    setTotalWallBlocksCost(undefined);
    setTotalCapBlocksCost(undefined);
    setTotalGravelCost(undefined);
    setTotalExpenses(undefined);
    
    // Reset errors
    setWallHeightError(null);
    setWallLengthError(null);
    setBlockHeightError(null);
    setBlockLengthError(null);
    setBackfillThicknessError(null);
    setBackfillLengthError(null);
    setBackfillHeightError(null);
    setWallBlockPriceError(null);
    setCapBlockPriceError(null);
    setGravelPriceError(null);
    setBaseGravelPrice("");
    setDisplayedGravelPrice("");
  };

  // Add function to handle gravel price change
  const handleGravelPriceChange = (value: string) => {
    // Store the base price in kg
    setBaseGravelPrice(value);
    // Convert for display
    setDisplayedGravelPrice(value);
    // Store original value for calculations
    setGravelPrice(value);
  };

  // Add function to handle display conversion
  const handleGravelPriceUnitChange = (newUnit: string) => {
    const numGravelPrice = typeof baseGravelPrice === 'string' ? parseFloat(baseGravelPrice) || 0 : baseGravelPrice;
    if (numGravelPrice > 0) {
      // Only convert the display value
      const convertedPrice = convertValue(numGravelPrice, 'kg', newUnit);
      setDisplayedGravelPrice(convertedPrice);
    }
    setGravelPriceUnit(newUnit);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-gradient-to-b from-slate-50 to-indigo-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Retaining Wall Calculator</h1>
      
      {/* Cap Row Option Card */}
      <div className="bg-white rounded-xl shadow mb-6 p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <label className="text-base font-semibold text-gray-700 flex items-center gap-1">
            Will there be a cap row?
            <span className="text-xs text-gray-400 cursor-help" title="Indicates if the wall will have a finishing cap row">ⓘ</span>
          </label>
        </div>
        <div className="flex gap-8 mt-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              className="accent-blue-600"
              checked={hasCap}
              onChange={() => setHasCap(true)}
            />
            <span className="ml-2 text-gray-700">Yes</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              className="accent-blue-600"
              checked={!hasCap}
              onChange={() => setHasCap(false)}
            />
            <span className="ml-2 text-gray-700">No</span>
          </label>
        </div>
      </div>
      
      {/* Wall Dimensions Section */}
      <div className="bg-white rounded-xl shadow mb-6 border border-gray-200 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
          onClick={() => setWallDimensionsExpanded(!wallDimensionsExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {wallDimensionsExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Wall dimensions</span>
          </div>
        </button>
        {wallDimensionsExpanded && (
          <div className="p-4 border-t bg-white">
            {/* Wall Height */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Height</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none ${wallHeightError ? 'border-red-500' : 'border-gray-200'}`}
                  value={wallHeight || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setWallHeight(value);
                    setWallHeightError(value !== '' && Number(value) <= 0 ? "Height must be positive." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={wallHeightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numHeight = typeof wallHeight === 'string' ? parseFloat(wallHeight) || 0 : wallHeight;
                    if (numHeight) {
                      setWallHeight(convertValue(numHeight, wallHeightUnit, newUnit));
                    }
                    setWallHeightUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {renderError(wallHeightError, "wall height")}
            </div>
            {/* Wall Length */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Length</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none ${wallLengthError ? 'border-red-500' : 'border-gray-200'}`}
                  value={wallLength || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setWallLength(value);
                    setWallLengthError(value !== '' && Number(value) <= 0 ? "Length must be positive." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={wallLengthUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numLength = typeof wallLength === 'string' ? parseFloat(wallLength) || 0 : wallLength;
                    if (numLength) {
                      setWallLength(convertValue(numLength, wallLengthUnit, newUnit));
                    }
                    setWallLengthUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {renderError(wallLengthError, "wall length")}
            </div>
          </div>
        )}
      </div>
      
      {/* Block Dimensions Section */}
      <div className="bg-white rounded-xl shadow mb-6 border border-gray-200 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
          onClick={() => setBlockDimensionsExpanded(!blockDimensionsExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {blockDimensionsExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Block dimensions</span>
          </div>
        </button>
        {blockDimensionsExpanded && (
          <div className="p-4 border-t bg-white">
            {/* Block Height */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Height</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none ${blockHeightError ? 'border-red-500' : 'border-gray-200'}`}
                  value={blockHeight || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBlockHeight(value);
                    setBlockHeightError(value !== '' && Number(value) <= 0 ? "Height must be positive." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={blockHeightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numHeight = typeof blockHeight === 'string' ? parseFloat(blockHeight) || 0 : blockHeight;
                    if (numHeight) {
                      setBlockHeight(convertValue(numHeight, blockHeightUnit, newUnit));
                    }
                    setBlockHeightUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {renderError(blockHeightError, "block height")}
            </div>
            {/* Block Length */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Length</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none ${blockLengthError ? 'border-red-500' : 'border-gray-200'}`}
                  value={blockLength || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBlockLength(value);
                    setBlockLengthError(value !== '' && Number(value) <= 0 ? "Length must be positive." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={blockLengthUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numLength = typeof blockLength === 'string' ? parseFloat(blockLength) || 0 : blockLength;
                    if (numLength) {
                      setBlockLength(convertValue(numLength, blockLengthUnit, newUnit));
                    }
                    setBlockLengthUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {renderError(blockLengthError, "block length")}
            </div>
          </div>
        )}
      </div>
      
      {/* Materials Needed Section */}
      <div className="bg-white rounded-xl shadow mb-6 border border-gray-200 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
          onClick={() => setMaterialsNeededExpanded(!materialsNeededExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {materialsNeededExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Materials needed</span>
          </div>
        </button>
        {materialsNeededExpanded && (
          <div className="p-4 border-t bg-white">
            {/* Only show wall blocks if hasCap is false, otherwise show both */}
            {!hasCap ? (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Number of wall blocks</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-2xl font-semibold text-blue-600 outline-none"
                  value={numWallBlocks !== undefined ? formatNumberWithCommas(numWallBlocks) : ""}
                  readOnly
                />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Number of wall blocks</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none"
                    value={numWallBlocks !== undefined ? formatNumberWithCommas(numWallBlocks) : ""}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Number of cap blocks</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none"
                    value={numCapBlocks !== undefined ? formatNumberWithCommas(numCapBlocks) : ""}
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Gravel for Backfill Section */}
      <div className="bg-white rounded-xl shadow mb-6 border border-gray-200 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
          onClick={() => setBackfillExpanded(!backfillExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {backfillExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Gravel for backfill</span>
          </div>
        </button>
        {backfillExpanded && (
          <div className="p-4 border-t bg-white">
            {/* Backfill Thickness */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Backfill area thickness 
                <span title="The width of the backfill area" className="text-xs text-gray-500 ml-1 cursor-help">ⓘ</span>
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none ${backfillThicknessError ? 'border-red-500' : 'border-gray-200'}`}
                  value={backfillThickness || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBackfillThickness(value);
                    setBackfillThicknessError(value !== '' && Number(value) <= 0 ? "Thickness must be positive." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={backfillThicknessUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numThickness = typeof backfillThickness === 'string' ? parseFloat(backfillThickness) || 0 : backfillThickness;
                    if (numThickness) {
                      setBackfillThickness(convertValue(numThickness, backfillThicknessUnit, newUnit));
                    }
                    setBackfillThicknessUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {renderError(backfillThicknessError, "backfill thickness")}
            </div>
            {/* Backfill Length */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Backfill area length 
                <span title="The length of the backfill area, typically matching wall length" className="text-xs text-gray-500 ml-1 cursor-help">ⓘ</span>
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none ${backfillLengthError ? 'border-red-500' : 'border-gray-200'}`}
                  value={backfillLength || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBackfillLength(value);
                    setBackfillLengthError(value !== '' && Number(value) <= 0 ? "Length must be positive." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={backfillLengthUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numLength = typeof backfillLength === 'string' ? parseFloat(backfillLength) || 0 : backfillLength;
                    if (numLength) {
                      setBackfillLength(convertValue(numLength, backfillLengthUnit, newUnit));
                    }
                    setBackfillLengthUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {renderError(backfillLengthError, "backfill length")}
            </div>
            {/* Backfill Height */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Backfill area height 
                <span title="The height of the backfill area, typically matching wall height" className="text-xs text-gray-500 ml-1 cursor-help">ⓘ</span>
              </label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  className={`flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none ${backfillHeightError ? 'border-red-500' : 'border-gray-200'}`}
                  value={backfillHeight || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBackfillHeight(value);
                    setBackfillHeightError(value !== '' && Number(value) <= 0 ? "Height must be positive." : null);
                  }}
                  placeholder="0"
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={backfillHeightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    const numHeight = typeof backfillHeight === 'string' ? parseFloat(backfillHeight) || 0 : backfillHeight;
                    if (numHeight) {
                      setBackfillHeight(convertValue(numHeight, backfillHeightUnit, newUnit));
                    }
                    setBackfillHeightUnit(newUnit);
                  }}
                >
                  {lengthUnitValues.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              {renderError(backfillHeightError, "backfill height")}
            </div>
            {/* Volume of Gravel */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Volume of gravel for backfill</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none"
                  value={backfillVolume !== undefined ? formatNumberWithCommas(backfillVolume) : ""}
                  readOnly
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={backfillVolumeUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    if (backfillVolume !== undefined && backfillVolume > 0) {
                      setBackfillVolume(convertValue(backfillVolume, backfillVolumeUnit, newUnit));
                    }
                    setBackfillVolumeUnit(newUnit);
                  }}
                >
                  {volumeUnitValues.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Weight of Gravel */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Backfill weight</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 text-base font-medium outline-none"
                  value={backfillWeight !== undefined ? formatNumberWithCommas(backfillWeight) : ""}
                  readOnly
                />
                <select 
                  className="border border-gray-200 rounded-lg bg-white px-2 py-2 text-blue-700 font-semibold outline-none"
                  value={backfillWeightUnit}
                  onChange={(e) => {
                    const newUnit = e.target.value;
                    if (backfillWeight !== undefined && backfillWeight > 0) {
                      setBackfillWeight(convertValue(backfillWeight, backfillWeightUnit, newUnit));
                    }
                    setBackfillWeightUnit(newUnit);
                  }}
                >
                  {weightUnitValues.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Costs Section */}
      <div className="bg-white rounded-xl shadow mb-6 border border-gray-200 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
          onClick={() => setCostsExpanded(!costsExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {costsExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span className="font-semibold">Costs</span>
          </div>
        </button>
        {costsExpanded && (
          <div className="p-4 border-t bg-white space-y-4">
            {/* Input Fields */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Single wall block price</label>
              <div className="flex gap-2">
                <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-gray-500">{currency}</span>
                <input 
                  type="number"
                  value={wallBlockPrice}
                  onChange={(e) => setWallBlockPrice(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Only show cap block price if hasCap is true */}
            {hasCap && (
              <div>
                <label className="block text-gray-700 font-medium mb-1">Single cap block price</label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-gray-500">{currency}</span>
                  <input 
                    type="number"
                    value={capBlockPrice}
                    onChange={(e) => setCapBlockPrice(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-1">Gravel price (per unit weight)</label>
              <div className="flex gap-2">
                <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-gray-500">{currency}</span>
                <input 
                  type="number"
                  value={displayedGravelPrice || ''}
                  onChange={(e) => handleGravelPriceChange(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-r-lg focus:outline-none"
                  placeholder="0.00"
                />
                <select
                  value={gravelPriceUnit}
                  onChange={(e) => handleGravelPriceUnitChange(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-2 font-semibold outline-none w-32"
                >
                  {weightUnitValues.map(u => (
                    <option key={u.value} value={u.value}>{u.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Fields */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Total cost of wall blocks</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-gray-500">{currency}</span>
                    <input 
                      type="text"
                      readOnly
                      value={totalWallBlocksCost !== undefined ? formatCurrency(totalWallBlocksCost) : ""}
                      className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-50 text-blue-600 font-medium"
                    />
                  </div>
                </div>

                {/* Only show cap blocks total cost if hasCap is true */}
                {hasCap && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Total cost of cap blocks</label>
                    <div className="flex gap-2">
                      <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-gray-500">{currency}</span>
                      <input 
                        type="text"
                        readOnly
                        value={totalCapBlocksCost !== undefined ? formatCurrency(totalCapBlocksCost) : ""}
                        className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-50 text-blue-600 font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Total cost of gravel for backfill</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-gray-500">{currency}</span>
                    <input 
                      type="text"
                      readOnly
                      value={totalGravelCost !== undefined ? formatCurrency(totalGravelCost) : ""}
                      className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-50 text-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Total expenses</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-l-lg text-gray-500">{currency}</span>
                    <input 
                      type="text"
                      readOnly
                      value={totalExpenses !== undefined ? formatCurrency(totalExpenses) : ""}
                      className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-50 text-blue-600 font-medium font-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Only show Clear button at the bottom */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={resetCalculator}
          className="px-8 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg border border-blue-300 font-semibold transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
  
    