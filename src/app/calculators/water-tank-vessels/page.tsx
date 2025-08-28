export default function WaterTankVesselsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Water Tank and Vessels Calculators</h1>
      <p className="mb-6">
        Calculate volumes, capacities, and related metrics for water tanks and vessels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
       <a href="/calculators/water-tank-vessels/fire-flow">
         <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Fire Flow Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the fire flow rate for a  water tank.</p>
        </div>
       </a>

       <a href="/calculators/water-tank-vessels/gallon-per-min">
         <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Gallon Per Minute Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the flow rate in gallons per minute for a water tank.</p>
        </div>
       </a>

         <a href="/calculators/water-tank-vessels/pool-cal">
         <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Pool Volume Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the volume of water in a pool.</p>
        </div>
       </a>

        <a href="/calculators/water-tank-vessels/pipe-volume">
         <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="font-medium">Pipe Volume Calculator</h3>
          <p className="text-sm text-gray-600">Calculate the volume of water in a pipe  .</p>
        </div>
       </a>
      </div>
    </div>
  );
}
