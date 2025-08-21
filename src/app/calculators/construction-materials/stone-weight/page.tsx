"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaChevronDown, FaInfoCircle } from "react-icons/fa";

// --- UNIT CONVERSION DATA --- //
const LENGTH_FACTORS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
};
const AREA_FACTORS: Record<string, number> = {
  "mm²": 0.000001,
  "cm²": 0.0001,
  "dm²": 0.01,
  "m²": 1,
  "in²": 0.00064516,
  "ft²": 0.092903,
};
const VOLUME_FACTORS: Record<string, number> = {
  "mm³": 1e-9,
  "cm³": 1e-6,
  "dm³": 1e-3,
  "m³": 1,
  "cu in": 0.000016387064,
  "cu ft": 0.0283168,
  "cu yd": 0.764555,
  "ml": 1e-6,
};
const MASS_FACTORS: Record<string, number> = {
  g: 0.001,
  dag: 0.01,
  kg: 1,
  t: 1000,
  oz: 0.0283495,
  lb: 0.453592,
  "US ton": 907.18474,
  "long ton": 1016.0469088,
};
const units = {
  length: [
    { label: "millimeters (mm)", value: "mm" },
    { label: "centimeters (cm)", value: "cm" },
    { label: "meters (m)", value: "m" },
    { label: "inches (in)", value: "in" },
    { label: "feet (ft)", value: "ft" },
    { label: "yards (yd)", value: "yd" },
  ],
  area: [
    { label: "square millimeters (mm²)", value: "mm²" },
    { label: "square centimeters (cm²)", value: "cm²" },
    { label: "square decimeters (dm²)", value: "dm²" },
    { label: "square meters (m²)", value: "m²" },
    { label: "square inches (in²)", value: "in²" },
    { label: "square feet (ft²)", value: "ft²" },
  ],
  volume: [
    { label: "cubic millimeters (mm³)", value: "mm³" },
    { label: "cubic centimeters (cm³)", value: "cm³" },
    { label: "cubic decimeters (dm³)", value: "dm³" },
    { label: "cubic meters (m³)", value: "m³" },
    { label: "cubic inches (cu in)", value: "cu in" },
    { label: "cubic feet (cu ft)", value: "cu ft" },
    { label: "cubic yards (cu yd)", value: "cu yd" },
    { label: "milliliters (ml)", value: "ml" },
  ],
  mass: [
    { label: "grams (g)", value: "g" },
    { label: "decagrams (dag)", value: "dag" },
    { label: "kilograms (kg)", value: "kg" },
    { label: "metric tons (t)", value: "t" },
    { label: "ounces (oz)", value: "oz" },
    { label: "pounds (lb)", value: "lb" },
    { label: "US short tons (US ton)", value: "US ton" },
    { label: "imperial tons (long ton)", value: "long ton" },
  ],
  currency: ["PKR"],
};
const stoneMaterials = [
  { label: "Select", value: "" },
  { label: "Gravel", value: "gravel" },
  { label: "Concrete", value: "concrete" },
  { label: "Limestone", value: "limestone" },
  { label: "Sandstone", value: "sandstone" },
  { label: "Granite", value: "granite" },
  { label: "Marble", value: "marble" },
  { label: "Crushed Stone", value: "crushed_stone" },
  { label: "Enter custom stone density", value: "custom" },
];

// Densities in kg/m³ (approximate):
const MATERIAL_DENSITIES: Record<string, number> = {
  gravel: 1700,
  concrete: 2400,
  limestone: 2500,
  sandstone: 2300,
  granite: 2650,
  marble: 2700,
  crushed_stone: 1600,
  // 'custom' handled separately
};

