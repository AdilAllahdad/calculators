import Link from 'next/link';

export default function ConstructionConvertersPage() {
  const calculators = [
    {
      name: "Board Foot Calculator",
      description: "Calculate board feet for lumber measurements",
      icon: "📏",
      href: "/calculators/construction-converters/board-foot"
    },
    {
      name: "Square Feet to Cubic Yards Calculator", 
      description: "Convert square footage to cubic yards",
      icon: "📐",
      href: "/calculators/construction-converters/sq-ft-to-cubic-yards"
    },
    {
      name: "Cubic Yard Calculator",
      description: "Calculate cubic yards for various materials",
      icon: "📦",
      href: "/calculators/construction-converters/cubic-yard"
    },
    {
      name: "Square Footage Calculator",
      description: "Calculate square footage of different shapes",
      icon: "🔲",
      href: "/calculators/construction-converters/square-footage"
    },
    {
      name: "Gallons per Square Foot Calculator",
      description: "Calculate liquid coverage per square foot",
      icon: "💧",
      href: "/calculators/construction-converters/gallons-per-sqft"
    },
    {
      name: "Square Yards Calculator",
      description: "Calculate and convert square yard measurements",
      icon: "📊",
      href: "/calculators/construction-converters/square-yards"
    },
    {
      name: "Size to Weight Calculator (Rectangular Box)",
      description: "Convert box dimensions to weight calculations",
      icon: "📋",
      href: "/calculators/construction-converters/size-to-weight"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex items-center">
          Construction Converters 
          <span className="ml-3 text-2xl">👷</span>
        </h1>
        <p className="text-lg text-slate-700">
          Convert between different construction-related units of measurement with our comprehensive collection of calculators.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculators.map((calculator, index) => (
          <Link 
            key={index}
            href={calculator.href}
            className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                {calculator.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-slate-800 group-hover:text-blue-600 transition-colors">
                  {calculator.name}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {calculator.description}
                </p>
                <div className="mt-3 text-blue-500 font-medium group-hover:text-blue-700 transition-colors">
                  Calculate now →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">📝 How to Use</h3>
        <p className="text-slate-600">
          Click on any calculator above to access the tool. Each calculator is designed to provide accurate conversions 
          for construction and building projects. Simply input your measurements and get instant results.
        </p>
      </div>
    </div>
  );
}
