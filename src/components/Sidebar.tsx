'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CALCULATOR_CATEGORIES } from '@/constants';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div 
      className="w-64 p-6 shadow-xl sidebar-container sticky top-0"
      style={{
        background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
        minHeight: '100vh',
        height: 'fit-content'
      }}
    >
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
