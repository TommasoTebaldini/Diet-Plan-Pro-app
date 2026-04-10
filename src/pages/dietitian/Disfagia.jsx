import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const IDDSI_LEVELS = [
  { level: 0, name: 'Liquido thin', desc: 'Acqua, succhi chiari, brodo. Scorre liberamente.', color: 'bg-blue-100 text-blue-800' },
  { level: 1, name: 'Slightly Thick', desc: 'Lievemente più denso dell\'acqua. Scorre da cucchiaio.', color: 'bg-cyan-100 text-cyan-800' },
  { level: 2, name: 'Mildly Thick', desc: 'Scorre ma più lentamente. Richiede sforzo moderato.', color: 'bg-teal-100 text-teal-800' },
  { level: 3, name: 'Liquidised', desc: 'Purè molto fluido. Scorre da cucchiaio, non mantiene forma.', color: 'bg-yellow-100 text-yellow-800' },
  { level: 4, name: 'Pureed', desc: 'Purè omogeneo. Mantiene forma su cucchiaio rovesciato.', color: 'bg-orange-100 text-orange-800' },
  { level: 5, name: 'Minced & Moist', desc: 'Pezzi ≤ 4mm, morbidi e umidi. Richiede masticazione minima.', color: 'bg-amber-100 text-amber-800' },
  { level: 6, name: 'Soft & Bite-sized', desc: 'Pezzi ≤ 1.5cm, morbidi. Richiede masticazione.', color: 'bg-lime-100 text-lime-800' },
  { level: 7, name: 'Regular', desc: 'Dieta normale. Tutti gli alimenti.', color: 'bg-green-100 text-green-800' },
];

const THICKENER_DOSE = [
  { product: 'Amido di mais (Maizena)', l1: '2g/100mL', l2: '4g/100mL', l3: '6g/100mL', l4: '8g/100mL' },
  { product: 'Gomma xantana', l1: '0.5g/100mL', l2: '1g/100mL', l3: '1.5g/100mL', l4: '2g/100mL' },
  { product: 'Preparato commerciale (es. Nutilis)', l1: '1 mis./200mL', l2: '1.5 mis./200mL', l3: '2 mis./200mL', l4: '2.5 mis./200mL' },
];

const FOOD_TIPS = [
  { food: 'Carne', mod: 'Trinciare finemente o passare al mixer con brodo. Aggiungere sugo per umidità.' },
  { food: 'Pesce', mod: 'Sfilettare e schiacciare. Verificare assenza di lische. Condire con olio.' },
  { food: 'Verdure', mod: 'Cuocere fino a morbidezza, passare con frullatore a immersione.' },
  { food: 'Frutta', mod: 'Frullare o centrifugare. Aggiungere addensante se necessario per livello 3–4.' },
  { food: 'Pane', mod: 'Livello 5–6: inzuppare nel latte/brodo. Livello 3–4: frullare con liquido.' },
  { food: 'Uova', mod: 'Uova strapazzate morbide (livello 5–6). Frittata frullata (livello 3–4).' },
];

export default function Disfagia() {
  const [selectedLevel, setSelectedLevel] = useState(4);
  const [volume, setVolume] = useState('200');

  const level = IDDSI_LEVELS.find(l => l.level === selectedLevel);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <MessageSquare size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Disfagia</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Disfagia — IDDSI Framework</h1>
          <p className="text-teal-100 text-sm mt-0.5">Livelli di consistenza IDDSI, calcolo addensante e modifiche degli alimenti</p>
        </div>

        {/* IDDSI Level selector */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Livelli di consistenza IDDSI (0–7)</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
            {IDDSI_LEVELS.map(l => (
              <button key={l.level} onClick={() => setSelectedLevel(l.level)}
                className={`rounded-lg p-2 text-center transition-all border-2 ${selectedLevel === l.level ? 'border-teal-500 shadow-md' : 'border-transparent hover:border-gray-300'} ${l.color}`}>
                <div className="text-lg font-bold">{l.level}</div>
                <div className="text-[10px] font-medium leading-tight">{l.name.split(' ')[0]}</div>
              </button>
            ))}
          </div>
          {level && (
            <div className={`rounded-lg p-4 ${level.color}`}>
              <div className="font-bold text-sm mb-1">Livello {level.level} — {level.name}</div>
              <p className="text-xs">{level.desc}</p>
            </div>
          )}
        </div>

        {/* Thickener dosage */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-2">Calcolatore addensante</h2>
          <div className="flex items-end gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Volume liquido (mL)</label>
              <input type="number" value={volume} onChange={e => setVolume(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Addensante</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Liv. 1 (Slightly)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Liv. 2 (Mildly)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Liv. 3 (Liquidised)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Liv. 4 (Pureed)</th>
                </tr>
              </thead>
              <tbody>
                {THICKENER_DOSE.map(t => (
                  <tr key={t.product} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-1.5 font-medium text-gray-700">{t.product}</td>
                    <td className="px-3 py-1.5 text-center text-gray-600">{t.l1}</td>
                    <td className="px-3 py-1.5 text-center text-gray-600">{t.l2}</td>
                    <td className="px-3 py-1.5 text-center text-gray-600">{t.l3}</td>
                    <td className="px-3 py-1.5 text-center text-gray-600">{t.l4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Dosi indicative per 100 mL standard; moltiplicare per il volume inserito ({volume} mL = ×{(Number(volume)/100).toFixed(1)})</p>
        </div>

        {/* Food texture tips */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Modifiche degli alimenti comuni</h2>
          <div className="space-y-2">
            {FOOD_TIPS.map(f => (
              <div key={f.food} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="font-semibold text-teal-700 text-xs w-16 flex-shrink-0">{f.food}</span>
                <span className="text-xs text-gray-600">{f.mod}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
