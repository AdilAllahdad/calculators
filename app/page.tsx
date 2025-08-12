import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Construction Calculators
          </h1>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Welcome to our comprehensive collection of construction calculators.
            Find the right tool for your construction project with precise calculations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link 
            href="/calculators/construction-converters"
            className="block p-8 bg-white rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="text-3xl mb-4">🔄</div>
            <h2 className="text-xl font-semibold mb-3 text-slate-800 group-hover:text-blue-600 transition-colors">
              Construction Converters
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Unit conversion tools for construction measurements and materials.
            </p>
          </Link>
          
          <Link 
            href="/calculators/construction-materials"
            className="block p-8 bg-white rounded-xl border border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="text-3xl mb-4">🧱</div>
            <h2 className="text-xl font-semibold mb-3 text-slate-800 group-hover:text-green-600 transition-colors">
              Construction Materials
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Calculate material quantities, costs, and specifications accurately.
            </p>
          </Link>
          
          <Link 
            href="/calculators/cement-concrete"
            className="block p-8 bg-white rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="text-3xl mb-4">🏗️</div>
            <h2 className="text-xl font-semibold mb-3 text-slate-800 group-hover:text-orange-600 transition-colors">
              Cement & Concrete
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Professional calculators for concrete and cement projects.
            </p>
          </Link>
          
          <Link 
            href="/calculators"
            className="block p-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="text-3xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-100 transition-colors">
              All Calculators
            </h2>
            <p className="text-blue-100 leading-relaxed">
              Browse our complete collection of construction tools.
            </p>
          </Link>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
            <h3 className="text-2xl font-semibold mb-4 text-slate-800">
              Why Choose Our Calculators?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-slate-800 mb-2">Fast & Accurate</h4>
                <p className="text-slate-600 text-sm">
                  Get instant, precise calculations for all your construction needs.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-slate-800 mb-2">Professional Grade</h4>
                <p className="text-slate-600 text-sm">
                  Built for contractors, engineers, and construction professionals.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💡</div>
                <h4 className="font-semibold text-slate-800 mb-2">Easy to Use</h4>
                <p className="text-slate-600 text-sm">
                  Intuitive interface designed for quick and efficient calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
