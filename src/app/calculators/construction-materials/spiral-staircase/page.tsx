'use client'
import React, { useState, useEffect } from 'react';

// Add a type for all field keys
type FieldKey =
  | 'insideDiameter'
  | 'outsideDiameter'
  | 'angleOfRotation'
  | 'totalRise'
  | 'maxRiserRise'
  | 'numberOfSteps'
  | 'actualRiserRise'
  | 'innerArc'
  | 'outerArc'
  | 'treadDepthCheck'
  | 'treadAngle'
  | 'treadLength'
  | 'numberOfTreads'
  | 'handrailLength'
  | 'innerStringerLength'
  | 'innerStairAngle'
  | 'outerStairAngle'
  | 'headroomClearance';

const initialFields: Record<FieldKey, string> = {
  // Spiral staircase details
  insideDiameter: '',
  outsideDiameter: '',
  angleOfRotation: '6.283', // default 2π radians
  totalRise: '',
  maxRiserRise: '',
  numberOfSteps: '',
  actualRiserRise: '',
  // Tread dimensions
  innerArc: '',
  outerArc: '',
  treadDepthCheck: '',
  treadAngle: '',
  treadLength: '',
  numberOfTreads: '',
  // Other results
  handrailLength: '',
  innerStringerLength: '',
  innerStairAngle: '',
  outerStairAngle: '',
  headroomClearance: '',
};

const initialUnits: Record<FieldKey, string> = {
  // Spiral staircase details
  insideDiameter: 'cm',
  outsideDiameter: 'cm',
  angleOfRotation: 'rad',
  totalRise: 'cm',
  maxRiserRise: 'cm',
  numberOfSteps: '', // no unit
  actualRiserRise: 'cm',
  // Tread dimensions
  innerArc: 'cm',
  outerArc: 'cm',
  treadDepthCheck: 'cm',
  treadAngle: 'deg',
  treadLength: 'cm',
  numberOfTreads: '', // no unit
  // Other results
  handrailLength: 'cm',
  innerStringerLength: 'cm',
  innerStairAngle: 'deg',
  outerStairAngle: 'deg',
  headroomClearance: 'cm',
};

const lengthUnitOptions = [
  { label: "millimeters (mm)", value: "mm" },
  { label: "centimeters (cm)", value: "cm" },
  { label: "meters (m)", value: "m" },
  { label: "inches (in)", value: "in" },
  { label: "feet (ft)", value: "ft" },
  { label: "yards (yd)", value: "yd" },
];

const angleUnitOptions = [
  { label: "degrees (deg)", value: "deg" },
  { label: "radians (rad)", value: "rad" },
];

// --- Conversion helpers ---
const lengthToCm: { [unit: string]: (v: number) => number } = {
  mm: (v: number) => v / 10,
  cm: (v: number) => v,
  m: (v: number) => v * 100,
  in: (v: number) => v * 2.54,
  ft: (v: number) => v * 30.48,
  yd: (v: number) => v * 91.44,
};
const cmToLength: { [unit: string]: (v: number) => number } = {
  mm: (v: number) => v * 10,
  cm: (v: number) => v,
  m: (v: number) => v / 100,
  in: (v: number) => v / 2.54,
  ft: (v: number) => v / 30.48,
  yd: (v: number) => v / 91.44,
};

const angleToDeg: { [unit: string]: (v: number) => number } = {
  deg: (v: number) => v,
  rad: (v: number) => v * (180 / Math.PI),
};
const degToAngle: { [unit: string]: (v: number) => number } = {
  deg: (v: number) => v,
  rad: (v: number) => v * (Math.PI / 180),
};

const degToRad = (deg: number) => deg * (Math.PI / 180);
const radToDeg = (rad: number) => rad * (180 / Math.PI);

// --- UI Components (unchanged) ---
const LabelWithInfo = (props: any) => (
  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
    {props.label}
    <span className="ml-1 text-gray-400 cursor-pointer" title={props.label}>
      &#9432;
    </span>
    {props.unit && (
      <span className="ml-auto text-xs text-gray-400 font-normal">
        {props.unit}
      </span>
    )}
  </label>
);

