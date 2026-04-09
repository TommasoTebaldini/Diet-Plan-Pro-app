import { useState } from 'react';
import { foods } from '../../data/foods';
import { Droplets, Flame, TrendingUp, UtensilsCrossed, Scale, Activity } from 'lucide-react';

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function calcNutrition(entries) {
  let cal = 0, protein = 0, carbs = 0, fat = 0;
  entries.forEach(e => {
    const food = foods.find(f => f.id === e.foodId);
    if (food) {
      const mult = e.grams / 100;
      cal      += food.calories * mult;
      protein  += food.protein  * mult;
      carbs    += food.carbs    * mult;
      fat      += food.fat      * mult;
    }
  });
  return { cal, protein, carbs, fat };
}

function MacroBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{Math.round(value)}g / {max}g</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CalorieRing({ current, target }) {
  const pct = Math.min(current / target, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f0fdf4" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke="#10b981" strokeWidth="12"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-gray-800">{Math.round(current)}</p>
        <p className="text-xs text-gray-500">/ {target} kcal</p>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buongiorno';
  if (h < 18) return 'Buon pomeriggio';
  return 'Buonasera';
}

export default function PatientDashboard({ patientId, profile }) {
  const mealPlanKey = `diet-patient-${patientId}-meal-plan`;
  const waterKey    = `diet-patient-${patientId}-water`;

  const [mealPlan] = useState(() => JSON.parse(localStorage.getItem(mealPlanKey) || '{}'));
  const [water, setWaterState] = useState(() => JSON.parse(localStorage.getItem(waterKey) || '0'));

  const setWater = (val) => {
    setWaterState(val);
    localStorage.setItem(waterKey, JSON.stringify(val));
  };

  const todayKey = dayNames[new Date().getDay()];
  const todayMeals = mealPlan[todayKey] || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  const allEntries = [
    ...(todayMeals.breakfast || []),
    ...(todayMeals.lunch    || []),
    ...(todayMeals.dinner   || []),
    ...(todayMeals.snacks   || []),
  ];

  const totals        = calcNutrition(allEntries);
  const calorieTarget = profile?.calorieTarget || 2000;
  const proteinTarget = Math.round(calorieTarget * 0.25 / 4);
  const carbsTarget   = Math.round(calorieTarget * 0.50 / 4);
  const fatTarget     = Math.round(calorieTarget * 0.25 / 9);

  const bmi = profile?.weight && profile?.height
    ? (profile.weight / (profile.height / 100) ** 2).toFixed(1)
    : null;

  const age = profile?.birthDate
    ? Math.floor((Date.now() - new Date(profile.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  const mealSlots = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const mealLabels = { breakfast: 'Colazione', lunch: 'Pranzo', dinner: 'Cena', snacks: 'Spuntini' };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {profile?.firstName || 'Ciao'}! 👋
        </h2>
        <p className="text-gray-500 mt-1">Ecco il riepilogo nutrizionale di oggi.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {profile?.weight && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Scale size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Peso</p>
              <p className="font-bold text-gray-800">{profile.weight} kg</p>
            </div>
          </div>
        )}
        {bmi && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">BMI</p>
              <p className="font-bold text-gray-800">{bmi}</p>
            </div>
          </div>
        )}
        {age && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">Età</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Anni</p>
              <p className="font-bold text-gray-800">{age}</p>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Flame size={18} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Target</p>
            <p className="font-bold text-gray-800">{calorieTarget} kcal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Calorie Ring */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Flame size={18} className="text-orange-400" /> Calorie di Oggi
          </h3>
          <CalorieRing current={totals.cal} target={calorieTarget} />
          <p className="mt-3 text-sm text-gray-500">
            {Math.round(calorieTarget - totals.cal)} kcal rimanenti
          </p>
          {totals.cal > calorieTarget && (
            <p className="text-xs text-orange-500 font-medium mt-1">⚠️ Superato il target!</p>
          )}
        </div>

        {/* Macros */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" /> Macronutrienti
          </h3>
          <div className="space-y-4">
            <MacroBar label="Proteine"    value={totals.protein} max={proteinTarget} color="bg-blue-400"   />
            <MacroBar label="Carboidrati" value={totals.carbs}   max={carbsTarget}   color="bg-amber-400"  />
            <MacroBar label="Grassi"      value={totals.fat}     max={fatTarget}     color="bg-rose-400"   />
          </div>
        </div>

        {/* Water Tracker */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Droplets size={18} className="text-blue-400" /> Idratazione
          </h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {Array.from({ length: 8 }, (_, i) => (
              <button
                key={i}
                onClick={() => setWater(i + 1 <= water ? i : i + 1)}
                className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${
                  i < water
                    ? 'bg-blue-400 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-200 hover:bg-blue-100'
                }`}
              >
                💧
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">{water} / 8 bicchieri ({water * 250}ml)</p>
          {water >= 8 && <p className="text-center text-xs text-emerald-500 font-medium mt-1">🎉 Obiettivo raggiunto!</p>}
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <UtensilsCrossed size={18} className="text-emerald-500" /> Pasti di Oggi
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mealSlots.map(slot => {
            const entries       = todayMeals[slot] || [];
            const slotNutrition = calcNutrition(entries);
            return (
              <div key={slot} className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-700 mb-2">{mealLabels[slot]}</h4>
                {entries.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nessun pasto pianificato</p>
                ) : (
                  <>
                    {entries.map((e, i) => (
                      <div key={i} className="text-xs text-gray-600 mb-1">
                        {e.foodName} <span className="text-gray-400">({e.grams}g)</span>
                      </div>
                    ))}
                    <p className="text-xs font-semibold text-emerald-600 mt-2">
                      {Math.round(slotNutrition.cal)} kcal
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
