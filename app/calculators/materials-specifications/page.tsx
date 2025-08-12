export default function MaterialsSpecificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Materials Specifications Calculators</h1>
      <p className="mb-6">
        Calculate properties and specifications for different construction materials.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Steel Weight Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the weight of steel based on dimensions and type.</p>
        </div>
      </div>
    </div>
  );
}
