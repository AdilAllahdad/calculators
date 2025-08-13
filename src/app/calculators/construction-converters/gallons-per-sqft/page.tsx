"use client"
import React, { useState } from "react";

export default function GallonsPerSqftCalculator() {
  const [gallons, setGallons] = useState(0);
  const [area, setArea] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (area > 0) {
      setResult(gallons / area);
    } else {
      setResult(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Gallons per Square Foot Calculator</h1>
      <p className="mb-6 text-slate-600">
        Enter the total gallons and the area in square feet to calculate the coverage per square foot. Useful for paint, sealant, or any liquid application.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-slate-700 mb-1">Total Gallons</label>
            <input
              type="number"
              min="0"
              step="any"
              value={gallons}
              onChange={e => setGallons(Number(e.target.value))}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-slate-700 mb-1">Area (sq ft)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={area}
              onChange={e => setArea(Number(e.target.value))}
              className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Calculate
        </button>
      </form>
      {result !== null && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded text-blue-800 text-lg font-medium">
          Coverage: <span className="font-bold">{result.toFixed(4)}</span> gallons per square foot
        </div>
      )}
    </div>
  );
}
