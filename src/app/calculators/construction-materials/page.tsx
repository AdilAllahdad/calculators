export default function ConstructionMaterialsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Construction Materials Calculators</h1>
      <p className="mb-6">
        Calculate quantities and costs for various construction materials.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Brick Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the number of bricks needed for a wall.</p>
        </div>
      </div>
    </div>
  );
}
