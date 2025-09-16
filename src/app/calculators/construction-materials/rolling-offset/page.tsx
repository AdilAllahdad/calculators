'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";

// Unit conversion factors to meters
const unitToMeter: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
};

const units = [
  { label: "millimeters (mm)", value: "mm" },
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
];

function convertLength(value: number, from: string, to: string) {
  if (isNaN(value)) return "";
  const meters = value * (unitToMeter[from] || 1);
  return meters / (unitToMeter[to] || 1);
}

// Add conversion helpers for angle units
function convertAngle(value: number, from: string, to: string): number {
  if (from === to) return value;
  if (from === "deg" && to === "rad") return value * (Math.PI / 180);
  if (from === "rad" && to === "deg") return value * (180 / Math.PI);
  return value;
}

const Page = () => {
  // Roll/horizontal offset (h)
  const [h, setH] = useState("");
  const [hUnit, setHUnit] = useState("m");
  const [hConverted, setHConverted] = useState<Record<string, string>>({});

  // Set/vertical offset (v)
  const [v, setV] = useState("");
  const [vUnit, setVUnit] = useState("m");
  const [vConverted, setVConverted] = useState<Record<string, string>>({});

  // True offset (c)
  const [c, setC] = useState("");
  const [cUnit, setCUnit] = useState("m");
  const [cConverted, setCConverted] = useState<Record<string, string>>({});

  // New fields: Travel (T) and Run (R)
  const [travel, setTravel] = useState("");
  const [travelUnit, setTravelUnit] = useState("ft");
  const [run, setRun] = useState("");
  const [runUnit, setRunUnit] = useState("ft");

  const fittingAngles = [
    { label: "22 ½°", value: "22.5" },
    { label: "45°", value: "45" },
    { label: "60°", value: "60" },
    { label: "90°", value: "90" },
    { label: "Enter a custom fitting bend angle", value: "custom" },
  ];

  const [fittingAngle, setFittingAngle] = useState("22.5");
  const [customAngle, setCustomAngle] = useState("");

  const angleUnits = [
    { label: "degrees (°)", value: "deg" },
    { label: "radians (rad)", value: "rad" },
  ];

  const [angleUnit, setAngleUnit] = useState("deg");

  // Helper for safe toFixed
  function safeToFixed(val: number | "", digits: number) {
    return typeof val === "number" && !isNaN(val) ? val.toFixed(digits) : "";
  }

  // Calculate rolling offset values automatically
  useEffect(() => {
    const hValue = parseFloat(h);
    const vValue = parseFloat(v);
    
    // Calculate true offset (c) automatically when h and v are entered
    if (!isNaN(hValue) && !isNaN(vValue) && hValue >= 0 && vValue >= 0) {
      // Convert to meters for calculation
      const hMeters = hValue * (unitToMeter[hUnit] || 1);
      const vMeters = vValue * (unitToMeter[vUnit] || 1);
      
      // Calculate true offset using Pythagorean theorem: c = √(h² + v²)
      const cMeters = Math.sqrt(hMeters * hMeters + vMeters * vMeters);
      
      // Convert back to display unit
      const cValue = cMeters / (unitToMeter[cUnit] || 1);
      setC(safeToFixed(cValue, 6));
      
      // Update conversions for c
      const cResult: Record<string, string> = {};
      units.forEach((u) => {
        const conv = convertLength(cValue, cUnit, u.value);
        cResult[u.value] = safeToFixed(typeof conv === "number" ? conv : Number(conv), 6);
      });
      setCConverted(cResult);
      
      // Calculate travel and run based on fitting angle
      let angleInDeg = 0;
      if (fittingAngle === "custom" && customAngle) {
        const customAngleValue = parseFloat(customAngle);
        if (!isNaN(customAngleValue)) {
          angleInDeg = angleUnit === "deg" ? customAngleValue : convertAngle(customAngleValue, "rad", "deg");
        }
      } else if (fittingAngle !== "custom") {
        angleInDeg = parseFloat(fittingAngle);
      }
      
      if (angleInDeg > 0) {
        const angleInRad = angleInDeg * (Math.PI / 180);
        
        // Calculate travel: T = c / sin(θ)
        const travelMeters = cMeters / Math.sin(angleInRad);
        const travelValue = travelMeters / (unitToMeter[travelUnit] || 1);
        setTravel(safeToFixed(travelValue, 6));
        
        // Calculate run: R = c / tan(θ)
        const runMeters = cMeters / Math.tan(angleInRad);
        const runValue = runMeters / (unitToMeter[runUnit] || 1);
        setRun(safeToFixed(runValue, 6));
      }
    } else if (h === "" || v === "") {
      // Clear calculated values if inputs are empty
      setC("");
      setCConverted({});
      setTravel("");
      setRun("");
    }
  }, [h, hUnit, v, vUnit, cUnit, travelUnit, runUnit, fittingAngle, customAngle, angleUnit]);

  const handleChange = (
    val: string,
    unit: string,
    setValue: (v: string) => void,
    setConverted: (c: Record<string, string>) => void
  ) => {
    setValue(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const result: Record<string, string> = {};
      units.forEach((u) => {
        const conv = convertLength(num, unit, u.value);
        result[u.value] = safeToFixed(typeof conv === "number" ? conv : Number(conv), 6);
      });
      setConverted(result);
    } else {
      setConverted({});
    }
  };

  const handleUnitChange = (
    val: string,
    value: string,
    oldUnit: string,
    setUnit: (u: string) => void,
    setValue: (v: string) => void,
    setConverted: (c: Record<string, string>) => void
  ) => {
    if (value) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        const meters = num * (unitToMeter[oldUnit] || 1);
        const newVal = meters / (unitToMeter[val] || 1);
        setValue(newVal ? newVal.toString() : "");
        const result: Record<string, string> = {};
        units.forEach((u) => {
          const conv = convertLength(newVal, val, u.value);
          result[u.value] = safeToFixed(typeof conv === "number" ? conv : Number(conv), 6);
        });
        setConverted(result);
      } else {
        setValue("");
        setConverted({});
      }
    }
    setUnit(val);
  };

  // Clear all fields
  const handleClearAll = () => {
    setH("");
    setHConverted({});
    setV("");
    setVConverted({});
    setC("");
    setCConverted({});
    setTravel("");
    setRun("");
    setCustomAngle("");
  };

  // Image selection based on fitting angle
  let imageSrc = "/one.png";
  if (fittingAngle === "22.5") imageSrc = "/one.png";
  else if (fittingAngle === "45") imageSrc = "/two.png";
  else if (fittingAngle === "60") imageSrc = "/three.png";
  else if (fittingAngle === "90") imageSrc = "/four.png";
  // For custom/default, use one.png

  // Validation for custom angle
  let customAngleError = "";
  if (fittingAngle === "custom" && customAngle) {
    const num = parseFloat(customAngle);
    const angleInDeg = angleUnit === "deg" ? num : convertAngle(num, "rad", "deg");
    if (isNaN(angleInDeg) || angleInDeg < 0 || angleInDeg > 90) {
      customAngleError = "Angle must be between 0° and 90°.";
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow p-6 border">
      <div className="flex flex-col items-center mb-4">
        <Image
          src={imageSrc}
          alt="Rolling Offset Diagram"
          width={260}
          height={160}
          className="mb-2"
        />
      </div>
      
      {/* Roll/horizontal offset (h) */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1 font-medium">
          Roll or horizontal offset (h)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={h}
            onChange={e => handleChange(e.target.value, hUnit, setH, setHConverted)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            placeholder="Enter value"
          />
          <select
            value={hUnit}
            onChange={e => handleUnitChange(e.target.value, h, hUnit, setHUnit, setH, setHConverted)}
            className="px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Set/vertical offset (v) */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1 font-medium">
          Set or vertical offset (v)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={v}
            onChange={e => handleChange(e.target.value, vUnit, setV, setVConverted)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            placeholder="Enter value"
          />
          <select
            value={vUnit}
            onChange={e => handleUnitChange(e.target.value, v, vUnit, setVUnit, setV, setVConverted)}
            className="px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* True offset (c) */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1 font-medium">
          True offset (c)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={c}
            onChange={e => handleChange(e.target.value, cUnit, setC, setCConverted)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-50"
            placeholder="Calculated automatically"
            readOnly
          />
          <select
            value={cUnit}
            onChange={e => handleUnitChange(e.target.value, c, cUnit, setCUnit, setC, setCConverted)}
            className="px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fitting bend angle */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1 font-medium flex items-center gap-1">
          Fitting bend
          <span className="text-gray-400 cursor-pointer" title="Angle of the pipe fitting (bend) used in the offset">i</span>
        </label>
        <select
          value={fittingAngle}
          onChange={e => setFittingAngle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 mb-2"
        >
          <option value="" disabled>Select</option>
          {fittingAngles.map((angle) => (
            <option key={angle.value} value={angle.value}>{angle.label}</option>
          ))}
        </select>
        {fittingAngle === "custom" && (
          <div className="flex gap-2 mt-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">Bend angle of fittings (θ)</label>
              <input
                type="number"
                min="0"
                max="90"
                step="0.01"
                value={customAngle}
                onChange={e => {
                  setCustomAngle(e.target.value);
                }}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${customAngleError ? 'border-red-500' : ''}`}
                placeholder="Enter angle"
              />
              {customAngleError && (
                <div className="text-red-500 text-xs mt-1 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {customAngleError}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1 invisible">unit</label>
              <select
                value={angleUnit}
                onChange={e => {
                  const prevUnit = angleUnit;
                  const newUnit = e.target.value;
                  setAngleUnit(newUnit);
                  if (customAngle) {
                    const num = parseFloat(customAngle);
                    if (!isNaN(num)) {
                      const converted = convertAngle(num, prevUnit, newUnit);
                      setCustomAngle(converted ? converted.toString() : "");
                    }
                  }
                }}
                className="px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
              >
                {angleUnits.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Travel (T) */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1 font-medium flex items-center gap-1">
          Travel (T)
          <span className="text-gray-400 cursor-pointer" title="Travel distance">i</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={travel}
            onChange={e => setTravel(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-50"
            placeholder="Calculated automatically"
            readOnly
          />
          <select
            value={travelUnit}
            onChange={e => setTravelUnit(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Run (R) */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1 font-medium flex items-center gap-1">
          Run (R)
          <span className="text-gray-400 cursor-pointer" title="Run distance">i</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={run}
            onChange={e => setRun(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-50"
            placeholder="Calculated automatically"
            readOnly
          />
          <select
            value={runUnit}
            onChange={e => setRunUnit(e.target.value)}
            className="px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
          >
            {units.map((u) => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
        >
          Clear all fields
        </button>
      </div>
    </div>
  );
}

export default Page;