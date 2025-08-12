export default function WaterTankVesselsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Water Tank and Vessels Calculators</h1>
      <p className="mb-6">
        Calculate volumes, capacities, and related metrics for water tanks and vessels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Cylindrical Tank Volume Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the volume of a cylindrical water tank.</p>
        </div>
      </div>
    </div>
  );
}
