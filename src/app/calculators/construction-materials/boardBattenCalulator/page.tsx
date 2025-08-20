"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Calculator, Ruler, Home, Package } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { convertLength } from "@/lib/conversions/length"

// ---- area conversion helper (base = m²)
const areaToM2 = {
  m2: 1,
  ft2: 0.09290304,
  in2: 0.00064516,
  cm2: 0.0001,
  yd2: 0.83612736,
} as const
type AreaUnit = keyof typeof areaToM2

function convertArea(value: number, from: AreaUnit, to: AreaUnit): number {
  if (from === to) return value
  const inM2 = value * areaToM2[from]
  return inM2 / areaToM2[to]
}

interface CalculatorState {
  // Dimensions
  wallWidth: number
  wallWidthUnit: string
  wallHeight: number
  wallHeightUnit: string
  wallArea: number
  wallAreaUnit: AreaUnit
  boardWidth: number
  boardWidthUnit: string
  boardSpacing: number
  boardSpacingUnit: string

  // Doors
  numberOfDoors: number
  doorHeight: number
  doorHeightUnit: string
  doorWidth: number
  doorWidthUnit: string

  // Windows
  numberOfWindows: number
  windowHeight: number
  windowHeightUnit: string
  windowWidth: number
  windowWidthUnit: string

  // Layout
  numberOfBoards: number
  numberOfBattens: number
  rowsOfFurringStrip: number
  numberOfTrims: number

  // Material
  boardMaterial: string
  boardMaterialValue: number
  boardMaterialUnit: string
  battenMaterial: string
  battenMaterialValue: number
  battenMaterialUnit: string
  furringStrip: string
  furringStripValue: number
  furringStripUnit: string
  trim: string
  trimValue: number
  trimUnit: string
}

const lengthUnits = [
  { value: 'cm', label: 'centimeters (cm)' },
  { value: 'm',  label: 'meters (m)' },
  { value: 'in', label: 'inches (in)' },
  { value: 'ft', label: 'feet (ft)' },
  { value: 'yd', label: 'yards (yd)' },
]

const areaUnits: { value: AreaUnit; label: string }[] = [
  { value: 'cm2', label: 'square centimeters (cm²)' },
  { value: 'm2',  label: 'square meters (m²)' },
  { value: 'in2', label: 'square inches (in²)' },
  { value: 'ft2', label: 'square feet (ft²)' },
  { value: 'yd2', label: 'square yards (yd²)' },
]

const materialUnits = [
  { value: 'cm', label: 'centimeters (cm)' },
  { value: 'm',  label: 'meters (m)' },
  { value: 'in', label: 'inches (in)' },
  { value: 'ft', label: 'feet (ft)' },
  { value: 'yd', label: 'yards (yd)' },
]

// Set default furring strip spacing (0.55m as per example)
const FURRING_SPACING_M = 0.55

