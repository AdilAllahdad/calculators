'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define calculator categories
const calculatorCategories = [
  {
    name: 'Construction Converters',
    path: '/calculators/construction-converters',
  },
  {
    name: 'Construction Materials Calculators',
    path: '/calculators/construction-materials',
  },
  {
    name: 'Cement and Concrete Calculators',
    path: '/calculators/cement-concrete',
  },
  {
    name: 'Home and Garden Calculators',
    path: '/calculators/home-garden',
  },
  {
    name: 'Roofing Calculators',
    path: '/calculators/roofing',
  },
  {
    name: 'Water Tank and Vessels Calculators',
    path: '/calculators/water-tank-vessels',
  },
  {
    name: 'Materials Specifications Calculators',
    path: '/calculators/materials-specifications',
  },
  {
    name: 'Other Calculators',
    path: '/calculators/other',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Calculator Categories</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {calculatorCategories.map((category) => (
            <li key={category.path}>
              <Link 
                href={category.path}
                className={`block p-2 rounded ${
                  pathname.startsWith(category.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-200'
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
