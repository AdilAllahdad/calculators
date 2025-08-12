export default function CementConcretePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cement and Concrete Calculators</h1>
      <p className="mb-6">
        Calculate cement, sand, and aggregate quantities for concrete projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Concrete Mix Calculator</h3>
          <p className="text-sm text-gray-600">Calculate materials needed for concrete mix.</p>
        </div>
      </div>
    </div>
  );
}
