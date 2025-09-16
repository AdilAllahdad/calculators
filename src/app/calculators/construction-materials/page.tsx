import Link from "next/link";

export default function ConstructionMaterialsPage() {
  const calculators = [
    {
      name: "Aluminum Weight Calculator",
      description: "Calculate the weight of aluminum based on dimensions",
      icon: "⚖️",
      href: "/calculators/construction-materials/aluminum-weight",
    },
    {
      name: "Baluster Calculator",
      description: "Calculate spacing and quantity of balusters needed",
      icon: "🏗️",
      href: "/calculators/construction-materials/baluster-calculator",
    },
    {
      name: "Board and Batten Calculator",
      description: "Calculate board and batten siding materials",
      icon: "🪵",
      href: "/calculators/construction-materials/boardBattenCalulator",
    },
    {
      name: "Brick Calculator",
      description: "Calculate the number of bricks needed for a wall",
      icon: "🧱",
      href: "/calculators/construction-materials/brick",
    },
    {
      name: "Decking Calculator",
      description: "Calculate materials needed for deck construction",
      icon: "🏠",
      href: "/calculators/construction-materials/decking-cal",
    },
    {
      name: "DIY Shed Cost Calculator",
      description: "Estimate the cost of building a DIY shed",
      icon: "🏚️",
      href: "/calculators/construction-materials/diy-shed-cost",
    },
    {
      name: "Drywall Calculator",
      description: "Calculate drywall sheets and materials needed",
      icon: "🧰",
      href: "/calculators/construction-materials/Drywall-cal",
    },
    {
      name: "Fire Glass Calculator",
      description: "Calculate fire glass needed for fire features",
      icon: "🔥",
      href: "/calculators/construction-materials/fire-glass",
    },
    {
      name: "Framing Calculator",
      description: "Calculate framing materials for construction",
      icon: "🔨",
      href: "/calculators/construction-materials/framing-calculator",
    },
    {
      name: "French Drain Calculator",
      description: "Calculate materials for a French drain system",
      icon: "💧",
      href: "/calculators/construction-materials/french-drain",
    },

     {
      name: "Rip Rap Calculator",
      description: "Calculate materials for a rip rap installation",
      icon: "🪨",
      href: "/calculators/construction-materials/rip-rap",
    },
    {
      name: "Glass Weight Calculator",
      description: "Calculate the weight of glass based on dimensions",
      icon: "🪟",
      href: "/calculators/construction-materials/glass-weight",
    },
    {
      name: "Gravel Calculator",
      description: "Calculate gravel needed for your project",
      icon: "🪨",
      href: "/calculators/construction-materials/gravel",
    },
    {
      name: "Limestone Calculator",
      description: "Calculate limestone needed for your project",
      icon: "🪨",
      href: "/calculators/construction-materials/limeStone-cal",
    },
    {
      name: "Log Weight Calculator",
      description: "Calculate the weight of logs based on dimensions",
      icon: "🪵",
      href: "/calculators/construction-materials/log-weight",
    },
    {
      name: "Lumber Calculator",
      description: "Calculate lumber needed for construction",
      icon: "🪵",
      href: "/calculators/construction-materials/lumber",
    },
    {
      name: "Metal Weight Calculator",
      description: "Calculate weight of metal based on dimensions",
      icon: "🔩",
      href: "/calculators/construction-materials/metal-weight",
    },
    {
      name: "Pipe Weight Calculator",
      description: "Calculate pipe weight based on specifications",
      icon: "🧪",
      href: "/calculators/construction-materials/pipe-weight",
    },
    {
      name: "Plate Weight Calculator",
      description: "Calculate weight of plates based on dimensions",
      icon: "⚖️",
      href: "/calculators/construction-materials/plate-weight",
    },
    {
      name: "Rebar Calculator",
      description: "Calculate rebar requirements for concrete",
      icon: "🏗️",
      href: "/calculators/construction-materials/rebar-calculator",
    },
    {
      name: "Retaining Wall Calculator",
      description: "Calculate materials for retaining wall construction",
      icon: "🧱",
      href: "/calculators/construction-materials/retaining-wall",
    },
    {
      name: "Rip Rap Calculator",
      description: "Calculate rip rap needed for erosion control",
      icon: "🪨",
      href: "/calculators/construction-materials/rip-rap",
    },
    {
      name: "River Rock Calculator",
      description: "Calculate river rock needed for landscaping",
      icon: "🪨",
      href: "/calculators/construction-materials/river-rock",
    },
    {
      name: "Rolling Offset Calculator",
      description: "Calculate pipe rolling offsets for plumbing",
      icon: "🔧",
      href: "/calculators/construction-materials/rolling-offset",
    },
    {
      name: "SAG Calculator",
      description: "Calculate sag in beams or cables",
      icon: "📏",
      href: "/calculators/construction-materials/sag",
    },
    {
      name: "Sand Calculator",
      description: "Calculate sand needed for your project",
      icon: "🏝️",
      href: "/calculators/construction-materials/sand",
    },
    {
      name: "Sealant Calculator",
      description: "Calculate sealant needed for joints or surfaces",
      icon: "🧴",
      href: "/calculators/construction-materials/sealant",
    },
    {
      name: "Sonotube Calculator",
      description: "Calculate concrete needed for sonotubes",
      icon: "⭕",
      href: "/calculators/construction-materials/sonotube",
    },
    {
      name: "Spindle Spacing Calculator",
      description: "Calculate spindle spacing for railings",
      icon: "🔢",
      href: "/calculators/construction-materials/spindle-spacing",
    },
    {
      name: "Spiral Staircase Calculator",
      description: "Calculate dimensions for spiral staircases",
      icon: "🌀",
      href: "/calculators/construction-materials/spiral-staircase",
    },
    {
      name: "Steel Plate Weight Calculator",
      description: "Calculate weight of steel plates",
      icon: "⚖️",
      href: "/calculators/construction-materials/steel-plate-weight",
    },
    {
      name: "Steel Weight Calculator",
      description: "Calculate weight of steel based on dimensions",
      icon: "⚖️",
      href: "/calculators/construction-materials/steel-weight",
    },
    {
      name: "Stone Weight Calculator",
      description: "Calculate stone weight based on dimensions",
      icon: "🪨",
      href: "/calculators/construction-materials/stone-weight",
    },
    {
      name: "Tile Calculator",
      description: "Calculate tile needed for your project",
      icon: "🧩",
      href: "/calculators/construction-materials/tile-calculator",
    },
    {
      name: "Tonnage Calculator",
      description: "Calculate tonnage for construction materials",
      icon: "⚖️",
      href: "/calculators/construction-materials/toonage-cal",
    },
    {
      name: "Vinyl Fence Calculator",
      description: "Calculate materials for vinyl fence installation",
      icon: "🏠",
      href: "/calculators/construction-materials/vinyl-fence",
    },
    {
      name: "Vinyl Siding Calculator",
      description: "Calculate vinyl siding for your project",
      icon: "🏠",
      href: "/calculators/construction-materials/vinyl-siding",
    },
    {
      name: "Wall Square Footage Calculator",
      description: "Calculate square footage of walls",
      icon: "📏",
      href: "/calculators/construction-materials/wall-square-footage",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Construction materials calculators 🧱
      </h1>
      <p className="mb-6">
        Calculate quantities and costs for various construction materials.
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
