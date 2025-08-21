'use client'
import React, { useState, useEffect } from "react";

// Length units and conversion
const lengthUnits = [
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "kilometers (km)", value: "km" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
  { label: "miles (mi)", value: "mi" }
];

const toMeters = {
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344
};

// Area units and conversion
const areaUnits = [
  { label: "square centimeters (cm²)", value: "cm²" },
  { label: "square meters (m²)", value: "m²" },
  { label: "square inches (in²)", value: "in²" },
  { label: "square feet (ft²)", value: "ft²" }
];

const toM2 = {
  "cm²": 0.0001,
  "m²": 1,
  "in²": 0.00064516,
  "ft²": 0.09290304
};

const fromM2 = {
  "cm²": 10000,
  "m²": 1,
  "in²": 1550.0031,
  "ft²": 10.76391041671
};

function convertLength(value: number, from: string, to: string) {
  if (from === to) return value;
  const valueInMeters = value * toMeters[from as keyof typeof toMeters];
  return valueInMeters / toMeters[to as keyof typeof toMeters];
}

function convertArea(value: number, from: string, to: string) {
  if (from === to) return value;
  const valueInM2 = value * toM2[from as keyof typeof toM2];
  return valueInM2 * fromM2[to as keyof typeof fromM2];
}

const DeckingCalculator = () => {
  // Deck size state
  const [deckLength, setDeckLength] = useState("");
  const [deckLengthUnit, setDeckLengthUnit] = useState("ft");
  const [deckWidth, setDeckWidth] = useState("");
  const [deckWidthUnit, setDeckWidthUnit] = useState("ft");
  const [deckAreaUnit, setDeckAreaUnit] = useState("ft²");
  const [deckArea, setDeckArea] = useState("");

  // Board size state
  const [boardLength, setBoardLength] = useState("");
  const [boardLengthUnit, setBoardLengthUnit] = useState("ft");
  const [boardWidth, setBoardWidth] = useState("");
  const [boardWidthUnit, setBoardWidthUnit] = useState("in");
  const [boardAreaUnit, setBoardAreaUnit] = useState("ft²");
  const [boardArea, setBoardArea] = useState("");

  // Material estimation state
  const [fastenerType, setFastenerType] = useState("screws");

  // Cost estimation state
  const [boardPrice, setBoardPrice] = useState("");
  const [fastenerPrice, setFastenerPrice] = useState("");

  // Add missing state for fastenerPackSize and fastenerPackPrice
  const [fastenerPackSize, setFastenerPackSize] = useState("");
  const [fastenerPackPrice, setFastenerPackPrice] = useState("");

  // Reset key for remounting inputs
  const [resetKey, setResetKey] = useState(0);

  // --- Deck area calculation (ft², m², etc) ---
  useEffect(() => {
    if (
      deckLength &&
      deckWidth &&
      !isNaN(parseFloat(deckLength)) &&
      !isNaN(parseFloat(deckWidth))
    ) {
      const l = parseFloat(deckLength) * toMeters[deckLengthUnit as keyof typeof toMeters];
      const w = parseFloat(deckWidth) * toMeters[deckWidthUnit as keyof typeof toMeters];
      const areaInM2 = l * w;
      const convertedArea = convertArea(areaInM2, "m²", deckAreaUnit);
      setDeckArea(
        convertedArea.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })
      );
    } else {
      setDeckArea("");
    }
  }, [deckLength, deckWidth, deckLengthUnit, deckWidthUnit, deckAreaUnit]);

  // --- Board area calculation (ft², m², etc) ---
  useEffect(() => {
    if (
      boardLength &&
      boardWidth &&
      !isNaN(parseFloat(boardLength)) &&
      !isNaN(parseFloat(boardWidth))
    ) {
      // For board width in inches, convert to feet if needed for ft² calculation
      let l = parseFloat(boardLength);
      let w = parseFloat(boardWidth);
      let l_ft = boardLengthUnit === "ft" ? l : convertLength(l, boardLengthUnit, "ft");
      let w_ft = boardWidthUnit === "ft" ? w : convertLength(w, boardWidthUnit, "ft");
      let area_ft2 = l_ft * w_ft;
      let areaInM2 = l_ft * w_ft * toM2["ft²"];
      let convertedArea = convertArea(areaInM2, "m²", boardAreaUnit);
      setBoardArea(
        convertedArea.toLocaleString(undefined, {
          maximumFractionDigits: 4,
          minimumFractionDigits: 4
        })
      );
    } else {
      setBoardArea("");
    }
  }, [boardLength, boardWidth, boardLengthUnit, boardWidthUnit, boardAreaUnit]);

  // --- Material estimation calculations (EXACT as per example) ---
  // Calculate deck area in ft² for all calculations
  const deckLengthFt = deckLength && !isNaN(Number(deckLength)) ? convertLength(Number(deckLength), deckLengthUnit, "ft") : 0;
  const deckWidthFt = deckWidth && !isNaN(Number(deckWidth)) ? convertLength(Number(deckWidth), deckWidthUnit, "ft") : 0;
  const deckAreaFt2 = deckLengthFt * deckWidthFt;

  // Calculate board area in ft² (convert width to ft if in inches)
  const boardLengthFt = boardLength && !isNaN(Number(boardLength)) ? convertLength(Number(boardLength), boardLengthUnit, "ft") : 0;
  let boardWidthFt = 0;
  if (boardWidth && !isNaN(Number(boardWidth))) {
    if (boardWidthUnit === "in") {
      boardWidthFt = Number(boardWidth) / 12;
    } else {
      boardWidthFt = convertLength(Number(boardWidth), boardWidthUnit, "ft");
    }
  }
  const boardAreaFt2 = boardLengthFt * boardWidthFt;

  // Number of boards (with 10% waste, round up)
  const numberOfBoards = boardAreaFt2 > 0
    ? Math.ceil((deckAreaFt2 / boardAreaFt2) * 1.1)
    : 0;

  // Number of fasteners (3.5 per ft² for screws, 1.75 per ft² for clips)
  const numberOfScrews = Math.ceil(deckAreaFt2 * 3.5);
  const numberOfHiddenClips = Math.ceil(deckAreaFt2 * 1.75);
  const numberOfFasteners = fastenerType === "screws" ? numberOfScrews : numberOfHiddenClips;

  // --- Cost estimation calculations (EXACT as per example) ---
  // Cost of fasteners = packsNeeded * price_of_pack (if price entered)
  let fastenerCount = fastenerType === "screws" ? numberOfScrews : numberOfHiddenClips;
  let packSize = fastenerPackSize && !isNaN(Number(fastenerPackSize)) && Number(fastenerPackSize) > 0
    ? Number(fastenerPackSize)
    : 1;
  let packsNeeded = Math.ceil(fastenerCount / packSize);

  let costOfFasteners = fastenerPackPrice && packsNeeded > 0
    ? (parseFloat(fastenerPackPrice) * packsNeeded)
    : 0;

  const totalBoardPrice = boardPrice && numberOfBoards > 0
    ? (parseFloat(boardPrice) * numberOfBoards)
    : 0;
  const totalCost = totalBoardPrice && costOfFasteners
    ? (totalBoardPrice + costOfFasteners)
    : 0;

  // --- Reset handler ---
  const handleClearAll = () => {
    setDeckLength("");
    setDeckWidth("");
    setDeckLengthUnit("ft");
    setDeckWidthUnit("ft");
    setDeckAreaUnit("ft²");
    setDeckArea("");
    setBoardLength("");
    setBoardLengthUnit("ft");
    setBoardWidth("");
    setBoardWidthUnit("in");
    setBoardAreaUnit("ft²");
    setBoardArea("");
    setFastenerType("screws");
    setBoardPrice("");
    setFastenerPrice("");
    setResetKey(prev => prev + 1);
  };

  // --- Deck Length: handle unit change and value conversion ---
  const handleDeckLengthUnitChange = (newUnit: string) => {
    if (deckLength && !isNaN(Number(deckLength))) {
      const valueNum = parseFloat(deckLength);
      const converted = convertLength(valueNum, deckLengthUnit, newUnit);
      setDeckLength(
        converted ? converted.toString() : ""
      );
    }
    setDeckLengthUnit(newUnit);
  };

  // --- Deck Width: handle unit change and value conversion ---
  const handleDeckWidthUnitChange = (newUnit: string) => {
    if (deckWidth && !isNaN(Number(deckWidth))) {
      const valueNum = parseFloat(deckWidth);
      const converted = convertLength(valueNum, deckWidthUnit, newUnit);
      setDeckWidth(
        converted ? converted.toString() : ""
      );
    }
    setDeckWidthUnit(newUnit);
  };

  // --- Board Length: handle unit change and value conversion ---
  const handleBoardLengthUnitChange = (newUnit: string) => {
    if (boardLength && !isNaN(Number(boardLength))) {
      const valueNum = parseFloat(boardLength);
      const converted = convertLength(valueNum, boardLengthUnit, newUnit);
      setBoardLength(
        converted ? converted.toString() : ""
      );
    }
    setBoardLengthUnit(newUnit);
  };

  // --- Board Width: handle unit change and value conversion ---
  const handleBoardWidthUnitChange = (newUnit: string) => {
    if (boardWidth && !isNaN(Number(boardWidth))) {
      const valueNum = parseFloat(boardWidth);
      const converted = convertLength(valueNum, boardWidthUnit, newUnit);
      setBoardWidth(
        converted ? converted.toString() : ""
      );
    }
    setBoardWidthUnit(newUnit);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fd] flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-bold text-gray-800">Decking Calculator</h1>
      {/* Deck Size Card */}
      <div key={`decksize-${resetKey}`} className="w-full max-w-md bg-white rounded-xl shadow p-6 border">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-lg flex items-center gap-2">
            <span className="text-blue-600 text-lg">▸</span>
            Size of your deck
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Length</label>
            <div className="flex">
              <input
                key={`decklength-${resetKey}`}
                type="number"
                value={deckLength}
                onChange={e => setDeckLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <select
                value={deckLengthUnit}
                onChange={e => handleDeckLengthUnitChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700"
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <div className="flex">
              <input
                key={`deckwidth-${resetKey}`}
                type="number"
                value={deckWidth}
                onChange={e => setDeckWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <select
                value={deckWidthUnit}
                onChange={e => handleDeckWidthUnitChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700"
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Square footage (area)</label>
            <div className="flex items-center gap-2">
              <div className="text-blue-700 text-xl font-semibold bg-gray-50 px-3 py-2 rounded-md border border-gray-200 flex-1">
                {deckArea || "0.00"}
              </div>
              <select
                value={deckAreaUnit}
                onChange={e => setDeckAreaUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Board Size Card */}
      <div key={`boardsize-${resetKey}`} className="w-full max-w-md bg-white rounded-xl shadow p-6 border">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-lg flex items-center gap-2">
            <span className="text-blue-600 text-lg">▸</span>
            Size of decking boards
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Length</label>
            <div className="flex">
              <input
                key={`boardlength-${resetKey}`}
                type="number"
                value={boardLength}
                onChange={e => setBoardLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <select
                value={boardLengthUnit}
                onChange={e => handleBoardLengthUnitChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700"
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Width</label>
            <div className="flex">
              <input
                key={`boardwidth-${resetKey}`}
                type="number"
                value={boardWidth}
                onChange={e => setBoardWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <select
                value={boardWidthUnit}
                onChange={e => handleBoardWidthUnitChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-r-md bg-white text-gray-700"
              >
                {lengthUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Square footage (area per board)</label>
            <div className="flex items-center gap-2">
              <div className="text-blue-700 text-xl font-semibold bg-gray-50 px-3 py-2 rounded-md border border-gray-200 flex-1">
                {boardArea || "0.0000"}
              </div>
              <select
                value={boardAreaUnit}
                onChange={e => setBoardAreaUnit(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-blue-700"
              >
                {areaUnits.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Material Estimations Card */}
      <div key={`materialest-${resetKey}`} className="w-full max-w-md bg-white rounded-xl shadow p-6 border">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-base">Material estimations</span>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
            Number of boards needed
            <span className="text-gray-400 cursor-pointer" title="Calculated number of boards including waste">ℹ️</span>
          </label>
          <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
            {numberOfBoards.toLocaleString()}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">Fasteners used</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="fastener"
                value="screws"
                checked={fastenerType === "screws"}
                onChange={() => setFastenerType("screws")}
                className="accent-blue-600"
              />
              <span className="text-gray-700">Screws/nails</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="fastener"
                value="clips"
                checked={fastenerType === "clips"}
                onChange={() => setFastenerType("clips")}
                className="accent-blue-600"
              />
              <span className="text-gray-700">Hidden clips</span>
            </label>
          </div>
        </div>
        {fastenerType === "screws" && (
          <div>
            <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
              Number of screws/nails needed
              <span className="text-gray-400 cursor-pointer" title="Approximately 3.5 fasteners per square foot">ℹ️</span>
            </label>
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
              {numberOfScrews.toLocaleString()}
            </div>
          </div>
        )}
        {fastenerType === "clips" && (
          <div>
            <label className="block text-sm text-gray-700 mb-1 flex items-center gap-1">
              Number of hidden clips needed
              <span className="text-gray-400 cursor-pointer" title="Approximately 1.75 clips per square foot">ℹ️</span>
            </label>
            <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
              {numberOfHiddenClips.toLocaleString()}
            </div>
          </div>
        )}
      </div>
      {/* Cost Estimations Card */}
      <div key={`costest-${resetKey}`} className="w-full max-w-md bg-white rounded-xl shadow p-6 border">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-base">Cost estimations</span>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per board (PKR)</label>
          <input
            type="number"
            value={boardPrice}
            onChange={e => setBoardPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Price for all boards</label>
          <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
            {totalBoardPrice ? `PKR ${totalBoardPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "PKR 0.00"}
          </div>
        </div>
        {/* Fastener pack size and price */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fastener pack size
          </label>
          <input
            type="number"
            value={fastenerPackSize}
            onChange={e => setFastenerPackSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 500"
            min="1"
            step="1"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost of fastener (PKR)
          </label>
          <input
            type="number"
            value={fastenerPackPrice}
            onChange={e => setFastenerPackPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost of all fasteners</label>
          <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
            {costOfFasteners ? `PKR ${costOfFasteners.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "PKR 0.00"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {fastenerCount > 0 && packSize > 0
              ? `You need ${fastenerCount} fasteners. Buy ${packsNeeded} pack(s) of ${packSize}.`
              : ""}
          </div>
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total cost</label>
          <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 font-bold">
            {totalCost ? `PKR ${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "PKR 0.00"}
          </div>
        </div>
      </div>
      {/* Clear all fields button */}
      <div className="w-full max-w-md flex justify-end mt-4">
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300 transition-colors"
        >
          Clear all fields
      
        </button>
      </div>
    </div>
  );
};

export default DeckingCalculator;