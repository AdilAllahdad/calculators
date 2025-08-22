"use client";
import React, { useState, useEffect } from "react";

// --- Constants for units ---
const LENGTH_UNIT_OPTIONS = [
  { label: "millimeters", short: "mm" },
  { label: "centimeters", short: "cm" },
  { label: "meters", short: "m" },
  { label: "inches", short: "in" },
  { label: "feet", short: "ft" },
  { label: "yards", short: "yd" }
];

const AREA_UNIT_OPTIONS = [
  { label: "square millimeters", short: "mm²" },
  { label: "square centimeters", short: "cm²" },
  { label: "square meters", short: "m²" },
  { label: "square inches", short: "in²" },
  { label: "square feet", short: "ft²" },
  { label: "square yards", short: "yd²" }
];

// Use standard unit values for AREA_UNIT_OPTIONS2 for conversion
const AREA_UNIT_OPTIONS2 = [
  { label: "square millimeters", short: "mm²", value: "mm²" },
  { label: "square centimeters", short: "cm²", value: "cm²" },
  { label: "square meters", short: "m²", value: "m²" },
  { label: "square inches", short: "in²", value: "in²" },
  { label: "square feet", short: "ft²", value: "ft²" },
  { label: "square yards", short: "yd²", value: "yd²" }
];





// Conversion factors for length and area
const LENGTH_FACTORS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144
};

const AREA_FACTORS: Record<string, number> = {
  "mm²": 0.000001,
  "cm²": 0.0001,
  "m²": 1,
  "in²": 0.00064516,
  "ft²": 0.09290304,
  "yd²": 0.83612736
};

// Conversion helpers for new units
const convertLengthStd = (value: number, from: string, to: string) => {
  if (isNaN(value)) return 0;
  const meters = value * (LENGTH_FACTORS[from] ?? 1);
  return meters / (LENGTH_FACTORS[to] ?? 1);
};

const convertAreaStd = (value: number, from: string, to: string) => {
  if (isNaN(value)) return 0;
  const m2 = value * (AREA_FACTORS[from] ?? 1);
  return m2 / (AREA_FACTORS[to] ?? 1);
};

const ANGLE_UNITS = [
  { label: "deg", value: "deg" },
  { label: "rad", value: "rad" }
];

const CURRENCY_UNITS = [
  { label: "PKR", value: "PKR" },

];

