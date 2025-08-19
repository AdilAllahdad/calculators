"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { convertLength } from "@/lib/conversions/length";

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

  // Add state for composite units for Railing length only
  const [railingLengthFeet, setRailingLengthFeet] = useState("");
  const [railingLengthInches, setRailingLengthInches] = useState("");
  const [railingLengthMeters, setRailingLengthMeters] = useState("");
  const [railingLengthCentimeters, setRailingLengthCentimeters] = useState("");

  // Validation function
  const validateField = (fieldName: string, value: string) => {
    const numValue = Number.parseFloat(value);
    if (value === "") {
      return "";
    }
    // FIX: Add missing parenthesis below
    if (isNaN(numValue)) {
      return "Value must be a number";
    }
    if (numValue <= 0) {
      return "Value must be greater than 0";
    }
    if (fieldName === "numberOfPosts" && !Number.isInteger(numValue)) {
      return "Number of posts must be a whole number";
    }
    return "";
  };

  // Convert composite units (ft/in or m/cm) to inches
  const convertCompositeToInches = (value: string, unit: string) => {
    if (unit === "ft/in") {
      const ft = Number.parseFloat(railingLengthFeet) || 0;
      const inches = Number.parseFloat(railingLengthInches) || 0;
      return ft * 12 + inches;
    } else if (unit === "m/cm") {
      const m = Number.parseFloat(railingLengthMeters) || 0;
      const cm = Number.parseFloat(railingLengthCentimeters) || 0;
      return (m * 100 + cm) / 2.54;
    }
    return convertLength(Number.parseFloat(value) || 0, unit, "in");
  };

  // Convert inches to composite units (ft/in or m/cm)
  const convertInchesToComposite = (inches: number, targetUnit: string) => {
    if (targetUnit === "ft/in") {
      const ft = Math.floor(inches / 12);
      const remainingInches = inches % 12;
      return `${ft} ${remainingInches.toFixed(2)}`;
    } else if (targetUnit === "m/cm") {
      const totalCm = inches * 2.54;
      const meters = Math.floor(totalCm / 100);
      const remainingCm = totalCm % 100;
      return `${meters} ${remainingCm.toFixed(2)}`;
    }
    return convertLength(inches, "in", targetUnit).toString();
  };

  // Handle input changes with validation
  const handleRailingLengthChange = (value: string) => {
    setRailingLength(value);
    setValidationErrors((prev) => ({
      ...prev,
      railingLength: validateField("railingLength", value),
    }));
  };

  const handleNumberOfPostsChange = (value: string) => {
    setNumberOfPosts(value);
    setValidationErrors((prev) => ({
      ...prev,
      numberOfPosts: validateField("numberOfPosts", value),
    }));
  };

  const handlePostWidthChange = (value: string) => {
    setPostWidth(value);
    setValidationErrors((prev) => ({
      ...prev,
      postWidth: validateField("postWidth", value),
    }));
  };

  const handleBalusterWidthChange = (value: string) => {
    setBalusterWidth(value);
    setValidationErrors((prev) => ({
      ...prev,
      balusterWidth: validateField("balusterWidth", value),
    }));
  };

  const handleBalusterSpacingChange = (value: string) => {
    setBalusterSpacing(value);
    setValidationErrors((prev) => ({
      ...prev,
      balusterSpacing: validateField("balusterSpacing", value),
    }));
  };

  // Handle unit changes with conversion
  const handleRailingLengthUnitChange = (newUnit: string) => {
    let currentValueInInches = 0;

    // Get the current value in inches, regardless of current unit
    if (railingLengthUnit === "ft/in") {
      const ft = Number.parseFloat(railingLengthFeet) || 0;
      const inches = Number.parseFloat(railingLengthInches) || 0;
      currentValueInInches = ft * 12 + inches;
    } else if (railingLengthUnit === "m/cm") {
      const m = Number.parseFloat(railingLengthMeters) || 0;
      const cm = Number.parseFloat(railingLengthCentimeters) || 0;
      currentValueInInches = (m * 100 + cm) / 2.54;
    } else if (railingLength !== "" && !isNaN(Number.parseFloat(railingLength))) {
      currentValueInInches = convertLength(Number.parseFloat(railingLength), railingLengthUnit, "in");
    }

    // Now convert to the new unit
    if (newUnit === "ft/in") {
      const ft = Math.floor(currentValueInInches / 12);
      const inches = currentValueInInches - ft * 12;
      setRailingLengthFeet(ft ? ft.toString() : "");
      setRailingLengthInches(inches ? inches.toFixed(2) : "");
      setRailingLength("");
      setRailingLengthMeters("");
      setRailingLengthCentimeters("");
    } else if (newUnit === "m/cm") {
      const totalCm = currentValueInInches * 2.54;
      const m = Math.floor(totalCm / 100);
      const cm = totalCm - m * 100;
      setRailingLengthMeters(m ? m.toString() : "");
      setRailingLengthCentimeters(cm ? cm.toFixed(2) : "");
      setRailingLength("");
      setRailingLengthFeet("");
      setRailingLengthInches("");
    } else {
      // Convert to single unit
      const newValue = convertLength(currentValueInInches, "in", newUnit);
      setRailingLength(
        newUnit === "mm"
          ? (Math.round(newValue * 10) / 10).toString()
          : newUnit === "cm"
          ? (Math.round(newValue * 100) / 100).toString()
          : newUnit === "m"
          ? (Math.round(newValue * 1000) / 1000).toString()
          : newUnit === "ft"
          ? (Math.round(newValue * 100) / 100).toString()
          : (Math.round(newValue * 100) / 100).toString()
      );
      setRailingLengthFeet("");
      setRailingLengthInches("");
      setRailingLengthMeters("");
      setRailingLengthCentimeters("");
    }
    setRailingLengthUnit(newUnit);
  };

  const handlePostWidthUnitChange = (newUnit: string) => {
    if (postWidth && !isNaN(Number.parseFloat(postWidth))) {
      const currentValueInInches = convertCompositeToInches(postWidth, postWidthUnit);
      let newValue;
      
      if (newUnit === "ft/in" || newUnit === "m/cm") {
        newValue = convertInchesToComposite(currentValueInInches, newUnit);
      } else {
        newValue = convertLength(currentValueInInches, "in", newUnit);
        // Round based on unit
        newValue = newUnit === "mm"
          ? Math.round(newValue * 10) / 10
          : newUnit === "cm"
          ? Math.round(newValue * 100) / 100
          : newUnit === "m"
          ? Math.round(newValue * 1000) / 1000
          : newUnit === "ft"
          ? Math.round(newValue * 100) / 100
          : Math.round(newValue * 100) / 100;
        newValue = newValue.toString();
      }
      
      setPostWidth(newValue);
    }
    setPostWidthUnit(newUnit);
  };

  const handleBalusterWidthUnitChange = (newUnit: string) => {
    if (balusterWidth && !isNaN(Number.parseFloat(balusterWidth))) {
      const currentValueInInches = convertCompositeToInches(
        balusterWidth,
        balusterWidthUnit
      );
      let newValue;
      
      if (newUnit === "ft/in" || newUnit === "m/cm") {
        newValue = convertInchesToComposite(currentValueInInches, newUnit);
      } else {
        newValue = convertLength(currentValueInInches, "in", newUnit);
        // Round based on unit
        newValue = newUnit === "mm"
          ? Math.round(newValue * 10) / 10
          : newUnit === "cm"
          ? Math.round(newValue * 100) / 100
          : newUnit === "m"
          ? Math.round(newValue * 1000) / 1000
          : newUnit === "ft"
          ? Math.round(newValue * 100) / 100
          : Math.round(newValue * 100) / 100;
        newValue = newValue.toString();
      }
      
      setBalusterWidth(newValue);
    }
    setBalusterWidthUnit(newUnit);
  };

  const handleBalusterSpacingUnitChange = (newUnit: string) => {
    if (balusterSpacing && !isNaN(Number.parseFloat(balusterSpacing))) {
      const currentValueInInches = convertCompositeToInches(
        balusterSpacing,
        balusterSpacingUnit
      );
      let newValue;
      
      if (newUnit === "ft/in" || newUnit === "m/cm") {
        newValue = convertInchesToComposite(currentValueInInches, newUnit);
      } else {
        newValue = convertLength(currentValueInInches, "in", newUnit);
        // Round based on unit
        newValue = newUnit === "mm"
          ? Math.round(newValue * 10) / 10
          : newUnit === "cm"
          ? Math.round(newValue * 100) / 100
          : newUnit === "m"
          ? Math.round(newValue * 1000) / 1000
          : newUnit === "ft"
          ? Math.round(newValue * 100) / 100
          : Math.round(newValue * 100) / 100;
        newValue = newValue.toString();
      }
      
      setBalusterSpacing(newValue);
    }
    setBalusterSpacingUnit(newUnit);
  };

  // Helper to get the current railing length in inches for calculation
  const getRailingLengthInches = () => {
    // Always check composite fields for ft/in and m/cm, otherwise use single value
    if (railingLengthUnit === "ft/in") {
      const ft = Number.parseFloat(railingLengthFeet);
      const inches = Number.parseFloat(railingLengthInches);
      // Only treat as "empty" if both are empty strings
      if (
        (railingLengthFeet === "" && railingLengthInches === "") ||
        (isNaN(ft) && isNaN(inches))
      ) {
        return 0;
      }
      return (isNaN(ft) ? 0 : ft) * 12 + (isNaN(inches) ? 0 : inches);
    } else if (railingLengthUnit === "m/cm") {
      const m = Number.parseFloat(railingLengthMeters);
      const cm = Number.parseFloat(railingLengthCentimeters);
      if (
        (railingLengthMeters === "" && railingLengthCentimeters === "") ||
        (isNaN(m) && isNaN(cm))
      ) {
        return 0;
      }
      return ((isNaN(m) ? 0 : m) * 100 + (isNaN(cm) ? 0 : cm)) / 2.54;
    } else if (railingLength !== "" && !isNaN(Number.parseFloat(railingLength))) {
      return convertLength(Number.parseFloat(railingLength), railingLengthUnit, "in");
    }
    return 0;
  };

  // Auto-calculate balusters when inputs change
  useEffect(() => {
    // Check if there are any validation errors
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );

    // --- Only check for empty fields for non-composite units ---
    const isComposite =
      railingLengthUnit === "ft/in" || railingLengthUnit === "m/cm";
    const isCompositeEmpty =
      (railingLengthUnit === "ft/in" &&
        railingLengthFeet === "" &&
        railingLengthInches === "") ||
      (railingLengthUnit === "m/cm" &&
        railingLengthMeters === "" &&
        railingLengthCentimeters === "");

    if (
      (!isComposite && !railingLength) ||
      !numberOfPosts ||
      !postWidth ||
      !balusterWidth ||
      !balusterSpacing ||
      hasErrors ||
      (isComposite && isCompositeEmpty)
    ) {
      setResult({ balustersNeeded: 0 });
      setSpacingWarning("");
      return;
    }

    // Parse numberOfPosts as integer (not float)
    const numPosts = parseInt(numberOfPosts, 10);
    if (isNaN(numPosts) || numPosts <= 0) {
      setResult({ balustersNeeded: 0 });
      return;
    }

    // All values must be in inches for calculation
    const railingLengthInches = getRailingLengthInches();
    const postWidthInches = convertCompositeToInches(postWidth, postWidthUnit);
    const balusterWidthInches = convertCompositeToInches(
      balusterWidth,
      balusterWidthUnit
    );
    const balusterSpacingInches = convertCompositeToInches(
      balusterSpacing,
      balusterSpacingUnit
    );

    // --- Enhanced: Show error and red border if baluster spacing > 4 inches (10.16 cm) ---
    let spacingError = "";
    let showRed = false;
    // Convert 4 inches to current unit for comparison
    let maxSpacing = 4;
    if (balusterSpacingUnit === "cm") {
      maxSpacing = 10.16;
    } else if (balusterSpacingUnit === "mm") {
      maxSpacing = 101.6;
    } else if (balusterSpacingUnit === "m") {
      maxSpacing = 0.1016;
    } else if (balusterSpacingUnit === "ft") {
      maxSpacing = 4 / 12;
    } // else keep as 4 inches

    const spacingValue = Number.parseFloat(balusterSpacing);
    if (!isNaN(spacingValue) && spacingValue > maxSpacing) {
      spacingError = 'The maximum baluster spacing is 4" (10 cm).';
      showRed = true;
    }

    // Also keep the old warning for > 4 inches in any unit
    if (balusterSpacingInches > 4) {
      setSpacingWarning(
        'Warning: Baluster spacing exceeds 4" (99mm) maximum allowed in most areas!'
      );
    } else {
      setSpacingWarning("");
    }

    if (
      railingLengthInches <= 0 ||
      numPosts <= 0 ||
      postWidthInches <= 0 ||
      balusterWidthInches <= 0 ||
      balusterSpacingInches <= 0
    ) {
      setResult({ balustersNeeded: 0 });
      return;
    }

    // Formula: (railing length - (number of posts × single post's width)) / (baluster width + baluster spacing)
    const totalPostWidth = numPosts * postWidthInches;
    const availableLength = railingLengthInches - totalPostWidth;
    const balusterPitch = balusterWidthInches + balusterSpacingInches;

    if (availableLength <= 0 || balusterPitch <= 0) {
      setResult({ balustersNeeded: 0 });
      return;
    }

    const balustersNeeded = Math.ceil(availableLength / balusterPitch);

    setResult({
      balustersNeeded,
    });

    // Set error for spacing field if needed
    setValidationErrors((prev) => ({
      ...prev,
      balusterSpacing: spacingError,
    }));
  }, [
    railingLength,
    railingLengthUnit,
    railingLengthFeet,
    railingLengthInches,
    railingLengthMeters,
    railingLengthCentimeters,
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
    { label: "Meters (m)", value: "m" },
    { label: "Inches (in)", value: "in" },
    { label: "Feet (ft)", value: "ft" },
    { label: "Feet & Inches (ft in)", value: "ft/in" },
    { label: "Meters & Centimeters (m cm)", value: "m/cm" },
  ];

  const unitOptions2 = [
    { label: "Centimeters (cm)", value: "cm" },
    { label: "Inches (in)", value: "in" },
  ];

  const unitOptions3 = [
    { label: "Millimeters (mm)", value: "mm" },
    { label: "Centimeters (cm)", value: "cm" },
    { label: "Inches (in)", value: "in" },
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

  // Helper function to format input placeholder based on unit
  const getPlaceholder = (unit: string) => {
    if (unit === "ft/in") return "5 6.5 (5ft 6.5in)";
    if (unit === "m/cm") return "1 75 (1m 75cm)";
    return "";
  };

  // Update handleRailingLengthChange for composite units
  const handleRailingLengthFeetChange = (value: string) => {
    setRailingLengthFeet(value);
    setValidationErrors((prev) => ({
      ...prev,
      railingLength: validateField("railingLength", value),
    }));
  };
  const handleRailingLengthInchesChange = (value: string) => {
    setRailingLengthInches(value);
    setValidationErrors((prev) => ({
      ...prev,
      railingLength: validateField("railingLength", value),
    }));
  };
  const handleRailingLengthMetersChange = (value: string) => {
    setRailingLengthMeters(value);
    setValidationErrors((prev) => ({
      ...prev,
      railingLength: validateField("railingLength", value),
    }));
  };
  const handleRailingLengthCentimetersChange = (value: string) => {
    setRailingLengthCentimeters(value);
    setValidationErrors((prev) => ({
      ...prev,
      railingLength: validateField("railingLength", value),
    }));
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
              src="/baluster.png"
              alt="Baluster railing diagram showing posts, balusters, and spacing"
              className="w-full max-w-sm h-auto object-contain"
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
              {railingLengthUnit === "ft/in" ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={railingLengthFeet}
                    onChange={(e) => handleRailingLengthFeetChange(e.target.value)}
                    placeholder="ft"
                    min="0"
                    className="w-20 px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                  <span className="self-center">ft</span>
                  <input
                    type="number"
                    value={railingLengthInches}
                    onChange={(e) => handleRailingLengthInchesChange(e.target.value)}
                    placeholder="in"
                    min="0"
                    className="w-20 px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                  <span className="self-center">in</span>
                  <div className="relative w-32 ml-2">
                    <select
                      value={railingLengthUnit}
                      onChange={(e) => handleRailingLengthUnitChange(e.target.value)}
                      className="h-8 py-0 pl-2 pr-8 border border-gray-200 rounded bg-gray-50 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer min-w-0 w-full"
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
              ) : railingLengthUnit === "m/cm" ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={railingLengthMeters}
                    onChange={(e) => handleRailingLengthMetersChange(e.target.value)}
                    placeholder="m"
                    min="0"
                    className="w-20 px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                  <span className="self-center">m</span>
                  <input
                    type="number"
                    value={railingLengthCentimeters}
                    onChange={(e) => handleRailingLengthCentimetersChange(e.target.value)}
                    placeholder="cm"
                    min="0"
                    className="w-20 px-3 py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  />
                  <span className="self-center">cm</span>
                  <div className="relative w-32 ml-2">
                    <select
                      value={railingLengthUnit}
                      onChange={(e) => handleRailingLengthUnitChange(e.target.value)}
                      className="h-8 py-0 pl-2 pr-8 border border-gray-200 rounded bg-gray-50 text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer min-w-0 w-full"
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
              ) : (
                // Default single input
                <div>
                  <input
                    type="number"
                    value={railingLength}
                    onChange={(e) => handleRailingLengthChange(e.target.value)}
                    placeholder={getPlaceholder(railingLengthUnit) || "20"}
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
                      onChange={(e) => handleRailingLengthUnitChange(e.target.value)}
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
              )}
            </div>
            {validationErrors.railingLength && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.railingLength}
              </p>
            )}
            {(railingLengthUnit === "ft/in" || railingLengthUnit === "m/cm") && (
              <p className="text-xs text-gray-500">
                {railingLengthUnit === "ft/in"
                  ? "Enter feet and inches separately."
                  : "Enter meters and centimeters separately."}
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
                type={postWidthUnit === "ft/in" || postWidthUnit === "m/cm" ? "text" : "number"}
                value={postWidth}
                onChange={(e) => handlePostWidthChange(e.target.value)}
                placeholder={getPlaceholder(postWidthUnit) || "2"}
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
                  {unitOptions2.map((u) => (
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
            {(postWidthUnit === "ft/in" || postWidthUnit === "m/cm") && (
              <p className="text-xs text-gray-500">
                {postWidthUnit === "ft/in" 
                  ? "Enter feet and inches separated by space (e.g., '0 3.5' for 0ft 3.5in)"
                  : "Enter meters and centimeters separated by space (e.g., '0 8.5' for 0m 8.5cm)"}
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
                type={balusterWidthUnit === "ft/in" || balusterWidthUnit === "m/cm" ? "text" : "number"}
                value={balusterWidth}
                onChange={(e) => handleBalusterWidthChange(e.target.value)}
                placeholder={getPlaceholder(balusterWidthUnit) || "2"}
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
                  {unitOptions2.map((u) => (
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
            {(balusterWidthUnit === "ft/in" || balusterWidthUnit === "m/cm") && (
              <p className="text-xs text-gray-500">
                {balusterWidthUnit === "ft/in" 
                  ? "Enter feet and inches separated by space (e.g., '0 1.5' for 0ft 1.5in)"
                  : "Enter meters and centimeters separated by space (e.g., '0 4' for 0m 4cm)"}
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
                type={balusterSpacingUnit === "ft/in" || balusterSpacingUnit === "m/cm" ? "text" : "number"}
                value={balusterSpacing}
                onChange={(e) => handleBalusterSpacingChange(e.target.value)}
                placeholder={getPlaceholder(balusterSpacingUnit) || "3"}
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
                  {unitOptions3.map((u) => (
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
            {(balusterSpacingUnit === "ft/in" || balusterSpacingUnit === "m/cm") && (
              <p className="text-xs text-gray-500">
                {balusterSpacingUnit === "ft/in" 
                  ? "Enter feet and inches separated by space (e.g., '0 3.5' for 0ft 3.5in)"
                  : "Enter meters and centimeters separated by space (e.g., '0 8.5' for 0m 8.5cm)"}
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
                  ? result.balustersNeeded.toString()
                  : "0"
              }
              readOnly
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md bg-gray-50 text-blue-600 font-semibold hover:border-gray-400 transition-colors"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
           
            <button
              onClick={clearAllFields}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Clear all changes
            </button>
          </div>
         
         
        </div>
      </div>
    </div>
  );
}