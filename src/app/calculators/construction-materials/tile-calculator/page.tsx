'use client'
import React, { useState, useEffect } from "react";
import {
  convertLength,
  convertToComposite,
  convertFromComposite,
  formatNumber,
} from "@/lib/conversions/length";

const lengthUnits = [
  { value: "cm", label: "centimeters (cm)" },
  { value: "m", label: "meters (m)" },
  { value: "in", label: "inches (in)" },
  { value: "ft", label: "feet (ft)" },
  { value: "yd", label: "yards (yd)" },
];

const areaUnits = [
  { value: "cm²", label: "square centimeters (cm²)" },
  { value: "m²", label: "square meters (m²)" },
  { value: "in²", label: "square inches (in²)" },
  { value: "ft²", label: "square feet (ft²)" },
  { value: "yd²", label: "square yards (yd²)" },
];

const tileLengthUnits = [
  { value: "mm", label: "millimeter (mm)" },
  { value: "cm", label: "centimeter (cm)" },
  { value: "m", label: "meter (m)" },
  { value: "in", label: "inch (in)" },
  { value: "ft", label: "foot (ft)" },
];

const gapUnits = [
  { label: "millimeters (mm)", value: "mm" },
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "thou, thousandth of an inch (mil)", value: "mil" },
  { label: "inches (in)", value: "in" }
];

const tileAreaUnitsShort = [
  { label: "square millimeters (mm²)", value: "mm²" },
  { label: "square centimeters (cm²)", value: "cm²" },
  { label: "square meters (m²)", value: "m²" },
  { label: "square inches (in²)", value: "in²" },
  { label: "square feet (ft²)", value: "ft²" },
  { label: "square yards (yd²)", value: "yd²" }
];

// Standard area unit conversion factors (to m²)
const areaToM2: Record<string, number> = {
  "mm²": 1e-6,
  "cm²": 1e-4,
  "m²": 1,
  "km²": 1e6,
  "in²": 0.00064516,
  "ft²": 0.09290304,
  "yd²": 0.83612736,
  "mi²": 2.59e6,
  "a": 100,
  "ha": 10000,
  "ac": 4046.8564224,
};

// Standard area unit conversion factors (from m²)
const m2ToArea: Record<string, number> = {
  "mm²": 1e6,
  "cm²": 1e4,
  "m²": 1,
  "km²": 1e-6,
  "in²": 1550.0031,
  "ft²": 10.76391041671,
  "yd²": 1.1959900463,
  "mi²": 3.861021585e-7,
  "a": 0.01,
  "ha": 0.0001,
  "ac": 0.000247105,
};

// Gap conversion factors
const gapToMeters: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  mil: 0.0000254,
};

const metersToGap: Record<string, number> = {
  mm: 1000,
  cm: 100,
  m: 1,
  in: 39.37007874,
  mil: 39370.07874,
};

