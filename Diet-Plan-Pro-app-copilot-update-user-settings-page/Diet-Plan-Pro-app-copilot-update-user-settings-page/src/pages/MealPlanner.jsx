import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { foods } from '../data/foods';
import { Plus, X, Search } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];

function calcCal(entries) {
  return entries.reduce((sum, e) => {
    const food = foods.find(f => f.id === e.foodId);
    return sum + (food ? (food.calories * e.grams / 100) : 0);
  }, 0);
}

const initPlan = () => {
  const plan = {};
  DAYS.forEach(d => { plan[d] = { breakfast: [], lunch: [], dinner: [], snacks: [] }; });
  return plan;
};

export default function MealPlanner() {
  const [mealPlan, setMealPlan] = useLocalStorage('diet-meal-plan', initPlan());
  const [modal, setModal] = useState(null); // { day, slot }
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState(100);

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (day, slot) => {
    setModal({ day, slot });
    setSearch('');
    setSelectedFood(null);
    setGrams(100);
  };

  const addEntry = () => {
    if (!selectedFood) return;
    setMealPlan(prev => {
      const updated = { ...prev };
      updated[modal.day] = { ...updated[modal.day] };
      updated[modal.day][modal.slot] = [
        ...(updated[modal.day][modal.slot] || []),
        { foodId: selectedFood.id, foodName: selectedFood.name, grams: Number(grams) }
      ];
      return updated;
    });
    setModal(null);
  };

  const removeEntry = (day, slot, idx) => {
    setMealPlan(prev => {
      const updated = { ...prev };
      updated[day] = { ...updated[day] };
      updated[day][slot] = updated[day][slot].filter((_, i) => i !== idx);
      return updated;
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Meal Planner</h2>
        <p className="text-gray-500 mt-1">Plan your meals for the week</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-emerald-50">
              <th className="p-3 text-left text-sm font-semibold text-gray-600 w-28">Meal</th>
              {DAYS.map(day => (
                <th key={day} className="p-3 text-center text-sm font-semibold text-gray-600 capitalize">
                  {day.slice(0, 3)}
                  <div className="text-xs font-normal text-emerald-600 mt-0.5">
                    {Math.round(calcCal([
                      ...(mealPlan[day]?.breakfast || []),
                      ...(mealPlan[day]?.lunch || []),
                      ...(mealPlan[day]?.dinner || []),
                      ...(mealPlan[day]?.snacks || []),
                    ]))} kcal
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot, si) => (
              <tr key={slot} className={si % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 font-medium text-gray-600 capitalize text-sm border-r border-gray-100">{slot}</td>
                {DAYS.map(day => {
                  const entries = mealPlan[day]?.[slot] || [];
                  return (
                    <td key={day} className="p-2 align-top border-r border-gray-50 min-h-[80px]">
                      <div className="space-y-1">
                        {entries.map((e, i) => (
                          <div key={i} className="flex items-center justify-between bg-emerald-50 rounded-lg px-2 py-1 text-xs group">
                            <span className="text-gray-700 truncate max-w-[80px]">{e.foodName}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-emerald-600 font-medium">
                                {Math.round((foods.find(f => f.id === e.foodId)?.calories ?? 0) * e.grams / 100)}
                              </span>
                              <button onClick={() => removeEntry(day, slot, i)}
                                className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => openModal(day, slot)}
                          className="w-full flex items-center justify-center gap-1 text-xs text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg py-1 transition-all border border-dashed border-gray-200 hover:border-emerald-300">
                          <Plus size={12} /> Add
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 capitalize">Add {modal.slot} – {modal.day}</h3>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search foods..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredFoods.map(food => (
                  <button key={food.id} onClick={() => setSelectedFood(food)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedFood?.id === food.id ? 'bg-emerald-100 text-emerald-700 font-medium' : 'hover:bg-gray-50'}`}>
                    <span>{food.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{food.calories} kcal/100g</span>
                  </button>
                ))}
              </div>
              {selectedFood && (
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-sm font-medium text-emerald-700 mb-2">{selectedFood.name}</p>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-gray-600">Grams:</label>
                    <input type="number" value={grams} onChange={e => setGrams(e.target.value)} min="1" max="2000"
                      className="w-24 px-2 py-1 border border-emerald-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                    <span className="text-xs text-emerald-600 font-medium">
                      = {Math.round(selectedFood.calories * grams / 100)} kcal
                    </span>
                  </div>
                </div>
              )}
              <button onClick={addEntry} disabled={!selectedFood}
                className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Add to {modal.slot}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
