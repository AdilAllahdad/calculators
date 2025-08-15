"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function BalusterCalculator() {
  const [railingLength, setRailingLength] = useState("");
  const [railingLengthUnit, setRailingLengthUnit] = useState("ft");
  const [numberOfPosts, setNumberOfPosts] = useState("");
  const [postWidth, setPostWidth] = useState("");
  const [postWidthUnit, setPostWidthUnit] = useState("in");
  const [balusterWidth, setBalusterWidth] = useState("");
  const [balusterWidthUnit, setBalusterWidthUnit] = useState("in");
  const [balusterSpacing, setBalusterSpacing] = useState("");
  const [balusterSpacingUnit, setBalusterSpacingUnit] = useState("in");
  const [result, setResult] = useState({
    balustersNeeded: 0,
  });
  const [validationErrors, setValidationErrors] = useState({
    railingLength: "",
    numberOfPosts: "",
    postWidth: "",
    balusterWidth: "",
    balusterSpacing: "",
  });
  const [spacingWarning, setSpacingWarning] = useState("");

  // Validation function
  const validateField = (fieldName, value) => {
    const numValue = Number.parseFloat(value);
    if (value === "") {
      return "";
    }
    if (isNaN(numValue) || numValue <= 0) {
      return "Value must be greater than 0";
    }
    if (fieldName === "numberOfPosts" && !Number.isInteger(numValue)) {
      return "Number of posts must be a whole number";
    }
    return "";
  };

  // Handle input changes with validation
  const handleRailingLengthChange = (value) => {
    setRailingLength(value);
    setValidationErrors((prev) => ({
      ...prev,
      railingLength: validateField("railingLength", value),
    }));
  };

  const handleNumberOfPostsChange = (value) => {
    setNumberOfPosts(value);
    setValidationErrors((prev) => ({
      ...prev,
      numberOfPosts: validateField("numberOfPosts", value),
    }));
  };

  const handlePostWidthChange = (value) => {
    setPostWidth(value);
    setValidationErrors((prev) => ({
      ...prev,
      postWidth: validateField("postWidth", value),
    }));
  };

  const handleBalusterWidthChange = (value) => {
    setBalusterWidth(value);
    setValidationErrors((prev) => ({
      ...prev,
      balusterWidth: validateField("balusterWidth", value),
    }));
  };

  const handleBalusterSpacingChange = (value) => {
    setBalusterSpacing(value);
    setValidationErrors((prev) => ({
      ...prev,
      balusterSpacing: validateField("balusterSpacing", value),
    }));
  };

  // Improved conversion function with higher precision
  const convertToInches = (value, unit) => {
    const val = Number.parseFloat(value);
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
  const convertFromInches = (inches, targetUnit) => {
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

  // Handle unit changes with conversion
  const handleRailingLengthUnitChange = (newUnit) => {
    if (railingLength && !isNaN(Number.parseFloat(railingLength))) {
      const currentValueInInches = convertToInches(
        railingLength,
        railingLengthUnit
      );
      const newValue = convertFromInches(currentValueInInches, newUnit);
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
      setRailingLength(roundedValue.toString());
    }
    setRailingLengthUnit(newUnit);
  };

  const handlePostWidthUnitChange = (newUnit) => {
    if (postWidth && !isNaN(Number.parseFloat(postWidth))) {
      const currentValueInInches = convertToInches(postWidth, postWidthUnit);
      const newValue = convertFromInches(currentValueInInches, newUnit);
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
      setPostWidth(roundedValue.toString());
    }
    setPostWidthUnit(newUnit);
  };

  const handleBalusterWidthUnitChange = (newUnit) => {
    if (balusterWidth && !isNaN(Number.parseFloat(balusterWidth))) {
      const currentValueInInches = convertToInches(
        balusterWidth,
        balusterWidthUnit
      );
      const newValue = convertFromInches(currentValueInInches, newUnit);
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
      setBalusterWidth(roundedValue.toString());
    }
    setBalusterWidthUnit(newUnit);
  };

  const handleBalusterSpacingUnitChange = (newUnit) => {
    if (balusterSpacing && !isNaN(Number.parseFloat(balusterSpacing))) {
      const currentValueInInches = convertToInches(
        balusterSpacing,
        balusterSpacingUnit
      );
      const newValue = convertFromInches(currentValueInInches, newUnit);
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
      setBalusterSpacing(roundedValue.toString());
    }
    setBalusterSpacingUnit(newUnit);
  };

  // Auto-calculate balusters when inputs change
  useEffect(() => {
    // Check if there are any validation errors
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    if (
      !railingLength ||
      !numberOfPosts ||
      !postWidth ||
      !balusterWidth ||
      !balusterSpacing ||
      hasErrors
    ) {
      setResult({ balustersNeeded: 0 });
      setSpacingWarning("");
      return;
    }

    const railingLengthInches = convertToInches(
      railingLength,
      railingLengthUnit
    );
    const postWidthInches = convertToInches(postWidth, postWidthUnit);
    const balusterWidthInches = convertToInches(
      balusterWidth,
      balusterWidthUnit
    );
    const balusterSpacingInches = convertToInches(
      balusterSpacing,
      balusterSpacingUnit
    );

    // Check for maximum spacing warning (4 inches or 99mm)
    if (balusterSpacingInches > 4) {
      setSpacingWarning(
        'Warning: Baluster spacing exceeds 4" (99mm) maximum allowed in most areas!'
      );
    } else {
      setSpacingWarning("");
    }

    if (
      railingLengthInches <= 0 ||
      numberOfPosts <= 0 ||
      postWidthInches <= 0 ||
      balusterWidthInches <= 0 ||
      balusterSpacingInches <= 0
    ) {
      return;
    }

    // Formula: (railing length - (number of posts × single post's width)) / (baluster width + baluster spacing)
    const availableLength =
      railingLengthInches - Number.parseFloat(numberOfPosts) * postWidthInches;
    const balusterPitch = balusterWidthInches + balusterSpacingInches;

    if (availableLength <= 0 || balusterPitch <= 0) {
      setResult({ balustersNeeded: 0 });
      return;
    }

    const balustersNeeded = availableLength / balusterPitch;

    setResult({
      balustersNeeded,
    });
  }, [
    railingLength,
    railingLengthUnit,
    numberOfPosts,
    postWidth,
    postWidthUnit,
    balusterWidth,
    balusterWidthUnit,
    balusterSpacing,
    balusterSpacingUnit,
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
    setRailingLength("");
    setNumberOfPosts("");
    setPostWidth("");
    setBalusterWidth("");
    setBalusterSpacing("");
    setValidationErrors({
      railingLength: "",
      numberOfPosts: "",
      postWidth: "",
      balusterWidth: "",
      balusterSpacing: "",
    });
    setSpacingWarning("");
  };

  const reloadCalculator = () => {
    // Recalculate based on current values
    if (
      railingLength &&
      numberOfPosts &&
      postWidth &&
      balusterWidth &&
      balusterSpacing
    ) {
      const railingLengthInches = convertToInches(
        railingLength,
        railingLengthUnit
      );
      const postWidthInches = convertToInches(postWidth, postWidthUnit);
      const balusterWidthInches = convertToInches(
        balusterWidth,
        balusterWidthUnit
      );
      const balusterSpacingInches = convertToInches(
        balusterSpacing,
        balusterSpacingUnit
      );

      const availableLength =
        railingLengthInches -
        Number.parseFloat(numberOfPosts) * postWidthInches;
      const balusterPitch = balusterWidthInches + balusterSpacingInches;

      if (availableLength > 0 && balusterPitch > 0) {
        const balustersNeeded = availableLength / balusterPitch;

        setResult({
          balustersNeeded,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Baluster Calculator
        </h1>

        {/* Main Calculator Container with Border */}
        <div className="bg-white p-6 space-y-6 border-2 border-gray-300 rounded-lg shadow-lg">
          {/* Baluster Image - Full Width */}
          <div className="flex justify-center mb-6">
            <img
              src="/placeholder.svg?height=128&width=400"
              alt="Baluster railing diagram showing posts, balusters, and spacing"
              className="w-full max-w-sm h-32 object-contain rounded"
            />
          </div>

          {/* Railing Length */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Railing length
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
                value={railingLength}
                onChange={(e) => handleRailingLengthChange(e.target.value)}
                placeholder="20"
                step="any"
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors pr-32 ${
                  validationErrors.railingLength
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                <select
                  value={railingLengthUnit}
                  onChange={(e) =>
                    handleRailingLengthUnitChange(e.target.value)
                  }
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
            {validationErrors.railingLength && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.railingLength}
              </p>
            )}
          </div>

          {/* Number of Posts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Number of posts
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
              type="number"
              value={numberOfPosts}
              onChange={(e) => handleNumberOfPostsChange(e.target.value)}
              placeholder="5"
              step="1"
              className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors ${
                validationErrors.numberOfPosts
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
            />
            {validationErrors.numberOfPosts && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.numberOfPosts}
              </p>
            )}
          </div>

          {/* Post Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Width of a single post
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
                value={postWidth}
                onChange={(e) => handlePostWidthChange(e.target.value)}
                placeholder="2"
                step="any"
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors pr-32 ${
                  validationErrors.postWidth
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                <select
                  value={postWidthUnit}
                  onChange={(e) => handlePostWidthUnitChange(e.target.value)}
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
            {validationErrors.postWidth && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.postWidth}
              </p>
            )}
          </div>

          {/* Baluster Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Width of a single baluster
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
                value={balusterWidth}
                onChange={(e) => handleBalusterWidthChange(e.target.value)}
                placeholder="2"
                step="any"
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors pr-32 ${
                  validationErrors.balusterWidth
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                <select
                  value={balusterWidthUnit}
                  onChange={(e) =>
                    handleBalusterWidthUnitChange(e.target.value)
                  }
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
            {validationErrors.balusterWidth && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.balusterWidth}
              </p>
            )}
          </div>

          {/* Baluster Spacing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Baluster spacing
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
                value={balusterSpacing}
                onChange={(e) => handleBalusterSpacingChange(e.target.value)}
                placeholder="3"
                step="any"
                className={`w-full px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors pr-32 ${
                  validationErrors.balusterSpacing
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                <select
                  value={balusterSpacingUnit}
                  onChange={(e) =>
                    handleBalusterSpacingUnitChange(e.target.value)
                  }
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
            {validationErrors.balusterSpacing && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.balusterSpacing}
              </p>
            )}
            {spacingWarning && (
              <p className="text-orange-500 text-xs mt-1 bg-orange-50 p-2 rounded">
                {spacingWarning}
              </p>
            )}
          </div>

          {/* Balusters Needed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Balusters needed
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
              value={
                result.balustersNeeded > 0
                  ? Math.ceil(result.balustersNeeded).toString()
                  : "0"
              }
              readOnly
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-blue-600 font-semibold hover:border-gray-400 transition-colors"
            />
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
