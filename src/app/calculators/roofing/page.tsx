import Link from "next/link";

export default function RoofingPage() {
  const calculators = [
    {
      name: "Birdsmouth Cut Calculator",
      description: "Calculate precise birdsmouth cuts for roof rafters",
      icon: "🔪",
      href: "/calculators/roofing/birdsmouth-cut",
    },
    {
      name: "Gambrel Roof Calculator",
      description: "Calculate measurements for gambrel roof construction",
      icon: "🏠",
      href: "/calculators/roofing/gambrel-roof",
    },
    {
      name: "Metal Roof Cost Calculator",
      description: "Calculate costs for metal roofing materials",
      icon: "💰",
      href: "/calculators/roofing/metal-roof-cost",
    },
    {
      name: "Rafter Length Calculator",
      description: "Calculate rafter lengths for roof construction",
      icon: "📏",
      href: "/calculators/roofing/rafter-length",
    },
    {
      name: "Roofing Calculator",
      description: "Calculate materials needed for your roofing project",
      icon: "🏡",
      href: "/calculators/roofing/roofingCal",
    },
    {
      name: "Roof Pitch Calculator",
      description: "Calculate roof pitch for your construction project",
      icon: "📐",
      href: "/calculators/roofing/roof-pitch",
    },
    {
      name: "Roof Shingle Calculator",
      description: "Calculate roof shingles needed for your project",
      icon: "🧱",
      href: "/calculators/roofing/roof-shingle",
    },
    {
      name: "Roof Truss Calculator",
      description: "Calculate roof truss dimensions and materials",
      icon: "🔨",
      href: "/calculators/roofing/roof-truss",
    },
    {
      name: "Snow Load Calculator",
      description: "Calculate snow load capacity for your roof",
      icon: "❄️",
      href: "/calculators/roofing/snow-load",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Roofing calculators 🏠</h1>
      <p className="mb-6">
        Calculate materials and costs for roofing projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calculator, index) => (
          <Link
            key={index}
            href={calculator.href}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{calculator.icon}</div>
              <div>
                <h3 className="font-medium text-blue-600">{calculator.name}</h3>
                <p className="text-sm text-gray-600">
                  {calculator.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
