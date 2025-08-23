"use client";
import React, { useState } from "react";

// Perimeter units
const PERIMETER_UNIT_OPTIONS = [
  { label: "millimeters", short: "mm" },
  { label: "centimeters", short: "cm" },
  { label: "meters", short: "m" },
  { label: "inches", short: "in" },
  { label: "feet", short: "ft" }
];

// Thickness units
const THICKNESS_UNIT_OPTIONS = [
  { label: "millimeters", short: "mm" },
  { label: "centimeters", short: "cm" },
  { label: "meters", short: "m" },
  { label: "inches", short: "in" }
];

// Material options with corrected names
const MATERIAL_OPTIONS = [
  { label: "Al 7075-T6" },
  { label: "Al 6061-O" },
  { label: "Grey Cast Iron ASTM 40" },
  { label: "Brass UNS C28000" },
  { label: "Al 2024-T3" },
  { label: "Balsa Panel" },
  { label: "Stainless Steel 316" },
  { label: "Custom" }
];

// Shear strength units
const SHEAR_STRENGTH_UNIT_OPTIONS = [
  { label: "pascals", short: "Pa" },
  { label: "pounds per square inch", short: "psi" },
  { label: "kilopascals", short: "kPa" },
  { label: "megapascals", short: "MPa" },
  { label: "gigapascals", short: "GPa" }
];

// Punching force units
const FORCE_UNIT_OPTIONS = [
  { label: "newtons", short: "N" },
  { label: "kilonewtons", short: "kN" },
  { label: "meganewtons", short: "MN" },
  { label: "pounds-force", short: "lbf" },
  { label: "kilograms-force", short: "kgf" }
];

// --- Unit conversion factors ---
const PERIMETER_FACTORS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048
};

const THICKNESS_FACTORS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254
};

const SHEAR_STRENGTH_FACTORS: Record<string, number> = {
  Pa: 1,
  psi: 6894.757,
  kPa: 1000,
  MPa: 1_000_000,
  GPa: 1_000_000_000
};

const FORCE_FACTORS: Record<string, number> = {
  N: 1,
  kN: 1000,
  MN: 1_000_000,
  lbf: 4.4482216,
  kgf: 9.80665
};

// --- Material shear strength lookup (MPa) - STANDARD VALUES ---
const MATERIAL_SHEAR_STRENGTH: Record<string, number> = {
  "Al 7075-T6": 331,
  "Al 6061-O": 82.7,  // Correct value in MPa
  "Grey Cast Iron ASTM 40": 400,
  "Brass UNS C28000": 270,
  "Al 2024-T3": 283,
  "Balsa Panel": 2.98,  // Correct value in MPa
  "Stainless Steel 316": 400
  // "Custom" will be user input
};

// --- Conversion helpers ---
function convertPerimeterToMeters(value: number, unit: string) {
  return value * (PERIMETER_FACTORS[unit] ?? 1);
}
function convertThicknessToMeters(value: number, unit: string) {
  return value * (THICKNESS_FACTORS[unit] ?? 1);
}
function convertShearStrengthToPa(value: number, unit: string) {
  return value * (SHEAR_STRENGTH_FACTORS[unit] ?? 1);
}
function convertForceFromN(value: number, unit: string) {
  return value / (FORCE_FACTORS[unit] ?? 1);
}
function convertForceToN(value: number, unit: string) {
  return value * (FORCE_FACTORS[unit] ?? 1);
}

