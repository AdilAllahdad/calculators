"use client"

import React, { useState, useEffect } from "react";
import UnitDropdown from "@/components/UnitDropdown";
import { convertValue } from "@/lib/utils";

// Define the unit values needed for each dropdown
const lengthUnitValues = ['cm', 'm', 'in', 'ft', 'yd', 'ft-in', 'm-cm'];
const volumeUnitValues = ['cm3', 'dm3', 'l', 'm3', 'in3', 'ft3', 'yd3', 'gal', 'gal-uk'];
const weightUnitValues = ['kg', 't', 'lb', 'US ton', 'long ton'];

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
    
    // Calculate number of wall blocks (excluding cap row)
    const rowsInWall = hasCap ? Math.floor(wallHeightInMeters / blockHeightInMeters) : Math.ceil(wallHeightInMeters / blockHeightInMeters);
    const blocksPerRow = Math.ceil(wallLengthInMeters / blockLengthInMeters);
    const totalWallBlocks = rowsInWall * blocksPerRow;
    setNumWallBlocks(totalWallBlocks);
    
    // Calculate number of cap blocks if applicable
    const totalCapBlocks = hasCap ? blocksPerRow : 0;
    setNumCapBlocks(totalCapBlocks);
    
    // Calculate backfill volume if dimensions are available
    const numBackfillThickness = typeof backfillThickness === 'string' ? parseFloat(backfillThickness) || 0 : backfillThickness;
    const numBackfillLength = typeof backfillLength === 'string' ? parseFloat(backfillLength) || 0 : backfillLength;
    const numBackfillHeight = typeof backfillHeight === 'string' ? parseFloat(backfillHeight) || 0 : backfillHeight;
    
    if (numBackfillThickness > 0 && numBackfillLength > 0 && numBackfillHeight > 0) {
      const backfillThicknessInMeters = convertValue(numBackfillThickness, backfillThicknessUnit, 'm');
      const backfillLengthInMeters = convertValue(numBackfillLength, backfillLengthUnit, 'm');
      const backfillHeightInMeters = convertValue(numBackfillHeight, backfillHeightUnit, 'm');
      
      // Calculate backfill volume in cubic meters
      const backfillVolumeInM3 = backfillThicknessInMeters * backfillLengthInMeters * backfillHeightInMeters;
      
      // Convert to selected display unit
      const backfillVolumeDisplay = convertValue(backfillVolumeInM3, 'm3', backfillVolumeUnit);
      setBackfillVolume(backfillVolumeDisplay);
      
      // Estimate weight (assuming gravel density of 1600 kg/m³)
      const weightInKg = backfillVolumeInM3 * 1600;
      const weightDisplay = convertValue(weightInKg, 'kg', backfillWeightUnit);
      setBackfillWeight(weightDisplay);
      
      // Calculate costs if prices are provided
      const numWallBlockPrice = typeof wallBlockPrice === 'string' ? parseFloat(wallBlockPrice) || 0 : wallBlockPrice;
      const numCapBlockPrice = typeof capBlockPrice === 'string' ? parseFloat(capBlockPrice) || 0 : capBlockPrice;
      const numGravelPrice = typeof gravelPrice === 'string' ? parseFloat(gravelPrice) || 0 : gravelPrice;
      
      // Wall blocks cost
      if (numWallBlockPrice > 0) {
        const wallBlocksCost = totalWallBlocks * numWallBlockPrice;
        setTotalWallBlocksCost(wallBlocksCost);
      } else {
        setTotalWallBlocksCost(undefined);
      }
      
      // Cap blocks cost
      if (hasCap && numCapBlockPrice > 0) {
        const capBlocksCost = totalCapBlocks * numCapBlockPrice;
        setTotalCapBlocksCost(capBlocksCost);
      } else {
        setTotalCapBlocksCost(undefined);
      }
      
      // Gravel cost
      if (numGravelPrice > 0) {
        // Convert weight to pricing unit
        let gravelWeightForPricing = weightInKg;
        if (gravelPriceUnit !== 'kg') {
          gravelWeightForPricing = convertValue(weightInKg, 'kg', gravelPriceUnit);
        }
        
        const gravelCost = gravelWeightForPricing * numGravelPrice;
        setTotalGravelCost(gravelCost);
      } else {
        setTotalGravelCost(undefined);
      }
      
      // Calculate total expenses
      const wallCost = numWallBlockPrice > 0 ? totalWallBlocks * numWallBlockPrice : 0;
      const capCost = hasCap && numCapBlockPrice > 0 ? totalCapBlocks * numCapBlockPrice : 0;
      
      let gravelCost = 0;
      if (numGravelPrice > 0) {
        let gravelWeightForPricing = weightInKg;
        if (gravelPriceUnit !== 'kg') {
          gravelWeightForPricing = convertValue(weightInKg, 'kg', gravelPriceUnit);
        }
        gravelCost = gravelWeightForPricing * numGravelPrice;
      }
      
      const total = wallCost + capCost + gravelCost;
      setTotalExpenses(total);
    }
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
    wallBlockPrice, capBlockPrice, gravelPrice, gravelPriceUnit
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
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Retaining Wall Calculator</h1>
      
      {/* Cap Row Option Card */}
      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex justify-between mb-1">
          <label className="text-base font-medium text-gray-700">
            Will there be a cap row? 
            <span className="text-xs text-gray-500 ml-1 cursor-help" title="Indicates if the wall will have a finishing cap row">ⓘ</span>
          </label>
          <button className="text-gray-400">•••</button>
        </div>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center">
            <div className={`h-6 w-6 rounded-full border flex items-center justify-center ${hasCap ? 'border-blue-500' : 'border-gray-300'}`}>
              {hasCap && <div className="h-4 w-4 rounded-full bg-blue-500"></div>}
            </div>
            <span className="ml-2 text-gray-700">Yes</span>
          </label>
          <label className="flex items-center">
            <div className={`h-6 w-6 rounded-full border flex items-center justify-center ${!hasCap ? 'border-blue-500' : 'border-gray-300'}`}>
              {!hasCap && <div className="h-4 w-4 rounded-full bg-blue-500"></div>}
            </div>
            <input 
              type="radio" 
              className="hidden"
              checked={hasCap === false}
              onChange={() => setHasCap(false)}
            />
            <span className="ml-2 text-gray-700">No</span>
          </label>
        </div>
      </div>
      
      {/* Wall Dimensions Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800"
          onClick={() => setWallDimensionsExpanded(!wallDimensionsExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="p-4 border-t">
            {/* Wall Height */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Height</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${wallHeightError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={wallHeight || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setWallHeight(value);
                    setWallHeightError(value !== '' && Number(value) <= 0 ? "Height must be positive." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
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
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {wallHeightError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {wallHeightError}
                </div>
              )}
            </div>
            
            {/* Wall Length */}
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Length</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${wallLengthError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={wallLength || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setWallLength(value);
                    setWallLengthError(value !== '' && Number(value) <= 0 ? "Length must be positive." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
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
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {wallLengthError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {wallLengthError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Block Dimensions Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800"
          onClick={() => setBlockDimensionsExpanded(!blockDimensionsExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="p-4 border-t">
            {/* Block Height */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Height</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${blockHeightError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={blockHeight || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBlockHeight(value);
                    setBlockHeightError(value !== '' && Number(value) <= 0 ? "Height must be positive." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
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
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {blockHeightError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {blockHeightError}
                </div>
              )}
            </div>
            
            {/* Block Length */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Length</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${blockLengthError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={blockLength || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBlockLength(value);
                    setBlockLengthError(value !== '' && Number(value) <= 0 ? "Length must be positive." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
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
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {blockLengthError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {blockLengthError}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Materials Needed Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800"
          onClick={() => setMaterialsNeededExpanded(!materialsNeededExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="p-4 border-t">
            {/* Number of wall blocks */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Number of wall blocks</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none"
                  value={numWallBlocks !== undefined ? formatNumberWithCommas(numWallBlocks) : ""}
                  readOnly
                />
              </div>
            </div>
            
            {/* Number of cap blocks */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Number of cap blocks</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="flex">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none"
                  value={numCapBlocks !== undefined ? formatNumberWithCommas(numCapBlocks) : ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Gravel for Backfill Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800"
          onClick={() => setBackfillExpanded(!backfillExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="p-4 border-t">
            {/* Backfill Thickness */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">
                  Backfill area thickness 
                  <span title="The width of the backfill area" className="text-xs text-gray-500 ml-1 cursor-help">ⓘ</span>
                </label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${backfillThicknessError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={backfillThickness || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBackfillThickness(value);
                    setBackfillThicknessError(value !== '' && Number(value) <= 0 ? "Thickness must be positive." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
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
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {backfillThicknessError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {backfillThicknessError}
                </div>
              )}
            </div>
            
            {/* Backfill Length */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">
                  Backfill area length 
                  <span title="The length of the backfill area, typically matching wall length" className="text-xs text-gray-500 ml-1 cursor-help">ⓘ</span>
                </label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${backfillLengthError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={backfillLength || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBackfillLength(value);
                    setBackfillLengthError(value !== '' && Number(value) <= 0 ? "Length must be positive." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
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
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {backfillLengthError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {backfillLengthError}
                </div>
              )}
            </div>
            
            {/* Backfill Height */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">
                  Backfill area height 
                  <span title="The height of the backfill area, typically matching wall height" className="text-xs text-gray-500 ml-1 cursor-help">ⓘ</span>
                </label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="number" 
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${backfillHeightError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={backfillHeight || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setBackfillHeight(value);
                    setBackfillHeightError(value !== '' && Number(value) <= 0 ? "Height must be positive." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
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
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {backfillHeightError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {backfillHeightError}
                </div>
              )}
            </div>
            
            {/* Volume of Gravel */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Volume of gravel for backfill</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none"
                  value={backfillVolume !== undefined ? formatNumberWithCommas(backfillVolume) : ""}
                  readOnly
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
                    value={backfillVolumeUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      if (backfillVolume !== undefined && backfillVolume > 0) {
                        setBackfillVolume(convertValue(backfillVolume, backfillVolumeUnit, newUnit));
                      }
                      setBackfillVolumeUnit(newUnit);
                    }}
                  >
                    {volumeUnitValues.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Weight of Gravel */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Backfill weight</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none"
                  value={backfillWeight !== undefined ? formatNumberWithCommas(backfillWeight) : ""}
                  readOnly
                />
                <div className="absolute right-2 text-blue-500">
                  <select 
                    className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
                    value={backfillWeightUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value;
                      if (backfillWeight !== undefined && backfillWeight > 0) {
                        setBackfillWeight(convertValue(backfillWeight, backfillWeightUnit, newUnit));
                      }
                      setBackfillWeightUnit(newUnit);
                    }}
                  >
                    {weightUnitValues.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Costs Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-gray-800"
          onClick={() => setCostsExpanded(!costsExpanded)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="p-4 border-t">
            {/* Single Wall Block Price */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Single wall block price</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  {currency}
                </div>
                <input 
                  type="number" 
                  className={`w-full border rounded-md px-3 py-2 pl-12 focus:outline-none focus:ring-1 ${wallBlockPriceError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={wallBlockPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setWallBlockPrice(value);
                    setWallBlockPriceError(value !== '' && Number(value) < 0 ? "Price cannot be negative." : null);
                  }}
                  placeholder="0"
                />
              </div>
              {wallBlockPriceError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {wallBlockPriceError}
                </div>
              )}
            </div>
            
            {/* Single Cap Block Price */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Single cap block price</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  {currency}
                </div>
                <input 
                  type="number" 
                  className={`w-full border rounded-md px-3 py-2 pl-12 focus:outline-none focus:ring-1 ${capBlockPriceError ? 'border-red-500' : 'focus:border-blue-500'} ${!hasCap ? 'opacity-50' : ''}`}
                  value={capBlockPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setCapBlockPrice(value);
                    setCapBlockPriceError(value !== '' && Number(value) < 0 ? "Price cannot be negative." : null);
                  }}
                  placeholder="0"
                  disabled={!hasCap}
                />
              </div>
              {capBlockPriceError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {capBlockPriceError}
                </div>
              )}
            </div>
            
            {/* Gravel Price */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Gravel price (per unit weight)</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  {currency}
                </div>
                <input 
                  type="number" 
                  className={`w-full border rounded-md px-3 py-2 pl-12 focus:outline-none focus:ring-1 ${gravelPriceError ? 'border-red-500' : 'focus:border-blue-500'}`}
                  value={gravelPrice || ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value);
                    setGravelPrice(value);
                    setGravelPriceError(value !== '' && Number(value) < 0 ? "Price cannot be negative." : null);
                  }}
                  placeholder="0"
                />
                <div className="absolute right-2 text-blue-500">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">/</span>
                    <select 
                      className="bg-transparent border-none focus:outline-none appearance-none pr-5 text-blue-500 font-medium"
                      value={gravelPriceUnit}
                      onChange={(e) => setGravelPriceUnit(e.target.value)}
                    >
                      {weightUnitValues.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              {gravelPriceError && (
                <div className="mt-1 flex items-center text-red-500 text-xs">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {gravelPriceError}
                </div>
              )}
            </div>
            
            {/* Total Cost of Wall Blocks */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Total cost of wall blocks</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  {currency}
                </div>
                <input 
                  type="text" 
                  className="w-full border rounded-md px-3 py-2 pl-12 bg-gray-50 text-blue-600 font-medium"
                  value={totalWallBlocksCost !== undefined ? formatCurrency(totalWallBlocksCost) : ""}
                  readOnly
                />
              </div>
            </div>
            
            {/* Total Cost of Cap Blocks */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Total cost of cap blocks</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  {currency}
                </div>
                <input 
                  type="text" 
                  className="w-full border rounded-md px-3 py-2 pl-12 bg-gray-50 text-blue-600 font-medium"
                  value={totalCapBlocksCost !== undefined ? formatCurrency(totalCapBlocksCost) : ""}
                  readOnly
                />
              </div>
            </div>
            
            {/* Total Cost of Gravel */}
            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Total cost of gravel for backfill</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  {currency}
                </div>
                <input 
                  type="text" 
                  className="w-full border rounded-md px-3 py-2 pl-12 bg-gray-50 text-blue-600 font-medium"
                  value={totalGravelCost !== undefined ? formatCurrency(totalGravelCost) : ""}
                  readOnly
                />
              </div>
            </div>
            
            {/* Total Expenses */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-base font-medium text-gray-700">Total expenses</label>
                <button className="text-gray-400">•••</button>
              </div>
              <div className="relative flex">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-3 border-r border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                  {currency}
                </div>
                <input 
                  type="text" 
                  className="w-full border rounded-md px-3 py-2 pl-12 bg-gray-50 text-blue-600 font-medium"
                  value={totalExpenses !== undefined ? formatCurrency(totalExpenses) : ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={resetCalculator}
          className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-md border border-gray-300 font-medium hover:bg-gray-200 transition"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={calculateMaterials}
          className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Calculate
        </button>
      </div>
    </div>
  );
}
