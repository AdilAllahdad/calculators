'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CALCULATOR_CATEGORIES } from '@/constants';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 h-screen p-6 shadow-xl">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2 text-white">🧮 Calculator Categories</h2>
        <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
      </div>
      <nav>
        <ul className="space-y-3">
          {CALCULATOR_CATEGORIES.map((category) => (
            <li key={category.path}>
              <Link 
                href={category.path}
                className={`block p-3 rounded-lg transition-all duration-200 font-medium ${
                  pathname.startsWith(category.path)
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105 hover:shadow-md'
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-2">
                    {pathname.startsWith(category.path) ? '🔹' : category.icon}
                  </span>
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