// --- Main Component ---
const RoofPitchCalculator: React.FC = () => {
  // House dimensions states
  const [houseLength, setHouseLength] = useState<string>("");
  const [lengthUnit, setLengthUnit] = useState<string>("mm");
  const [houseWidth, setHouseWidth] = useState<string>("");
  const [widthUnit, setWidthUnit] = useState<string>("mm");
  const [houseBaseArea, setHouseBaseArea] = useState<string>("");
  const [baseAreaUnit, setBaseAreaUnit] = useState<string>("mm²");

  // Pitch states - track which field was last modified to prevent infinite loops
  const [roofPitch, setRoofPitch] = useState<string>("");
  const [roofPitchUnit, setRoofPitchUnit] = useState<string>("deg");
  const [roofPitchPercent, setRoofPitchPercent] = useState<string>("");
  const [roofPitchX12, setRoofPitchX12] = useState<string>("");
  const [lastModifiedPitch, setLastModifiedPitch] = useState<string>("");

  // Roof area states - separate display and calculation values
  const [roofAreaDisplay, setRoofAreaDisplay] = useState<string>("");
  const [roofAreaDisplayUnit, setRoofAreaDisplayUnit] = useState<string>("mm²");
  const [roofAreaInM2, setRoofAreaInM2] = useState<number>(0); // For calculations
  const [isRoofAreaCalculated, setIsRoofAreaCalculated] = useState<boolean>(false); // Track if auto-calculated
  
  // Unit price states - separate display and calculation values
  const [unitPriceDisplay, setUnitPriceDisplay] = useState<string>("");
  const [unitPriceCurrency, setUnitPriceCurrency] = useState<string>("PKR");
  const [unitPriceDisplayUnit, setUnitPriceDisplayUnit] = useState<string>("mm²");
  const [unitPricePerM2, setUnitPricePerM2] = useState<number>(0); // For calculations
  
  const [totalCost, setTotalCost] = useState<string>("");

  // Update roofAreaInM2 when display value changes (not when unit changes)
  const updateRoofAreaForCalculation = (displayValue: string, displayUnit: string) => {
    if (displayValue) {
      const val = parseFloat(displayValue);
      if (!isNaN(val)) {
        const valueInM2 = val * (AREA_FACTORS[displayUnit] ?? 1);
        setRoofAreaInM2(valueInM2);
      } else {
        setRoofAreaInM2(0);
      }
    } else {
      setRoofAreaInM2(0);
    }
  };

  // Update unitPricePerM2 when display value changes (not when unit changes)
  const updateUnitPriceForCalculation = (displayValue: string, displayUnit: string) => {
    if (displayValue) {
      const val = parseFloat(displayValue);
      if (!isNaN(val)) {
        // Convert price to price per m² for calculations
        const factor = AREA_FACTORS[displayUnit] ?? 1;
        const valuePerM2 = val / factor;
        setUnitPricePerM2(valuePerM2);
      } else {
        setUnitPricePerM2(0);
      }
    } else {
      setUnitPricePerM2(0);
    }
  };

  // House length input and dropdown independent
  const handleHouseLengthUnitChange = (newUnit: string) => {
    if (houseLength) {
      const val = parseFloat(houseLength);
      if (!isNaN(val)) {
        const newVal = convertLengthStd(val, lengthUnit, newUnit);
        setHouseLength(newVal.toString());
      }
    }
    setLengthUnit(newUnit);
  };

  // House width input and dropdown independent
  const handleHouseWidthUnitChange = (newUnit: string) => {
    if (houseWidth) {
      const val = parseFloat(houseWidth);
      if (!isNaN(val)) {
        const newVal = convertLengthStd(val, widthUnit, newUnit);
        setHouseWidth(newVal.toString());
      }
    }
    setWidthUnit(newUnit);
  };

  // House base area input and dropdown independent
  const handleBaseAreaUnitChange = (newUnit: string) => {
    if (houseBaseArea) {
      const val = parseFloat(houseBaseArea);
      if (!isNaN(val)) {
        const newVal = convertAreaStd(val, baseAreaUnit, newUnit);
        setHouseBaseArea(newVal.toString());
      }
    }
    setBaseAreaUnit(newUnit);
  };

  // Roof area display unit change - only converts display value, doesn't affect calculation
  const handleRoofAreaDisplayUnitChange = (newUnit: string) => {
    if (roofAreaDisplay) {
      const val = parseFloat(roofAreaDisplay);
      if (!isNaN(val)) {
        const newVal = convertAreaStd(val, roofAreaDisplayUnit, newUnit);
        setRoofAreaDisplay(newVal.toFixed(2));
      }
    }
    setRoofAreaDisplayUnit(newUnit);
    // Don't update calculation values - they stay the same
  };

  // Unit price display unit change - only converts display value, doesn't affect calculation
  const handleUnitPriceDisplayUnitChange = (newUnit: string) => {
    if (unitPriceDisplay) {
      const val = parseFloat(unitPriceDisplay);
      if (!isNaN(val)) {
        // Convert the current value from the old unit to the new unit for display only
        // pricePerOldUnit * (oldUnit in m²) / (newUnit in m²)
        const oldFactor = AREA_FACTORS[unitPriceDisplayUnit] ?? 1;
        const newFactor = AREA_FACTORS[newUnit] ?? 1;
        // To convert price per old unit to price per new unit:
        // pricePerOldUnit * (newFactor / oldFactor)
        const newVal = val * (newFactor / oldFactor);
        setUnitPriceDisplay(newVal.toFixed(2));
      }
    }
    setUnitPriceDisplayUnit(newUnit);
    // Don't update calculation values - they stay the same
  };

  // Roof pitch unit change - converts between deg and rad
  const handleRoofPitchUnitChange = (newUnit: string) => {
    if (roofPitch) {
      const val = parseFloat(roofPitch);
      if (!isNaN(val)) {
        let newVal = val;
        if (roofPitchUnit === "deg" && newUnit === "rad") {
          newVal = val * Math.PI / 180;
        } else if (roofPitchUnit === "rad" && newUnit === "deg") {
          newVal = val * 180 / Math.PI;
        }
        setRoofPitch(newVal.toString());
      }
    }
    setRoofPitchUnit(newUnit);
  };

  // Handle roof pitch input changes with validation
  const handleRoofPitchChange = (value: string) => {
    if (value && !validatePositiveNumber(value, "Roof pitch")) {
      return;
    }
    setRoofPitch(value);
    setLastModifiedPitch("pitch");
  };

  const handleRoofPitchPercentChange = (value: string) => {
    if (value && !validatePositiveNumber(value, "Roof pitch percentage")) {
      return;
    }
    setRoofPitchPercent(value);
    setLastModifiedPitch("percent");
  };

  const handleRoofPitchX12Change = (value: string) => {
    if (value && !validatePositiveNumber(value, "Roof pitch ratio")) {
      return;
    }
    setRoofPitchX12(value);
    setLastModifiedPitch("x12");
  };

  // Validation helper
  const validatePositiveNumber = (value: string, fieldName: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num <= 0) {
      alert(`${fieldName} must be greater than 0`);
      return false;
    }
    return true;
  };

  // Handle roof area input changes - updates both display and calculation values
  const handleRoofAreaDisplayChange = (value: string) => {
    if (value && !validatePositiveNumber(value, "Roof area")) {
      return;
    }
    setRoofAreaDisplay(value);
    setIsRoofAreaCalculated(false); // Mark as manually entered
    updateRoofAreaForCalculation(value, roofAreaDisplayUnit);
  };

  // Handle unit price input changes - updates both display and calculation values
  const handleUnitPriceDisplayChange = (value: string) => {
    if (value && !validatePositiveNumber(value, "Unit price")) {
      return;
    }
    setUnitPriceDisplay(value);
    updateUnitPriceForCalculation(value, unitPriceDisplayUnit);
  };

  // --- Clear all fields ---
  const handleClear = () => {
    setHouseLength("");
    setLengthUnit("mm");
    setHouseWidth("");
    setWidthUnit("mm");
    setHouseBaseArea("");
    setBaseAreaUnit("mm²");
    setRoofPitch("");
    setRoofPitchUnit("deg");
    setRoofPitchPercent("");
    setRoofPitchX12("");
    setLastModifiedPitch("");
    setRoofAreaDisplay("");
    setRoofAreaDisplayUnit("mm²");
    setIsRoofAreaCalculated(false);
    setUnitPriceDisplay("");
    setUnitPriceCurrency("PKR");
    setUnitPriceDisplayUnit("mm²");
    setTotalCost("");
    setRoofAreaInM2(0);
    setUnitPricePerM2(0);
  };

  // --- Area calculation ---
  useEffect(() => {
    // Calculate house base area if both length and width provided
    const l = parseFloat(houseLength);
    const w = parseFloat(houseWidth);
    if (!isNaN(l) && !isNaN(w)) {
      // Convert both to meters for area calculation, then to selected area unit
      const lInM = convertLengthStd(l, lengthUnit, "m");
      const wInM = convertLengthStd(w, widthUnit, "m");
      const areaM2 = lInM * wInM;
      // Convert area to selected area unit
      const areaInSelected = convertAreaStd(areaM2, "m²", baseAreaUnit);
      setHouseBaseArea(areaInSelected ? areaInSelected.toFixed(2) : "");
    } else {
      setHouseBaseArea("");
    }
  }, [houseLength, lengthUnit, houseWidth, widthUnit, baseAreaUnit]);

  // --- Roof pitch conversions using correct formulas ---
  useEffect(() => {
    if (lastModifiedPitch === "pitch" && roofPitch !== "") {
      const val = parseFloat(roofPitch);
      if (!isNaN(val) && val > 0) {
        let degValue = val;
        if (roofPitchUnit === "rad") {
          degValue = val * 180 / Math.PI;
        }
        
        // Convert degrees to percentage: pitch(%) = tan(pitch_deg) * 100
        const pitchPercent = Math.tan(degValue * Math.PI / 180) * 100;
        setRoofPitchPercent(pitchPercent.toFixed(2));
        
        // Convert degrees to x:12 ratio: pitch(x:12) = tan(pitch_deg) * 12
        const pitchX12 = Math.tan(degValue * Math.PI / 180) * 12;
        setRoofPitchX12(pitchX12.toFixed(2));
      }
    } else if (lastModifiedPitch === "percent" && roofPitchPercent !== "") {
      const percent = parseFloat(roofPitchPercent);
      if (!isNaN(percent) && percent > 0) {
        // Convert percentage to degrees: pitch(deg) = arctan(pitch% / 100)
        const degValue = Math.atan(percent / 100) * (180 / Math.PI);
        let pitchValue = degValue;
        if (roofPitchUnit === "rad") {
          pitchValue = degValue * Math.PI / 180;
        }
        setRoofPitch(pitchValue.toFixed(2));
        
        // Convert percentage to x:12: x = pitch% / 100 * 12
        const pitchX12 = (percent / 100) * 12;
        setRoofPitchX12(pitchX12.toFixed(2));
      }
    } else if (lastModifiedPitch === "x12" && roofPitchX12 !== "") {
      const run12 = parseFloat(roofPitchX12);
      if (!isNaN(run12) && run12 > 0) {
        // Convert x:12 to degrees: pitch(deg) = arctan(x / 12)
        const degValue = Math.atan(run12 / 12) * (180 / Math.PI);
        let pitchValue = degValue;
        if (roofPitchUnit === "rad") {
          pitchValue = degValue * Math.PI / 180;
        }
        setRoofPitch(pitchValue.toFixed(2));
        
        // Convert x:12 to percentage: pitch(%) = x / 12 * 100
        const pitchPercent = (run12 / 12) * 100;
        setRoofPitchPercent(pitchPercent.toFixed(2));
      }
    }
  }, [roofPitch, roofPitchPercent, roofPitchX12, roofPitchUnit, lastModifiedPitch]);

  // --- Calculate roof area based on house base area and roof pitch using CORRECT formula ---
  useEffect(() => {
    // Only auto-calculate if houseBaseArea and any roof pitch value is present
    const baseArea = parseFloat(houseBaseArea);
    let pitchDegrees = NaN;

    if (roofPitch) {
      let val = parseFloat(roofPitch);
      if (!isNaN(val)) {
        pitchDegrees = roofPitchUnit === "rad" ? val * 180 / Math.PI : val;
      }
    } else if (roofPitchPercent) {
      let percent = parseFloat(roofPitchPercent);
      if (!isNaN(percent)) {
        pitchDegrees = Math.atan(percent / 100) * (180 / Math.PI);
      }
    } else if (roofPitchX12) {
      let run12 = parseFloat(roofPitchX12);
      if (!isNaN(run12)) {
        pitchDegrees = Math.atan(run12 / 12) * (180 / Math.PI);
      }
    }

    if (
      !isNaN(baseArea) &&
      baseArea > 0 &&
      !isNaN(pitchDegrees)
    ) {
      // CORRECT formula: roof area = base area / cos[pitch(deg)]
      const pitchRadians = pitchDegrees * Math.PI / 180;
      const cosineValue = Math.cos(pitchRadians);

      if (cosineValue !== 0) {
        // Always convert base area to m² for calculation, then convert result to display unit
        const baseAreaM2 = baseArea * (AREA_FACTORS[baseAreaUnit] ?? 1);
        const roofAreaM2 = baseAreaM2 / cosineValue;
        const roofAreaInDisplayUnit = roofAreaM2 / (AREA_FACTORS[roofAreaDisplayUnit] ?? 1);

        setRoofAreaDisplay(roofAreaInDisplayUnit.toFixed(2));
        setRoofAreaInM2(roofAreaM2);
        setIsRoofAreaCalculated(true);
      }
    }
    // If any field is missing or invalid, do not auto-calculate
  }, [
    houseBaseArea,
    baseAreaUnit,
    roofPitch,
    roofPitchPercent,
    roofPitchX12,
    roofPitchUnit,
    roofAreaDisplayUnit
  ]);

  // --- Roof cost calculation (use stored m² values for accurate calculations) ---
  useEffect(() => {
    if (roofAreaInM2 > 0 && unitPricePerM2 > 0) {
      // Use the stored m² values for accurate calculations
      const cost = roofAreaInM2 * unitPricePerM2;
      setTotalCost(cost.toFixed(2));
    } else {
      setTotalCost("");
    }
  }, [roofAreaInM2, unitPricePerM2]);

  // --- UI ---
  return (
    <div className="max-w-md mx-auto mt-10 p-2">
      <h1 className="text-2xl font-bold mb-8 text-center">Roofing calculator</h1>

      {/* House dimensions */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-5">
        <div className="font-semibold text-base mb-3 text-indigo-700 flex items-center gap-2">
          <span>House dimensions</span>
        </div>
        <label className="block font-medium mb-1">House length</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={houseLength}
            onChange={e => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              if (value && !validatePositiveNumber(value, "House length")) {
                return;
              }
              setHouseLength(value);
            }}
            inputMode="numeric"
            placeholder=""
          />
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={lengthUnit}
            onChange={e => handleHouseLengthUnitChange(e.target.value)}
          >
            {LENGTH_UNIT_OPTIONS.map(u => (
              <option key={u.short} value={u.short}>{u.label}</option>
            ))}
          </select>
        </div>

        <label className="block font-medium mb-1">House width</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={houseWidth}
            onChange={e => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              if (value && !validatePositiveNumber(value, "House width")) {
                return;
              }
              setHouseWidth(value);
            }}
            inputMode="numeric"
            placeholder=""
          />
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={widthUnit}
            onChange={e => handleHouseWidthUnitChange(e.target.value)}
          >
            {LENGTH_UNIT_OPTIONS.map(u => (
              <option key={u.short} value={u.short}>{u.label}</option>
            ))}
          </select>
        </div>

        <label className="block font-medium mb-1">House base area</label>
        <div className="flex items-center gap-2">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50"
            value={houseBaseArea}
            readOnly
            placeholder=""
          />
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={baseAreaUnit}
            onChange={e => handleBaseAreaUnitChange(e.target.value)}
          >
            {AREA_UNIT_OPTIONS.map(u => (
              <option key={u.short} value={u.short}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roof pitch */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-5">
        <div className="font-semibold text-base mb-2 text-indigo-700 flex items-center gap-2">
          <span>Roof pitch</span>
        </div>
        <div className="text-gray-500 text-sm mb-3">
          Enter any single value to calculate the others.
        </div>
        <label className="block font-medium mb-1">Roof pitch</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={roofPitch}
            onChange={e => handleRoofPitchChange(e.target.value.replace(/[^0-9.-]/g, ""))}
            inputMode="numeric"
            placeholder=""
          />
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={roofPitchUnit}
            onChange={e => handleRoofPitchUnitChange(e.target.value)}
          >
            {ANGLE_UNITS.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        <label className="block font-medium mb-1">Roof pitch (%)</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={roofPitchPercent}
            onChange={e => handleRoofPitchPercentChange(e.target.value.replace(/[^0-9.-]/g, ""))}
            inputMode="numeric"
            placeholder=""
          />
          <span className="text-gray-400 text-lg">%</span>
        </div>

        <label className="block font-medium mb-1">Roof pitch (x:12)</label>
        <div className="flex items-center gap-2">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={roofPitchX12}
            onChange={e => handleRoofPitchX12Change(e.target.value.replace(/[^0-9.-]/g, ""))}
            inputMode="numeric"
            placeholder=""
          />
          <span className="text-gray-400 text-lg">:12</span>
        </div>
      </div>

      {/* Roof cost */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-0">
        <div className="font-semibold text-base mb-2 text-indigo-700 flex items-center gap-2">
          <span>Roof cost</span>
        </div>
        <label className="block font-medium mb-1">Roof area</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={roofAreaDisplay}
            onChange={e => handleRoofAreaDisplayChange(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="numeric"
            placeholder=""
          />
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={roofAreaDisplayUnit}
            onChange={e => handleRoofAreaDisplayUnitChange(e.target.value)}
          >
            {AREA_UNIT_OPTIONS.map(u => (
              <option key={u.short} value={u.short}>{u.label}</option>
            ))}
          </select>
        </div>

        <label className="block font-medium mb-1">Unit price</label>
        <div className="flex items-center gap-2 mb-4">
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={unitPriceCurrency}
            onChange={e => setUnitPriceCurrency(e.target.value)}
          >
            {CURRENCY_UNITS.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={unitPriceDisplay}
            onChange={e => handleUnitPriceDisplayChange(e.target.value.replace(/[^0-9.]/g, ""))}
            inputMode="numeric"
            placeholder=""
          />
          <span className="text-gray-400 text-base">/</span>
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={unitPriceDisplayUnit}
            onChange={e => handleUnitPriceDisplayUnitChange(e.target.value)}
          >
            {AREA_UNIT_OPTIONS2.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>

        <label className="block font-medium mb-1">Total cost</label>
        <input
          className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50"
          value={totalCost ? `${unitPriceCurrency} ${totalCost}` : ""}
          readOnly
          placeholder=""
        />
        {/* Move Clear button here */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
            onClick={handleClear}
            type="button"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoofPitchCalculator;