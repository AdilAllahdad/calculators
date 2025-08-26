export default function MaterialsSpecificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Drive way calculators</h1>
      <p className="mb-6">
        Drive way calculators help you determine the necessary specifications and materials for your driveway projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <a href="/calculators/drive-way-cal/asphalt-cal" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Asphalt Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the amount of asphalt needed for your driveway.</p>
          </div>
        </a>

          <a href="/calculators/drive-way-cal/gravel-drive-way" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Gravel Drive Way Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the amount of gravel needed for your driveway.</p>
          </div>
        </a>

        <a href="/calculators/drive-way-cal/concrete-driveway" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Concrete Drive Way Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the amount of concrete needed for your driveway.</p>
          </div>
        </a>

      
       <a href="/calculators/drive-way-cal/crushed-stone" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Crushed Stone Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the amount of crushed stone needed for your driveway.</p>
          </div>
        </a>

        <a href="/calculators/drive-way-cal/road-base-cal" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Road Base Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the amount of road base material needed for your driveway.</p>
          </div>
        </a>
      </div>
    </div>
  );
}
