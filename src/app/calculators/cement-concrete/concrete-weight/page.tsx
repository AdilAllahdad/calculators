"use client";
import React, { useState, useEffect } from "react";

// Dropdown options as shown in your images
const CONCRETE_TYPES = [
  { label: "Select", value: "" },
  { label: "Asphalt", value: "Asphalt" },
  { label: "Gravel", value: "Gravel" },
  { label: "Limestone with Portland", value: "Limestone with Portland" },
  { label: "Portland", value: "Portland" },
  { label: "Reinforced", value: "Reinforced" }
];

const VOLUME_UNITS = [
  { label: "cubic meters (m³)", symbol: "m³" },
  { label: "cubic feet (cu ft)", symbol: "cu ft" },
  { label: "cubic yards (cu yd)", symbol: "cu yd" }
];

const DENSITY_UNITS = [
  { label: "kilograms per cubic meter (kg/m³)", symbol: "kg/m³" },
  { label: "pounds per cubic feet (lb/cu ft)", symbol: "lb/cu ft" },
  { label: "pounds per cubic yard (lb/cu yd)", symbol: "lb/cu yd" }
];

const WEIGHT_UNITS = [
  { label: "kilograms (kg)", symbol: "kg" },
  { label: "metric tons (t)", symbol: "t" },
  { label: "pounds (lb)", symbol: "lb" },
  { label: "stones (st)", symbol: "st" },
  { label: "US short tons (US ton)", symbol: "US ton" },
  { label: "imperial tons (long ton)", symbol: "long ton" }
];

// Add types for density keys and concrete types
type DensityUnitKey = 'lb/cu ft' | 'kg/m³' | 'lb/cu yd';
type ConcreteTypeKey = keyof typeof STANDARD_DENSITIES;

// Standard densities based on the reference data
const STANDARD_DENSITIES: Record<string, Record<DensityUnitKey, number>> = {
  Asphalt: { 'lb/cu ft': 140.03, 'kg/m³': 2243, 'lb/cu yd': 3781 },
  Gravel: { 'lb/cu ft': 150.01, 'kg/m³': 2404, 'lb/cu yd': 4050 },
  "Limestone with Portland": { 'lb/cu ft': 148.02, 'kg/m³': 2371, 'lb/cu yd': 3996 },
  Portland: { 'lb/cu ft': 143.58, 'kg/m³': 2300, 'lb/cu yd': 3877 },
  Reinforced: { 'lb/cu ft': 156.07, 'kg/m³': 2500, 'lb/cu yd': 4214 }
};

// Conversion helpers
const volumeToM3 = (value: number, unit: string): number => {
  switch (unit) {
    case "m³": return value;
    case "cu ft": return value * 0.0283168;
    case "cu yd": return value * 0.764555;
    default: return value;
  }
};

const m3ToVolume = (value: number, unit: string): number => {
  switch (unit) {
    case "m³": return value;
    case "cu ft": return value / 0.0283168;
    case "cu yd": return value / 0.764555;
    default: return value;
  }
};

const densityToKgM3 = (value: number, unit: string): number => {
  switch (unit) {
    case "kg/m³": return value;
    case "lb/cu ft": return value * 16.0185;
    case "lb/cu yd": return value * 0.593276;
    default: return value;
  }
};

const kgM3ToDensity = (value: number, unit: string): number => {
  switch (unit) {
    case "kg/m³": return value;
    case "lb/cu ft": return value / 16.0185;
    case "lb/cu yd": return value / 0.593276;
    default: return value;
  }
};

const kgToWeight = (value: number, unit: string): number => {
  switch (unit) {
    case "kg": return value;
    case "t": return value / 1000;
    case "lb": return value * 2.20462;
    case "st": return value * 0.157473;
    case "US ton": return value / 907.185;
    case "long ton": return value / 1016.05;
    default: return value;
  }
};

const weightToKg = (value: number, unit: string): number => {
  switch (unit) {
    case "kg": return value;
    case "t": return value * 1000;
    case "lb": return value / 2.20462;
    case "st": return value / 0.157473;
    case "US ton": return value * 907.185;
    case "long ton": return value * 1016.05;
    default: return value;
  }
};

