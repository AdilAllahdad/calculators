import Image from 'next/image';

export default function CementConcretePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">Cement and Concrete Calculators</h1>
      <p className="mb-6">
        Calculate cement, sand, and aggregate quantities for concrete projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <a href="cement-concrete/cement-calculator" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Cement Calculator</h3>
                <p className="text-black group-hover:text-gray-700">Calculate precise cement quantities for your construction projects.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Concrete Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Determine the exact amount of concrete needed for your project.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Concrete Block Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate the number of concrete blocks needed for your wall.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Concrete Block Fill Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate grout and mortar needed for block wall fills.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Concrete Column Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Determine materials needed for concrete columns and pillars.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Concrete Stairs Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate concrete needed for staircase construction.</p>
              </div>
            </div>
          </a>
        </div>
        <div className="flex flex-col gap-6">
          <a href="cement-concrete/concrete-estimator-tube" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl ghover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Concrete Estimator - Tube</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate concrete needed for tubular forms and footings.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Concrete Weight Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate the weight of concrete structures and elements.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Grout Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Determine the amount of grout needed for your project.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Hole Volume Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate the volume of holes and excavations.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Mortar Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate the amount of mortar needed for masonry work.</p>
              </div>
            </div>
          </a>
          <a href="#" className="group block p-6 border-2 rounded-xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/file.svg"
                  alt="Calculator Icon"
                  width={32}
                  height={32}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-2 group-hover:text-blue-600">Thinset Calculator</h3>
                <p className="text-gray-600 group-hover:text-gray-700">Calculate thinset mortar needed for tile installation.</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
