export default function HomeGardenPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Home and Garden Calculators</h1>
      <p className="mb-6">
        Calculators for home improvement and gardening projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Paint Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the amount of paint needed for a room.</p>
        </div>
      </div>
    </div>
  );
}
