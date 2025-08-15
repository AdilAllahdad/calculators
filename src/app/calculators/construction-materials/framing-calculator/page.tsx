"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function FramingCalculator() {
  const [wallLength, setWallLength] = useState("");
  const [wallLengthUnit, setWallLengthUnit] = useState("ft");
  const [ocSpacing, setOcSpacing] = useState("");
  const [ocSpacingUnit, setOcSpacingUnit] = useState("in"); // Changed default to inches
  const [pricePerStud, setPricePerStud] = useState("");
  const [wastagePercent, setWastagePercent] = useState(15);
  const [result, setResult] = useState({
    studsNeeded: 0,
    totalStudsWithWastage: 0,
    totalCost: 0,
  });
  const [validationErrors, setValidationErrors] = useState({
    wallLength: "",
    ocSpacing: "",
    pricePerStud: "",
    wastagePercent: "",
  });

  // Validation function
  const validateField = (fieldName: string, value: string) => {
    const numValue = Number.parseFloat(value);
    if (value === "") {
      return "";
    }
    if (isNaN(numValue) || numValue <= 0) {
      return "Value must be greater than 0";
    }
    return "";
  };
  
  // Handle input changes with validation
  const handleWallLengthChange = (value: string) => {
    setWallLength(value);
    setValidationErrors((prev) => ({
      ...prev,
      wallLength: validateField("wallLength", value),
    }));
  };

  const handleOcSpacingChange = (value: string) => {
    setOcSpacing(value);
    setValidationErrors((prev) => ({
      ...prev,
      ocSpacing: validateField("ocSpacing", value),
    }));
  };

  const handlePricePerStudChange = (value: string) => {
    setPricePerStud(value);
    setValidationErrors((prev) => ({
      ...prev,
      pricePerStud: validateField("pricePerStud", value),
    }));
  };

  const handleWastagePercentChange = (value: string) => {
    setWastagePercent(value);
    setValidationErrors((prev) => ({
      ...prev,
      wastagePercent: validateField("wastagePercent", value),
    }));
  };

  // Improved conversion function with higher precision
  const convertToInches = (value: string, unit: string) => {
    const val = parseFloat(value);
    if (isNaN(val)) return 0;
    switch (unit) {
      case "mm":
        return val / 25.4;
      case "cm":
        return val / 2.54;
      case "m":
        return val * 39.3701;
      case "ft":
        return val * 12;
      case "in":
        return val;
      default:
        return val;
    }
  };

  // Convert from inches to target unit
  const convertFromInches = (inches: number, targetUnit: string) => {
    if (isNaN(inches) || inches === 0) return 0;
    switch (targetUnit) {
      case "mm":
        return inches * 25.4;
      case "cm":
        return inches * 2.54;
      case "m":
        return inches / 39.3701;
      case "ft":
        return inches / 12;
      case "in":
        return inches;
      default:
        return inches;
    }
  };

  // Handle wall length unit change with conversion
  const handleWallLengthUnitChange = (newUnit: string) => {
    if (wallLength && !isNaN(parseFloat(wallLength))) {
      // Convert current value to inches first
      const currentValueInInches = convertToInches(wallLength, wallLengthUnit);
      // Convert from inches to new unit
      const newValue = convertFromInches(currentValueInInches, newUnit);
      // Round to appropriate decimal places
      const roundedValue =
        newUnit === "mm"
          ? Math.round(newValue * 10) / 10
          : newUnit === "cm"
          ? Math.round(newValue * 100) / 100
          : newUnit === "m"
          ? Math.round(newValue * 1000) / 1000
          : newUnit === "ft"
          ? Math.round(newValue * 100) / 100
          : Math.round(newValue * 100) / 100;
      setWallLength(roundedValue.toString());
    }
    setWallLengthUnit(newUnit);
  };

  // Handle OC spacing unit change with conversion
  const handleOcSpacingUnitChange = (newUnit: string) => {
    if (ocSpacing && !isNaN(parseFloat(ocSpacing))) {
      // Convert current value to inches first
      const currentValueInInches = convertToInches(ocSpacing, ocSpacingUnit);
      // Convert from inches to new unit
      const newValue = convertFromInches(currentValueInInches, newUnit);
      // Round to appropriate decimal places
      const roundedValue =
        newUnit === "mm"
          ? Math.round(newValue * 10) / 10
          : newUnit === "cm"
          ? Math.round(newValue * 100) / 100
          : newUnit === "m"
          ? Math.round(newValue * 1000) / 1000
          : newUnit === "ft"
          ? Math.round(newValue * 100) / 100
          : Math.round(newValue * 100) / 100;
      setOcSpacing(roundedValue.toString());
    }
    setOcSpacingUnit(newUnit);
  };

  // Auto-calculate studs when inputs change
  useEffect(() => {
    // Check if there are any validation errors
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    if (!wallLength || !ocSpacing || hasErrors) {
      setResult({ studsNeeded: 0, totalStudsWithWastage: 0, totalCost: 0 });
      return;
    }

    const wallLengthInches = convertToInches(wallLength, wallLengthUnit);
    const ocSpacingInches = convertToInches(ocSpacing, ocSpacingUnit);

    if (ocSpacingInches <= 0 || wallLengthInches <= 0) return;

    // Exact formula: (wall length / OC spacing) + 1
    // Keep exact values without rounding
    const exactStudsNeeded = wallLengthInches / ocSpacingInches + 1;
    const studsNeeded = exactStudsNeeded; // No rounding

    // Apply wastage percentage without rounding
    const wastageDecimal = parseFloat(wastagePercent.toString()) / 100;
    const totalStudsWithWastage = studsNeeded * (1 + wastageDecimal);

    // Calculate total cost
    const totalCost = pricePerStud
      ? totalStudsWithWastage * parseFloat(pricePerStud)
      : 0;

    setResult({
      studsNeeded,
      totalStudsWithWastage,
      totalCost,
    });
  }, [
    wallLength,
    wallLengthUnit,
    ocSpacing,
    ocSpacingUnit,
    pricePerStud,
    wastagePercent,
    validationErrors,
  ]);

  const unitOptions = [
    { label: "Millimeters (mm)", value: "mm" },
    { label: "Centimeters (cm)", value: "cm" },
    { label: "Inches (in)", value: "in" },
    { label: "Feet (ft)", value: "ft" },
    { label: "Meters (m)", value: "m" },
  ];

  const clearAllFields = () => {
    setWallLength("");
    setOcSpacing("");
    setPricePerStud("");
    setWastagePercent(15);
    setValidationErrors({
      wallLength: "",
      ocSpacing: "",
      pricePerStud: "",
      wastagePercent: "",
    });
  };

  const reloadCalculator = () => {
    // Recalculate based on current values
    if (wallLength && ocSpacing) {
      const wallLengthInches = convertToInches(wallLength, wallLengthUnit);
      const ocSpacingInches = convertToInches(ocSpacing, ocSpacingUnit);

      if (ocSpacingInches > 0) {
        const exactStudsNeeded = wallLengthInches / ocSpacingInches + 1;
        const studsNeeded = exactStudsNeeded; // No rounding

        const wastageDecimal = parseFloat(wastagePercent.toString()) / 100;
        const totalStudsWithWastage = studsNeeded * (1 + wastageDecimal);

        const totalCost = pricePerStud
          ? totalStudsWithWastage * parseFloat(pricePerStud)
          : 0;

        setResult({
          studsNeeded,
          totalStudsWithWastage,
          totalCost,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Framing Calculator
        </h1>

        {/* Main Calculator Container with Border */}
        <div className="bg-white p-6 space-y-6 border-2 border-gray-300 rounded-lg shadow-lg">
          {/* Frame Image - Full Width */}
          <div className="flex justify-center mb-6">
            <img
              src="/frame.svg"
              alt="Frame structure diagram"
              className="w-full max-w-sm h-auto object-contain"
            />
          </div>

          {/* Wall Length */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Wall length
              </label>
              <button className="text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                value={wallLength}
                onChange={(e) => handleWallLengthChange(e.target.value)}
                placeholder="30"
                step="any"
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors pr-32 ${
                  validationErrors.wallLength
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                <select
                  value={wallLengthUnit}
                  onChange={(e) => handleWallLengthUnitChange(e.target.value)}
                  className="h-8 py-0 pl-2 pr-8 border border-gray-200 rounded bg-gray-50 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer min-w-0"
                  style={{ width: "120px" }}
                >
                  {unitOptions.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {validationErrors.wallLength && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.wallLength}
              </p>
            )}
          </div>

          {/* OC Spacing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                OC spacing
              </label>
              <button className="text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                value={ocSpacing}
                onChange={(e) => handleOcSpacingChange(e.target.value)}
                placeholder="16"
                step="any"
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors pr-32 ${
                  validationErrors.ocSpacing
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                <select
                  value={ocSpacingUnit}
                  onChange={(e) => handleOcSpacingUnitChange(e.target.value)}
                  className="h-8 py-0 pl-2 pr-8 border border-gray-200 rounded bg-gray-50 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer min-w-0"
                  style={{ width: "120px" }}
                >
                  {unitOptions.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 h-3 w-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {validationErrors.ocSpacing && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.ocSpacing}
              </p>
            )}
          </div>

          {/* Studs Needed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Studs needed
              </label>
              <button className="text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={result.studsNeeded.toFixed(4)}
              readOnly
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-blue-600 font-semibold hover:border-gray-400 transition-colors"
            />
          </div>

          {/* Stud Cost Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">
                Stud cost
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>

            {/* Price per stud */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Price per stud
                </label>
                <button className="text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  PKR
                </span>
                <input
                  type="number"
                  value={pricePerStud}
                  onChange={(e) => handlePricePerStudChange(e.target.value)}
                  placeholder="67.00"
                  step="any"
                  className={`w-full px-3 py-2.5 pl-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                    validationErrors.pricePerStud
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>
              {validationErrors.pricePerStud && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.pricePerStud}
                </p>
              )}
            </div>

            {/* Estimated waste */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Estimated waste
                </label>
                <button className="text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={wastagePercent}
                  onChange={(e) => handleWastagePercentChange(e.target.value)}
                  step="any"
                  className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors pr-8 ${
                    validationErrors.wastagePercent
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-sm">
                  %
                </span>
              </div>
              {validationErrors.wastagePercent && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.wastagePercent}
                </p>
              )}
            </div>

            {/* Total studs with wastage */}
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Total studs (with wastage)
                </label>
                <button className="text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={result.totalStudsWithWastage.toFixed(4)}
                readOnly
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-blue-600 font-semibold hover:border-gray-400 transition-colors"
              />
            </div> */}

            {/* Total cost */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Total cost
                </label>
                <button className="text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  PKR
                </span>
                <input
                  type="text"
                  value={result.totalCost.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2.5 pl-12 border border-gray-300 rounded-md bg-gray-50 text-blue-600 font-semibold hover:border-gray-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <button
              onClick={reloadCalculator}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Reload calculator
            </button>
            <button
              onClick={clearAllFields}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Clear all changes
            </button>
          </div>

          {/* Share Section */}
          <div className="flex items-center space-x-2 pt-2">
            <button className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-full text-white hover:bg-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
            <span className="text-sm text-gray-600">Share result</span>
          </div>

          {/* Bottom Question */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              Did we solve your problem today?
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                👍 Yes
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                👎 No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