const InputRow = (props: any) => {
  const {
    label,
    name,
    value,
    onChange,
    unit,
    unitValue,
    onUnitChange,
    disabled,
    suffix,
    error,
  } = props;

  let options: { label: string; value: string }[] = [];
  if (
    unit === "cm" ||
    unit === "mm" ||
    unit === "m" ||
    unit === "in" ||
    unit === "ft" ||
    unit === "yd"
  ) {
    options = lengthUnitOptions;
  } else if (unit === "deg" || unit === "rad") {
    options = angleUnitOptions;
  }
  return (
    <div className="mb-5">
      <LabelWithInfo label={label} unit={undefined} />
      <div className="flex items-center w-full">
        <div className="flex w-full">
          <input
            className={`border rounded-l px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ${error ? 'border-red-500 bg-red-50' : ''}`}
            style={{ width: unit ? "75%" : "100%" }}
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            autoComplete="off"
          />
          {unit && (
            <select
              className={`border-l-0 border rounded-r px-2 py-2 text-lg bg-white ${error ? 'border-red-500 bg-red-50' : ''}`}
              style={{ width: "25%" }}
              value={unitValue}
              onChange={onUnitChange}
              name={name + "Unit"}
            >
              {options.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          )}
        </div>
        {suffix && (
          <span className="ml-3 text-gray-500 text-lg whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <div className="text-xs text-red-600 mt-1">{error}</div>
      )}
    </div>
  );
};

const Section = (props: any) => {
  const { title, children, defaultOpen = true } = props;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 w-[480px]">
      <button
        className="flex items-center w-full text-left font-semibold text-gray-700 mb-4 text-xl"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="mr-3">{open ? "▾" : "▸"}</span>
        {title}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

// --- Main Calculator Logic ---
const page = () => {
  const [fields, setFields] = useState<Record<FieldKey, string>>(initialFields);
  const [units, setUnits] = useState<Record<FieldKey, string>>(initialUnits);
  const [baseFields, setBaseFields] = useState<Record<FieldKey, string>>(initialFields);
  const [errors, setErrors] = useState<{ [k in FieldKey]?: string }>({});

  // Helper to determine type
  const getType = (name: string): "length" | "angle" | null => {
    if (
      [
        "insideDiameter",
        "outsideDiameter",
        "totalRise",
        "maxRiserRise",
        "actualRiserRise",
        "innerArc",
        "outerArc",
        "treadDepthCheck",
        "treadLength",
        "handrailLength",
        "innerStringerLength",
        "headroomClearance",
      ].includes(name)
    ) {
      return "length";
    }
    if (
      ["treadAngle", "innerStairAngle", "outerStairAngle", "angleOfRotation"].includes(
        name
      )
    ) {
      return "angle";
    }
    return null;
  };

  // --- Input Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as FieldKey;
    const type = getType(key);
    let baseValue = value;
    if (type && value && !isNaN(Number(value))) {
      if (type === "length") {
        baseValue = String(lengthToCm[units[key]](Number(value)));
      } else if (type === "angle") {
        baseValue = String(angleToDeg[units[key]](Number(value)));
      }
    }
    setBaseFields({ ...baseFields, [key]: baseValue });
    setFields({ ...fields, [key]: value });
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name.replace("Unit", "") as FieldKey;
    const newUnit = e.target.value;
    const type = getType(name);
    let displayValue = fields[name];
    if (type && baseFields[name]) {
      if (type === "length") {
        displayValue = cmToLength[newUnit](Number(baseFields[name])).toString();
      } else if (type === "angle") {
        displayValue = degToAngle[newUnit](Number(baseFields[name])).toString();
      }
    }
    setUnits({ ...units, [name]: newUnit });
    setFields({ ...fields, [name]: displayValue });
  };

  const handleClear = () => {
    setFields(initialFields);
    setUnits(initialUnits);
    setBaseFields(initialFields);
  };

  // --- Validation Logic ---
  useEffect(() => {
    const newErrors: { [k in FieldKey]?: string } = {};

    // Helper for positive number validation
    const mustBePositive = (val: string, label: string, allowZero = true) => {
      if (val === '') return undefined;
      const num = Number(val);
      if (isNaN(num)) return `${label} must be a valid number.`;
      if (allowZero ? num < 0 : num <= 0) return `${label} must be greater than${allowZero ? ' or equal to' : ''} zero.`;
      return undefined;
    };

    // Validate all user input fields (not calculated fields)
    newErrors.insideDiameter = mustBePositive(fields.insideDiameter, "The inside diameter");
    newErrors.outsideDiameter = mustBePositive(fields.outsideDiameter, "The outside diameter");
    newErrors.angleOfRotation = mustBePositive(fields.angleOfRotation, "The angle of rotation", false);
    newErrors.totalRise = mustBePositive(fields.totalRise, "The total rise", false);
    newErrors.maxRiserRise = mustBePositive(fields.maxRiserRise, "The maximum riser rise", false);

    // Additional logic for inside/outside diameter relationship
    const inside = parseFloat(baseFields.insideDiameter) || 0;
    const outside = parseFloat(baseFields.outsideDiameter) || 0;
    if (
      !newErrors.insideDiameter &&
      !newErrors.outsideDiameter &&
      fields.insideDiameter &&
      fields.outsideDiameter
    ) {
      if (inside >= outside) {
        newErrors.insideDiameter = "The inside diameter must be smaller than the outside diameter.";
        newErrors.outsideDiameter = "The outside diameter must be greater than the inside diameter.";
      }
    }

    // Optionally, validate other user-editable fields if needed
    // (e.g. treadLength, etc. if you make them editable)

    setErrors(newErrors);
  }, [
    fields.insideDiameter,
    fields.outsideDiameter,
    fields.angleOfRotation,
    fields.totalRise,
    fields.maxRiserRise,
    baseFields.insideDiameter,
    baseFields.outsideDiameter,
  ]);

  // --- Calculation Logic ---
  useEffect(() => {
    // Parse all required base values (in base units: cm for length, deg for angle)
    const insideDiameterCm = parseFloat(baseFields.insideDiameter) || 0;
    const outsideDiameterCm = parseFloat(baseFields.outsideDiameter) || 0;
    const totalRiseCm = parseFloat(baseFields.totalRise) || 0;
    const maxRiserRiseCm = parseFloat(baseFields.maxRiserRise) || 0;
    let angleOfRotationDeg = 0;
    if (units.angleOfRotation === "rad") {
      angleOfRotationDeg = radToDeg(parseFloat(fields.angleOfRotation) || 0);
    } else {
      angleOfRotationDeg = parseFloat(fields.angleOfRotation) || 0;
    }

    // 1. Number of steps (rounded up)
    let numberOfSteps = 0;
    if (totalRiseCm > 0 && maxRiserRiseCm > 0) {
      numberOfSteps = Math.ceil(totalRiseCm / maxRiserRiseCm);
    }

    // 2. Actual riser rise
    let actualRiserRiseCm = 0;
    if (numberOfSteps > 0) {
      actualRiserRiseCm = totalRiseCm / numberOfSteps;
    }

    // 3. Number of treads (steps - 1)
    let numberOfTreads = numberOfSteps > 0 ? numberOfSteps - 1 : 0;

    // 4. Tread angle (angle of rotation / number of treads)
    let treadAngleDeg = 0;
    if (numberOfTreads > 0 && angleOfRotationDeg > 0) {
      treadAngleDeg = angleOfRotationDeg / numberOfTreads;
    }

    // 5. Tread length (outsideDiameter - insideDiameter) / 2
    let treadLengthCm = 0;
    if (outsideDiameterCm > 0 && insideDiameterCm >= 0) {
      treadLengthCm = (outsideDiameterCm - insideDiameterCm) / 2;
    }

    // 6. Inner arc and outer arc
    let innerArcCm = 0,
      outerArcCm = 0;
    if (treadAngleDeg > 0 && insideDiameterCm >= 0 && outsideDiameterCm > 0) {
      innerArcCm =
        (treadAngleDeg * Math.PI) / 180 * (insideDiameterCm / 2);
      outerArcCm =
        (treadAngleDeg * Math.PI) / 180 * (outsideDiameterCm / 2);
    }

    // 7. Tread depth check (outer arc - inner arc)
    let treadDepthCheckCm = 0;
    if (outerArcCm > 0 && innerArcCm >= 0) {
      treadDepthCheckCm = outerArcCm - innerArcCm;
    }

    // 8. Handrail length and inner stringer length
    let handrailLengthCm = 0,
      innerStringerLengthCm = 0;
    if (outerArcCm > 0 && actualRiserRiseCm > 0 && numberOfSteps > 0) {
      handrailLengthCm =
        Math.sqrt(Math.pow(outerArcCm, 2) + Math.pow(actualRiserRiseCm, 2)) *
        numberOfSteps;
    }
    if (innerArcCm > 0 && actualRiserRiseCm > 0 && numberOfSteps > 0) {
      innerStringerLengthCm =
        Math.sqrt(Math.pow(innerArcCm, 2) + Math.pow(actualRiserRiseCm, 2)) *
        numberOfSteps;
    }

    // 9. Inner/outer stair angles (atan(actualRiserRise / arc))
    let innerStairAngleDeg = 0,
      outerStairAngleDeg = 0;
    if (actualRiserRiseCm > 0 && innerArcCm > 0) {
      innerStairAngleDeg = radToDeg(Math.atan(actualRiserRiseCm / innerArcCm));
    }
    if (actualRiserRiseCm > 0 && outerArcCm > 0) {
      outerStairAngleDeg = radToDeg(Math.atan(actualRiserRiseCm / outerArcCm));
    }

    // 10. Headroom clearance
    let headroomClearanceCm = 0;
    if (treadAngleDeg > 0 && actualRiserRiseCm > 0) {
      const treadsPer360 = Math.floor(360 / treadAngleDeg);
      headroomClearanceCm = actualRiserRiseCm * treadsPer360;
    }

    // --- Update all calculated fields (convert to display units) ---
    setFields((prev) => ({
      ...prev,
      numberOfSteps: numberOfSteps ? numberOfSteps.toString() : '',
      actualRiserRise:
        actualRiserRiseCm ?
          cmToLength[units.actualRiserRise](actualRiserRiseCm).toFixed(3) :
          '',
      numberOfTreads: numberOfTreads ? numberOfTreads.toString() : '',
      treadAngle:
        treadAngleDeg ?
          (units.treadAngle === 'rad'
            ? degToAngle['rad'](treadAngleDeg).toFixed(6)
            : treadAngleDeg.toFixed(3)) :
          '',
      treadLength: treadLengthCm ? cmToLength[units.treadLength](treadLengthCm).toFixed(3) : '',
      innerArc: innerArcCm ? cmToLength[units.innerArc](innerArcCm).toFixed(3) : '',
      outerArc: outerArcCm ? cmToLength[units.outerArc](outerArcCm).toFixed(3) : '',
      treadDepthCheck: treadDepthCheckCm ? cmToLength[units.treadDepthCheck](treadDepthCheckCm).toFixed(3) : '',
      handrailLength: handrailLengthCm ? cmToLength[units.handrailLength](handrailLengthCm).toFixed(3) : '',
      innerStringerLength: innerStringerLengthCm ? cmToLength[units.innerStringerLength](innerStringerLengthCm).toFixed(3) : '',
      innerStairAngle: innerStairAngleDeg ? (units.innerStairAngle === 'rad'
        ? degToAngle['rad'](innerStairAngleDeg).toFixed(6)
        : innerStairAngleDeg.toFixed(3)) : '',
      outerStairAngle: outerStairAngleDeg ? (units.outerStairAngle === 'rad'
        ? degToAngle['rad'](outerStairAngleDeg).toFixed(6)
        : outerStairAngleDeg.toFixed(3)) : '',
      headroomClearance: headroomClearanceCm ? cmToLength[units.headroomClearance](headroomClearanceCm).toFixed(3) : '',
    }));
    // eslint-disable-next-line
  }, [
    baseFields.insideDiameter,
    baseFields.outsideDiameter,
    baseFields.totalRise,
    baseFields.maxRiserRise,
    fields.angleOfRotation,
    units.angleOfRotation,
    units.actualRiserRise,
    units.treadAngle,
    units.treadLength,
    units.innerArc,
    units.outerArc,
    units.treadDepthCheck,
    units.handrailLength,
    units.innerStringerLength,
    units.innerStairAngle,
    units.outerStairAngle,
    units.headroomClearance,
  ]);

  // --- Render ---
  return (
    <div className="flex flex-col items-center min-h-screen  py-12">
      <h1 className="text-4xl font-bold mb-10">Spiral Staircase Calculator</h1>
      <div className="w-full flex flex-col items-center">
        <Section title="Spiral staircase details">
          <InputRow
            label="Inside diameter"
            name="insideDiameter"
            value={fields.insideDiameter}
            onChange={handleChange}
            unit="cm"
            unitValue={units.insideDiameter}
            onUnitChange={handleUnitChange}
            error={errors.insideDiameter}
          />
          <InputRow
            label="Outside diameter"
            name="outsideDiameter"
            value={fields.outsideDiameter}
            onChange={handleChange}
            unit="cm"
            unitValue={units.outsideDiameter}
            onUnitChange={handleUnitChange}
            error={errors.outsideDiameter}
          />
          <InputRow
            label="Angle of rotation"
            name="angleOfRotation"
            value={fields.angleOfRotation}
            onChange={handleChange}
            unit="rad"
            unitValue={units.angleOfRotation}
            onUnitChange={handleUnitChange}
            error={errors.angleOfRotation}
          />
          <InputRow
            label="Total rise"
            name="totalRise"
            value={fields.totalRise}
            onChange={handleChange}
            unit="cm"
            unitValue={units.totalRise}
            onUnitChange={handleUnitChange}
            error={errors.totalRise}
          />
          <InputRow
            label="Maximum riser rise"
            name="maxRiserRise"
            value={fields.maxRiserRise}
            onChange={handleChange}
            unit="cm"
            unitValue={units.maxRiserRise}
            onUnitChange={handleUnitChange}
            error={errors.maxRiserRise}
          />
          <InputRow
            label="Number of steps"
            name="numberOfSteps"
            value={fields.numberOfSteps}
            onChange={() => {}}
            disabled
            suffix="steps"
          />
          <InputRow
            label="Actual riser rise"
            name="actualRiserRise"
            value={fields.actualRiserRise}
            onChange={() => {}}
            unit="cm"
            unitValue={units.actualRiserRise}
            onUnitChange={handleUnitChange}
            disabled
          />
        </Section>
        <Section title="Tread dimensions">
          <InputRow
            label="Inner arc"
            name="innerArc"
            value={fields.innerArc}
            onChange={() => {}}
            unit="cm"
            unitValue={units.innerArc}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Outer arc"
            name="outerArc"
            value={fields.outerArc}
            onChange={() => {}}
            unit="cm"
            unitValue={units.outerArc}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Tread depth check"
            name="treadDepthCheck"
            value={fields.treadDepthCheck}
            onChange={() => {}}
            unit="cm"
            unitValue={units.treadDepthCheck}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Tread angle"
            name="treadAngle"
            value={fields.treadAngle}
            onChange={() => {}}
            unit="deg"
            unitValue={units.treadAngle}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Tread length"
            name="treadLength"
            value={fields.treadLength}
            onChange={() => {}}
            unit="cm"
            unitValue={units.treadLength}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Number of treads"
            name="numberOfTreads"
            value={fields.numberOfTreads}
            onChange={() => {}}
            disabled
            suffix="treads"
          />
        </Section>
        <Section title="Other results">
          <InputRow
            label="Handrail length"
            name="handrailLength"
            value={fields.handrailLength}
            onChange={() => {}}
            unit="cm"
            unitValue={units.handrailLength}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Inner stringer length"
            name="innerStringerLength"
            value={fields.innerStringerLength}
            onChange={() => {}}
            unit="cm"
            unitValue={units.innerStringerLength}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Inner stair angle"
            name="innerStairAngle"
            value={fields.innerStairAngle}
            onChange={() => {}}
            unit="deg"
            unitValue={units.innerStairAngle}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Outer stair angle"
            name="outerStairAngle"
            value={fields.outerStairAngle}
            onChange={() => {}}
            unit="deg"
            unitValue={units.outerStairAngle}
            onUnitChange={handleUnitChange}
            disabled
          />
          <InputRow
            label="Headroom clearance"
            name="headroomClearance"
            value={fields.headroomClearance}
            onChange={() => {}}
            unit="cm"
            unitValue={units.headroomClearance}
            onUnitChange={handleUnitChange}
            disabled
          />
        </Section>
        <button
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-12 rounded shadow text-lg"
          onClick={handleClear}
          type="button"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default page;
