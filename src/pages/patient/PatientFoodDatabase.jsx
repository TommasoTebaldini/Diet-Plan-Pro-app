import { useState } from 'react';
import { foods, categories } from '../../data/foods';
import { Search } from 'lucide-react';

const categoryColors = {
  Proteine:  'bg-blue-100 text-blue-700',
  Cereali:   'bg-amber-100 text-amber-700',
  Verdure:   'bg-emerald-100 text-emerald-700',
  Frutta:    'bg-pink-100 text-pink-700',
  Latticini: 'bg-sky-100 text-sky-700',
  Grassi:    'bg-orange-100 text-orange-700',
  Legumi:    'bg-lime-100 text-lime-700',
};

export default function PatientFoodDatabase() {
  const [search, setSearch]             = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === 'All' || f.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Database Alimenti</h2>
        <p className="text-gray-500 mt-1">
          Valori nutrizionali per {foods.length} alimenti (per 100g)
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca alimenti..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'Tutti' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(food => (
          <div
            key={food.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">{food.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[food.category] || 'bg-gray-100 text-gray-600'}`}>
                {food.category}
              </span>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mb-3">
              {food.calories} <span className="text-sm font-normal text-gray-400">kcal</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center bg-blue-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Proteine</p>
                <p className="font-semibold text-blue-600 text-sm">{food.protein}g</p>
              </div>
              <div className="text-center bg-amber-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Carboidrati</p>
                <p className="font-semibold text-amber-600 text-sm">{food.carbs}g</p>
              </div>
              <div className="text-center bg-rose-50 rounded-lg p-2">
                <p className="text-xs text-gray-500">Grassi</p>
                <p className="font-semibold text-rose-600 text-sm">{food.fat}g</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">per 100g</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Nessun alimento trovato</p>
          <p className="text-sm mt-1">Prova con un termine diverso</p>
        </div>
      )}
    </div>
  );
}
