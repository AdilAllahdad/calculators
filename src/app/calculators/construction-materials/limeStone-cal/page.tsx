'use client'
import React, { useState, useEffect } from "react";

// Limestone types and their densities in t/m³
const limestoneTypes = [
  { label: "Select", value: "" },
  { label: "Low-density limestone", value: "low_density", density: 1.96 },
  { label: "Medium-density limestone", value: "medium_density", density: 2.41 },
  { label: "High-density limestone", value: "high_density", density: 2.65 },
  { label: "Crushed limestone", value: "crushed", density: 2.24 },
  { label: "Loose limestone", value: "loose", density: 1.54 },
  { label: "Solid limestone", value: "solid", density: 2.69 },
  { label: "Enter custom limestone density", value: "custom" }
];

const densityUnits = [
  { label: "tons per cubic meter(t/m³)", value: "t/m³" },
  { label: "kilograms per cubic meter(kg/m³)", value: "kg/m³" },
  { label: "pounds per cubic inch(lb/cu in)", value: "lb/cu in" },
  { label: "pounds per cubic feet(lb/cu ft)", value: "lb/cu ft" },
  { label: "pounds per cubic yard(lb/cu yd)", value: "lb/cu yd" }
];

// Conversion factors to t/m³ (metric ton per cubic meter)
const toTPerM3 = {
  "t/m³": 1,
  "kg/m³": 0.001, // 1 kg/m³ = 0.001 t/m³
  "lb/cu in": 27.679904843, // 1 lb/cu in = 27.679904843 t/m³
  "lb/cu ft": 0.016018463, // 1 lb/cu ft = 0.016018463 t/m³
  "lb/cu yd": 0.0005932764 // 1 lb/cu yd = 0.0005932764 t/m³
};

// Conversion factors from t/m³ to target unit
const fromTPerM3 = {
  "t/m³": 1,
  "kg/m³": 1000, // 1 t/m³ = 1000 kg/m³
  "lb/cu in": 0.036127292, // 1 t/m³ = 0.036127292 lb/cu in
  "lb/cu ft": 62.4279606, // 1 t/m³ = 62.4279606 lb/cu ft
  "lb/cu yd": 1685.55494 // 1 t/m³ = 1685.55494 lb/cu yd
};

function convertDensity(value: number, from: string, to: string) {
  if (from === to) return value;
  // Convert from 'from' unit to t/m³, then to target unit
  const valueInTPerM3 = value * toTPerM3[from as keyof typeof toTPerM3];
  return valueInTPerM3 * fromTPerM3[to as keyof typeof fromTPerM3];
}

const lengthUnits = [
  { label: "centimeters(cm)", value: "cm" },
  { label: "meters(m)", value: "m" },
  { label: "kilometers(km)", value: "km" },
  { label: "inches(in)", value: "in" },
  { label: "feet(ft)", value: "ft" },
  { label: "yards(yd)", value: "yd" },
  { label: "miles(mi)", value: "mi" },
];

