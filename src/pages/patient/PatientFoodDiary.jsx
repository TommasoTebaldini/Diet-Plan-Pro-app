import { useState } from 'react';
import { foods } from '../../data/foods';
import { Plus, X, Search, BookOpen, ChevronLeft, ChevronRight, Flame, TrendingUp } from 'lucide-react';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks'];
const SLOT_LABELS = { breakfast: 'Colazione', lunch: 'Pranzo', dinner: 'Cena', snacks: 'Spuntini' };
const SLOT_COLORS = {
  breakfast: 'bg-amber-50 border-amber-200',
  lunch:     'bg-emerald-50 border-emerald-200',
  dinner:    'bg-blue-50 border-blue-200',
  snacks:    'bg-purple-50 border-purple-200',
};
const SLOT_ICON = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍎' };

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function toDateKey(date) {
  return date.toISOString().split('T')[0];
}

function calcNutrition(entries) {
  let cal = 0, protein = 0, carbs = 0, fat = 0;
  entries.forEach(e => {
    const food = foods.find(f => f.id === e.foodId);
    if (food) {
      const m = e.grams / 100;
      cal     += food.calories * m;
      protein += food.protein  * m;
      carbs   += food.carbs    * m;
      fat     += food.fat      * m;
    }
  });
  return { cal, protein, carbs, fat };
}

export default function PatientFoodDiary({ patientId, profile }) {
  const [currentDate, setCurrentDate] = useState(() => toDateKey(new Date()));

  const diaryKey = `diet-patient-${patientId}-diary`;

  const [diary, setDiaryState] = useState(() =>
    JSON.parse(localStorage.getItem(diaryKey) || '{}')
  );

  const setDiary = (updater) => {
    setDiaryState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(diaryKey, JSON.stringify(next));
      return next;
    });
  };

  const [modal, setModal]             = useState(null);
  const [search, setSearch]           = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams]             = useState(100);

  const dayData = diary[currentDate] || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const allEntries = SLOTS.flatMap(s => dayData[s] || []);
  const totals     = calcNutrition(allEntries);
  const calorieTarget = profile?.calorieTarget || 2000;

  const prevDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setCurrentDate(toDateKey(d));
  };
  const nextDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const today = toDateKey(new Date());
    if (toDateKey(d) <= today) setCurrentDate(toDateKey(d));
  };

  const openModal = (slot) => {
    setModal(slot);
    setSearch('');
    setSelectedFood(null);
    setGrams(100);
  };

  const addEntry = () => {
    if (!selectedFood) return;
    setDiary(prev => {
      const day = prev[currentDate] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
      return {
        ...prev,
        [currentDate]: {
          ...day,
          [modal]: [
            ...(day[modal] || []),
            { foodId: selectedFood.id, foodName: selectedFood.name, grams: Number(grams) },
          ],
        },
      };
    });
    setModal(null);
  };

  const removeEntry = (slot, idx) => {
    setDiary(prev => {
      const day = prev[currentDate] || {};
      return {
        ...prev,
        [currentDate]: {
          ...day,
          [slot]: (day[slot] || []).filter((_, i) => i !== idx),
        },
      };
    });
  };

  const pct = Math.min((totals.cal / calorieTarget) * 100, 100);
  const isToday = currentDate === toDateKey(new Date());

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen size={24} className="text-emerald-500" /> Diario Alimentare
          </h2>
          <p className="text-gray-500 mt-1">Registra tutto ciò che mangi ogni giorno</p>
        </div>
        {/* Date navigator */}
        <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-2">
          <button onClick={prevDay} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center min-w-[180px]">
            <p className="text-sm font-semibold text-gray-800 capitalize">{formatDate(currentDate)}</p>
            {isToday && <p className="text-xs text-emerald-500 font-medium">Oggi</p>}
          </div>
          <button
            onClick={nextDay}
            disabled={isToday}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="sm:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-400" />
              <span className="font-semibold text-gray-700">Calorie</span>
            </div>
            <span className="text-sm text-gray-500">{Math.round(totals.cal)} / {calorieTarget} kcal</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${totals.cal > calorieTarget ? 'bg-orange-400' : 'bg-emerald-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {totals.cal > calorieTarget && (
            <p className="text-xs text-orange-500 mt-1 font-medium">⚠️ Superato il target!</p>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <TrendingUp size={16} className="text-blue-400 mb-1" />
          <p className="text-xs text-gray-500">Proteine</p>
          <p className="text-lg font-bold text-blue-600">{Math.round(totals.protein)}g</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <TrendingUp size={16} className="text-amber-400 mb-1" />
          <p className="text-xs text-gray-500">Carboidrati</p>
          <p className="text-lg font-bold text-amber-600">{Math.round(totals.carbs)}g</p>
        </div>
      </div>

      {/* Meal slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SLOTS.map(slot => {
          const entries    = dayData[slot] || [];
          const slotTotals = calcNutrition(entries);
          return (
            <div key={slot} className={`bg-white rounded-2xl shadow-sm border p-5 ${SLOT_COLORS[slot]}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-lg">{SLOT_ICON[slot]}</span>
                  {SLOT_LABELS[slot]}
                </h3>
                {entries.length > 0 && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {Math.round(slotTotals.cal)} kcal
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-3">
                {entries.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2">Nessun alimento registrato</p>
                ) : (
                  entries.map((e, i) => {
                    const food    = foods.find(f => f.id === e.foodId);
                    const entCal  = food ? Math.round(food.calories * e.grams / 100) : 0;
                    return (
                      <div key={i} className="flex items-center justify-between bg-white/70 rounded-xl px-3 py-2 group">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{e.foodName}</p>
                          <p className="text-xs text-gray-400">{e.grams}g · {entCal} kcal</p>
                        </div>
                        <button
                          onClick={() => removeEntry(slot, i)}
                          className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                onClick={() => openModal(slot)}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400 hover:text-emerald-600 hover:bg-emerald-50/80 rounded-xl py-2 transition-all border border-dashed border-gray-200 hover:border-emerald-300"
              >
                <Plus size={14} /> Aggiungi alimento
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">
                  {SLOT_ICON[modal]} Aggiungi a {SLOT_LABELS[modal]}
                </h3>
                <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cerca alimenti..."
                  autoFocus
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredFoods.slice(0, 50).map(food => (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedFood?.id === food.id ? 'bg-emerald-100 text-emerald-700 font-medium' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{food.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{food.calories} kcal/100g</span>
                  </button>
                ))}
              </div>
              {selectedFood && (
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-sm font-medium text-emerald-700 mb-2">{selectedFood.name}</p>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-gray-600">Grammi:</label>
                    <input
                      type="number"
                      value={grams}
                      onChange={e => setGrams(e.target.value)}
                      min="1"
                      max="2000"
                      className="w-24 px-2 py-1 border border-emerald-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                    <span className="text-xs text-emerald-600 font-medium">
                      = {Math.round(selectedFood.calories * grams / 100)} kcal
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={addEntry}
                disabled={!selectedFood}
                className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
