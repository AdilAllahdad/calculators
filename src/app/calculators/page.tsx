
export default function CalculatorsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">
          Construction Calculators Dashboard
        </h1>
        <p className="text-lg text-slate-700">
          Select a calculator category from the sidebar to access our professional construction calculation tools.
        </p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Unit Converters</h3>
            <p className="text-blue-600">Convert between different measurement units for construction projects</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-3xl mb-3">🧱</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Material Calculators</h3>
            <p className="text-green-600">Calculate quantities and costs of construction materials</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-3xl mb-3">🏗️</div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">Concrete & Cement</h3>
            <p className="text-orange-600">Specialized concrete and cement calculation tools</p>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="text-3xl mb-3">🏠</div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">Home & Garden</h3>
            <p className="text-purple-600">Calculators for home improvement and garden projects</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-slate-100 to-blue-100 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">👈 Getting Started</h3>
          <p className="text-slate-600">
            Choose a category from the sidebar on the left to access specific calculators. 
            Each category contains specialized tools designed for different aspects of construction work.
          </p>
        </div>
      </div>
    </div>
  );
}
