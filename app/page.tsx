import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Construction Calculators</h1>
      <p className="text-lg mb-8">
        Welcome to our comprehensive collection of construction calculators.
        Find the right tool for your construction project.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          href="/calculators/construction-converters"
          className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Construction Converters</h2>
          <p className="text-gray-600">Unit conversion tools for construction.</p>
        </Link>
        
        <Link 
          href="/calculators/construction-materials"
          className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Construction Materials</h2>
          <p className="text-gray-600">Calculate material quantities and costs.</p>
        </Link>
        
        <Link 
          href="/calculators/cement-concrete"
          className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Cement & Concrete</h2>
          <p className="text-gray-600">Calculators for concrete projects.</p>
        </Link>
        
        <Link 
          href="/calculators"
          className="block p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">All Calculators</h2>
          <p className="text-gray-600">Browse our complete collection.</p>
        </Link>
      </div>
    </div>
  );
}
