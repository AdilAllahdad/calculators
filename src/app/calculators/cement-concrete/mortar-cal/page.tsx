"use client";
import React, { useState, useEffect } from "react";

type CalcType = "bricks" | "blocks";
type WeightUnit = "kg" | "t" | "lb" | "st";

const UNITS = [
  { label: "kilograms", short: "kg" },
  { label: "metric tons", short: "t" },
  { label: "pounds", short: "lb" },
  { label: "stones", short: "st" },
];

// Conversion factors to kilograms
const TO_KG: Record<WeightUnit, number> = {
  kg: 1,
  t: 1000,
  lb: 0.45359237,
  st: 6.35029318,
};

const MortarCalculator: React.FC = () => {
  const [type, setType] = useState<CalcType>("bricks");
  const [numBricks, setNumBricks] = useState<string>("");
  const [yieldPerBag, setYieldPerBag] = useState<string>("40");
  const [mortarBags, setMortarBags] = useState<string>("");
  const [singleBagWeight, setSingleBagWeight] = useState<string>("");
  const [singleBagUnit, setSingleBagUnit] = useState<WeightUnit>("kg");
  const [totalWeight, setTotalWeight] = useState<string>("");
  const [totalWeightUnit, setTotalWeightUnit] = useState<WeightUnit>("kg");
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    const nB = parseFloat(numBricks);
    const yB = parseFloat(yieldPerBag);
    if (nB > 0 && yB > 0) {
      // Round up to nearest whole number as bags aren't sold in parts
      setMortarBags(Math.ceil(nB / yB).toString());
    } else {
      setMortarBags("");
    }
  }, [numBricks, yieldPerBag]);

  useEffect(() => {
    const bags = parseFloat(mortarBags);
    const single = parseFloat(singleBagWeight);

    if (bags > 0 && single > 0) {
      // Convert single bag weight to kg
      const singleInKg = single * TO_KG[singleBagUnit];
      const totalInKg = bags * singleInKg;
      // Convert total kg to selected total weight unit
      const factor = TO_KG[totalWeightUnit];
      const totalConverted = totalInKg / factor;
      setTotalWeight(totalConverted.toFixed(2));
    } else {
      setTotalWeight("");
    }
  }, [mortarBags, singleBagWeight, singleBagUnit, totalWeightUnit]);

  // Add clear all handler
  const handleClear = () => {
    setType("bricks");
    setNumBricks("");
    setYieldPerBag("40");
    setMortarBags("");
    setSingleBagWeight("");
    setSingleBagUnit("kg");
    setTotalWeight("");
    setTotalWeightUnit("kg");
  };

  // Single bag's weight dropdown: convert only the input field, not the canonical value
  const handleSingleBagUnitChange = (newUnit: WeightUnit) => {
    if (singleBagWeight) {
      const val = parseFloat(singleBagWeight);
      if (!isNaN(val)) {
        // Convert current value to kg, then to new unit
        const inKg = val * TO_KG[singleBagUnit];
        const newVal = inKg / TO_KG[newUnit];
        setSingleBagWeight(newVal.toString());
      }
    }
    setSingleBagUnit(newUnit);
  };

  // Total weight dropdown: convert only the input field, not the canonical value
  const handleTotalWeightUnitChange = (newUnit: WeightUnit) => {
    if (totalWeight) {
      const val = parseFloat(totalWeight);
      if (!isNaN(val)) {
        // Convert current value to kg, then to new unit
        const inKg = val * TO_KG[totalWeightUnit];
        const newVal = inKg / TO_KG[newUnit];
        setTotalWeight(newVal.toString());
      }
    }
    setTotalWeightUnit(newUnit);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-lg bg-white font-sans">
      <h1 className="text-2xl font-bold mb-6 text-center">Mortar Calculator</h1>

      {/* Type Selection */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <label className="block font-medium mb-3">Calculate mortar for:</label>
        <div className="flex gap-8 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={type === "bricks"}
              onChange={() => setType("bricks")}
              className="accent-indigo-500"
            />
            bricks
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={type === "blocks"}
              onChange={() => setType("blocks")}
              className="accent-indigo-500"
            />
            blocks
          </label>
        </div>
      </div>

      {/* Number of bags calculation */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-6">
        <div className="font-semibold text-base mb-3">
          Number of bags calculation
        </div>
        <label className="block font-medium mb-1">
          Number of {type}
        </label>
        <input
          className="w-full px-3 py-2 rounded-md border border-gray-200 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          value={numBricks}
          onChange={e => setNumBricks(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="Enter number"
          inputMode="numeric"
        />

        <label className="block font-medium mb-1 flex items-center">
          Yield of one mortar bag
          <span
            title="Click for yield information"
            className="ml-2 inline-block text-indigo-500 rounded-full bg-indigo-50 w-5 h-5 text-center font-bold text-xs cursor-pointer relative"
            onClick={() => setShowTooltip(!showTooltip)}
          >
            i
            {showTooltip && (
              <div className="absolute top-6 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-10 text-sm text-gray-700 font-normal">
                <div className="mb-3 font-semibold">Typical yields for 80 lb bags:</div>
                <div className="space-y-1 text-xs">
                  <div><strong>Modular bricks:</strong> 40-45</div>
                  <div><strong>Queen size bricks:</strong> 34-39</div>
                  <div><strong>King size bricks:</strong> 28-33</div>
                  <div><strong>Utility bricks:</strong> 23-28</div>
                  <div><strong>4 inch blocks:</strong> 15-17</div>
                  <div><strong>6 inch blocks:</strong> 12-14</div>
                  <div><strong>8 inch blocks:</strong> 11-13</div>
                  <div><strong>10 inch blocks:</strong> 11-13</div>
                  <div><strong>12 inch blocks:</strong> 10-12</div>
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  Yield depends on block/brick size and mortar type. Values may vary due to site conditions.
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  Reference: <a href="https://www.omnicalculator.com/construction/mortar" target="_blank" rel="noopener noreferrer" className="underline">Omni Calculator</a>
                </div>
              </div>
            )}
          </span>
        </label>
        <input
          className="w-full px-3 py-2 rounded-md border border-gray-200 mb-4 font-bold"
          value={yieldPerBag}
          onChange={e => setYieldPerBag(e.target.value.replace(/[^0-9.]/g, ""))}
          inputMode="numeric"
        />

        <label className="block font-medium mb-1">Mortar bags</label>
        <div className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-100 min-h-[2.5rem] flex items-center text-base">
          {mortarBags}
        </div>
      </div>

      {/* Weight calculation */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 mb-0">
        <div className="font-semibold text-base mb-3">
          Weight calculation
        </div>

        <label className="block font-medium mb-1">
          Single bag&apos;s weight
        </label>
        <div className="flex items-center gap-2 mb-4">
          <input
            className="w-full px-3 py-2 rounded-md border border-gray-200"
            value={singleBagWeight}
            onChange={e =>
              setSingleBagWeight(e.target.value.replace(/[^0-9.]/g, ""))
            }
            inputMode="numeric"
          />
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={singleBagUnit}
            onChange={e => handleSingleBagUnitChange(e.target.value as WeightUnit)}
          >
            {UNITS.map(unit => (
              <option key={unit.short} value={unit.short}>
                {unit.label} ({unit.short})
              </option>
            ))}
          </select>
        </div>

        <label className="block font-medium mb-1">Total weight</label>
        <div className="flex items-center gap-2">
          <div className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-100 min-h-[2.5rem] flex items-center text-base">
            {totalWeight && `${totalWeight} ${totalWeightUnit}`}
          </div>
          <select
            className="border border-gray-200 rounded-md px-2 py-2 bg-white"
            value={totalWeightUnit}
            onChange={e => handleTotalWeightUnitChange(e.target.value as WeightUnit)}
          >
            {UNITS.map(unit => (
              <option key={unit.short} value={unit.short}>
                {unit.label} ({unit.short})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Button */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 text-sm font-medium transition"
        >
          Clear
        </button>
      </div>

      {/* Click outside to close tooltip */}
      {showTooltip && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
};

export default MortarCalculator;