// Add standard density units and conversion factors
const DENSITY_UNITS = [
  { label: "kilograms per cubic meter (kg/m³)", value: "kg/m³" },
  { label: "kilograms per cubic decimeter (kg/dm³)", value: "kg/dm³" },
  { label: "kilograms per liter (kg/L)", value: "kg/L" },
  { label: "grams per milliliter (g/mL)", value: "g/mL" },
  { label: "grams per cubic centimeter (g/cm³)", value: "g/cm³" },
  { label: "ounces per cubic inch (oz/cu in)", value: "oz/cu in" },
  { label: "pounds per cubic inch (lb/cu in)", value: "lb/cu in" },
  { label: "pounds per cubic feet (lb/cu ft)", value: "lb/cu ft" },
  { label: "pounds per cubic yard (lb/cu yd)", value: "lb/cu yd" },
];

// Conversion factors to kg/m³ for density units
const DENSITY_TO_KGM3: Record<string, number> = {
  "kg/m³": 1,
  "kg/dm³": 1000,
  "kg/L": 1000,
  "g/mL": 1000,
  "g/cm³": 1000,
  "oz/cu in": 1729.994,
  "lb/cu in": 27679.9,
  "lb/cu ft": 16.0185,
  "lb/cu yd": 0.593276,
};

// --- UNIT CONVERSION HELPERS --- //
function convertValue(
  value: string,
  from: string,
  to: string,
  type: "length" | "area" | "volume" | "mass"
): string {
  if (!value) return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  let factors: Record<string, number>;
  if (type === "length") factors = LENGTH_FACTORS;
  else if (type === "area") factors = AREA_FACTORS;
  else if (type === "volume") factors = VOLUME_FACTORS;
  else if (type === "mass") factors = MASS_FACTORS;
  else return value;
  const si = num * (factors[from] ?? 1);
  const result = si / (factors[to] ?? 1);
  return (+result.toFixed(8)).toString();
}

// Converts any value+unit to SI (m, m², m³, kg)
function toSI(
  value: string,
  unit: string,
  type: "length" | "area" | "volume" | "mass"
): number {
  if (!value) return 0;
  const num = Number(value);
  if (isNaN(num)) return 0;
  let factors: Record<string, number>;
  if (type === "length") factors = LENGTH_FACTORS;
  else if (type === "area") factors = AREA_FACTORS;
  else if (type === "volume") factors = VOLUME_FACTORS;
  else if (type === "mass") factors = MASS_FACTORS;
  else return num;
  return num * (factors[unit] ?? 1);
}
function fromSI(
  value: number,
  unit: string,
  type: "length" | "area" | "volume" | "mass"
): string {
  let factors: Record<string, number>;
  if (type === "length") factors = LENGTH_FACTORS;
  else if (type === "area") factors = AREA_FACTORS;
  else if (type === "volume") factors = VOLUME_FACTORS;
  else if (type === "mass") factors = MASS_FACTORS;
  else return value.toString();
  return (+((value / (factors[unit] ?? 1)).toFixed(8))).toString();
}

