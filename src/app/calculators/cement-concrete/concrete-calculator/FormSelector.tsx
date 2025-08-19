import React from 'react';
import Image from 'next/image';

interface FormSelectorProps {
  selectedForm: string;
  setSelectedForm: (v: string) => void;
  CONCRETE_FORMS: { id: string; name: string; image: string }[];
}

const FormSelector: React.FC<FormSelectorProps> = ({ selectedForm, setSelectedForm, CONCRETE_FORMS }) => {
  const selectedFormDetails = CONCRETE_FORMS.find(form => form.id === selectedForm) || CONCRETE_FORMS[0];
  return (
    <>
      <div className="mb-8 border rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Choose a concrete form</h2>
          <button
            onClick={() => {}}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <span className="text-xl">▼</span>
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Concrete form</label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full border border-slate-300 rounded px-4 py-2"
          >
            {CONCRETE_FORMS.map((form) => (
              <option key={form.id} value={form.id}>
                {form.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center mt-4">
          <div className="relative w-64 h-64">
            <Image
              src={selectedFormDetails.image}
              alt={selectedFormDetails.name}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormSelector;
