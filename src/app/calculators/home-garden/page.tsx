import Link from 'next/link';

export default function HomeGardenPage() {
  const calculators = [
    {
      name:"Air Changes per Hour Calculator",
      description:"Calculate air changes per hour for ventilation",
      icon:"💨",
      href:"/calculators/home-garden/air-changes-per-hour"
    },
    {
      name:"Air Conditioner BTU Calculator",
      description:"Calculate BTU requirements for air conditioning",
      icon:"❄️",
      href:"/calculators/home-garden/air-conditioner-btu"
    },
    {
      name:"Arch Calculator",
      description:"Calculate arch dimensions and materials",
      icon:"拱",
      href:"/calculators/home-garden/arch"
    },
    {
      name:"Boiler Size Calculator",
      description:"Calculate boiler size for heating systems",
      icon:"🔥",
      href:"/calculators/home-garden/boiler-size"
    },
    {
      name:"Carpet Calculator",
      description:"Calculate carpet quantities and costs",
      icon:"🧷",
      href:"/calculators/home-garden/carpet"
    },
    {
      name:"Chickent Coop Size Calculator",
      description:"Calculate the size of a chicken coop",
      icon:"🐔",
      href:"/calculators/home-garden/chicken-coop-size"
    },
    {
      name:"Clearance Hole Calculator",
      description:"Calculate clearance hole sizes",
      icon:"🕳️",
      href:"/calculators/home-garden/clearance-hole"
    },
    {
      name:"Deck Stain Calculator",
      description:"Calculate the amount of deck stain needed",
      icon:"🎨",
      href:"/calculators/home-garden/deck-stain"
    },
    {
      name:"Epoxy Calculator",
      description:"Calculate epoxy quantities and costs",
      icon:"🧪",
      href:"/calculators/home-garden/epoxy"
    },
    {
      name:"Fence Calculator",
      description:"Calculate fence materials and costs",
      icon:"🚧",
      href:"/calculators/home-garden/fence"
    },
    {
      name:"Rectangle Fence Perimeter Calculator",
      description:"Calculate the perimeter of a rectangular fence",
      icon:"🚧",
      href:"/calculators/home-garden/rectangle-fence-perimeter"
    },
    {
      name:"Fence Post Depth Calculator",
      description:"Calculate the depth of fence posts",
      icon:"橛",
      href:"/calculators/home-garden/fence-post-depth"
    },
    {
      name:"Floor Area Ratio Calculator",
      description:"Calculate the floor area ratio for building projects",
      icon:" Büro",
      href:"/calculators/home-garden/floor-area-ratio"
    },
    {
      name:"Flooring Calculator",
      description:"Calculate flooring quantities and costs",
      icon:"🏠",
      href:"/calculators/home-garden/flooring"
    },
    {
      name:"Furnace Size Calculator",
      description:"Calculate furnace size for heating systems",
      icon:"🔥",
      href:"/calculators/home-garden/furnace-size"
    },
    {
      name:"Heat Loss Calculator",
      description:"Calculate heat loss for building insulation",
      icon:"❄️",
      href:"/calculators/home-garden/heat-loss"
    },
    {
      name:"Hoop House Calculator",
      description:"Calculate hoop house dimensions and materials",
      icon:" hoop",
      href:"/calculators/home-garden/hoop-house"
    },
    {
      name:"Ladder Angle Calculator",
      description:"Calculate ladder angles for safety",
      icon:"梯",
      href:"/calculators/home-garden/ladder-angle"
    },
    {
      name:"Paint Calculator",
      description:"Calculate paint quantities and costs",
      icon:"🎨",
      href:"/calculators/home-garden/paint"
    },
    {
      name:"Paver Calculator",
      description:"Calculate paver quantities and costs",
      icon:" paving",
      href:"/calculators/home-garden/paver"
    },
    {
      name:"Paver Sand Calculator",
      description:"Calculate paver sand quantities and costs",
      icon:" paving",
      href:"/calculators/home-garden/paver-sand"
    },
    {
      name:"Plywood Calculator",
      description:"Calculate plywood quantities and costs",
      icon:" plywood",
      href:"/calculators/home-garden/plywood"
    },
    {
      name:"Ramp Calculator",
      description:"Calculate ramp dimensions and materials",
      icon:" ramp",
      href:"/calculators/home-garden/ramp"
    },
    {
      name:"Shiplap Calculator",
      description:"Calculate shiplap quantities and costs",
      icon:" shiplap",
      href:"/calculators/home-garden/shiplap"
    },
    {
      name:"Siding Calculator",
      description:"Calculate siding quantities and costs",
      icon:" siding",
      href:"/calculators/home-garden/siding"
    },
    {
      name:"Square Yard Calculator",
      description:"Calculate square yards for materials",
      icon:" 📏",
      href:"/calculators/home-garden/square-yard"
    },
    {
      name:"Stair Carper Calculator",
      description:"Calculate the amount needed for the stair carpet",
      icon:" stair",
      href:"/calculators/home-garden/stair-carpet"
    },
    {
      name:"Stair Calculator",
      description:"Calculate stair dimensions and materials",
      icon:" stair",
      href:"/calculators/home-garden/stair"
    },
    {
      name:"Wainscoting Calculator",
      description:"Calculate wainscoting quantities and costs",
      icon:" wainscoting",
      href:"/calculators/home-garden/wainscoting"
    },
    {
      name:"Wallpaper Calculator",
      description:"Calculate wallpaper quantities and costs",
      icon:" wallpaper",
      href:"/calculators/home-garden/wallpaper"
    }
  ];
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-slate-800 flex items-center">
          Home & Garden Calculators 
          <span className="ml-3 text-2xl">🏠</span>
        </h1>
        <p className="text-lg text-slate-700">
          Calculate materials and costs for home improvement and garden projects with our comprehensive collection of calculators.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}
