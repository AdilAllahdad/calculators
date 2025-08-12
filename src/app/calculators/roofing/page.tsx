export default function RoofingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Roofing Calculators</h1>
      <p className="mb-6">
        Calculate materials and costs for roofing projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Roof Area Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the area of your roof for material estimation.</p>
        </div>
      </div>
    </div>
  );
}