// --- Main Component ---
export default function PunchForceCalculator() {
  const [perimeter, setPerimeter] = useState("");
  const [perimeterUnit, setPerimeterUnit] = useState(PERIMETER_UNIT_OPTIONS[0].short);
  const [thickness, setThickness] = useState("");
  const [thicknessUnit, setThicknessUnit] = useState(THICKNESS_UNIT_OPTIONS[0].short);
  const [material, setMaterial] = useState(MATERIAL_OPTIONS[0].label);
  const [shearStrength, setShearStrength] = useState("");
  const [shearStrengthUnit, setShearStrengthUnit] = useState(SHEAR_STRENGTH_UNIT_OPTIONS[3].short); // Default to MPa
  const [punchingForce, setPunchingForce] = useState("");
  const [punchingForceUnit, setPunchingForceUnit] = useState(FORCE_UNIT_OPTIONS[0].short);

  // --- Auto-fill shear strength when material changes ---
  React.useEffect(() => {
    if (material !== "Custom" && MATERIAL_SHEAR_STRENGTH[material]) {
      // Material values are stored in MPa, convert to selected unit
      const valueMPa = MATERIAL_SHEAR_STRENGTH[material];
      
      // Convert from MPa to selected unit
      let valueInSelectedUnit;
      switch (shearStrengthUnit) {
        case "Pa":
          valueInSelectedUnit = valueMPa * 1_000_000;
          break;
        case "kPa":
          valueInSelectedUnit = valueMPa * 1_000;
          break;
        case "MPa":
          valueInSelectedUnit = valueMPa;
          break;
        case "GPa":
          valueInSelectedUnit = valueMPa / 1_000;
          break;
        case "psi":
          valueInSelectedUnit = valueMPa * 145.038; // 1 MPa = 145.038 psi
          break;
        default:
          valueInSelectedUnit = valueMPa;
      }
      
      setShearStrength(valueInSelectedUnit.toFixed(2));
    } else if (material === "Custom") {
      setShearStrength("");
    }
  }, [material, shearStrengthUnit]);

  // --- Shear strength unit conversion for its input field only ---
  const handleShearStrengthUnitChange = (newUnit: string) => {
    if (shearStrength && material !== "Custom") {
      const val = parseFloat(shearStrength);
      if (!isNaN(val)) {
        // Convert current value to Pa, then to new unit
        const valuePa = convertShearStrengthToPa(val, shearStrengthUnit);
        const newVal = valuePa / (SHEAR_STRENGTH_FACTORS[newUnit] ?? 1);
        setShearStrength(newVal.toFixed(2));
      }
    }
    setShearStrengthUnit(newUnit);
  };

  // --- Perimeter unit conversion for its input field only ---
  const handlePerimeterUnitChange = (newUnit: string) => {
    if (perimeter) {
      const val = parseFloat(perimeter);
      if (!isNaN(val)) {
        // Convert to meters, then to new unit
        const valueM = convertPerimeterToMeters(val, perimeterUnit);
        const newVal = valueM / (PERIMETER_FACTORS[newUnit] ?? 1);
        setPerimeter(newVal.toFixed(4));
      }
    }
    setPerimeterUnit(newUnit);
  };

  // --- Thickness unit conversion for its input field only ---
  const handleThicknessUnitChange = (newUnit: string) => {
    if (thickness) {
      const val = parseFloat(thickness);
      if (!isNaN(val)) {
        // Convert to meters, then to new unit
        const valueM = convertThicknessToMeters(val, thicknessUnit);
        const newVal = valueM / (THICKNESS_FACTORS[newUnit] ?? 1);
        setThickness(newVal.toFixed(4));
      }
    }
    setThicknessUnit(newUnit);
  };

  // --- Punching force unit conversion for its input field only ---
  const handlePunchingForceUnitChange = (newUnit: string) => {
    if (punchingForce) {
      const val = parseFloat(punchingForce);
      if (!isNaN(val)) {
        // Convert from current unit to N, then to new unit
        const valueN = convertForceToN(val, punchingForceUnit);
        const newVal = convertForceFromN(valueN, newUnit);
        setPunchingForce(newVal.toFixed(2));
      }
    }
    setPunchingForceUnit(newUnit);
  };

  // --- Calculate punching force automatically ---
  React.useEffect(() => {
    // Only calculate if all fields are filled and valid
    const p = parseFloat(perimeter);
    const t = parseFloat(thickness);
    const s = parseFloat(shearStrength);

    if (!isNaN(p) && !isNaN(t) && !isNaN(s) && p > 0 && t > 0 && s > 0) {
      // Convert all to SI units: perimeter (m), thickness (m), shear strength (Pa)
      const p_m = convertPerimeterToMeters(p, perimeterUnit);
      const t_m = convertThicknessToMeters(t, thicknessUnit);
      const s_Pa = convertShearStrengthToPa(s, shearStrengthUnit);

      // F = P × S × t (Punch Force Formula)
      let forceN = p_m * s_Pa * t_m;

      // Convert to selected output unit
      const forceDisplay = convertForceFromN(forceN, punchingForceUnit);

      setPunchingForce(forceDisplay.toFixed(2));
    } else {
      setPunchingForce("");
    }
  }, [perimeter, perimeterUnit, thickness, thicknessUnit, shearStrength, shearStrengthUnit, punchingForceUnit]);

  // --- Clear fields ---
  const clearFields = () => {
    setPerimeter("");
    setPerimeterUnit(PERIMETER_UNIT_OPTIONS[0].short);
    setThickness("");
    setThicknessUnit(THICKNESS_UNIT_OPTIONS[0].short);
    setMaterial(MATERIAL_OPTIONS[0].label);
    setShearStrength("");
    setShearStrengthUnit(SHEAR_STRENGTH_UNIT_OPTIONS[3].short); // Reset to MPa
    setPunchingForce("");
    setPunchingForceUnit(FORCE_UNIT_OPTIONS[0].short);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Punch Force Calculator</h1>
          <p className="text-gray-600 text-sm">F = P × S × t</p>
        </div>

        {/* Formula Explanation */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-gray-700">
            <strong>Formula:</strong> Punching Force = Perimeter × Shear Strength × Thickness
          </p>
        </div>

        {/* Perimeter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Perimeter (P) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center relative">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50"
              type="number"
              placeholder="Enter perimeter"
              value={perimeter}
              onChange={e => setPerimeter(e.target.value)}
            />
            <select
              className="absolute right-2 bg-transparent text-gray-600 focus:outline-none cursor-pointer"
              value={perimeterUnit}
              onChange={e => handlePerimeterUnitChange(e.target.value)}
            >
              {PERIMETER_UNIT_OPTIONS.map(unit => (
                <option key={unit.short} value={unit.short}>{unit.short}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Thickness */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Thickness (t) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center relative">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50"
              type="number"
              placeholder="Enter thickness"
              value={thickness}
              onChange={e => setThickness(e.target.value)}
            />
            <select
              className="absolute right-2 bg-transparent text-gray-600 focus:outline-none cursor-pointer"
              value={thicknessUnit}
              onChange={e => handleThicknessUnitChange(e.target.value)}
            >
              {THICKNESS_UNIT_OPTIONS.map(unit => (
                <option key={unit.short} value={unit.short}>{unit.short}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Material */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Material <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50"
              value={material}
              onChange={e => setMaterial(e.target.value)}
            >
              {MATERIAL_OPTIONS.map(mat => (
                <option key={mat.label} value={mat.label}>{mat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shear Strength */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Shear Strength (S) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center relative">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50"
              type="number"
              placeholder="Enter shear strength"
              value={shearStrength}
              onChange={e => setShearStrength(e.target.value)}
              disabled={material !== "Custom"}
            />
            <select
              className="absolute right-2 bg-transparent text-gray-600 focus:outline-none cursor-pointer"
              value={shearStrengthUnit}
              onChange={e => handleShearStrengthUnitChange(e.target.value)}
            >
              {SHEAR_STRENGTH_UNIT_OPTIONS.map(unit => (
                <option key={unit.short} value={unit.short}>{unit.short}</option>
              ))}
            </select>
          </div>
          {material !== "Custom" && (
            <p className="text-xs text-gray-500 mt-1">
              Auto-filled based on selected material
            </p>
          )}
        </div>

        {/* Punching Force */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Punching Force (F)
          </label>
          <div className="flex items-center relative">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 pr-20 focus:outline-none text-gray-700 bg-green-50 font-bold text-lg"
              type="text"
              value={punchingForce}
              readOnly
              placeholder="Result will appear here"
            />
            <select
              className="absolute right-2 bg-transparent text-gray-600 focus:outline-none cursor-pointer"
              value={punchingForceUnit}
              onChange={e => handlePunchingForceUnitChange(e.target.value)}
            >
              {FORCE_UNIT_OPTIONS.map(unit => (
                <option key={unit.short} value={unit.short}>{unit.short}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Button */}
        <button
          className="w-full py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors duration-200"
          onClick={clearFields}
        >
          Clear All Fields
        </button>
      </div>
    </div>
  );
}