import { useState } from 'react';
import { Dumbbell } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const SPORT_TYPES = [
  { value: 'endurance', label: 'Endurance (corsa, ciclismo, nuoto)' },
  { value: 'strength', label: 'Forza / Ipertrofia (pesi, powerlifting)' },
  { value: 'team', label: 'Sport di squadra (calcio, basket, volley)' },
  { value: 'combat', label: 'Sport da combattimento (judo, boxe)' },
  { value: 'mixed', label: 'Misto (crossfit, triathlon)' },
];

const LOAD_LEVELS = [
  { value: 'low', label: 'Basso (< 1h/die, 3×/sett)', factor: 1.4 },
  { value: 'moderate', label: 'Moderato (1–2h/die, 4–5×/sett)', factor: 1.6 },
  { value: 'high', label: 'Alto (2–3h/die, 6×/sett)', factor: 1.8 },
  { value: 'very_high', label: 'Molto alto (> 3h/die, bi-quotidiano)', factor: 2.1 },
];

const SPORT_MACROS = {
  endurance: { cho: [6, 10], prot: [1.2, 1.6], fat: [1.0, 1.5], note: 'Alto fabbisogno di CHO per sostenere la glicemia e ricaricare il glicogeno.' },
  strength:  { cho: [4, 7],  prot: [1.6, 2.2], fat: [1.0, 1.5], note: 'Elevato fabbisogno proteico per la sintesi muscolare.' },
  team:      { cho: [5, 8],  prot: [1.4, 1.7], fat: [1.0, 1.5], note: 'Mix di energia aerobica e anaerobica; CHO importanti nei giorni di gara.' },
  combat:    { cho: [4, 7],  prot: [1.5, 2.0], fat: [1.0, 1.5], note: 'Gestione del peso corporeo critica; attenzione al timing proteico.' },
  mixed:     { cho: [5, 9],  prot: [1.5, 2.0], fat: [1.0, 1.5], note: 'Varia in base alla componente dominante della sessione.' },
};

export default function NutrioneSportiva() {
  const [weight, setWeight] = useState('');
  const [sport, setSport] = useState('endurance');
  const [load, setLoad] = useState('moderate');

  const loadFactor = LOAD_LEVELS.find(l => l.value === load)?.factor || 1.6;
  const macros = SPORT_MACROS[sport];
  const w = Number(weight) || 0;

  const tdee = w ? Math.round(w * 24 * loadFactor) : null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Dumbbell size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Nutrizione Sportiva</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Nutrizione Sportiva</h1>
          <p className="text-teal-100 text-sm mt-0.5">Calcolo macronutrienti, idratazione e timing nutrizionale per atleti</p>
        </div>

        {/* Macro calculator */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Calcolatore Macronutrienti Sportivi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Peso corporeo (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="es. 70"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo di sport</label>
              <select value={sport} onChange={e => setSport(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                {SPORT_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Carico allenamento</label>
              <select value={load} onChange={e => setLoad(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                {LOAD_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>

          {w > 0 && (
            <>
              <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-3 text-sm">
                <span className="text-gray-600">Fabbisogno energetico stimato: </span>
                <span className="font-bold text-teal-700 text-base">{tdee} kcal/die</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { label: 'Carboidrati', range: macros.cho, unit: 'g/kg', color: 'blue' },
                  { label: 'Proteine', range: macros.prot, unit: 'g/kg', color: 'emerald' },
                  { label: 'Grassi', range: macros.fat, unit: 'g/kg', color: 'amber' },
                ].map(m => (
                  <div key={m.label} className={`bg-${m.color}-50 border border-${m.color}-200 rounded-lg p-3 text-center`}>
                    <div className={`text-xs text-${m.color}-600 font-medium mb-1`}>{m.label}</div>
                    <div className={`text-lg font-bold text-${m.color}-700`}>
                      {(w * m.range[0]).toFixed(0)}–{(w * m.range[1]).toFixed(0)} g
                    </div>
                    <div className="text-xs text-gray-500">{m.range[0]}–{m.range[1]} {m.unit}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 italic">{macros.note}</p>
            </>
          )}
        </div>

        {/* Hydration */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Idratazione</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="font-semibold text-blue-800 mb-1">Fabbisogno base</div>
              <div className="text-gray-700">{w ? `${(w * 35 / 1000).toFixed(1)}–${(w * 45 / 1000).toFixed(1)} L/die` : '35–45 mL/kg/die'}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="font-semibold text-blue-800 mb-1">Durante allenamento</div>
              <div className="text-gray-700">150–250 mL ogni 15–20 min; soluzioni ipotoniche per sessioni &gt; 1h</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="font-semibold text-blue-800 mb-1">Pre-gara (2–4h prima)</div>
              <div className="text-gray-700">5–7 mL/kg; urine color paglierino chiaro come indicatore</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="font-semibold text-blue-800 mb-1">Post-allenamento</div>
              <div className="text-gray-700">1.5 × kg di peso perso; aggiungere sodio per reidratazione rapida</div>
            </div>
          </div>
        </div>

        {/* Nutrient timing */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Timing Nutrizionale</h2>
          <div className="space-y-3">
            {[
              { time: '3–4h prima', color: 'bg-amber-50 border-amber-200', title: 'Pre-workout (principale)', desc: 'Pasto ricco di CHO a basso IG, proteine moderate, grassi limitati. Es: riso + pollo + verdure.' },
              { time: '30–60 min prima', color: 'bg-yellow-50 border-yellow-200', title: 'Pre-workout (snack)', desc: 'Snack a base di CHO semplici + proteine. Es: banana + yogurt greco, o barretta energetica.' },
              { time: '0–30 min dopo', color: 'bg-emerald-50 border-emerald-200', title: 'Post-workout (finestra anabolica)', desc: 'CHO + proteine in rapporto 3:1. Es: 40g CHO + 20–30g proteine. Whey o latte cioccolato.' },
              { time: '1–2h dopo', color: 'bg-teal-50 border-teal-200', title: 'Pasto di recupero', desc: 'Pasto completo bilanciato per massimizzare sintesi proteica e ripristino del glicogeno.' },
            ].map(t => (
              <div key={t.time} className={`border rounded-lg p-3 ${t.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-500">{t.time}</span>
                  <span className="font-semibold text-gray-800 text-sm">{t.title}</span>
                </div>
                <p className="text-xs text-gray-600">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