export default function BoardBattenCalculator() {
  const [openSections, setOpenSections] = useState({
    dimensions: true,
    doors: true,
    windows: true,
    layout: true,
    material: true,
  })

  const [state, setState] = useState<CalculatorState>({
    // Dimensions
    wallWidth: 0,
    wallWidthUnit: "ft",
    wallHeight: 0,
    wallHeightUnit: "m",
    wallArea: 0,
    wallAreaUnit: "in2",
    boardWidth: 0,
    boardWidthUnit: "in",
    boardSpacing: 0,
    boardSpacingUnit: "ft",

    // Doors (defaults in meters)
    numberOfDoors: 0,
    doorHeight: 2.13,
    doorHeightUnit: "m",
    doorWidth: 1.52,
    doorWidthUnit: "m",

    // Windows (defaults in meters)
    numberOfWindows: 0,
    windowHeight: 1.22,
    windowHeightUnit: "m",
    windowWidth: 0.91,
    windowWidthUnit: "m",

    // Layout
    numberOfBoards: 0,
    numberOfBattens: 0,
    rowsOfFurringStrip: 0, // derived
    numberOfTrims: 2,

    // Material
    boardMaterial: "",
    boardMaterialValue: 0,
    boardMaterialUnit: "ft",
    battenMaterial: "",
    battenMaterialValue: 0,
    battenMaterialUnit: "m",
    furringStrip: "",
    furringStripValue: 0,
    furringStripUnit: "m",
    trim: "",
    trimValue: 0,
    trimUnit: "m",
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateState = (field: keyof CalculatorState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }

  // Unit change handler (length + area + material lengths)
  const handleUnitChange = (field: keyof CalculatorState, value: string) => {
    const numericFields: Record<string, keyof CalculatorState> = {
      wallWidthUnit: 'wallWidth',
      wallHeightUnit: 'wallHeight',
      boardWidthUnit: 'boardWidth',
      boardSpacingUnit: 'boardSpacing',
      doorHeightUnit: 'doorHeight',
      doorWidthUnit: 'doorWidth',
      windowHeightUnit: 'windowHeight',
      windowWidthUnit: 'windowWidth',
      wallAreaUnit: 'wallArea',
      boardMaterialUnit: 'boardMaterialValue',
      battenMaterialUnit: 'battenMaterialValue',
      furringStripUnit: 'furringStripValue',
      trimUnit: 'trimValue'
    }

    const numericField = numericFields[field]
    if (!numericField) {
      updateState(field, value)
      return
    }

    const currentValue = state[numericField]
    const currentUnit = state[field] as string

    if (typeof currentValue === 'number' && currentValue > 0) {
      let convertedValue: number

      if (field === 'wallAreaUnit') {
        convertedValue = convertArea(
          currentValue,
          currentUnit as AreaUnit,
          value as AreaUnit
        )
      } else {
        convertedValue = convertLength(currentValue, currentUnit, value)
      }

      setState(prev => ({
        ...prev,
        [field]: value,
        [numericField]: Number(convertedValue.toFixed(4))
      }))
    } else {
      updateState(field, value)
    }
  }

  // 1) wall area auto from width/height (shown in chosen unit)
  useEffect(() => {
    if (state.wallWidth > 0 && state.wallHeight > 0) {
      const wM = convertLength(state.wallWidth, state.wallWidthUnit, "m");
      const hM = convertLength(state.wallHeight, state.wallHeightUnit, "m");
      const areaM2 = wM * hM;
      const finalArea = convertArea(areaM2, "m2", state.wallAreaUnit);
      updateState("wallArea", Number(finalArea.toFixed(4)));
    } else {
      updateState("wallArea", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.wallWidth, state.wallWidthUnit, state.wallHeight, state.wallHeightUnit, state.wallAreaUnit])

  // 2) rows of furring strips (derived from height and spacing)
  useEffect(() => {
    const wallHeightM = convertLength(state.wallHeight, state.wallHeightUnit, "m")
    if (wallHeightM > 0) {
      // Rows = ceil(wallHeight / spacing) + 1 (to cover both ends)
      const rows = Math.max(1, Math.ceil(wallHeightM / FURRING_SPACING_M) + 1)
      if (state.rowsOfFurringStrip !== rows) {
        updateState('rowsOfFurringStrip', rows)
      }
    } else if (state.rowsOfFurringStrip !== 0) {
      updateState('rowsOfFurringStrip', 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.wallHeight, state.wallHeightUnit])

  // 3) boards/battens count (independent of openings)
  useEffect(() => {
    if (state.wallWidth > 0 && state.boardWidth > 0 && state.boardSpacing >= 0) {
      const wallWidthM = convertLength(state.wallWidth, state.wallWidthUnit, "m");
      const boardWidthM = convertLength(state.boardWidth, state.boardWidthUnit, "m");
      const spacingM = convertLength(state.boardSpacing, state.boardSpacingUnit, "m");
      const totalSection = boardWidthM + spacingM;

      // Boards = ceil(wallWidth / (boardWidth + spacing))
      const numberOfBoards = totalSection > 0
        ? Math.ceil(wallWidthM / totalSection)
        : 0;

      // Battens: cover all seams (including first and last edge)
      const numberOfBattens = numberOfBoards > 0 ? numberOfBoards + 1 : 0;

      updateState("numberOfBoards", numberOfBoards);
      updateState("numberOfBattens", numberOfBattens);
    } else {
      updateState("numberOfBoards", 0);
      updateState("numberOfBattens", 0);
    }
  }, [
    state.wallWidth, state.wallWidthUnit,
    state.boardWidth, state.boardWidthUnit,
    state.boardSpacing, state.boardSpacingUnit
  ]);

  // 4) materials — use standard formulas, always in meters for calculation, adjust for doors/windows
  useEffect(() => {
    const wallHeightM = convertLength(state.wallHeight, state.wallHeightUnit, 'm');
    const wallWidthM = convertLength(state.wallWidth, state.wallWidthUnit, 'm');
    const boardWidthM = convertLength(state.boardWidth, state.boardWidthUnit, 'm');
    const spacingM = convertLength(state.boardSpacing, state.boardSpacingUnit, 'm');
    const battenWidthM = boardWidthM; // If you want to allow separate batten width, add a field

    // Boards/battens
    const totalSection = boardWidthM + spacingM;
    const numberOfBoards = (wallWidthM > 0 && boardWidthM > 0 && spacingM >= 0 && totalSection > 0)
      ? Math.ceil(wallWidthM / totalSection)
      : 0;
    // Battens: cover all seams (including first and last edge)
    const numberOfBattens = numberOfBoards > 0 ? numberOfBoards + 1 : 0;

    // Openings area
    const doorArea = state.numberOfDoors *
      convertLength(state.doorHeight, state.doorHeightUnit, "m") *
      convertLength(state.doorWidth, state.doorWidthUnit, "m");
    const windowArea = state.numberOfWindows *
      convertLength(state.windowHeight, state.windowHeightUnit, "m") *
      convertLength(state.windowWidth, state.windowWidthUnit, "m");
    const totalOpeningsArea = doorArea + windowArea;

    // Board material (before adjustment)
    let boardMaterial = numberOfBoards * wallHeightM;
    // Batten material (before adjustment)
    let battenMaterial = numberOfBattens * wallHeightM;

    // Adjust for openings (subtract opening area divided by width)
    if (totalOpeningsArea > 0 && boardWidthM > 0) {
      boardMaterial -= totalOpeningsArea / boardWidthM;
      battenMaterial -= totalOpeningsArea / battenWidthM;
      boardMaterial = Math.max(0, boardMaterial);
      battenMaterial = Math.max(0, battenMaterial);
    }

    // Convert to selected units and round up
    const boardLengthInSelectedUnit = convertLength(boardMaterial, 'm', state.boardMaterialUnit);
    updateState('boardMaterialValue', Math.ceil(boardLengthInSelectedUnit));

    const battenLengthInSelectedUnit = convertLength(battenMaterial, 'm', state.battenMaterialUnit);
    updateState('battenMaterialValue', Math.ceil(battenLengthInSelectedUnit));

    // Furring strip material: ⌈Wall Height / Furring Spacing⌉ × Wall Width
    const furringRows = wallHeightM > 0 ? Math.ceil(wallHeightM / FURRING_SPACING_M) : 0;
    const furringLengthTotal = furringRows * wallWidthM;
    const furringLengthInSelectedUnit = convertLength(furringLengthTotal, 'm', state.furringStripUnit);
    updateState('furringStripValue', Math.ceil(furringLengthInSelectedUnit));

    // Trim material: number of trims × wall height
    const trims = Number.isFinite(state.numberOfTrims) && state.numberOfTrims > 0
      ? state.numberOfTrims
      : 2;
    const trimLengthTotal = trims * wallHeightM;
    const trimLengthInSelectedUnit = convertLength(trimLengthTotal, 'm', state.trimUnit);
    updateState('trimValue', Math.ceil(trimLengthInSelectedUnit));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.wallHeight, state.wallHeightUnit,
    state.wallWidth, state.wallWidthUnit,
    state.boardWidth, state.boardWidthUnit,
    state.boardSpacing, state.boardSpacingUnit,
    state.rowsOfFurringStrip,
    state.numberOfTrims,
    state.numberOfDoors, state.doorHeight, state.doorHeightUnit,
    state.doorWidth, state.doorWidthUnit,
    state.numberOfWindows, state.windowHeight, state.windowHeightUnit,
    state.windowWidth, state.windowWidthUnit,
    state.furringStripUnit, state.trimUnit,
    state.boardMaterialUnit, state.battenMaterialUnit
  ])

  // Results (areas & counts)
  const calculateResults = () => {
    const doorArea =
      state.numberOfDoors *
      convertLength(state.doorHeight, state.doorHeightUnit, "m") *
      convertLength(state.doorWidth, state.doorWidthUnit, "m")

    const windowArea =
      state.numberOfWindows *
      convertLength(state.windowHeight, state.windowHeightUnit, "m") *
      convertLength(state.windowWidth, state.windowWidthUnit, "m")

    const wallAreaInM2 = convertArea(state.wallArea, state.wallAreaUnit, "m2")
    const netWallArea = Math.max(0, wallAreaInM2 - doorArea - windowArea)

    return {
      totalWallArea: wallAreaInM2,
      doorArea,
      windowArea,
      netWallArea,
      boardsNeeded: state.numberOfBoards,
      battensNeeded: state.numberOfBattens,
      furringStripRows: state.rowsOfFurringStrip,
      trimsNeeded: state.numberOfTrims,
    }
  }

  const results = calculateResults()

  // Clear
  const handleClear = () => {
    setState({
      // Dimensions
      wallWidth: 0,
      wallWidthUnit: "ft",
      wallHeight: 0,
      wallHeightUnit: "m",
      wallArea: 0,
      wallAreaUnit: "in2",
      boardWidth: 0,
      boardWidthUnit: "in",
      boardSpacing: 0,
      boardSpacingUnit: "ft",

      // Doors (m)
      numberOfDoors: 0,
      doorHeight: 2.13,
      doorHeightUnit: "m",
      doorWidth: 1.52,
      doorWidthUnit: "m",

      // Windows (m)
      numberOfWindows: 0,
      windowHeight: 1.22,
      windowHeightUnit: "m",
      windowWidth: 0.91,
      windowWidthUnit: "m",

      // Layout
      numberOfBoards: 0,
      numberOfBattens: 0,
      rowsOfFurringStrip: 0,
      numberOfTrims: 2,

      // Material
      boardMaterial: "",
      boardMaterialValue: 0,
      boardMaterialUnit: "ft",
      battenMaterial: "",
      battenMaterialValue: 0,
      battenMaterialUnit: "m",
      furringStrip: "",
      furringStripValue: 0,
      furringStripUnit: "m",
      trim: "",
      trimValue: 0,
      trimUnit: "m",
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-blue-600" />
          Board and Batten Calculator
        </h1>
        <p className="text-gray-600">Calculate materials needed for your board and batten siding project</p>
      </div>

      {/* Dimensions */}
      <Card>
        <Collapsible open={openSections.dimensions} onOpenChange={() => toggleSection("dimensions")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-blue-600" />
                  Dimensions
                </div>
                {openSections.dimensions ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wall-width">Wall width</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wall-width"
                      type="number"
                      value={state.wallWidth || ""}
                      onChange={(e) => updateState("wallWidth", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <Select value={state.wallWidthUnit} onValueChange={(v) => handleUnitChange("wallWidthUnit", v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50">
                        {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wall-height">Wall height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wall-height"
                      type="number"
                      value={state.wallHeight || ""}
                      onChange={(e) => updateState("wallHeight", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <Select value={state.wallHeightUnit} onValueChange={(v) => handleUnitChange("wallHeightUnit", v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50">
                        {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wall-area">Wall area</Label>
                <div className="flex gap-2">
                  <Input
                    id="wall-area"
                    type="number"
                    value={state.wallArea || ""}
                    onChange={(e) => updateState("wallArea", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                  <Select value={state.wallAreaUnit} onValueChange={(v) => handleUnitChange("wallAreaUnit", v)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50">
                      {areaUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="board-width">Board width</Label>
                  <div className="flex gap-2">
                    <Input
                      id="board-width"
                      type="number"
                      value={state.boardWidth || ""}
                      onChange={(e) => updateState("boardWidth", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <Select value={state.boardWidthUnit} onValueChange={(v) => handleUnitChange("boardWidthUnit", v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50">
                        {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="board-spacing">Board spacing</Label>
                  <div className="flex gap-2">
                    <Input
                      id="board-spacing"
                      type="number"
                      value={state.boardSpacing || ""}
                      onChange={(e) => updateState("boardSpacing", Number.parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                    <Select value={state.boardSpacingUnit} onValueChange={(v) => handleUnitChange("boardSpacingUnit", v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-50">
                        {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Doors & Windows */}
      <Card>
        <Collapsible open={openSections.doors} onOpenChange={() => toggleSection("doors")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  Doors and windows
                </div>
                {openSections.doors ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="number-doors">Number of doors</Label>
                  <Input
                    id="number-doors"
                    type="number"
                    value={state.numberOfDoors || ""}
                    onChange={(e) => updateState("numberOfDoors", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="door-height">Door height</Label>
                    <div className="flex gap-2">
                      <Input
                        id="door-height"
                        type="number"
                        step="0.01"
                        value={state.doorHeight || ""}
                        onChange={(e) => updateState("doorHeight", Number.parseFloat(e.target.value) || 0)}
                        placeholder="2.13"
                      />
                      <Select value={state.doorHeightUnit} onValueChange={(v) => handleUnitChange("doorHeightUnit", v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-50">
                          {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="door-width">Door width</Label>
                    <div className="flex gap-2">
                      <Input
                        id="door-width"
                        type="number"
                        step="0.01"
                        value={state.doorWidth || ""}
                        onChange={(e) => updateState("doorWidth", Number.parseFloat(e.target.value) || 0)}
                        placeholder="1.52"
                      />
                      <Select value={state.doorWidthUnit} onValueChange={(v) => handleUnitChange("doorWidthUnit", v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-50">
                          {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="number-windows">Number of windows</Label>
                  <Input
                    id="number-windows"
                    type="number"
                    value={state.numberOfWindows || ""}
                    onChange={(e) => updateState("numberOfWindows", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="window-height">Window height</Label>
                    <div className="flex gap-2">
                      <Input
                        id="window-height"
                        type="number"
                        step="0.01"
                        value={state.windowHeight || ""}
                        onChange={(e) => updateState("windowHeight", Number.parseFloat(e.target.value) || 0)}
                        placeholder="1.22"
                      />
                      <Select value={state.windowHeightUnit} onValueChange={(v) => handleUnitChange("windowHeightUnit", v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-50">
                          {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="window-width">Window width</Label>
                    <div className="flex gap-2">
                      <Input
                        id="window-width"
                        type="number"
                        step="0.01"
                        value={state.windowWidth || ""}
                        onChange={(e) => updateState("windowWidth", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0.91"
                      />
                      <Select value={state.windowWidthUnit} onValueChange={(v) => handleUnitChange("windowWidthUnit", v)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-50">
                          {lengthUnits.map((u) => (<SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Layout */}
      <Card>
        <Collapsible open={openSections.layout} onOpenChange={() => toggleSection("layout")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Layout
                </div>
                {openSections.layout ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number-boards">Number of boards</Label>
                  <Input
                    id="number-boards"
                    type="number"
                    value={state.numberOfBoards || ""}
                    readOnly
                    className="bg-gray-50"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number-battens">Number of battens</Label>
                  <Input
                    id="number-battens"
                    type="number"
                    value={state.numberOfBattens || ""}
                    readOnly
                    className="bg-gray-50"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="furring-strips">Rows of furring strip (derived)</Label>
                  <Input
                    id="furring-strips"
                    type="number"
                    value={state.rowsOfFurringStrip || ""}
                    readOnly
                    className="bg-gray-50"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number-trims">Number of trims</Label>
                  <Input
                    id="number-trims"
                    type="number"
                    value={state.numberOfTrims || ""}
                    onChange={(e) => updateState("numberOfTrims", Number.parseInt(e.target.value) || 0)}
                    placeholder="2"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Material */}
      <Card>
        <Collapsible open={openSections.material} onOpenChange={() => toggleSection("material")}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Material
                </div>
                {openSections.material ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {/* Board material */}
              <div className="space-y-2">
                <Label>Board material length</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={state.boardMaterialValue || ""}
                    className="bg-gray-50"
                    readOnly
                    placeholder="0"
                  />
                  <Select value={state.boardMaterialUnit} onValueChange={(v) => handleUnitChange("boardMaterialUnit", v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengthUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value} className="bg-gray-50">
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Batten material */}
              <div className="space-y-2">
                <Label>Batten material length</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={state.battenMaterialValue || ""}
                    className="bg-gray-50"
                    readOnly
                    placeholder="0"
                  />
                  <Select value={state.battenMaterialUnit} onValueChange={(v) => handleUnitChange("battenMaterialUnit", v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengthUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value} className="bg-gray-50">
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Furring strip */}
              <div className="space-y-2">
                <Label>Furring strip length</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={state.furringStripValue || ""}
                    className="bg-gray-50"
                    readOnly
                    placeholder="0"
                  />
                  <Select value={state.furringStripUnit} onValueChange={(v) => handleUnitChange("furringStripUnit", v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengthUnits.map((unit) => (
                        <SelectItem className="bg-gray-50" key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Trim */}
              <div className="space-y-2">
                <Label>Trim length</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={state.trimValue || ""}
                    className="bg-gray-50"
                    readOnly
                    placeholder="0"
                  />
                  <Select value={state.trimUnit} onValueChange={(v) => handleUnitChange("trimUnit", v)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengthUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value} className="bg-gray-50">
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Clear */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Clear All Fields
        </button>
      </div>
    </div>
  )
}
