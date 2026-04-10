import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const ALLERGENS = [
  { id: 'glutine', name: 'Glutine', emoji: '🌾' },
  { id: 'crostacei', name: 'Crostacei', emoji: '🦐' },
  { id: 'uova', name: 'Uova', emoji: '🥚' },
  { id: 'pesce', name: 'Pesce', emoji: '🐟' },
  { id: 'arachidi', name: 'Arachidi', emoji: '🥜' },
  { id: 'soia', name: 'Soia', emoji: '🫘' },
  { id: 'latte', name: 'Latte', emoji: '🥛' },
  { id: 'fruttaSecca', name: 'Frutta secca', emoji: '🌰' },
  { id: 'sedano', name: 'Sedano', emoji: '🥬' },
  { id: 'senape', name: 'Senape', emoji: '🌿' },
  { id: 'sesamo', name: 'Sesamo', emoji: '⚪' },
  { id: 'solfiti', name: 'Solfiti', emoji: '🍷' },
  { id: 'lupini', name: 'Lupini', emoji: '🌼' },
  { id: 'molluschi', name: 'Molluschi', emoji: '🦪' },
];

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const MEALS = ['Colazione', 'Pranzo', 'Merenda', 'Cena'];

function initMenu() {
  const m = {};
  DAYS.forEach(d => { m[d] = {}; MEALS.forEach(meal => { m[d][meal] = ''; }); });
  return m;
}

export default function RistorazioneCollettiva() {
  const [menu, setMenu] = useState(initMenu);
  const [activeAllergens, setActiveAllergens] = useState({});
  const [portions, setPortions] = useState({ count: '', kcalPortion: '' });
  const [haccpNote, setHaccpNote] = useState('');

  const toggleAllergen = (id) => setActiveAllergens(prev => ({ ...prev, [id]: !prev[id] }));
  const updateMenu = (day, meal, val) => setMenu(prev => ({ ...prev, [day]: { ...prev[day], [meal]: val } }));

  const activeCount = Object.values(activeAllergens).filter(Boolean).length;
  const totalKcal = portions.count && portions.kcalPortion
    ? (Number(portions.count) * Number(portions.kcalPortion)).toLocaleString()
    : null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <UtensilsCrossed size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Ristorazione Collettiva</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🍴</span>
            <div>
              <h1 className="text-white font-bold text-lg">Ristorazione Collettiva</h1>
              <p className="text-teal-100 text-sm mt-0.5">Pianificazione menu settimanale, controllo allergeni, porzioni e HACCP</p>
            </div>
          </div>
        </div>

        {/* Weekly menu */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Piano Menu Settimanale</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 w-28">Giorno</th>
                  {MEALS.map(m => <th key={m} className="text-center px-3 py-2 font-medium text-gray-600">{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {DAYS.map(day => (
                  <tr key={day} className="border-b border-gray-100">
                    <td className="px-3 py-1.5 font-medium text-teal-700">{day}</td>
                    {MEALS.map(meal => (
                      <td key={meal} className="px-2 py-1.5">
                        <input
                          value={menu[day][meal]}
                          onChange={e => updateMenu(day, meal, e.target.value)}
                          placeholder="es. pasta al pomodoro"
                          className="w-full border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-300 bg-transparent"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allergen checker */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">
            Controllo Allergeni UE (Reg. 1169/2011)
            {activeCount > 0 && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{activeCount} presenti</span>}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {ALLERGENS.map(a => (
              <button key={a.id} onClick={() => toggleAllergen(a.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${activeAllergens[a.id] ? 'bg-orange-100 border-orange-400 text-orange-800 font-semibold' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                <span className="text-lg">{a.emoji}</span>
                <span className="leading-tight text-center">{a.name}</span>
              </button>
            ))}
          </div>
          {activeCount > 0 && (
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-xs text-orange-700">
              ⚠ Allergeni rilevati nel menu: {ALLERGENS.filter(a => activeAllergens[a.id]).map(a => a.name).join(', ')}. Indicare nel menu esposto e nell'etichettatura.
            </div>
          )}
        </div>

        {/* Portion calculator */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Calcolatore porzioni di gruppo</h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Numero commensali</label>
              <input type="number" value={portions.count} onChange={e => setPortions(p => ({ ...p, count: e.target.value }))}
                placeholder="es. 150"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Kcal per porzione</label>
              <input type="number" value={portions.kcalPortion} onChange={e => setPortions(p => ({ ...p, kcalPortion: e.target.value }))}
                placeholder="es. 600"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            {totalKcal && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-2 text-sm">
                Kcal totali: <span className="font-bold text-teal-700 text-base">{totalKcal} kcal</span>
              </div>
            )}
          </div>
        </div>

        {/* HACCP notes */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-2">Note HACCP</h2>
          <textarea value={haccpNote} onChange={e => setHaccpNote(e.target.value)}
            placeholder="Punti critici di controllo (CCP), temperature di conservazione, procedure di sanificazione, non conformità rilevate..."
            rows={5}
            className="w-full text-sm px-3 py-2 border border-dashed border-teal-200 rounded-lg bg-teal-50/30 focus:outline-none focus:ring-1 focus:ring-teal-300 placeholder-gray-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
