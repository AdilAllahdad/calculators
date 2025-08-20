import Link from "next/link";
export default function OtherCalculatorsPage() {
const calculators = [
    {
      name: "Angle Cut Calculator",
      description: "Calculate precise angle cuts for construction projects",
      icon: "�",
      href: "/calculators/other/angle-cut"
    },
    {
      name: "Angle of Depression Calculator", 
      description: "Determine angles of depression in construction and surveying",
      icon: "📉",
      href: "/calculators/other/angle-of-depression"
    },
    {
      name: "Bolt Circle Calculator",
      description: "Calculate bolt circle dimensions and layouts",
      icon: "⚙️",
      href: "/calculators/other/bolt-circle"
    },
    {
      name: "Bowl Segment Calculator",
      description: "Calculate segments for bowl construction and woodworking",
      icon: "🥣",
      href: "/calculators/other/bowl-segment"
    },
    {
      name: "Countersink Depth Calculator",
      description: "Determine proper countersink depths for various fasteners",
      icon: "�",
      href: "/calculators/other/countersink-depth"
    },
    {
      name: "Elevation Grade Calculator",
      description: "Calculate elevation grades for landscaping and construction",
      icon: "🏞️",
      href: "/calculators/other/elevation-grade"
    },
    {
      name: "Miter Angle Calculator",
      description: "Calculate precise miter angles for perfect joints",
      icon: "�",
      href: "/calculators/other/miter-angle"
    },
    {
      name: "Round Pen Calculator",
      description: "Design and calculate dimensions for round pens",
      icon: "⭕",
      href: "/calculators/other/round-pen"
    },
    {
      name: "Trump's Wall Calculator",
      description: "Calculate materials and specifications for large wall projects",
      icon: "🧱",
      href: "/calculators/other/trumps-wall"
    },
    {
      name: "Vertical Curve Calculator",
      description: "Calculate vertical curves for road and path design",
      icon: "↕️",
      href: "/calculators/other/vertical-curve"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center">
          Other Calculators 
          <span className="ml-3 text-2xl">🧮</span>
        </h1>
        <p className="text-lg text-slate-700">
          Explore our specialized collection of calculators for various construction and design applications.
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
          Click on any calculator above to access the tool. Each calculator is designed for specialized construction and design applications, 
          from angle calculations to advanced engineering measurements. Simply input your parameters and get accurate results for your projects.
        </p>
      </div>
    </div>
  );
}
