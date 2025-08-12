export default function ConstructionConvertersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Construction Converters</h1>
      <p className="mb-6">
        Convert between different construction-related units of measurement.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Length Converter</h3>
          <p className="text-sm text-gray-600">Convert between feet, inches, meters, etc.</p>
        </div>
      </div>
    </div>
  );
}
