"use client"

import React, { useState, useEffect } from "react";
import UnitDropdown from "@/components/UnitDropdown";
import { convertValue, formatNumberWithCommas, getUnitsByType, getUnitsByValues } from "@/lib/utils";
import { UnitOption } from "@/types/calculator";

export default function RoundPenCalculator() {
  // Define unit values for this calculator - limited set as requested
  const lengthUnitValues = getUnitsByValues(['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']);
  
  // State for pen diameter
  const [penDiameter, setPenDiameter] = useState<number | string>("");
  const [penDiameterFeet, setPenDiameterFeet] = useState<number | string>("");
  const [penDiameterInches, setPenDiameterInches] = useState<number | string>("");
  const [penDiameterMeters, setPenDiameterMeters] = useState<number | string>("");
  const [penDiameterCentimeters, setPenDiameterCentimeters] = useState<number | string>("");
  const [penDiameterUnit, setPenDiameterUnit] = useState("cm");
  
  // State for pen circumference
  const [penCircumference, setPenCircumference] = useState<number | string>("");
  const [penCircumferenceFeet, setPenCircumferenceFeet] = useState<number | string>("");
  const [penCircumferenceInches, setPenCircumferenceInches] = useState<number | string>("");
  const [penCircumferenceMeters, setPenCircumferenceMeters] = useState<number | string>("");
  const [penCircumferenceCentimeters, setPenCircumferenceCentimeters] = useState<number | string>("");
  const [penCircumferenceUnit, setPenCircumferenceUnit] = useState("cm");
  
  // State for panel length
  const [panelLength, setPanelLength] = useState<number | string>("");
  const [panelLengthFeet, setPanelLengthFeet] = useState<number | string>("");
  const [panelLengthInches, setPanelLengthInches] = useState<number | string>("");
  const [panelLengthMeters, setPanelLengthMeters] = useState<number | string>("");
  const [panelLengthCentimeters, setPanelLengthCentimeters] = useState<number | string>("");
  const [panelLengthUnit, setPanelLengthUnit] = useState("cm");
  
  // State for number of panels required
  const [numberOfPanels, setNumberOfPanels] = useState<number | string>("");
  
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
  
  // Calculate circumference and panels when inputs change
  useEffect(() => {
    calculateCircumference();
  }, [penDiameter, penDiameterFeet, penDiameterInches, penDiameterMeters, penDiameterCentimeters, penDiameterUnit]);
  
  useEffect(() => {
    calculateNumberOfPanels();
  }, [
    penCircumference, 
    penCircumferenceFeet, 
    penCircumferenceInches, 
    penCircumferenceMeters, 
    penCircumferenceCentimeters,
    panelLength, 
    panelLengthFeet, 
    panelLengthInches, 
    panelLengthMeters, 
    panelLengthCentimeters,
    penCircumferenceUnit, 
    panelLengthUnit
  ]);
  
  // Calculate pen circumference based on diameter
  const calculateCircumference = () => {
    let diameterInM: number = 0;
    
    // Handle different unit types for diameter
    if (penDiameterUnit === 'ft-in') {
      const feet = typeof penDiameterFeet === 'string' ? parseFloat(penDiameterFeet) || 0 : penDiameterFeet;
      const inches = typeof penDiameterInches === 'string' ? parseFloat(penDiameterInches) || 0 : penDiameterInches;
      
      // Skip if both fields are empty or zero
      if (feet <= 0 && inches <= 0) return;
      
      // Convert to feet first with proper precision
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      // Then convert to meters with full precision
      diameterInM = convertValue(valueInFeet, 'ft', 'm');
    } 
    else if (penDiameterUnit === 'm-cm') {
      const meters = typeof penDiameterMeters === 'string' ? parseFloat(penDiameterMeters) || 0 : penDiameterMeters;
      const centimeters = typeof penDiameterCentimeters === 'string' ? parseFloat(penDiameterCentimeters) || 0 : penDiameterCentimeters;
      
      // Skip if both fields are empty or zero
      if (meters <= 0 && centimeters <= 0) return;
      
      // Convert to meters with proper precision
      const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
      diameterInM = valueInMeters;
    } 
    else {
      const numDiameter = typeof penDiameter === 'string' ? parseFloat(penDiameter) || 0 : penDiameter;
      if (numDiameter <= 0) return;
      
      // Convert to meters for calculation
      diameterInM = convertValue(numDiameter, penDiameterUnit, 'm');
    }
    
    // Calculate circumference: C = π * d
    const circumferenceInM = Math.PI * diameterInM;
    
    // Convert to the selected circumference unit
    const convertedCircumference = convertValue(circumferenceInM, 'm', penCircumferenceUnit);
    setPenCircumference(parseFloat(convertedCircumference.toFixed(4)));
  };
  
  // State for validation message
  const [validationMessage, setValidationMessage] = useState<string>("");
  
  // Calculate number of panels required
  const calculateNumberOfPanels = () => {
    let circumferenceInM: number = 0;
    let panelLengthInM: number = 0;
    let diameterInM: number = 0;
    
    setValidationMessage(""); // Clear previous message
    
    // Get diameter in meters for validation
    if (penDiameterUnit === 'ft-in') {
      const feet = typeof penDiameterFeet === 'string' ? parseFloat(penDiameterFeet) || 0 : penDiameterFeet;
      const inches = typeof penDiameterInches === 'string' ? parseFloat(penDiameterInches) || 0 : penDiameterInches;
      
      if (feet > 0 || inches > 0) {
        const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
        diameterInM = convertValue(valueInFeet, 'ft', 'm');
      }
    } 
    else if (penDiameterUnit === 'm-cm') {
      const meters = typeof penDiameterMeters === 'string' ? parseFloat(penDiameterMeters) || 0 : penDiameterMeters;
      const centimeters = typeof penDiameterCentimeters === 'string' ? parseFloat(penDiameterCentimeters) || 0 : penDiameterCentimeters;
      
      if (meters > 0 || centimeters > 0) {
        diameterInM = parseFloat((meters + (centimeters / 100)).toFixed(6));
      }
    }
    else {
      const numDiameter = typeof penDiameter === 'string' ? parseFloat(penDiameter) || 0 : penDiameter;
      if (numDiameter > 0) {
        diameterInM = convertValue(numDiameter, penDiameterUnit, 'm');
      }
    }
    
    // Handle different unit types for circumference
    if (penCircumferenceUnit === 'ft-in') {
      const feet = typeof penCircumferenceFeet === 'string' ? parseFloat(penCircumferenceFeet) || 0 : penCircumferenceFeet;
      const inches = typeof penCircumferenceInches === 'string' ? parseFloat(penCircumferenceInches) || 0 : penCircumferenceInches;
      
      // Skip if both fields are empty or zero
      if (feet <= 0 && inches <= 0) return;
      
      // Convert to feet first with proper precision
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      // Then convert to meters with full precision
      circumferenceInM = convertValue(valueInFeet, 'ft', 'm');
    } 
    else if (penCircumferenceUnit === 'm-cm') {
      const meters = typeof penCircumferenceMeters === 'string' ? parseFloat(penCircumferenceMeters) || 0 : penCircumferenceMeters;
      const centimeters = typeof penCircumferenceCentimeters === 'string' ? parseFloat(penCircumferenceCentimeters) || 0 : penCircumferenceCentimeters;
      
      // Skip if both fields are empty or zero
      if (meters <= 0 && centimeters <= 0) return;
      
      // Convert to meters with proper precision
      circumferenceInM = parseFloat((meters + (centimeters / 100)).toFixed(6));
    }
    else {
      const circumferenceValue = typeof penCircumference === 'string' ? parseFloat(penCircumference) || 0 : penCircumference;
      if (circumferenceValue <= 0) return;
      
      // Convert to meters for calculation
      circumferenceInM = convertValue(circumferenceValue, penCircumferenceUnit, 'm');
    }
    
    // Handle different unit types for panel length
    if (panelLengthUnit === 'ft-in') {
      const feet = typeof panelLengthFeet === 'string' ? parseFloat(panelLengthFeet) || 0 : panelLengthFeet;
      const inches = typeof panelLengthInches === 'string' ? parseFloat(panelLengthInches) || 0 : panelLengthInches;
      
      // Skip if both fields are empty or zero
      if (feet <= 0 && inches <= 0) return;
      
      // Convert to feet first with proper precision
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      // Then convert to meters with full precision
      panelLengthInM = convertValue(valueInFeet, 'ft', 'm');
    } 
    else if (panelLengthUnit === 'm-cm') {
      const meters = typeof panelLengthMeters === 'string' ? parseFloat(panelLengthMeters) || 0 : panelLengthMeters;
      const centimeters = typeof panelLengthCentimeters === 'string' ? parseFloat(panelLengthCentimeters) || 0 : panelLengthCentimeters;
      
      // Skip if both fields are empty or zero
      if (meters <= 0 && centimeters <= 0) return;
      
      // Convert to meters with proper precision
      panelLengthInM = parseFloat((meters + (centimeters / 100)).toFixed(6));
    }
    else {
      const panelLengthValue = typeof panelLength === 'string' ? parseFloat(panelLength) || 0 : panelLength;
      if (panelLengthValue <= 0) return;
      
      // Convert to meters for calculation
      panelLengthInM = convertValue(panelLengthValue, panelLengthUnit, 'm');
    }
    
    if (circumferenceInM <= 0 || panelLengthInM <= 0) return;
    
    // Check for realistic relationship between panel length and circumference
    // The "ideal calculator" seems to show an error when panel length is too large compared to diameter
    if (panelLengthInM > circumferenceInM / 2) {
      setNumberOfPanels(0);
      setValidationMessage("This doesn't look right. Please recheck your input values.");
      return;
    }
    
    // Calculate number of panels needed
    // Using direct P = D × π / L formula for more accurate results
    let panelsNeeded: number;
    
    if (diameterInM > 0) {
      // P = D × π / L formula
      panelsNeeded = Math.ceil((diameterInM * Math.PI) / panelLengthInM);
    } else {
      // Fallback to circumference / length
      panelsNeeded = Math.ceil(circumferenceInM / panelLengthInM);
    }
    
    // Check if the result is realistic
    if (panelsNeeded <= 1 || panelsNeeded > 100) {
      setNumberOfPanels(0);
      setValidationMessage("This doesn't look right. Please recheck your input values.");
      return;
    }
    
    setNumberOfPanels(panelsNeeded);
    setValidationMessage("Excluding the entrance panel or any walk-thru gates.");
  };
  
  // Handle unit changes
  const handlePenDiameterUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = typeof penDiameter === 'string' ? parseFloat(penDiameter) || 0 : penDiameter;
    
    // Handle conversion to compound units
    if (newUnit === 'ft-in' && penDiameterUnit !== 'ft-in') {
      let valueInFeet: number;
      
      // From m-cm to ft-in
      if (penDiameterUnit === 'm-cm') {
        const meters = typeof penDiameterMeters === 'string' ? parseFloat(penDiameterMeters) || 0 : penDiameterMeters;
        const centimeters = typeof penDiameterCentimeters === 'string' ? parseFloat(penDiameterCentimeters) || 0 : penDiameterCentimeters;
        const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
        valueInFeet = convertValue(valueInMeters, 'm', 'ft');
      }
      // From regular unit to ft-in
      else {
        const valueInMeters = convertValue(currentValue, penDiameterUnit, 'm');
        valueInFeet = convertValue(valueInMeters, 'm', 'ft');
      }
      
      // Split into feet and inches
      const feet = Math.floor(valueInFeet);
      const inchesExact = (valueInFeet - feet) * 12;
      const inches = parseFloat(inchesExact.toFixed(4));
      
      setPenDiameterFeet(feet);
      setPenDiameterInches(inches);
    }
    // Handle conversion to m-cm
    else if (newUnit === 'm-cm' && penDiameterUnit !== 'm-cm') {
      let valueInMeters: number;
      
      // From ft-in to m-cm
      if (penDiameterUnit === 'ft-in') {
        const feet = typeof penDiameterFeet === 'string' ? parseFloat(penDiameterFeet) || 0 : penDiameterFeet;
        const inches = typeof penDiameterInches === 'string' ? parseFloat(penDiameterInches) || 0 : penDiameterInches;
        const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
        valueInMeters = convertValue(valueInFeet, 'ft', 'm');
      }
      // From regular unit to m-cm
      else {
        valueInMeters = convertValue(currentValue, penDiameterUnit, 'm');
      }
      
      // Split into meters and centimeters
      const meters = Math.floor(valueInMeters);
      const centimetersExact = (valueInMeters - meters) * 100;
      const centimeters = parseFloat(centimetersExact.toFixed(4));
      
      setPenDiameterMeters(meters);
      setPenDiameterCentimeters(centimeters);
    }
    // From ft-in to regular unit
    else if (penDiameterUnit === 'ft-in' && newUnit !== 'ft-in') {
      const feet = typeof penDiameterFeet === 'string' ? parseFloat(penDiameterFeet) || 0 : penDiameterFeet;
      const inches = typeof penDiameterInches === 'string' ? parseFloat(penDiameterInches) || 0 : penDiameterInches;
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      const valueInMeters = convertValue(valueInFeet, 'ft', 'm');
      setPenDiameter(convertValue(valueInMeters, 'm', newUnit));
    }
    // From m-cm to regular unit
    else if (penDiameterUnit === 'm-cm' && newUnit !== 'm-cm') {
      const meters = typeof penDiameterMeters === 'string' ? parseFloat(penDiameterMeters) || 0 : penDiameterMeters;
      const centimeters = typeof penDiameterCentimeters === 'string' ? parseFloat(penDiameterCentimeters) || 0 : penDiameterCentimeters;
      const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
      setPenDiameter(convertValue(valueInMeters, 'm', newUnit));
    }
    // Regular unit to regular unit
    else if (newUnit !== 'ft-in' && newUnit !== 'm-cm') {
      if (currentValue) {
        const valueInMeters = convertValue(currentValue, penDiameterUnit, 'm');
        setPenDiameter(convertValue(valueInMeters, 'm', newUnit));
      }
    }
    
    setPenDiameterUnit(newUnit);
    // Recalculate after unit change
    setTimeout(() => calculateCircumference(), 0);
  };
  
  const handlePenCircumferenceUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = typeof penCircumference === 'string' ? parseFloat(penCircumference) || 0 : penCircumference;
    
    // Handle conversion to compound units
    if (newUnit === 'ft-in' && penCircumferenceUnit !== 'ft-in') {
      let valueInFeet: number;
      
      // From m-cm to ft-in
      if (penCircumferenceUnit === 'm-cm') {
        const meters = typeof penCircumferenceMeters === 'string' ? parseFloat(penCircumferenceMeters) || 0 : penCircumferenceMeters;
        const centimeters = typeof penCircumferenceCentimeters === 'string' ? parseFloat(penCircumferenceCentimeters) || 0 : penCircumferenceCentimeters;
        const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
        valueInFeet = convertValue(valueInMeters, 'm', 'ft');
      }
      // From regular unit to ft-in
      else {
        const valueInMeters = convertValue(currentValue, penCircumferenceUnit, 'm');
        valueInFeet = convertValue(valueInMeters, 'm', 'ft');
      }
      
      // Split into feet and inches
      const feet = Math.floor(valueInFeet);
      const inchesExact = (valueInFeet - feet) * 12;
      const inches = parseFloat(inchesExact.toFixed(4));
      
      setPenCircumferenceFeet(feet);
      setPenCircumferenceInches(inches);
    }
    // Handle conversion to m-cm
    else if (newUnit === 'm-cm' && penCircumferenceUnit !== 'm-cm') {
      let valueInMeters: number;
      
      // From ft-in to m-cm
      if (penCircumferenceUnit === 'ft-in') {
        const feet = typeof penCircumferenceFeet === 'string' ? parseFloat(penCircumferenceFeet) || 0 : penCircumferenceFeet;
        const inches = typeof penCircumferenceInches === 'string' ? parseFloat(penCircumferenceInches) || 0 : penCircumferenceInches;
        const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
        valueInMeters = convertValue(valueInFeet, 'ft', 'm');
      }
      // From regular unit to m-cm
      else {
        valueInMeters = convertValue(currentValue, penCircumferenceUnit, 'm');
      }
      
      // Split into meters and centimeters
      const meters = Math.floor(valueInMeters);
      const centimetersExact = (valueInMeters - meters) * 100;
      const centimeters = parseFloat(centimetersExact.toFixed(4));
      
      setPenCircumferenceMeters(meters);
      setPenCircumferenceCentimeters(centimeters);
    }
    // From ft-in to regular unit
    else if (penCircumferenceUnit === 'ft-in' && newUnit !== 'ft-in') {
      const feet = typeof penCircumferenceFeet === 'string' ? parseFloat(penCircumferenceFeet) || 0 : penCircumferenceFeet;
      const inches = typeof penCircumferenceInches === 'string' ? parseFloat(penCircumferenceInches) || 0 : penCircumferenceInches;
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      const valueInMeters = convertValue(valueInFeet, 'ft', 'm');
      setPenCircumference(convertValue(valueInMeters, 'm', newUnit));
    }
    // From m-cm to regular unit
    else if (penCircumferenceUnit === 'm-cm' && newUnit !== 'm-cm') {
      const meters = typeof penCircumferenceMeters === 'string' ? parseFloat(penCircumferenceMeters) || 0 : penCircumferenceMeters;
      const centimeters = typeof penCircumferenceCentimeters === 'string' ? parseFloat(penCircumferenceCentimeters) || 0 : penCircumferenceCentimeters;
      const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
      setPenCircumference(convertValue(valueInMeters, 'm', newUnit));
    }
    // Regular unit to regular unit
    else if (newUnit !== 'ft-in' && newUnit !== 'm-cm') {
      if (currentValue) {
        const valueInMeters = convertValue(currentValue, penCircumferenceUnit, 'm');
        setPenCircumference(convertValue(valueInMeters, 'm', newUnit));
      }
    }
    
    setPenCircumferenceUnit(newUnit);
    // Recalculate panels after unit change
    setTimeout(() => calculateNumberOfPanels(), 0);
  };
  
  const handlePanelLengthUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const currentValue = typeof panelLength === 'string' ? parseFloat(panelLength) || 0 : panelLength;
    
    // Handle conversion to compound units
    if (newUnit === 'ft-in' && panelLengthUnit !== 'ft-in') {
      let valueInFeet: number;
      
      // From m-cm to ft-in
      if (panelLengthUnit === 'm-cm') {
        const meters = typeof panelLengthMeters === 'string' ? parseFloat(panelLengthMeters) || 0 : panelLengthMeters;
        const centimeters = typeof panelLengthCentimeters === 'string' ? parseFloat(panelLengthCentimeters) || 0 : panelLengthCentimeters;
        const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
        valueInFeet = convertValue(valueInMeters, 'm', 'ft');
      }
      // From regular unit to ft-in
      else {
        const valueInMeters = convertValue(currentValue, panelLengthUnit, 'm');
        valueInFeet = convertValue(valueInMeters, 'm', 'ft');
      }
      
      // Split into feet and inches
      const feet = Math.floor(valueInFeet);
      const inchesExact = (valueInFeet - feet) * 12;
      const inches = parseFloat(inchesExact.toFixed(4));
      
      setPanelLengthFeet(feet);
      setPanelLengthInches(inches);
    }
    // Handle conversion to m-cm
    else if (newUnit === 'm-cm' && panelLengthUnit !== 'm-cm') {
      let valueInMeters: number;
      
      // From ft-in to m-cm
      if (panelLengthUnit === 'ft-in') {
        const feet = typeof panelLengthFeet === 'string' ? parseFloat(panelLengthFeet) || 0 : panelLengthFeet;
        const inches = typeof panelLengthInches === 'string' ? parseFloat(panelLengthInches) || 0 : panelLengthInches;
        const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
        valueInMeters = convertValue(valueInFeet, 'ft', 'm');
      }
      // From regular unit to m-cm
      else {
        valueInMeters = convertValue(currentValue, panelLengthUnit, 'm');
      }
      
      // Split into meters and centimeters
      const meters = Math.floor(valueInMeters);
      const centimetersExact = (valueInMeters - meters) * 100;
      const centimeters = parseFloat(centimetersExact.toFixed(4));
      
      setPanelLengthMeters(meters);
      setPanelLengthCentimeters(centimeters);
    }
    // From ft-in to regular unit
    else if (panelLengthUnit === 'ft-in' && newUnit !== 'ft-in') {
      const feet = typeof panelLengthFeet === 'string' ? parseFloat(panelLengthFeet) || 0 : panelLengthFeet;
      const inches = typeof panelLengthInches === 'string' ? parseFloat(panelLengthInches) || 0 : panelLengthInches;
      const valueInFeet = parseFloat((feet + (inches / 12)).toFixed(6));
      const valueInMeters = convertValue(valueInFeet, 'ft', 'm');
      setPanelLength(convertValue(valueInMeters, 'm', newUnit));
    }
    // From m-cm to regular unit
    else if (panelLengthUnit === 'm-cm' && newUnit !== 'm-cm') {
      const meters = typeof panelLengthMeters === 'string' ? parseFloat(panelLengthMeters) || 0 : panelLengthMeters;
      const centimeters = typeof panelLengthCentimeters === 'string' ? parseFloat(panelLengthCentimeters) || 0 : panelLengthCentimeters;
      const valueInMeters = parseFloat((meters + (centimeters / 100)).toFixed(6));
      setPanelLength(convertValue(valueInMeters, 'm', newUnit));
    }
    // Regular unit to regular unit
    else if (newUnit !== 'ft-in' && newUnit !== 'm-cm') {
      if (currentValue) {
        const valueInMeters = convertValue(currentValue, panelLengthUnit, 'm');
        setPanelLength(convertValue(valueInMeters, 'm', newUnit));
      }
    }
    
    setPanelLengthUnit(newUnit);
    // Recalculate panels after unit change
    setTimeout(() => calculateNumberOfPanels(), 0);
  };
  
  // Reset the calculator
  const resetCalculator = () => {
    setPenDiameter("");
    setPenDiameterFeet("");
    setPenDiameterInches("");
    setPenDiameterMeters("");
    setPenDiameterCentimeters("");
    setPenCircumference("");
    setPenCircumferenceFeet("");
    setPenCircumferenceInches("");
    setPenCircumferenceMeters("");
    setPenCircumferenceCentimeters("");
    setPanelLength("");
    setPanelLengthFeet("");
    setPanelLengthInches("");
    setPanelLengthMeters("");
    setPanelLengthCentimeters("");
    setNumberOfPanels("");
    setPenDiameterUnit("cm");
    setPenCircumferenceUnit("cm");
    setPanelLengthUnit("cm");
    setValidationMessage("");
  };
  
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Round Pen Calculator</h1>
      
      {/* Calculator Section */}
      <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
        <div className="p-4 space-y-6">
          {/* Pen Diameter Input */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Pen diameter</label>
             
            </div>
            
            {/* Different input fields based on the selected unit */}
            {penDiameterUnit === 'ft-in' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penDiameterFeet || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenDiameterFeet(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">ft</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penDiameterInches || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenDiameterInches(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">in</div>
                </div>
                <UnitDropdown
                  value={penDiameterUnit}
                  onChange={handlePenDiameterUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : penDiameterUnit === 'm-cm' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penDiameterMeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenDiameterMeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">m</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penDiameterCentimeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenDiameterCentimeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">cm</div>
                </div>
                <UnitDropdown
                  value={penDiameterUnit}
                  onChange={handlePenDiameterUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : (
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formatInputValue(penDiameter)}
                  onChange={(e) => {
                    // Remove any commas and non-numeric characters (except for decimal point)
                    const rawValue = e.target.value.replace(/,/g, '');
                    const value = rawValue === '' ? '' : Number(rawValue);
                    setPenDiameter(value);
                  }}
                  placeholder="0"
                />
                <UnitDropdown
                  value={penDiameterUnit}
                  onChange={handlePenDiameterUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 rounded-l-none rounded-r-md border-l-0"
                />
              </div>
            )}
          </div>
          
          {/* Pen Circumference Output */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Pen circumference</label>
            </div>
            {penCircumferenceUnit === 'ft-in' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penCircumferenceFeet || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenCircumferenceFeet(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">ft</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penCircumferenceInches || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenCircumferenceInches(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">in</div>
                </div>
                <UnitDropdown
                  value={penCircumferenceUnit}
                  onChange={handlePenCircumferenceUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : penCircumferenceUnit === 'm-cm' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penCircumferenceMeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenCircumferenceMeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">m</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={penCircumferenceCentimeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPenCircumferenceCentimeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">cm</div>
                </div>
                <UnitDropdown
                  value={penCircumferenceUnit}
                  onChange={handlePenCircumferenceUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : (
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formatInputValue(penCircumference)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, '');
                    const value = rawValue === '' ? '' : Number(rawValue);
                    setPenCircumference(value);
                  }}
                  placeholder="0"
                />
                <UnitDropdown
                  value={penCircumferenceUnit}
                  onChange={handlePenCircumferenceUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 rounded-l-none rounded-r-md border-l-0"
                />
              </div>
            )}
          </div>
          
          {/* Panel Length Input */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Panel length</label>
            </div>
            {panelLengthUnit === 'ft-in' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={panelLengthFeet || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPanelLengthFeet(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">ft</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={panelLengthInches || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPanelLengthInches(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">in</div>
                </div>
                <UnitDropdown
                  value={panelLengthUnit}
                  onChange={handlePanelLengthUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : panelLengthUnit === 'm-cm' ? (
              <div className="flex">
                <div className="flex-1 flex">
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={panelLengthMeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPanelLengthMeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-slate-300 bg-slate-50">m</div>
                  <input 
                    type="number" 
                    className="flex-1 px-3 py-2 border-t border-b border-r focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={panelLengthCentimeters || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      setPanelLengthCentimeters(value);
                    }}
                    placeholder="0"
                  />
                  <div className="flex items-center px-2 border-t border-b border-r border-slate-300 rounded-r-md bg-slate-50">cm</div>
                </div>
                <UnitDropdown
                  value={panelLengthUnit}
                  onChange={handlePanelLengthUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 ml-1 rounded-md"
                />
              </div>
            ) : (
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formatInputValue(panelLength)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, '');
                    const value = rawValue === '' ? '' : Number(rawValue);
                    setPanelLength(value);
                  }}
                  placeholder="0"
                />
                <UnitDropdown
                  value={panelLengthUnit}
                  onChange={handlePanelLengthUnitChange}
                  unitValues={['cm', 'm', 'in', 'ft', 'ft-in', 'm-cm']}
                  className="w-24 rounded-l-none rounded-r-md border-l-0"
                />
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">Standard corral panels are between 4 to 20 feet wide.</p>
          </div>
          
          {/* Number of Panels Required Output */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-base font-medium text-gray-700">Number of panels required</label>
            </div>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-md bg-gray-50 focus:outline-none"
              value={numberOfPanels}
              readOnly
              placeholder="0"
            />
            {validationMessage && (
              <p className={`mt-1 text-sm ${numberOfPanels === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {validationMessage}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid gap-4">
       
        <button 
          onClick={resetCalculator}
          className="py-3 bg-gray-100 rounded-lg font-medium text-gray-900"
        >
          Reload calculator
        </button>
      </div>
    </div>
  );
}
