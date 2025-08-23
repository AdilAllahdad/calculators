export default function MaterialsSpecificationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Materials Specifications Calculators</h1>
      <p className="mb-6">
        Calculate properties and specifications for different construction materials.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calculator cards will be added here */}
        <a href="/calculators/materials-specifications/punch-force" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Punch Force Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the punch force required based on material properties and dimensions.</p>
          </div>
        </a>

        <a href="/calculators/materials-specifications/bolt-torque" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Bolt Torque Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the bolt torque required based on material properties and dimensions.</p>
          </div>
        </a>

        <a href="/calculators/materials-specifications/spindle-speed" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Spindle Speed Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the spindle speed required based on material properties and dimensions.</p>
          </div>
        </a>

         <a href="/calculators/materials-specifications/carbon-equivalent" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Carbon Equivalent Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the carbon equivalent based on alloy composition.</p>
          </div>
        </a>

        <a href="/calculators/materials-specifications/taper-cal" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Taper Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the taper based on material properties and dimensions.</p>
          </div>
        </a>

        <a href="/calculators/materials-specifications/cfm-cal" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">CFM Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the airflow in cubic feet per minute based on room dimensions and air changes per hour.</p>
          </div>
        </a>

         <a href="/calculators/materials-specifications/door-header-size" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Door Header Size Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the required header size for door openings based on rough opening dimensions.</p>
          </div>
        </a>

        <a href="/calculators/materials-specifications/thread-pitch" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">Thread Pitch Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the thread pitch based on the number of threads and length .</p>
          </div>
        </a>

        <a href="/calculators/materials-specifications/k-factor" className="p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium">K Factor Calculator</h3>
            <p className="text-sm text-gray-600">Calculate the K factor based on material properties and dimensions.</p>
          </div>
        </a>
      </div>
    </div>
  );
}
