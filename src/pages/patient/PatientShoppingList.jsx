import { useState, useMemo } from 'react';
import { foods } from '../../data/foods';
import { ShoppingCart, Plus, Trash2, Check, RefreshCw, X } from 'lucide-react';

const DAYS  = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

const categoryOrder = ['Proteine', 'Cereali', 'Verdure', 'Frutta', 'Latticini', 'Grassi', 'Legumi'];

const categoryIcons = {
  Proteine:  '🥩',
  Cereali:   '🌾',
  Verdure:   '🥦',
  Frutta:    '🍎',
  Latticini: '🥛',
  Grassi:    '🥑',
  Legumi:    '🫘',
  Altro:     '🛒',
};

const categoryColors = {
  Proteine:  'bg-blue-50 border-blue-200',
  Cereali:   'bg-amber-50 border-amber-200',
  Verdure:   'bg-emerald-50 border-emerald-200',
  Frutta:    'bg-pink-50 border-pink-200',
  Latticini: 'bg-sky-50 border-sky-200',
  Grassi:    'bg-orange-50 border-orange-200',
  Legumi:    'bg-lime-50 border-lime-200',
  Altro:     'bg-gray-50 border-gray-200',
};

export default function PatientShoppingList({ patientId }) {
  const mealPlanKey   = `diet-patient-${patientId}-meal-plan`;
  const listKey       = `diet-patient-${patientId}-shopping-list`;

  // checked items stored as Set of "<foodId>-<grams>" or custom item ids
  const [checked, setChecked] = useState(() =>
    new Set(JSON.parse(localStorage.getItem(listKey + '-checked') || '[]'))
  );
  const [customItems, setCustomItems] = useState(() =>
    JSON.parse(localStorage.getItem(listKey + '-custom') || '[]')
  );
  const [customInput, setCustomInput] = useState('');

  const mealPlan = useMemo(() =>
    JSON.parse(localStorage.getItem(mealPlanKey) || '{}'), [mealPlanKey]
  );

  // Aggregate all foods from meal plan (grams per food)
  const aggregated = useMemo(() => {
    const map = {};
    DAYS.forEach(day => {
      SLOTS.forEach(slot => {
        (mealPlan[day]?.[slot] || []).forEach(entry => {
          const key = entry.foodId;
          if (!map[key]) map[key] = { foodId: entry.foodId, foodName: entry.foodName, totalGrams: 0 };
          map[key].totalGrams += entry.grams;
        });
      });
    });
    return Object.values(map);
  }, [mealPlan]);

  // Group by category
  const grouped = useMemo(() => {
    const groups = {};
    aggregated.forEach(item => {
      const food     = foods.find(f => f.id === item.foodId);
      const category = food?.category || 'Altro';
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });
    return groups;
  }, [aggregated]);

  const toggleChecked = (key) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      localStorage.setItem(listKey + '-checked', JSON.stringify([...next]));
      return next;
    });
  };

  const clearChecked = () => {
    setChecked(new Set());
    localStorage.removeItem(listKey + '-checked');
  };

  const addCustomItem = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const newItem = { id: `custom-${Date.now()}`, name: customInput.trim() };
    const updated = [...customItems, newItem];
    setCustomItems(updated);
    localStorage.setItem(listKey + '-custom', JSON.stringify(updated));
    setCustomInput('');
  };

  const removeCustomItem = (id) => {
    const updated = customItems.filter(i => i.id !== id);
    setCustomItems(updated);
    localStorage.setItem(listKey + '-custom', JSON.stringify(updated));
    setChecked(prev => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem(listKey + '-checked', JSON.stringify([...next]));
      return next;
    });
  };

  const totalItems    = aggregated.length + customItems.length;
  const checkedCount  = [...checked].length;
  const sortedCats    = [
    ...categoryOrder.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !categoryOrder.includes(c)),
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={24} className="text-emerald-500" /> Lista della Spesa
          </h2>
          <p className="text-gray-500 mt-1">
            Generata automaticamente dal tuo piano pasti settimanale
          </p>
        </div>
        <div className="flex items-center gap-3">
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              <RefreshCw size={14} /> Deseleziona tutto
            </button>
          )}
          <div className="bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-xl border border-emerald-200">
            {checkedCount} / {totalItems} articoli
          </div>
        </div>
      </div>

      {aggregated.length === 0 && customItems.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Lista vuota</p>
          <p className="text-sm mt-1">
            Aggiungi alimenti al tuo{' '}
            <span className="text-emerald-500 font-medium">Piano Pasti settimanale</span>{' '}
            per generare automaticamente la lista della spesa.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCats.map(category => (
            <div
              key={category}
              className={`rounded-2xl border shadow-sm overflow-hidden ${categoryColors[category] || categoryColors['Altro']}`}
            >
              <div className="px-5 py-3 border-b border-black/5">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category] || '🛒'}</span>
                  {category}
                  <span className="ml-auto text-xs font-normal text-gray-400">
                    {grouped[category].length} prodott{grouped[category].length === 1 ? 'o' : 'i'}
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-black/5">
                {grouped[category].map(item => {
                  const key      = String(item.foodId);
                  const isChecked = checked.has(key);
                  return (
                    <div
                      key={item.foodId}
                      className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-all hover:bg-black/5 ${
                        isChecked ? 'opacity-50' : ''
                      }`}
                      onClick={() => toggleChecked(key)}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isChecked && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`flex-1 text-sm font-medium text-gray-700 ${isChecked ? 'line-through' : ''}`}>
                        {item.foodName}
                      </span>
                      <span className="text-xs text-gray-400 bg-white/60 px-2 py-0.5 rounded-full">
                        ~{item.totalGrams}g
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Custom items */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-lg">✏️</span>
                Articoli personalizzati
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {customItems.map(item => {
                const isChecked = checked.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 px-5 py-3 transition-all ${isChecked ? 'opacity-50' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                        isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white hover:border-emerald-400'
                      }`}
                      onClick={() => toggleChecked(item.id)}
                    >
                      {isChecked && <Check size={12} className="text-white" />}
                    </div>
                    <span
                      className={`flex-1 text-sm font-medium text-gray-700 cursor-pointer ${isChecked ? 'line-through' : ''}`}
                      onClick={() => toggleChecked(item.id)}
                    >
                      {item.name}
                    </span>
                    <button
                      onClick={() => removeCustomItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
              {/* Add custom item form */}
              <form onSubmit={addCustomItem} className="flex items-center gap-2 px-5 py-3">
                <input
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="Aggiungi articolo manualmente..."
                  className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={14} /> Aggiungi
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add custom item when list is empty */}
      {aggregated.length === 0 && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">✏️</span>
            Aggiungi articoli manualmente
          </h3>
          <form onSubmit={addCustomItem} className="flex items-center gap-2">
            <input
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="es. Pane, Latte, Uova..."
              className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="flex items-center gap-1 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={14} /> Aggiungi
            </button>
          </form>
          {customItems.length > 0 && (
            <div className="mt-3 space-y-2">
              {customItems.map(item => {
                const isChecked = checked.has(item.id);
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                        isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
                      }`}
                      onClick={() => toggleChecked(item.id)}
                    >
                      {isChecked && <Check size={12} className="text-white" />}
                    </div>
                    <span
                      className={`flex-1 text-sm text-gray-700 cursor-pointer ${isChecked ? 'line-through opacity-50' : ''}`}
                      onClick={() => toggleChecked(item.id)}
                    >
                      {item.name}
                    </span>
                    <button onClick={() => removeCustomItem(item.id)} className="text-gray-300 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