// --- COMPONENTS --- //
const UnitSelect = React.memo(({
  units,
  value,
  onChange,
  style = {},
}: {
  units: { label: string; value: string }[];
  value: string;
  onChange: (u: string) => void;
  style?: React.CSSProperties;
}) => {
  return (
    <div className="relative flex-shrink-0">
      <select
        className="min-w-[160px] max-w-[200px] bg-transparent text-blue-700 font-medium focus:outline-none border-0 py-1 px-2 text-[15px] rounded-md hover:bg-blue-50 h-[38px] appearance-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={style}
      >
        {units.map((u) => (
          <option key={u.value} value={u.value}>
            {u.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-700">
        ▼
      </span>
    </div>
  );
});

UnitSelect.displayName = 'UnitSelect';

const CurrencySelect = React.memo(({
  value,
  onChange,
  style = {},
}: {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}) => {
  return (
    <select
      className="min-w-[65px] border-0 bg-transparent text-blue-700 font-medium focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
    >
      {units.currency.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
});

CurrencySelect.displayName = 'CurrencySelect';

const InputWithUnit = React.memo(({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  unitOptions,
  info,
  inputProps = {},
  disabled = false,
  convertType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  onUnitChange: (u: string) => void;
  unitOptions: { label: string; value: string }[];
  info?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  disabled?: boolean;
  convertType?: "length" | "area" | "volume" | "mass";
}) => {
  const handleUnitChange = useCallback((newUnit: string) => {
    if (unit === newUnit || !convertType || disabled) {
      onUnitChange(newUnit);
      return;
    }
    const converted = convertValue(value, unit, newUnit, convertType);
    onChange(converted);
    onUnitChange(newUnit);
  }, [unit, convertType, disabled, value, onChange, onUnitChange]);

  // Ensure value is always a string
  const safeValue = typeof value === "string" ? value : value?.toString() ?? "";
  
  return (
    <div className="mb-4">
      <div className="flex items-center text-sm font-medium mb-1">
        <span>{label}</span>
        {info && (
          <span
            className="ml-1 text-gray-400 cursor-pointer"
            title={typeof info === "string" ? info : undefined}
          >
            <FaInfoCircle />
          </span>
        )}
      </div>
      <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 h-[44px] w-[360px]">
        <input
          className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base h-full"
          type="number"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          {...inputProps}
        />
        <UnitSelect units={unitOptions} value={unit} onChange={handleUnitChange} />
      </div>
    </div>
  );
});

InputWithUnit.displayName = 'InputWithUnit';

function SectionCard({
  open,
  setOpen,
  title,
  children,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-4 px-6 mb-6 w-[410px] mx-auto">
      <div
        className="flex items-center justify-between cursor-pointer select-none mb-2"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <span
            className={`transition-transform duration-200 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          >
            <FaChevronDown />
          </span>
          <span className="font-semibold text-lg">{title}</span>
        </div>
      </div>
      <div className={open ? "block" : "hidden"}>{children}</div>
    </div>
  );
}

// Custom density input component
const CustomDensityInput = React.memo(({
  value,
  onChange,
  unit,
  onUnitChange,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  onUnitChange: (v: string) => void;
}) => {
  // Convert value to new unit when unit changes
  const handleUnitChange = useCallback((newUnit: string) => {
    if (unit === newUnit) {
      onUnitChange(newUnit);
      return;
    }
    // Convert value from old unit to new unit
    if (!value) {
      onUnitChange(newUnit);
      return;
    }
    const num = Number(value);
    if (isNaN(num)) {
      onUnitChange(newUnit);
      return;
    }
    // Convert to kg/m³ first, then to new unit
    const valueInKgM3 = num * (DENSITY_TO_KGM3[unit] ?? 1);
    const newValue = valueInKgM3 / (DENSITY_TO_KGM3[newUnit] ?? 1);
    onChange(newValue.toString());
    onUnitChange(newUnit);
  }, [value, unit, onChange, onUnitChange]);

  return (
    <div className="mb-4">
      <div className="flex items-center text-sm font-medium mb-1">
        <span>Custom density</span>
        <span className="ml-1 text-gray-400" title="Enter custom density value">
          <FaInfoCircle />
        </span>
      </div>
      <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 h-[44px] w-[360px]">
        <input
          className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base h-full"
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Density value"
        />
        <UnitSelect
          units={DENSITY_UNITS}
          value={unit}
          onChange={handleUnitChange}
        />
      </div>
    </div>
  );
});
CustomDensityInput.displayName = 'CustomDensityInput';

// --- PricePerMassInput: dropdown only converts its own input field, does NOT affect price per volume or total cost ---
const PricePerMassInput = React.memo(({
  value,
  onChange,
  unit,
  onUnitChange,
  unitOptions,
  currency,
  onCurrencyChange,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  onUnitChange: (v: string) => void;
  unitOptions: { label: string; value: string }[];
  currency: string;
  onCurrencyChange: (v: string) => void;
}) => {
  // Store the original value in kg for calculations
  const [originalValueInKg, setOriginalValueInKg] = useState<number | null>(null);
  
  // Only convert the value for this input field when unit changes
  const handleUnitChange = useCallback((newUnit: string) => {
    if (unit === newUnit) {
      onUnitChange(newUnit);
      return;
    }
    
    if (!value) {
      onUnitChange(newUnit);
      return;
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      onUnitChange(newUnit);
      return;
    }
    
    // Convert from current unit to new unit for display only
    const valueInKg = num * (MASS_FACTORS[unit] ?? 1);
    const newValue = valueInKg / (MASS_FACTORS[newUnit] ?? 1);
    
    // Update the displayed value but keep the original value in kg for calculations
    onChange(newValue.toString());
    onUnitChange(newUnit);
    
    // Store the original value in kg for calculations
    if (originalValueInKg === null) {
      setOriginalValueInKg(valueInKg);
    }
  }, [value, unit, onChange, onUnitChange, originalValueInKg]);

  return (
    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 h-[44px] w-[360px]">
      <CurrencySelect value={currency} onChange={onCurrencyChange} />
      <input
        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base ml-2"
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Amount"
        autoComplete="off"
      />
      <span className="mx-1">/</span>
      <UnitSelect units={unitOptions} value={unit} onChange={handleUnitChange} />
    </div>
  );
});
PricePerMassInput.displayName = 'PricePerMassInput';

const PricePerVolumeInput = React.memo(({
  value,
  onChange,
  unit,
  onUnitChange,
  unitOptions,
  currency,
  onCurrencyChange,
  readOnly = false,
  style = {},
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  onUnitChange: (v: string) => void;
  unitOptions: { label: string; value: string }[];
  currency: string;
  onCurrencyChange: (v: string) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
}) => {
  // Only convert the value for this input field when unit changes
  const handleUnitChange = useCallback((newUnit: string) => {
    if (unit === newUnit) {
      onUnitChange(newUnit);
      return;
    }
    if (!value) {
      onUnitChange(newUnit);
      return;
    }
    const num = Number(value);
    if (isNaN(num)) {
      onUnitChange(newUnit);
      return;
    }
    const valueInM3 = num * (VOLUME_FACTORS[unit] ?? 1);
    const newValue = valueInM3 / (VOLUME_FACTORS[newUnit] ?? 1);
    onChange(newValue.toString());
    onUnitChange(newUnit);
  }, [value, unit, onChange, onUnitChange]);
  return (
    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 h-[44px] w-[360px]">
      <CurrencySelect value={currency} onChange={onCurrencyChange} />
      <input
        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base ml-2"
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Amount"
        autoComplete="off"
        readOnly={readOnly}
        style={style}
      />
      <span className="mx-1">/</span>
      <UnitSelect units={unitOptions} value={unit} onChange={handleUnitChange} />
    </div>
  );
});
PricePerVolumeInput.displayName = 'PricePerVolumeInput';

// --- Helper: Get density for selected material or custom ---
function getDensity(material: string, customDensity: string, customDensityUnit: string): number | undefined {
  if (material && material !== "custom") return MATERIAL_DENSITIES[material];
  if (material === "custom" && customDensity) {
    const val = Number(customDensity);
    if (!isNaN(val)) {
      const factor = DENSITY_TO_KGM3[customDensityUnit] || 1;
      return val * factor;
    }
  }
  return undefined;
}

// --- MAIN COMPONENT --- //
export default function StoneCalculator() {
  // --- STATE --- //
  // Section expand/collapse state
  const [shapeOpen, setShapeOpen] = useState(true);
  const [materialOpen, setMaterialOpen] = useState(true);
  const [costOpen, setCostOpen] = useState(true);

  // Stone shape state
  const [shape, setShape] = useState<"circular" | "rectangular">("circular");

  // Circular state
  const [radius, setRadius] = useState("");
  const [radiusUnit, setRadiusUnit] = useState("cm");
  const [diameter, setDiameter] = useState("");
  const [diameterUnit, setDiameterUnit] = useState("cm");
  const [thickness, setThickness] = useState("");
  const [thicknessUnit, setThicknessUnit] = useState("cm");

  // Rectangular state
  const [length, setLength] = useState("");
  const [lengthUnit, setLengthUnit] = useState("cm");
  const [width, setWidth] = useState("");
  const [widthUnit, setWidthUnit] = useState("cm");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");

  // Stone material/weight state
  const [material, setMaterial] = useState("");
  const [customDensity, setCustomDensity] = useState(""); // kg/m³ if custom
  const [numStones, setNumStones] = useState("1");
  const [totalWeightUnit, setTotalWeightUnit] = useState("kg");

  // Cost section state
  const [pricePerMass, setPricePerMass] = useState("");
  const [pricePerMassUnit, setPricePerMassUnit] = useState("kg");
  const [pricePerMassCurrency, setPricePerMassCurrency] = useState("PKR");
  const [pricePerVolume, setPricePerVolume] = useState("");
  const [pricePerVolumeUnit, setPricePerVolumeUnit] = useState("m³");
  const [pricePerVolumeCurrency, setPricePerVolumeCurrency] = useState("PKR");
  const [totalCostCurrency, setTotalCostCurrency] = useState("PKR");

  // Add state for custom density unit
  const [customDensityUnit, setCustomDensityUnit] = useState("kg/m³");

  // --- Area/Volume Unit State for Circular and Rectangular ---
  const [circularAreaUnit, setCircularAreaUnit] = useState("m²");
  const [circularVolumeUnit, setCircularVolumeUnit] = useState("m³");
  const [rectAreaUnit, setRectAreaUnit] = useState("m²");
  const [rectVolumeUnit, setRectVolumeUnit] = useState("m³");

  // Store the original price per mass value in kg for calculations
  const [pricePerMassInKg, setPricePerMassInKg] = useState(0);

  // Update pricePerMassInKg whenever pricePerMass or pricePerMassUnit changes
  useEffect(() => {
    if (pricePerMass) {
      const num = Number(pricePerMass);
      if (!isNaN(num)) {
        const valueInKg = num * (MASS_FACTORS[pricePerMassUnit] ?? 1);
        setPricePerMassInKg(valueInKg);
      } else {
        setPricePerMassInKg(0);
      }
    } else {
      setPricePerMassInKg(0);
    }
  }, [pricePerMass, pricePerMassUnit]);

  // --- CALCULATED FIELDS --- //
  // Area, volume, and weight are always recalculated in SI, then converted for display

  // --- Volume calculation ---
  const radiusSI = radius ? toSI(radius, radiusUnit, "length") : diameter ? toSI(diameter, diameterUnit, "length") / 2 : 0;
  const thicknessSI = toSI(thickness, thicknessUnit, "length");
  const circularAreaSI = Math.PI * Math.pow(radiusSI, 2);
  const circularVolumeSI = circularAreaSI * thicknessSI;

  const lengthSI = toSI(length, lengthUnit, "length");
  const widthSI = toSI(width, widthUnit, "length");
  const heightSI = toSI(height, heightUnit, "length");
  const rectAreaSI = lengthSI * widthSI;
  const rectVolumeSI = lengthSI * widthSI * heightSI;

  const volumeSI = shape === "circular" ? circularVolumeSI : rectVolumeSI;

  // --- Area/Volume for display ---
  const circularAreaValue = fromSI(circularAreaSI, circularAreaUnit, "area");
  const circularVolumeValue = fromSI(circularVolumeSI, circularVolumeUnit, "volume");
  const rectAreaValue = fromSI(rectAreaSI, rectAreaUnit, "area");
  const rectVolumeValue = fromSI(rectVolumeSI, rectVolumeUnit, "volume");

  // --- Density ---
  const density = getDensity(material, customDensity, customDensityUnit);

  // --- Weight calculation (Step 1: m = V * ρ) ---
  const numStonesNum = Number(numStones) || 1;
  const totalWeightSI = volumeSI && density ? volumeSI * density * numStonesNum : 0;

  // --- Step 2: Price per Volume from Price per Mass ---
  // Pv = Pm × ρ
  let pricePerVolumeAuto = "";
  let pricePerVolumeSI = 0;
  if (pricePerMassInKg > 0 && density) {
    // Use the stored price per mass in kg for calculations
    pricePerVolumeSI = pricePerMassInKg * density; // $/m³
    const factor = VOLUME_FACTORS[pricePerVolumeUnit] ?? 1;
    pricePerVolumeAuto = (pricePerVolumeSI * factor).toFixed(8).replace(/\.?0+$/, "");
  }

  // --- Step 3: Total Cost ---
  // C = m × Pm  or  C = V × Pv
  let totalCostValue = 0;
  let calculationMethod = "";

  // Always auto-calculate total cost if enough data is present
  if (pricePerMassInKg > 0 && density && volumeSI && numStonesNum) {
    // Use: C = m × Pm
    totalCostValue = totalWeightSI * pricePerMassInKg;
    calculationMethod = "Weight × Price per mass";
  } else if (pricePerVolume && volumeSI && numStonesNum) {
    // Use: C = V × Pv
    const pricePerVolumeSIInput = Number(pricePerVolume) / (VOLUME_FACTORS[pricePerVolumeUnit] ?? 1);
    totalCostValue = volumeSI * pricePerVolumeSIInput * numStonesNum;
    calculationMethod = "Volume × Price per volume";
  }

  // --- Price per volume for display ---
  const pricePerVolumeDisplay = pricePerMassInKg > 0 && density ? pricePerVolumeAuto : pricePerVolume;

  // --- CLEAR HANDLER --- //
  function handleClearAll() {
    setShape("circular");
    setRadius("");
    setRadiusUnit("cm");
    setDiameter("");
    setDiameterUnit("cm");
    setThickness("");
    setThicknessUnit("cm");
    setLength("");
    setLengthUnit("cm");
    setWidth("");
    setWidthUnit("cm");
    setHeight("");
    setHeightUnit("cm");
    setMaterial("");
    setCustomDensity("");
    setCustomDensityUnit("kg/m³");
    setNumStones("1");
    setTotalWeightUnit("kg");
    setPricePerMass("");
    setPricePerMassUnit("kg");
    setPricePerMassCurrency("PKR");
    setPricePerVolume("");
    setPricePerVolumeUnit("m³");
    setPricePerVolumeCurrency("PKR");
    setTotalCostCurrency("PKR");
    setCircularAreaUnit("m²");
    setCircularVolumeUnit("m³");
    setRectAreaUnit("m²");
    setRectVolumeUnit("m³");
    setPricePerMassInKg(0);
  }

  // --- Circular ↔ Diameter sync ---
  useEffect(() => {
    // Only update if one is filled and the other is empty
    if (radius && !diameter) {
      const r = Number(radius);
      if (!isNaN(r)) setDiameter((2 * r).toString());
    } else if (diameter && !radius) {
      const d = Number(diameter);
      if (!isNaN(d)) setRadius((d / 2).toString());
    }
    // Do not sync if both are filled (user may be editing both)
  }, [radius, diameter]);

  // --- Memoized handlers for inputs that were losing focus ---
  const handleNumStonesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNumStones(e.target.value);
  }, []);

  const handlePricePerMassChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPricePerMass(e.target.value);
  }, []);

  const handlePricePerVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow direct input if price per mass is not set
    if (!pricePerMass) setPricePerVolume(e.target.value);
  }, [pricePerMass]);

  return (
    <div className="bg-[#F9FAFF] min-h-screen py-10" autoComplete="off">
      {/* Stone calculator title */}
      <div className="w-[410px] mx-auto mb-4">
        <h1 className="text-2xl font-bold mb-2">Stone calculator</h1>
        <p className="text-gray-600 text-sm mb-2">
          Calculate volume, weight, and cost of your construction stones based on dimensions, material, and price. All units are supported!
        </p>
      </div>
      {/* Clear button */}
      <div className="w-[410px] mx-auto flex justify-end mb-4">
        <button
          type="button"
          className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-red-100 hover:text-red-700 transition"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>

      {/* 1. Stone shape and dimensions */}
      <SectionCard open={shapeOpen} setOpen={setShapeOpen} title="Stone shape and dimensions">
        {/* Shape radio */}
        <div className="mb-4">
          <div className="font-medium mb-2">Stone shape</div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="shape"
                value="circular"
                checked={shape === "circular"}
                onChange={() => setShape("circular")}
                className="accent-blue-500"
              />
              <span>Circular</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="shape"
                value="rectangular"
                checked={shape === "rectangular"}
                onChange={() => setShape("rectangular")}
                className="accent-blue-500"
              />
              <span>Rectangular</span>
            </label>
          </div>
        </div>
        {/* Circular shape inputs */}
        {shape === "circular" && (
          <>
            <InputWithUnit
              label="Radius"
              value={radius}
              onChange={setRadius}
              unit={radiusUnit}
              onUnitChange={setRadiusUnit}
              unitOptions={units.length}
              convertType="length"
            />
            <InputWithUnit
              label="Diameter"
              value={diameter}
              onChange={setDiameter}
              unit={diameterUnit}
              onUnitChange={setDiameterUnit}
              unitOptions={units.length}
              convertType="length"
            />
            <InputWithUnit
              label="Circular area"
              value={circularAreaValue}
              onChange={() => {}}
              unit={circularAreaUnit}
              onUnitChange={setCircularAreaUnit}
              unitOptions={units.area}
              info="Area of the circular face."
              disabled
              convertType="area"
            />
            <InputWithUnit
              label="Thickness"
              value={thickness}
              onChange={setThickness}
              unit={thicknessUnit}
              onUnitChange={setThicknessUnit}
              unitOptions={units.length}
              convertType="length"
            />
            <InputWithUnit
              label="Volume"
              value={circularVolumeValue}
              onChange={() => {}}
              unit={circularVolumeUnit}
              onUnitChange={setCircularVolumeUnit}
              unitOptions={units.volume}
              disabled
              convertType="volume"
            />
          </>
        )}
        {/* Rectangular shape inputs */}
        {shape === "rectangular" && (
          <>
            <InputWithUnit
              label="Length"
              value={length}
              onChange={setLength}
              unit={lengthUnit}
              onUnitChange={setLengthUnit}
              unitOptions={units.length}
              convertType="length"
            />
            <InputWithUnit
              label="Width"
              value={width}
              onChange={setWidth}
              unit={widthUnit}
              onUnitChange={setWidthUnit}
              unitOptions={units.length}
              convertType="length"
            />
            <InputWithUnit
              label="Rectangular area"
              value={rectAreaValue}
              onChange={() => {}}
              unit={rectAreaUnit}
              onUnitChange={setRectAreaUnit}
              unitOptions={units.area}
              info="Area of the rectangular face."
              disabled
              convertType="area"
            />
            <InputWithUnit
              label="Height"
              value={height}
              onChange={setHeight}
              unit={heightUnit}
              onUnitChange={setHeightUnit}
              unitOptions={units.length}
              convertType="length"
            />
            <InputWithUnit
              label="Volume"
              value={rectVolumeValue}
              onChange={() => {}}
              unit={rectVolumeUnit}
              onUnitChange={setRectVolumeUnit}
              unitOptions={units.volume}
              disabled
              convertType="volume"
            />
          </>
        )}
      </SectionCard>

      {/* 2. Stone material and weight */}
      <SectionCard open={materialOpen} setOpen={setMaterialOpen} title="Stone material and weight">
        <div className="mb-4">
          <div className="flex items-center text-sm font-medium mb-1">
            <span>Material</span>
            <span className="ml-1 text-gray-400" title="Select stone material">
              <FaInfoCircle />
            </span>
          </div>
          <select
            className="border rounded-lg px-3 py-2 bg-gray-50 text-base w-full focus:outline-none"
            value={material}
            onChange={e => setMaterial(e.target.value)}
          >
            {stoneMaterials.map((mat) => (
              <option key={mat.value} value={mat.value}>
                {mat.label}
              </option>
            ))}
          </select>
        </div>
        {material === "custom" && (
          <CustomDensityInput
            value={customDensity}
            onChange={setCustomDensity}
            unit={customDensityUnit}
            onUnitChange={setCustomDensityUnit}
          />
        )}
        <div className="mb-4">
          <div className="flex items-center text-sm font-medium mb-1">
            Number of stones
          </div>
          <input
            type="number"
            className="border rounded-lg px-3 py-2 bg-gray-50 text-base w-full focus:outline-none"
            value={numStones}
            min={1}
            onChange={handleNumStonesChange}
            autoComplete="off"
          />
        </div>
        <InputWithUnit
          label="Total weight of the stone pieces"
          value={fromSI(totalWeightSI, totalWeightUnit, "mass")}
          onChange={() => {}}
          unit={totalWeightUnit}
          onUnitChange={setTotalWeightUnit}
          unitOptions={units.mass}
          disabled
          convertType="mass"
        />
      </SectionCard>

      {/* 3. Cost of stone */}
      <SectionCard open={costOpen} setOpen={setCostOpen} title="Cost of stone">
        <div className="mb-4">
          <div className="flex items-center text-sm font-medium mb-1">
            Price per mass
          </div>
          <PricePerMassInput
            value={pricePerMass}
            onChange={setPricePerMass}
            unit={pricePerMassUnit}
            onUnitChange={setPricePerMassUnit}
            unitOptions={units.mass}
            currency={pricePerMassCurrency}
            onCurrencyChange={setPricePerMassCurrency}
          />
        </div>
        <div className="mb-4">
          <div className="flex items-center text-sm font-medium mb-1">
            Price per volume
          </div>
          <PricePerVolumeInput
            value={pricePerVolumeDisplay}
            onChange={setPricePerVolume}
            unit={pricePerVolumeUnit}
            onUnitChange={setPricePerVolumeUnit}
            unitOptions={units.volume}
            currency={pricePerVolumeCurrency}
            onCurrencyChange={setPricePerVolumeCurrency}
            readOnly={!!(pricePerMass && density)}
            style={pricePerMass && density ? { backgroundColor: "#f3f4f6", color: 'black'} : undefined}
          />
          {pricePerMass && density && (
            <div className="text-xs text-gray-500 mt-1">
              Calculated as: Price per mass × Density
            </div>
          )}
        </div>
        <div className="mb-2">
          <div className="flex items-center text-sm font-medium mb-1">
            Total cost
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 h-[44px] w-[360px]">
            <CurrencySelect value={totalCostCurrency} onChange={setTotalCostCurrency} />
            <input
              className="flex-1 min-w-0 bg-transparent border-0 outline-none text-base ml-2"
              type="number"
              value={
                typeof totalCostValue === "number" && !isNaN(totalCostValue) && totalCostValue !== 0
                  ? totalCostValue.toFixed(2)
                  : ""
              }
              onChange={() => {}}
              placeholder="Total"
              disabled
            />
          </div>
          {calculationMethod && (
            <div className="text-xs text-gray-500 mt-1">
              Calculated as: {calculationMethod}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}