const Page = () => {
  const [lengthValue, setLengthValue] = useState("");
  const [lengthUnit, setLengthUnit] = useState("in");
  const [lengthFt, setLengthFt] = useState("");
  const [lengthIn, setLengthIn] = useState("");
  const [lengthM, setLengthM] = useState("");
  const [lengthCm, setLengthCm] = useState("");

  const [widthValue, setWidthValue] = useState("");
  const [widthUnit, setWidthUnit] = useState("m");
  const [widthFt, setWidthFt] = useState("");
  const [widthIn, setWidthIn] = useState("");
  const [widthM, setWidthM] = useState("");
  const [widthCm, setWidthCm] = useState("");

  const [areaValue, setAreaValue] = useState("");
  const [areaUnit, setAreaUnit] = useState("m²");

  // Tile section state
  const [tileLength, setTileLength] = useState("");
  const [tileLengthUnit, setTileLengthUnit] = useState("m");
  const [tileWidth, setTileWidth] = useState("");
  const [tileWidthUnit, setTileWidthUnit] = useState("in");
  const [tileArea, setTileArea] = useState("");
  const [tileAreaUnit, setTileAreaUnit] = useState("cm²");
  const [gapSize, setGapSize] = useState("0");
  const [gapUnit, setGapUnit] = useState("mm");
  const [showTileAreaWithGap, setShowTileAreaWithGap] = useState(false);
  const [tileAreaWithGap, setTileAreaWithGap] = useState("");
  const [tileAreaWithGapUnit, setTileAreaWithGapUnit] = useState("cm²");
  const [wasteFactor, setWasteFactor] = useState("10");

  const [boxSize, setBoxSize] = useState("");
  const [costPerBox, setCostPerBox] = useState("");
  const [totalTiles, setTotalTiles] = useState("");
  const [tilesWithWaste, setTilesWithWaste] = useState("");
  const [boxesNeeded, setBoxesNeeded] = useState("");
  const [totalCost, setTotalCost] = useState("");

  // Internal state for calculations
  const [internalTileArea, setInternalTileArea] = useState(0);
  const [internalTileAreaWithGap, setInternalTileAreaWithGap] = useState(0);

  // Helper: get value in meters from all input types
  const getLengthInMeters = () => {
    if (lengthUnit === "ft/in") {
      const ft = parseFloat(lengthFt) || 0;
      const inch = parseFloat(lengthIn) || 0;
      return convertFromComposite(ft, inch, "ft / in", "m");
    } else if (lengthUnit === "m/cm") {
      const m = parseFloat(lengthM) || 0;
      const cm = parseFloat(lengthCm) || 0;
      return convertFromComposite(m, cm, "m / cm", "m");
    } else if (lengthValue !== "" && !isNaN(Number(lengthValue))) {
      return convertLength(Number(lengthValue), lengthUnit, "m");
    }
    return 0;
  };

  const getWidthInMeters = () => {
    if (widthUnit === "ft/in") {
      const ft = parseFloat(widthFt) || 0;
      const inch = parseFloat(widthIn) || 0;
      return convertFromComposite(ft, inch, "ft / in", "m");
    } else if (widthUnit === "m/cm") {
      const m = parseFloat(widthM) || 0;
      const cm = parseFloat(widthCm) || 0;
      return convertFromComposite(m, cm, "m / cm", "m");
    } else if (widthValue !== "" && !isNaN(Number(widthValue))) {
      return convertLength(Number(widthValue), widthUnit, "m");
    }
    return 0;
  };

  // Calculate area when values or units change
  useEffect(() => {
    const lMeters = getLengthInMeters();
    const wMeters = getWidthInMeters();
    if (lMeters > 0 && wMeters > 0) {
      let area = lMeters * wMeters;
      let areaConverted = area;
      if (areaUnit === "m²") areaConverted = area;
      else if (areaUnit === "ft²") areaConverted = area * 10.76391041671;
      else if (areaUnit === "yd²") areaConverted = area * 1.1959900463;
      else if (areaUnit === "cm²") areaConverted = area * 10000;
      else if (areaUnit === "in²") areaConverted = area * 1550.0031;
      setAreaValue(formatNumber(areaConverted, { maximumFractionDigits: 4 }));
    } else {
      setAreaValue("");
    }
  }, [
    lengthValue,
    lengthUnit,
    lengthFt,
    lengthIn,
    lengthM,
    lengthCm,
    widthValue,
    widthUnit,
    widthFt,
    widthIn,
    widthM,
    widthCm,
    areaUnit,
  ]);

  // Handle unit changes for composite units
  const handleLengthUnitChange = (unit: string) => {
    let meters = getLengthInMeters();
    if (unit === "ft/in") {
      const { whole, fraction } = convertToComposite(meters, "m", "ft / in");
      setLengthFt(whole ? whole.toString() : "");
      setLengthIn(fraction ? fraction.toFixed(2) : "");
      setLengthValue("");
      setLengthM("");
      setLengthCm("");
    } else if (unit === "m/cm") {
      const { whole, fraction } = convertToComposite(meters, "m", "m / cm");
      setLengthM(whole ? whole.toString() : "");
      setLengthCm(fraction ? fraction.toFixed(2) : "");
      setLengthValue("");
      setLengthFt("");
      setLengthIn("");
    } else {
      setLengthValue(
        meters ? formatNumber(convertLength(meters, "m", unit), { maximumFractionDigits: 4 }) : ""
      );
      setLengthFt("");
      setLengthIn("");
      setLengthM("");
      setLengthCm("");
    }
    setLengthUnit(unit);
  };

  const handleWidthUnitChange = (unit: string) => {
    let meters = getWidthInMeters();
    if (unit === "ft/in") {
      const { whole, fraction } = convertToComposite(meters, "m", "ft / in");
      setWidthFt(whole ? whole.toString() : "");
      setWidthIn(fraction ? fraction.toFixed(2) : "");
      setWidthValue("");
      setWidthM("");
      setWidthCm("");
    } else if (unit === "m/cm") {
      const { whole, fraction } = convertToComposite(meters, "m", "m / cm");
      setWidthM(whole ? whole.toString() : "");
      setWidthCm(fraction ? fraction.toFixed(2) : "");
      setWidthValue("");
      setWidthFt("");
      setWidthIn("");
    } else {
      setWidthValue(
        meters ? formatNumber(convertLength(meters, "m", unit), { maximumFractionDigits: 4 }) : ""
      );
      setWidthFt("");
      setWidthIn("");
      setWidthM("");
      setWidthCm("");
    }
    setWidthUnit(unit);
  };

  // Tile Length/Width handlers
  const handleTileLengthChange = (val: string) => setTileLength(val);
  const handleTileWidthChange = (val: string) => setTileWidth(val);

  const handleTileLengthUnitChange = (newUnit: string) => {
    if (tileLength && !isNaN(Number(tileLength))) {
      const valueNum = parseFloat(tileLength);
      const converted = convertLength(valueNum, tileLengthUnit, newUnit);
      setTileLength(formatNumber(converted, { maximumFractionDigits: 6, useCommas: false }));
    }
    setTileLengthUnit(newUnit);
  };

  const handleTileWidthUnitChange = (newUnit: string) => {
    if (tileWidth && !isNaN(Number(tileWidth))) {
      const valueNum = parseFloat(tileWidth);
      const converted = convertLength(valueNum, tileWidthUnit, newUnit);
      setTileWidth(formatNumber(converted, { maximumFractionDigits: 6, useCommas: false }));
    }
    setTileWidthUnit(newUnit);
  };

  // Gap Unit Conversion Handler
  const handleGapUnitChange = (newUnit: string) => {
    if (gapSize && !isNaN(Number(gapSize))) {
      const valueNum = parseFloat(gapSize);
      const meters = valueNum * (gapToMeters[gapUnit] || 1);
      const converted = meters * (metersToGap[newUnit] || 1);
      setGapSize(formatNumber(converted, { maximumFractionDigits: 6, useCommas: false }));
    }
    setGapUnit(newUnit);
  };

  // Tile Area Unit Conversion Handler
  const handleTileAreaUnitChange = (newUnit: string) => {
    if (tileArea && !isNaN(Number(tileArea))) {
      const valueNum = parseFloat(tileArea);
      const m2 = valueNum * (areaToM2[tileAreaUnit] || 1);
      const converted = m2 * (m2ToArea[newUnit] || 1);
      setTileArea(isNaN(converted) ? "" : formatNumber(converted, { maximumFractionDigits: 6, useCommas: false }));
    }
    setTileAreaUnit(newUnit);
  };

  // Tile Area With Gap handlers
  const handleTileAreaWithGapChange = (value: string) => {
    setTileAreaWithGap(value);
    if (value && !isNaN(Number(value))) {
      const valueNum = parseFloat(value);
      const m2 = valueNum * (areaToM2[tileAreaWithGapUnit] || 1);
      setInternalTileAreaWithGap(m2);
    } else {
      setInternalTileAreaWithGap(0);
    }
  };

  const handleTileAreaWithGapUnitChange = (newUnit: string) => {
    if (tileAreaWithGap && !isNaN(Number(tileAreaWithGap))) {
      const valueNum = parseFloat(tileAreaWithGap);
      const m2 = valueNum * (areaToM2[tileAreaWithGapUnit] || 1);
      const converted = m2 * (m2ToArea[newUnit] || 1);
      setTileAreaWithGap(formatNumber(converted, { maximumFractionDigits: 4 }));
    }
    setTileAreaWithGapUnit(newUnit);
  };

  // Calculate tile area automatically
  useEffect(() => {
    if (tileLength && tileWidth && !isNaN(Number(tileLength)) && !isNaN(Number(tileWidth))) {
      const l = parseFloat(tileLength);
      const w = parseFloat(tileWidth);
      const lMeters = convertLength(l, tileLengthUnit, "m");
      const wMeters = convertLength(w, tileWidthUnit, "m");
      const area = lMeters * wMeters;
      
      setInternalTileArea(area);

      const areaInCm2 = area * 10000;
      let display = "";
      if (tileAreaUnit === "m²") display = formatNumber(area, { maximumFractionDigits: 4 });
      else if (tileAreaUnit === "ft²") display = formatNumber(area * 10.76391041671, { maximumFractionDigits: 4 });
      else if (tileAreaUnit === "yd²") display = formatNumber(area * 1.1959900463, { maximumFractionDigits: 4 });
      else if (tileAreaUnit === "cm²") display = formatNumber(areaInCm2, { maximumFractionDigits: 2 });
      else if (tileAreaUnit === "in²") display = formatNumber(area * 1550.0031, { maximumFractionDigits: 2 });
      else if (tileAreaUnit === "mm²") display = formatNumber(area * 1e6, { maximumFractionDigits: 2 });
      else display = formatNumber(area, { maximumFractionDigits: 4 });
      setTileArea(display);
    } else {
      setTileArea("");
      setInternalTileArea(0);
    }
  }, [tileLength, tileLengthUnit, tileWidth, tileWidthUnit, tileAreaUnit]);

  // Calculate tile area with gap
  useEffect(() => {
    if (showTileAreaWithGap && tileLength && tileWidth && !isNaN(Number(tileLength)) && !isNaN(Number(tileWidth))) {
      const l = parseFloat(tileLength);
      const w = parseFloat(tileWidth);
      const lMeters = convertLength(l, tileLengthUnit, "m");
      const wMeters = convertLength(w, tileWidthUnit, "m");
      const gap = parseFloat(gapSize) || 0;
      const gapMeters = convertLength(gap, gapUnit, "m");
      
      const areaWithGap = (lMeters + gapMeters) * (wMeters + gapMeters);
      setInternalTileAreaWithGap(areaWithGap);

      const areaInCm2 = areaWithGap * 10000;
      let displayGap = "";
      if (tileAreaWithGapUnit === "m²") displayGap = formatNumber(areaWithGap, { maximumFractionDigits: 4 });
      else if (tileAreaWithGapUnit === "ft²") displayGap = formatNumber(areaWithGap * 10.76391041671, { maximumFractionDigits: 4 });
      else if (tileAreaWithGapUnit === "yd²") displayGap = formatNumber(areaWithGap * 1.1959900463, { maximumFractionDigits: 4 });
      else if (tileAreaWithGapUnit === "cm²") displayGap = formatNumber(areaInCm2, { maximumFractionDigits: 2 });
      else if (tileAreaWithGapUnit === "in²") displayGap = formatNumber(areaWithGap * 1550.0031, { maximumFractionDigits: 2 });
      else if (tileAreaWithGapUnit === "mm²") displayGap = formatNumber(areaWithGap * 1e6, { maximumFractionDigits: 2 });
      else displayGap = formatNumber(areaWithGap, { maximumFractionDigits: 4 });
      
      setTileAreaWithGap(displayGap);
    }
  }, [tileLength, tileLengthUnit, tileWidth, tileWidthUnit, gapSize, gapUnit, showTileAreaWithGap, tileAreaWithGapUnit]);

  // Handle gap size change
  const handleGapSizeChange = (val: string) => {
    setGapSize(val);
  };

  // Clear all fields
  const handleClear = () => {
    setLengthValue("");
    setLengthUnit("in");
    setLengthFt("");
    setLengthIn("");
    setLengthM("");
    setLengthCm("");
    setWidthValue("");
    setWidthUnit("m");
    setWidthFt("");
    setWidthIn("");
    setWidthM("");
    setWidthCm("");
    setAreaValue("");
    setAreaUnit("m²");
    setTileLength("");
    setTileLengthUnit("m");
    setTileWidth("");
    setTileWidthUnit("in");
    setTileArea("");
    setTileAreaUnit("cm²");
    setGapSize("0");
    setGapUnit("mm");
    setShowTileAreaWithGap(false);
    setTileAreaWithGap("");
    setTileAreaWithGapUnit("cm²");
    setWasteFactor("10");
    setBoxSize("");
    setCostPerBox("");
    setTotalTiles("");
    setTilesWithWaste("");
    setBoxesNeeded("");
    setTotalCost("");
    setInternalTileArea(0);
    setInternalTileAreaWithGap(0);
  };

  // Calculate total tiles, tiles with waste, boxes needed, and total cost
  useEffect(() => {
    // Calculate area to tile in m²
    let areaToTileM2 = 0;
    if (areaValue && !isNaN(Number(areaValue))) {
      areaToTileM2 = Number(areaValue) * (areaToM2[areaUnit] || 1);
    }

    // Determine which tile area to use (with or without gap)
    let tileAreaM2 = internalTileArea;
    if (showTileAreaWithGap && internalTileAreaWithGap > 0) {
      tileAreaM2 = internalTileAreaWithGap;
    }

    // Calculate number of tiles
    let tiles = 0;
    if (tileAreaM2 > 0 && areaToTileM2 > 0) {
      tiles = areaToTileM2 / tileAreaM2;
    }
    
    const tilesNeeded = tiles > 0 ? Math.ceil(tiles) : 0;
    setTotalTiles(tilesNeeded ? tilesNeeded.toString() : "");

    // Tiles with waste
    let waste = parseFloat(wasteFactor) || 0;
    let tilesWithWasteNum = tilesNeeded;
    if (tilesNeeded > 0 && waste > 0) {
      tilesWithWasteNum = Math.ceil(tilesNeeded * (1 + waste / 100));
    }
    setTilesWithWaste(tilesWithWasteNum ? tilesWithWasteNum.toString() : "");

    // Boxes needed
    let boxes = 0;
    const boxCount = parseFloat(boxSize);
    if (tilesWithWasteNum > 0 && boxCount > 0) {
      boxes = Math.ceil(tilesWithWasteNum / boxCount);
    }
    setBoxesNeeded(boxes ? boxes.toString() : "");

    // Total cost
    let totalCostVal = 0;
    const costBox = parseFloat(costPerBox);
    if (boxes > 0 && costBox > 0) {
      totalCostVal = boxes * costBox;
    }
    setTotalCost(totalCostVal > 0 ? "PKR " + formatNumber(totalCostVal, { maximumFractionDigits: 2 }) : "");
  }, [
    areaValue, areaUnit,
    internalTileArea, internalTileAreaWithGap, showTileAreaWithGap,
    wasteFactor, boxSize, costPerBox
  ]);

  return (
    <>
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Your space to tile</h2>
        {/* Length */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Length</label>
          <div className="flex items-center gap-2">
            {lengthUnit === "ft/in" ? (
              <>
                <input
                  type="number"
                  value={lengthFt}
                  onChange={(e) => setLengthFt(e.target.value)}
                  placeholder="ft"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">ft</span>
                <input
                  type="number"
                  value={lengthIn}
                  onChange={(e) => setLengthIn(e.target.value)}
                  placeholder="in"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">in</span>
              </>
            ) : lengthUnit === "m/cm" ? (
              <>
                <input
                  type="number"
                  value={lengthM}
                  onChange={(e) => setLengthM(e.target.value)}
                  placeholder="m"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">m</span>
                <input
                  type="number"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  placeholder="cm"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">cm</span>
              </>
            ) : (
              <input
                type="text"
                value={lengthValue}
                onChange={(e) => setLengthValue(e.target.value)}
                placeholder="Length"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minWidth: 0 }}
              />
            )}
            <div className="relative w-48">
              <select
                value={lengthUnit}
                onChange={(e) => handleLengthUnitChange(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              >
                {lengthUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Width */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Width</label>
          <div className="flex items-center gap-2">
            {widthUnit === "ft/in" ? (
              <>
                <input
                  type="number"
                  value={widthFt}
                  onChange={(e) => setWidthFt(e.target.value)}
                  placeholder="ft"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">ft</span>
                <input
                  type="number"
                  value={widthIn}
                  onChange={(e) => setWidthIn(e.target.value)}
                  placeholder="in"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">in</span>
              </>
            ) : widthUnit === "m/cm" ? (
              <>
                <input
                  type="number"
                  value={widthM}
                  onChange={(e) => setWidthM(e.target.value)}
                  placeholder="m"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">m</span>
                <input
                  type="number"
                  value={widthCm}
                  onChange={(e) => setWidthCm(e.target.value)}
                  placeholder="cm"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="mx-1">cm</span>
              </>
            ) : (
              <input
                type="text"
                value={widthValue}
                onChange={(e) => setWidthValue(e.target.value)}
                placeholder="Width"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minWidth: 0 }}
              />
            )}
            <div className="relative w-32">
              <select
                value={widthUnit}
                onChange={(e) => handleWidthUnitChange(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              >
                {lengthUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Total area */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Total area</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={areaValue}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              style={{ minWidth: 0 }}
            />
            <div className="relative w-32">
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              >
                {areaUnits.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Your tiles section */}
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-6 border">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-base">Your tiles</span>
        <span className="text-gray-400 text-xl">...</span>
      </div>
      {/* Tile length */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Tile length</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tileLength}
            onChange={e => handleTileLengthChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative w-20">
            <select
              value={tileLengthUnit}
              onChange={e => handleTileLengthUnitChange(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
            >
              {tileLengthUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Tile width */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Tile width</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tileWidth}
            onChange={e => handleTileWidthChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative w-20">
            <select
              value={tileWidthUnit}
              onChange={e => handleTileWidthUnitChange(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
            >
              {tileLengthUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Area of one tile */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Area of one tile</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tileArea}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
          <div className="relative w-20">
            <select
              value={tileAreaUnit}
              onChange={e => handleTileAreaUnitChange(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
            >
              {tileAreaUnitsShort.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Gap size */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1 flex items-center">
          Gap size
          <span className="ml-1 text-gray-400 cursor-pointer" title="The space between tiles">i</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={gapSize}
            onChange={e => handleGapSizeChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative w-20">
            <select
              value={gapUnit}
              onChange={e => handleGapUnitChange(e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
            >
              {gapUnits.map(u => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Show tile area including gap */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={showTileAreaWithGap}
          onChange={e => setShowTileAreaWithGap(e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm text-gray-700">Show tile area including gap</span>
      </div>
      {/* Tile area (including gap) - editable if checked */}
      {showTileAreaWithGap && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Tile area (including gap)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tileAreaWithGap}
              onChange={(e) => handleTileAreaWithGapChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
            <div className="relative min-w-[120px]">
              <select
                value={tileAreaWithGapUnit}
                onChange={(e) => handleTileAreaWithGapUnitChange(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-xs"
              >
                {tileAreaUnitsShort.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      {/* Waste factor */}
      <div className="mb-2">
        <label className="block text-sm text-gray-600 mb-1">Waste factor</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={wasteFactor}
            onChange={e => setWasteFactor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-700">%</span>
        </div>
      </div>
    </div>

    {/* Buying the tiles section */}
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-6 border">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-base">Buying the tiles</span>
        <span className="text-gray-400 text-xl">...</span>
      </div>
      {/* Box size */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1 flex items-center">
          Box size
          <span className="ml-1 text-gray-400 cursor-pointer" title="How many tiles in one box?">i</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={boxSize}
            onChange={e => setBoxSize(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">tiles/box</span>
        </div>
      </div>
      {/* Cost per box */}
      <div className="mb-2">
        <label className="block text-sm text-gray-600 mb-1 flex items-center">
          Cost per box
          <span className="ml-1 text-gray-400 cursor-pointer" title="How much does one box cost?">...</span>
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">PKR</span>
            <input
              type="text"
              value={costPerBox}
              onChange={e => setCostPerBox(e.target.value)}
              className="w-full pl-12 pr-8 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
              placeholder=""
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/box</span>
          </div>
        </div>
      </div>
      {/* Clear button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
        >
          Clear all fields
        </button>
      </div>
    </div>

    {/* Total tiles and cost summary */}
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-6 border">
      <div className="font-semibold text-base mb-4">Total tiles and cost</div>
      <div className="text-gray-700 mb-2">
        You will need <b>{totalTiles || 0} tiles</b> to cover the entire space.
      </div>
      <div className="text-gray-700 mb-2">
        Accounting for your desired {wasteFactor || 0}% extra,
        <b> you should buy {tilesWithWaste || 0} tiles</b> to be safe.
      </div>
      <div className="text-gray-700 mb-2">
        You should buy <b>{boxesNeeded || 0} boxes</b>
        {boxSize ? ` with ${boxSize} tiles per box.` : "."}
        <br />
        This means you will get <b>{boxesNeeded && boxSize ? Number(boxesNeeded) * Number(boxSize) : 0} tiles</b> in the end.
      </div>
      <div className="text-gray-700">
        The total cost of all {boxesNeeded || 0} boxes is <b>{totalCost || "PKR 0.00"}</b>.
      </div>
    </div>
    </>
  );
};

export default Page;