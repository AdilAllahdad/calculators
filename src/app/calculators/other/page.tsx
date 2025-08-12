export default function OtherCalculatorsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Other Calculators</h1>
      <p className="mb-6">
        Miscellaneous calculators that don't fit into other categories.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Cost Estimation Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the total cost of a construction project.</p>
        </div>
      </div>
    </div>
  );
}