// Conversion factors to meters
const toMeters = {
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

// Conversion factors from meters to target unit
const fromMeters = {
  cm: 100,
  m: 1,
  km: 0.001,
  in: 39.3700787,
  ft: 3.2808399,
  yd: 1.0936133,
  mi: 0.0006213712,
};

function convertLength(value: number, from: string, to: string) {
  if (from === to) return value;
  const valueInMeters = value * toMeters[from as keyof typeof toMeters];
  return valueInMeters * fromMeters[to as keyof typeof fromMeters];
}

const areaUnits = [
  { label: "square centimeters(cm²)", value: "cm²" },
  { label: "square meters(m²)", value: "m²" },
  { label: "square kilometers(km²)", value: "km²" },
  { label: "square inches(in²)", value: "in²" },
  { label: "square feet(ft²)", value: "ft²" },
  { label: "square yards(yd²)", value: "yd²" },
  { label: "square miles(mi²)", value: "mi²" }
];

const volumeUnits = [
  { label: "cubic centimeters (cm³)", value: "cm³" },
  { label: "cubic meters (m³)", value: "m³" },
  { label: "cubic kilometers (km³)", value: "km³" },
  { label: "cubic inches (in³)", value: "in³" },
  { label: "cubic feet (ft³)", value: "ft³" },
  { label: "cubic yards (yd³)", value: "yd³" },
];

// Area and volume conversion helpers
const toM2 = {
  "cm²": 0.0001,
  "m²": 1,
  "km²": 1e6,
  "in²": 0.00064516,
  "ft²": 0.09290304,
  "yd²": 0.83612736,
  "mi²": 2.59e6,
};
const fromM2 = {
  "cm²": 10000,
  "m²": 1,
  "km²": 1e-6,
  "in²": 1550.0031,
  "ft²": 10.76391041671,
  "yd²": 1.1959900463,
  "mi²": 3.861021585e-7,
};

const toM3 = {
  "cm³": 1e-6,
  "m³": 1,
  "km³": 1e9,
  "in³": 0.000016387064,
  "ft³": 0.0283168466,
  "yd³": 0.764554858,
  "mi³": 4.16818183e9,
};
const fromM3 = {
  "cm³": 1e6,
  "m³": 1,
  "km³": 1e-9,
  "in³": 61023.7441,
  "ft³": 35.3146667,
  "yd³": 1.30795062,
  "mi³": 2.39912759e-10,
};

function convertArea(value: number, from: string, to: string) {
  if (from === to) return value;
  const valueInM2 = value * toM2[from as keyof typeof toM2];
  return valueInM2 * fromM2[to as keyof typeof fromM2];
}
function convertVolume(value: number, from: string, to: string) {
  if (from === to) return value;
  const valueInM3 = value * toM3[from as keyof typeof toM3];
  return valueInM3 * fromM3[to as keyof typeof fromM3];
}

const volumeNeededUnits = [
  { label: "cubic centimeters(cm³)", value: "cm³" },
  { label: "cubic meters(m³)", value: "m³" },
  { label: "cubic inches(in³)", value: "cu in" },
  { label: "cubic feet(ft³)", value: "cu ft" },
  { label: "cubic yards(yd³)", value: "cu yd" }
];

const weightNeededUnits = [
  { label: "kilograms(kg)", value: "kg" },
  { label: "metric tons(t)", value: "t" },
  { label: "pounds(lb)", value: "lb" },
  { label: "stones(st)", value: "st" },
  { label: "US short tons(US ton)", value: "US ton" },
  { label: "imperial tons(long ton)", value: "long ton" }
];

// Volume conversion helpers for "needed" (cu in, cu ft, cu yd)
const toM3Needed = {
  "cm³": 1e-6,
  "m³": 1,
  "cu in": 0.000016387064,
  "cu ft": 0.0283168466,
  "cu yd": 0.764554858
};
const fromM3Needed = {
  "cm³": 1e6,
  "m³": 1,
  "cu in": 61023.7441,
  "cu ft": 35.3146667,
  "cu yd": 1.30795062
};

// Weight conversion helpers
const fromKg = {
  kg: 1,
  t: 0.001,
  lb: 2.20462262,
  st: 0.157473044,
  "US ton": 0.00110231131,
  "long ton": 0.000984206528
};
const toKg = {
  kg: 1,
  t: 1000,
  lb: 0.45359237,
  st: 6.35029318,
  "US ton": 907.18474,
  "long ton": 1016.0469088
};

function convertVolumeNeeded(value: number, from: string, to: string) {
  if (from === to) return value;
  const valueInM3 = value * toM3Needed[from as keyof typeof toM3Needed];
  return valueInM3 * fromM3Needed[to as keyof typeof fromM3Needed];
}
function convertWeightNeeded(value: number, from: string, to: string) {
  if (from === to) return value;
  // Convert from 'from' unit to kg, then to 'to' unit
  const valueInKg = value * toKg[from as keyof typeof toKg];
  return valueInKg * fromKg[to as keyof typeof fromKg];
}

const pricePerVolumeUnits = [
  { label: "cubic centimeter (cm³)", value: "cm³" },
  { label: "cubic meter (m³)", value: "m³" },
  // { label: "cubic inch (cu in)", value: "cu in" },
  // { label: "cubic foot (cu ft)", value: "cu ft" },
  // { label: "cubic yard (cu yd)", value: "cu yd" }
];

// Conversion factors for price per volume (to m³)
const toM3Price = {
  "cm³": 1e-6,
  "m³": 1,
  "cu in": 0.000016387064,
  "cu ft": 0.0283168466,
  "cu yd": 0.764554858
};
const fromM3Price = {
  "cm³": 1e6,
  "m³": 1,
  "cu in": 61023.7441,
  "cu ft": 35.3146667,
  "cu yd": 1.30795062
};

// Fix: use standard conversion for price per unit of volume dropdown
function convertPricePerVolume(value: number, from: string, to: string) {
  if (from === to) return value;
  // Convert from 'from' unit to m³
  const valueInM3 = value * toM3Price[from as keyof typeof toM3Price];
  // Convert from m³ to 'to' unit (divide by toM3Price[to])
  return valueInM3 / toM3Price[to as keyof typeof toM3Price];
}

// Weight conversion helpers for price per unit of weight
const pricePerWeightUnits = [
  { label: "kilograms (kg)", value: "kg" },
  { label: "metric tons (t)", value: "t" },
  { label: "pounds (lb)", value: "lb" },
  { label: "stones (st)", value: "st" },
  { label: "US short tons (US ton)", value: "US ton" },
  { label: "imperial tons (long ton)", value: "long ton" }
];

// Conversion factors for price per weight (to kg)
const toKgPrice = {
  kg: 1,
  t: 1000,
  lb: 0.45359237,
  st: 6.35029318,
  "US ton": 907.18474,
  "long ton": 1016.0469088
};
const fromKgPrice = {
  kg: 1,
  t: 0.001,
  lb: 2.20462262,
  st: 0.157473044,
  "US ton": 0.00110231131,
  "long ton": 0.000984206528
};

function convertPricePerWeight(value: number, from: string, to: string) {
  if (from === to) return value;
  const valueInKg = value * toKgPrice[from as keyof typeof toKgPrice];
  return valueInKg * fromKgPrice[to as keyof typeof fromKgPrice];
}

const LimestoneSpecCard = () => {
  const [type, setType] = useState("crushed");
  const [densityInTPerM3, setDensityInTPerM3] = useState(2.24); // Always store in t/m³ internally
  const [densityUnit, setDensityUnit] = useState("t/m³");
  const [displayValue, setDisplayValue] = useState("2.24");

  // Length/Width state
  const [length, setLength] = useState("");
  const [lengthUnit, setLengthUnit] = useState("m");
  const [width, setWidth] = useState("");
  const [widthUnit, setWidthUnit] = useState("m");

  // Area, depth, and volume state
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("m²");
  const [depth, setDepth] = useState("");
  const [depthUnit, setDepthUnit] = useState("m");
  const [volume, setVolume] = useState("");
  const [volumeUnit, setVolumeUnit] = useState("m³");

  // Volume needed and weight needed state
  const [wastage, setWastage] = useState("5");
  const [volumeNeeded, setVolumeNeeded] = useState("");
  const [volumeNeededUnit, setVolumeNeededUnit] = useState("cu ft");
  const [weightNeeded, setWeightNeeded] = useState("");
  const [weightNeededUnit, setWeightNeededUnit] = useState("t");

  // State for price per unit of volume
  const [pricePerVolume, setPricePerVolume] = useState("");
  const [pricePerVolumeUnit, setPricePerVolumeUnit] = useState("cu ft");

  // State for price per unit of weight
  const [pricePerWeight, setPricePerWeight] = useState("");
  const [pricePerWeightUnit, setPricePerWeightUnit] = useState("long ton");

  // Total cost state
  const [totalCost, setTotalCost] = useState("");

  // When type changes, update density (unless custom)
  const handleTypeChange = (val: string) => {
    setType(val);
    const found = limestoneTypes.find(t => t.value === val);
    
    if (found && found.value !== "custom" && found.density) {
      // Set internal density in t/m³
      setDensityInTPerM3(found.density);
      // Convert to current display unit
      const convertedValue = convertDensity(found.density, "t/m³", densityUnit);
      setDisplayValue(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
    } else if (found && found.value === "custom") {
      setDisplayValue("");
      setDensityInTPerM3(0);
    }
  };

  // When density unit changes, convert the display value
  const handleDensityUnitChange = (newUnit: string) => {
    if (displayValue && !isNaN(parseFloat(displayValue))) {
      // Convert current display value to new unit
      const currentValue = parseFloat(displayValue);
      const convertedValue = convertDensity(currentValue, densityUnit, newUnit);
      setDisplayValue(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
    }
    setDensityUnit(newUnit);
  };

  // When custom density input changes
  const handleCustomDensityChange = (val: string) => {
    setDisplayValue(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      // Convert input value to t/m³ for internal storage
      const valueInTPerM3 = convertDensity(num, densityUnit, "t/m³");
      setDensityInTPerM3(valueInTPerM3);
    } else {
      setDensityInTPerM3(0);
    }
  };

  // Length/Width handlers
  const handleLengthChange = (val: string) => setLength(val);
  const handleLengthUnitChange = (unit: string) => {
    if (length && !isNaN(parseFloat(length))) {
      const meters = convertLength(parseFloat(length), lengthUnit, "m");
      const newVal = convertLength(meters, "m", unit);
      setLength(newVal.toString());
    }
    setLengthUnit(unit);
  };

  const handleWidthChange = (val: string) => setWidth(val);
  const handleWidthUnitChange = (unit: string) => {
    if (width && !isNaN(parseFloat(width))) {
      const meters = convertLength(parseFloat(width), widthUnit, "m");
      const newVal = convertLength(meters, "m", unit);
      setWidth(newVal.toString());
    }
    setWidthUnit(unit);
  };

  // Area handlers
  const handleAreaChange = (val: string) => setArea(val);
  const handleAreaUnitChange = (unit: string) => {
    if (area && !isNaN(parseFloat(area))) {
      const m2 = convertArea(parseFloat(area), areaUnit, "m²");
      const newVal = convertArea(m2, "m²", unit);
      setArea(newVal.toString());
    }
    setAreaUnit(unit);
  };

  // Depth handlers
  const handleDepthChange = (val: string) => setDepth(val);
  const handleDepthUnitChange = (unit: string) => {
    if (depth && !isNaN(parseFloat(depth))) {
      const meters = convertLength(parseFloat(depth), depthUnit, "m");
      const newVal = convertLength(meters, "m", unit);
      setDepth(newVal.toString());
    }
    setDepthUnit(unit);
  };

  // Volume handlers
  const handleVolumeChange = (val: string) => setVolume(val);
  const handleVolumeUnitChange = (unit: string) => {
    if (volume && !isNaN(parseFloat(volume))) {
      const m3 = convertVolume(parseFloat(volume), volumeUnit, "m³");
      const newVal = convertVolume(m3, "m³", unit);
      setVolume(newVal.toString());
    }
    setVolumeUnit(unit);
  };

  // Handle volume needed unit change
  const handleVolumeNeededUnitChange = (unit: string) => {
    if (volumeNeeded && !isNaN(parseFloat(volumeNeeded))) {
      const m3 = convertVolumeNeeded(parseFloat(volumeNeeded), volumeNeededUnit, "m³");
      const newVal = convertVolumeNeeded(m3, "m³", unit);
      setVolumeNeeded(newVal.toString());
    }
    setVolumeNeededUnit(unit);
  };

  // Handle weight needed unit change
  const handleWeightNeededUnitChange = (unit: string) => {
    if (weightNeeded && !isNaN(parseFloat(weightNeeded))) {
      const kg = convertWeightNeeded(parseFloat(weightNeeded), weightNeededUnit, "kg");
      const newVal = convertWeightNeeded(kg, "kg", unit);
      setWeightNeeded(newVal.toString());
    }
    setWeightNeededUnit(unit);
  };

  // Handle price per volume unit change
  const handlePricePerVolumeUnitChange = (unit: string) => {
    if (pricePerVolume && !isNaN(parseFloat(pricePerVolume))) {
      const m3 = convertPricePerVolume(parseFloat(pricePerVolume), pricePerVolumeUnit, "m³");
      const newVal = convertPricePerVolume(m3, "m³", unit);
      setPricePerVolume(newVal.toString());
    }
    setPricePerVolumeUnit(unit);
  };

  // Handle price per weight unit change
  const handlePricePerWeightUnitChange = (unit: string) => {
    if (pricePerWeight && !isNaN(parseFloat(pricePerWeight))) {
      const kg = convertPricePerWeight(parseFloat(pricePerWeight), pricePerWeightUnit, "kg");
      const newVal = convertPricePerWeight(kg, "kg", unit);
      setPricePerWeight(newVal.toString());
    }
    setPricePerWeightUnit(unit);
  };

  // Calculate area from length and width
  useEffect(() => {
    if (length && width && !isNaN(parseFloat(length)) && !isNaN(parseFloat(width))) {
      const lengthInM = convertLength(parseFloat(length), lengthUnit, "m");
      const widthInM = convertLength(parseFloat(width), widthUnit, "m");
      const areaInM2 = lengthInM * widthInM;
      const convertedArea = convertArea(areaInM2, "m²", areaUnit);
      setArea(convertedArea.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setArea("");
    }
  }, [length, width, lengthUnit, widthUnit, areaUnit]);

  // Calculate volume from area and depth
  useEffect(() => {
    if (area && depth && !isNaN(parseFloat(area)) && !isNaN(parseFloat(depth))) {
      const areaInM2 = convertArea(parseFloat(area), areaUnit, "m²");
      const depthInM = convertLength(parseFloat(depth), depthUnit, "m");
      const volumeInM3 = areaInM2 * depthInM;
      const convertedVolume = convertVolume(volumeInM3, "m³", volumeUnit);
      setVolume(convertedVolume.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setVolume("");
    }
  }, [area, depth, areaUnit, depthUnit, volumeUnit]);

  // Calculate volume needed including wastage
  useEffect(() => {
    if (volume && !isNaN(parseFloat(volume)) && !isNaN(parseFloat(wastage))) {
      const volumeInM3 = convertVolume(parseFloat(volume), volumeUnit, "m³");
      const wastageFactor = 1 + (parseFloat(wastage) / 100);
      const volumeNeededInM3 = volumeInM3 * wastageFactor;
      const convertedVolumeNeeded = convertVolumeNeeded(volumeNeededInM3, "m³", volumeNeededUnit);
      setVolumeNeeded(convertedVolumeNeeded.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setVolumeNeeded("");
    }
  }, [volume, wastage, volumeUnit, volumeNeededUnit]);

  // Calculate weight needed from volume needed and density
  useEffect(() => {
    if (volumeNeeded && !isNaN(parseFloat(volumeNeeded)) && densityInTPerM3 > 0) {
      const volumeNeededInM3 = convertVolumeNeeded(parseFloat(volumeNeeded), volumeNeededUnit, "m³");
      const weightNeededInT = volumeNeededInM3 * densityInTPerM3;
      const convertedWeightNeeded = convertWeightNeeded(weightNeededInT, "t", weightNeededUnit);
      setWeightNeeded(convertedWeightNeeded.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setWeightNeeded("");
    }
  }, [volumeNeeded, densityInTPerM3, volumeNeededUnit, weightNeededUnit]);

  // Calculate total cost
  useEffect(() => {
    let cost = 0;
    
    // Calculate cost based on price per weight
    if (pricePerWeight && weightNeeded && !isNaN(parseFloat(pricePerWeight)) && !isNaN(parseFloat(weightNeeded))) {
      const pricePerWeightInKg = convertPricePerWeight(parseFloat(pricePerWeight), pricePerWeightUnit, "kg");
      const weightNeededInKg = convertWeightNeeded(parseFloat(weightNeeded), weightNeededUnit, "kg");
      cost = pricePerWeightInKg * weightNeededInKg;
    }
    
    // Calculate cost based on price per volume (if price per weight is not provided)
    else if (pricePerVolume && volumeNeeded && !isNaN(parseFloat(pricePerVolume)) && !isNaN(parseFloat(volumeNeeded))) {
      const pricePerVolumeInM3 = convertPricePerVolume(parseFloat(pricePerVolume), pricePerVolumeUnit, "m³");
      const volumeNeededInM3 = convertVolumeNeeded(parseFloat(volumeNeeded), volumeNeededUnit, "m³");
      cost = pricePerVolumeInM3 * volumeNeededInM3;
    }
    
    setTotalCost(cost > 0 ? cost.toFixed(2) : "");
  }, [pricePerWeight, pricePerVolume, weightNeeded, volumeNeeded, 
      pricePerWeightUnit, pricePerVolumeUnit, weightNeededUnit, volumeNeededUnit]);

  // Clear all fields handler
  const handleClearAll = () => {
    setType("crushed");
    setDensityInTPerM3(2.24);
    setDensityUnit("t/m³");
    setDisplayValue("2.24");
    setLength("");
    setLengthUnit("m");
    setWidth("");
    setWidthUnit("m");
    setArea("");
    setAreaUnit("m²");
    setDepth("");
    setDepthUnit("m");
    setVolume("");
    setVolumeUnit("m³");
    setWastage("5");
    setVolumeNeeded("");
    setVolumeNeededUnit("cu ft");
    setWeightNeeded("");
    setWeightNeededUnit("t");
    setPricePerVolume("");
    setPricePerVolumeUnit("cu ft");
    setPricePerWeight("");
    setPricePerWeightUnit("long ton");
    setTotalCost("");
  };

  // Add useEffect to auto-calculate price per one unit of volume when price per weight changes
  useEffect(() => {
    // Only auto-calculate if pricePerWeight is provided and valid
    if (
      pricePerWeight &&
      !isNaN(parseFloat(pricePerWeight)) &&
      densityInTPerM3 > 0
    ) {
      // Convert price per weight to PKR/kg
      const pricePerWeightInKg = convertPricePerWeight(
        parseFloat(pricePerWeight),
        pricePerWeightUnit,
        "kg"
      );
      // Convert density to kg/m³
      const densityKgPerM3 = densityInTPerM3 * 1000;
      // Price per m³ = price per kg * density (kg/m³)
      const pricePerM3 = pricePerWeightInKg * densityKgPerM3;
      // Convert price per m³ to selected pricePerVolumeUnit
      const pricePerSelectedVolume = convertPricePerVolume(
        pricePerM3,
        "m³",
        pricePerVolumeUnit
      );
      setPricePerVolume(pricePerSelectedVolume ? pricePerSelectedVolume.toFixed(6).replace(/\.?0+$/, '') : "");
    }
    // If pricePerWeight is empty, do not auto-calculate
    // eslint-disable-next-line
  }, [pricePerWeight, pricePerWeightUnit, densityInTPerM3, pricePerVolumeUnit]);

  return (
    <div className="w-[600px] mx-auto mt-10 bg-white rounded-xl shadow p-6 border">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-lg flex items-center gap-2">
          <span className="text-blue-600">▸</span>
          Limestone specifications
        </span>
        <span className="text-gray-400 text-xl">...</span>
      </div>
      
      {/* Limestone type */}
      <div className="mb-6">
        <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
          Limestone type
          <span className="text-gray-400 cursor-pointer" title="Select the type of limestone">i</span>
        </label>
        <select
          value={type}
          onChange={e => handleTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
        >
          {limestoneTypes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      
      {/* Average density */}
      <div>
        <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
          Average density
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={displayValue}
            onChange={type === "custom" ? e => handleCustomDensityChange(e.target.value) : undefined}
            readOnly={type !== "custom"}
            className={`flex-1 px-3 py-2 border ${type === "custom" ? "border-blue-400" : "border-gray-300 bg-gray-50"} rounded-md focus:outline-none`}
            placeholder="Density"
            step="any"
          />
          <select
            value={densityUnit}
            onChange={e => handleDensityUnitChange(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            {densityUnits.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* How much limestone do you need? */}
      <div className="mt-8 mb-8 p-4 rounded-lg  bg-gray-50">
        <div className="font-semibold text-base mb-4">How much limestone do you need?</div>
        {/* Length */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Length
            <span className="text-gray-400 cursor-pointer" title="Length of the area">i</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={length}
              onChange={e => handleLengthChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-white"
              placeholder="Enter length"
              step="any"
            />
            <select
              value={lengthUnit}
              onChange={e => handleLengthUnitChange(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
            >
              {lengthUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Width */}
        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Width
            <span className="text-gray-400 cursor-pointer" title="Width of the area">i</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={width}
              onChange={e => handleWidthChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-white"
              placeholder="Enter width"
              step="any"
            />
            <select
              value={widthUnit}
              onChange={e => handleWidthUnitChange(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
            >
              {lengthUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Area */}
        <div className="mt-4 mb-4">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Area
            <span className="text-gray-400 cursor-pointer" title="Area of the surface">i</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={area}
              onChange={e => handleAreaChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-50"
              placeholder="Area"
              step="any"
              readOnly
            />
            <select
              value={areaUnit}
              onChange={e => handleAreaUnitChange(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
            >
              {areaUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Depth */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Depth
            <span className="text-gray-400 cursor-pointer" title="Depth of the layer">i</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={depth}
              onChange={e => handleDepthChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-white"
              placeholder="Depth"
              step="any"
            />
            <select
              value={depthUnit}
              onChange={e => handleDepthUnitChange(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
            >
              {lengthUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Volume */}
        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Volume
            <span className="text-gray-400 cursor-pointer" title="Volume of limestone needed">i</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={volume}
              onChange={e => handleVolumeChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-50"
              placeholder="Volume"
              step="any"
              readOnly
            />
            <select
              value={volumeUnit}
              onChange={e => handleVolumeUnitChange(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
            >
              {volumeUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Wastage */}
        <div className="mt-4 mb-4">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Wastage
            <span className="text-gray-400 cursor-pointer" title="Wastage percentage">i</span>
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={wastage}
              onChange={e => setWastage(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none bg-white text-blue-700"
              placeholder="Wastage"
              min="0"
              max="100"
              step="any"
            />
            <span className="text-blue-500 font-semibold pr-2">%</span>
          </div>
        </div>

        {/* Volume needed */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Volume needed
            <span className="text-gray-400 cursor-pointer" title="Total volume needed including wastage">i</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={volumeNeeded}
              onChange={e => setVolumeNeeded(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none bg-gray-50"
              placeholder="Volume needed"
              step="any"
              readOnly
            />
            <select
              value={volumeNeededUnit}
              onChange={e => handleVolumeNeededUnitChange(e.target.value)}
              className="px-2 py-2 border border-blue-200 rounded-md bg-white text-blue-700"
            >
              {volumeNeededUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weight needed */}
        <div>
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Weight needed
            <span className="text-gray-400 cursor-pointer" title="Total weight needed">i</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weightNeeded}
              onChange={e => setWeightNeeded(e.target.value)}
              className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:outline-none bg-gray-50"
              placeholder="Weight needed"
              step="any"
              readOnly
            />
            <select
              value={weightNeededUnit}
              onChange={e => handleWeightNeededUnitChange(e.target.value)}
              className="px-2 py-2 border border-blue-200 rounded-md bg-white text-blue-700"
            >
              {weightNeededUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Limestone cost section */}
      <div className="mt-10 mb-6 p-4 rounded-lg border bg-gray-50">
        <div className="font-semibold text-base mb-4">Limestone cost</div>
        {/* Price per one unit of weight */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Price per one unit of weight</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={pricePerWeight}
              onChange={e => setPricePerWeight(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="PKR"
              step="any"
            />
            <span className="text-gray-400 font-semibold px-2">/</span>
            <select
              value={pricePerWeightUnit}
              onChange={e => handlePricePerWeightUnitChange(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
            >
              {pricePerWeightUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Price per one unit of volume */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Price per one unit of volume</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={pricePerVolume}
              onChange={e => setPricePerVolume(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="PKR"
              step="any"
            />
            <span className="text-gray-400 font-semibold px-2">/</span>
            <select
              value={pricePerVolumeUnit}
              onChange={e => handlePricePerVolumeUnitChange(e.target.value)}
              className="px-2 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
            >
              {pricePerVolumeUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Total cost */}
        <div className="mb-2">
          <label className="block text-sm text-gray-700 mb-1">Total cost</label>
          <input
            type="number"
            value={totalCost}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            placeholder="PKR"
            readOnly
          />
        </div>
        {/* Clear all fields button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-Price per one unit of volume
gray-200 border border-gray-300"
          >
            Clear all fields
          </button>
        </div>
      </div>

      {/* Debug info - you can remove this */}
      <div className="mt-4 text-xs text-gray-500">
        Internal value (t/m³): {densityInTPerM3.toFixed(6)}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <LimestoneSpecCard />
      </div>
    </div>
  );
};

export default Page;