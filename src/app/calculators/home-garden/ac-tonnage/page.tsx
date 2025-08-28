"use client";

import { useState } from "react";
import UnitDropdown from "@/components/UnitDropdown";

export default function ACTonnageCalculator() {
  const [squareFeet, setSquareFeet] = useState<number | "">("");
  const [result, setResult] = useState<number | null>(null);

  const calculateTonnage = () => {
    if (typeof squareFeet === "number" && squareFeet > 0) {
      // Standard rule of thumb: 1 ton per 600 sq ft
      const tonnage = squareFeet / 600;
      setResult(tonnage);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AC Tonnage Calculator</h1>
      <p className="mb-6 text-gray-600">Calculate the required AC tonnage based on square footage</p>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-1">
            Square Footage
          </label>
          <input
            id="squareFeet"
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter square feet"
            value={squareFeet}
            onChange={(e) => setSquareFeet(e.target.value ? Number(e.target.value) : "")}
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={calculateTonnage}
        >
          Calculate
        </button>

        {result !== null && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="font-medium text-lg">Result:</h3>
            <p>Required AC Tonnage: {result.toFixed(2)} tons</p>
            <div className="mt-2 text-sm text-gray-600">
              <p>Recommendation:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{result <= 1 ? "1 ton AC unit" : Math.ceil(result) + " ton AC unit"}</li>
                <li>This is an estimate based on the standard rule of thumb (1 ton per 600 sq ft)</li>
                <li>For precise sizing, consult with an HVAC professional</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-medium">How it works:</h3>
          <p>
            This calculator uses the general rule of thumb that approximately 1 ton of air conditioning capacity is needed for every 600 square feet of living space. This is a simplified estimation and actual requirements may vary based on:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>Climate zone</li>
            <li>Ceiling height</li>
            <li>Insulation quality</li>
            <li>Number of windows and their efficiency</li>
            <li>Number of occupants</li>
            <li>Heat-generating appliances</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