export default function ConcreteCalculator() {
  // State for each field
  const [type, setType] = useState<string>("Asphalt");
  const [volume, setVolume] = useState<string>("");
  const [volumeUnit, setVolumeUnit] = useState<string>("cu yd");
  const [density, setDensity] = useState<string>("140.03");
  const [densityUnit, setDensityUnit] = useState<string>("lb/cu ft");
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("kg");

  // Track which field was last modified for calculation priority
  const [lastModified, setLastModified] = useState<'volume' | 'weight' | null>(null);

  // Calculate weight when volume or density changes
  const calculateWeight = () => {
    const volumeVal = parseFloat(volume);
    const densityVal = parseFloat(density);
    
    if (!isNaN(volumeVal) && !isNaN(densityVal) && volumeVal > 0 && densityVal > 0) {
      // Convert volume and density to SI units
      const volumeInM3 = volumeToM3(volumeVal, volumeUnit);
      const densityInKgM3 = densityToKgM3(densityVal, densityUnit);
      
      // Calculate weight in kg
      const weightInKg = volumeInM3 * densityInKgM3;
      
      // Convert to desired unit and update
      const weightInUnit = kgToWeight(weightInKg, weightUnit);
      setWeight(weightInUnit.toFixed(2));
    }
  };

  // Calculate volume when weight and density are known
  const calculateVolume = () => {
    const weightVal = parseFloat(weight);
    const densityVal = parseFloat(density);
    
    if (!isNaN(weightVal) && !isNaN(densityVal) && weightVal > 0 && densityVal > 0) {
      // Convert weight and density to SI units
      const weightInKg = weightToKg(weightVal, weightUnit);
      const densityInKgM3 = densityToKgM3(densityVal, densityUnit);
      
      // Calculate volume in m³
      const volumeInM3 = weightInKg / densityInKgM3;
      
      // Convert to desired unit and update
      const volumeInUnit = m3ToVolume(volumeInM3, volumeUnit);
      setVolume(volumeInUnit.toFixed(2));
    }
  };

  // Effect to perform calculations based on what was last modified
  useEffect(() => {
    if (lastModified === 'volume') {
      calculateWeight();
    } else if (lastModified === 'weight') {
      calculateVolume();
    }
  }, [volume, density, weight, volumeUnit, densityUnit, weightUnit, lastModified]);

  // Initialize with default values
  useEffect(() => {
    if (type && STANDARD_DENSITIES[type]) {
      const newDensity = STANDARD_DENSITIES[type][densityUnit as DensityUnitKey];
      setDensity(newDensity.toString());
    }
  }, []);

  // Volume input and dropdown handlers
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(e.target.value);
    setLastModified('volume');
  };

  const handleVolumeUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const volumeVal = parseFloat(volume);
    
    if (!isNaN(volumeVal)) {
      // Convert current volume to new unit
      const volumeInM3 = volumeToM3(volumeVal, volumeUnit);
      const volumeInNewUnit = m3ToVolume(volumeInM3, newUnit);
      setVolume(volumeInNewUnit.toFixed(2));
    }
    
    setVolumeUnit(newUnit);
    setLastModified('volume');
  };

  // Density input and dropdown handlers
  const handleDensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDensity(e.target.value);
    // Trigger recalculation based on last modified field
    if (lastModified === 'volume') {
      setLastModified('volume');
    } else if (lastModified === 'weight') {
      setLastModified('weight');
    }
  };

  const handleDensityUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const densityVal = parseFloat(density);
    
    if (!isNaN(densityVal)) {
      // Convert current density to new unit
      const densityInKgM3 = densityToKgM3(densityVal, densityUnit);
      const densityInNewUnit = kgM3ToDensity(densityInKgM3, newUnit);
      setDensity(densityInNewUnit.toFixed(2));
    }
    
    setDensityUnit(newUnit);
  };

  // Weight input and dropdown handlers
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    setLastModified('weight');
  };

  const handleWeightUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    const weightVal = parseFloat(weight);
    
    if (!isNaN(weightVal)) {
      // Convert current weight to new unit
      const weightInKg = weightToKg(weightVal, weightUnit);
      const weightInNewUnit = kgToWeight(weightInKg, newUnit);
      setWeight(weightInNewUnit.toFixed(2));
    }
    
    setWeightUnit(newUnit);
    setLastModified('weight');
  };

  // When type changes, update density field
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setType(selected);
    
    if (STANDARD_DENSITIES[selected]) {
      const newDensity = STANDARD_DENSITIES[selected][densityUnit as DensityUnitKey];
      setDensity(newDensity.toString());
      
      // Recalculate based on last modified field
      if (lastModified === 'volume') {
        setLastModified('volume');
      } else if (lastModified === 'weight') {
        setLastModified('weight');
      }
    } else {
      setDensity("");
    }
  };

  // Clear all fields
  const handleClear = () => {
    setType("");
    setVolume("");
    setVolumeUnit("cu yd");
    setDensity("");
    setDensityUnit("lb/cu ft");
    setWeight("");
    setWeightUnit("kg");
    setLastModified(null);
  };

  return (
    <div className="bg-[#f6f8ff] rounded-2xl w-[340px] mx-auto mt-10 p-6 shadow-md">
      {/* Heading */}
      <h2 className="font-bold text-[22px] mb-5 text-center text-[#223]">
        Concrete Weight Calculator
      </h2>
      {/* Concrete Type */}
      <label className="font-semibold text-[16px]">Concrete type</label>
      <select
        value={type}
        onChange={handleTypeChange}
        className="my-2 mb-4 w-full px-2 py-2 font-mono font-semibold rounded-lg border border-[#b5c1e4] focus:outline-none"
      >
        {CONCRETE_TYPES.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Volume */}
      <label className="font-semibold text-[16px]">Volume</label>
      <div className="flex my-2 mb-4">
        <input
          type="number"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 min-w-0 max-w-none w-[60%] px-2 py-2 rounded-l-lg border border-[#b5c1e4] border-r-0 box-border"
          placeholder=" "
          step="any"
        />
        <select
          value={volumeUnit}
          onChange={handleVolumeUnitChange}
          className="w-[40%] min-w-0 max-w-none px-2 py-2 rounded-r-lg border border-[#b5c1e4] bg-white font-medium box-border"
        >
          {VOLUME_UNITS.map((u) => (
            <option key={u.symbol} value={u.symbol}>
              {u.symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Density */}
      <label className="font-semibold text-[16px]">Density</label>
      <div className="flex my-2 mb-4">
        <input
          type="number"
          value={density}
          onChange={handleDensityChange}
          className="flex-1 min-w-0 max-w-none w-[60%] px-2 py-2 rounded-l-lg border border-[#b5c1e4] border-r-0 box-border bg-[#f1f4fc] text-[#225] font-semibold"
          placeholder=" "
          step="any"
        />
        <select
          value={densityUnit}
          onChange={handleDensityUnitChange}
          className="w-[40%] min-w-0 max-w-none px-2 py-2 rounded-r-lg border border-[#b5c1e4] bg-white font-medium box-border"
        >
          {DENSITY_UNITS.map((u) => (
            <option key={u.symbol} value={u.symbol}>
              {u.symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Weight */}
      <label className="font-semibold text-[16px]">Weight</label>
      <div className="flex my-2 mb-4">
        <input
          type="number"
          value={weight}
          onChange={handleWeightChange}
          className="flex-1 min-w-0 max-w-none w-[60%] px-2 py-2 rounded-l-lg border border-[#b5c1e4] border-r-0 box-border"
          placeholder=" "
          step="any"
        />
        <select
          value={weightUnit}
          onChange={handleWeightUnitChange}
          className="w-[40%] min-w-0 max-w-none px-2 py-2 rounded-r-lg border border-[#b5c1e4] bg-white font-medium box-border"
        >
          {WEIGHT_UNITS.map((u) => (
            <option key={u.symbol} value={u.symbol}>{u.symbol}</option>
          ))}
        </select>
      </div>

      {/* Clear Button */}
      <button
        onClick={handleClear}
        className="w-full py-2 bg-[#f3f7ff] text-[#225] border border-[#b5c1e4] rounded-lg font-semibold text-[16px] cursor-pointer mt-2"
        type="button"
      >
        Clear
      </button>
    </div>
  );
}