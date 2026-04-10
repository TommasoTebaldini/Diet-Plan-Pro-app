import { useState } from 'react';
import { Leaf } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const ALLOWED_FOODS = ['Carne, pesce, uova', 'Formaggi stagionati', 'Verdure a foglia (spinaci, rucola, lattuga)', 'Avocado', 'Noci e semi', 'Olio extravergine d\'oliva', 'Burro e panna', 'Funghi', 'Cavolfiore, broccoli, zucchine'];
const AVOID_FOODS = ['Pane, pasta, riso, cereali', 'Patate e tuberi', 'Legumi (lenticchie, fagioli, ceci)', 'Frutta (tranne piccole quantità di frutti di bosco)', 'Zucchero, miele, sciroppi', 'Alcolici (soprattutto birra)', 'Latte e yogurt ad alto contenuto di lattosio'];

function emptyKetone() {
  return { id: Date.now(), data: new Date().toISOString().slice(0, 10), ketoBlood: '', ketoUrine: '' };
}

export default function DietaChetogenica() {
  const [ratio, setRatio] = useState('4');
  const [kcal, setKcal] = useState('');
  const [ketones, setKetones] = useState([emptyKetone()]);
  const [cho, setCho] = useState('');

  const r = Number(ratio) || 4;
  const totalKcal = Number(kcal) || 0;

  // Classic ratio: fat:(protein+carb) = r:1, fat provides 9 kcal/g, prot+carb provide 4 kcal/g
  // ratio = fat_g / (prot_g + carb_g)
  // fat_kcal = totalKcal * r*9 / (r*9 + 4)
  const fatKcal = totalKcal ? totalKcal * (r * 9) / (r * 9 + 4) : 0;
  const restKcal = totalKcal - fatKcal;
  const fatG = (fatKcal / 9).toFixed(1);
  const protCarbG = (restKcal / 4).toFixed(1);
  // assume 10% carb, 90% prot of remaining for classic keto
  const carbG = totalKcal ? Math.min(Number(protCarbG) * 0.15, 20).toFixed(1) : 0;
  const protG = totalKcal ? (Number(protCarbG) - Number(carbG)).toFixed(1) : 0;

  const netCarb = cho ? Math.max(0, Number(cho)).toFixed(1) : null;

  const addKetone = () => setKetones(prev => [...prev, emptyKetone()]);
  const updateKetone = (id, field, val) => setKetones(prev => prev.map(k => k.id === id ? { ...k, [field]: val } : k));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Leaf size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Dieta Chetogenica</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🥑</span>
            <div>
              <h1 className="text-white font-bold text-lg">Dieta Chetogenica</h1>
              <p className="text-teal-100 text-sm mt-0.5">Calcolatore ratio, carboidrati netti, monitoraggio chetoni e alimenti consigliati</p>
            </div>
          </div>
        </div>

        {/* Macro ratio calculator */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Calcolatore Ratio Chetogenico</h2>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ratio (grassi : proteine+carboidrati)</label>
              <select value={ratio} onChange={e => setRatio(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300">
                {['2', '3', '4', '4.5'].map(r => <option key={r} value={r}>{r}:1</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fabbisogno energetico (kcal/die)</label>
              <input type="number" value={kcal} onChange={e => setKcal(e.target.value)} placeholder="es. 1600"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
          </div>

          {totalKcal > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Grassi', g: fatG, kcalV: fatKcal.toFixed(0), pct: ((fatKcal / totalKcal) * 100).toFixed(0), color: 'amber' },
                { label: 'Proteine', g: protG, kcalV: (Number(protG) * 4).toFixed(0), pct: ((Number(protG) * 4 / totalKcal) * 100).toFixed(0), color: 'blue' },
                { label: 'Carboidrati', g: carbG, kcalV: (Number(carbG) * 4).toFixed(0), pct: ((Number(carbG) * 4 / totalKcal) * 100).toFixed(0), color: 'green' },
              ].map(m => (
                <div key={m.label} className={`bg-${m.color}-50 border border-${m.color}-200 rounded-lg p-3 text-center`}>
                  <div className={`text-xs font-medium text-${m.color}-600 mb-1`}>{m.label}</div>
                  <div className={`text-xl font-bold text-${m.color}-700`}>{m.g} g</div>
                  <div className="text-xs text-gray-500">{m.kcalV} kcal · {m.pct}%</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Net carb calculator */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-2">Calcolatore Carboidrati Netti</h2>
          <p className="text-xs text-gray-500 mb-3">Carboidrati netti = Carboidrati totali − Fibre alimentari</p>
          <div className="flex items-end gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">CHO totali (g)</label>
              <input type="number" value={cho} onChange={e => setCho(e.target.value)} placeholder="es. 25"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div className="pb-2 text-sm text-gray-600">
              Carboidrati netti: <span className="font-bold text-teal-700 text-base">{netCarb !== null ? `${netCarb} g` : '—'}</span>
              {netCarb !== null && Number(netCarb) <= 20 && <span className="ml-2 text-xs text-green-600 font-medium">✓ In range chetogenico</span>}
              {netCarb !== null && Number(netCarb) > 20 && <span className="ml-2 text-xs text-orange-600 font-medium">⚠ Sopra soglia chetogenica</span>}
            </div>
          </div>
        </div>

        {/* Ketone tracking */}
        <div className={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Monitoraggio Chetoni</h2>
            <button onClick={addKetone} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
              + Aggiungi
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Data</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Chetoni ematici (mmol/L)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Chetoni urinari</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Stato</th>
                </tr>
              </thead>
              <tbody>
                {ketones.map(k => {
                  const blood = Number(k.ketoBlood);
                  const state = !k.ketoBlood ? '—' : blood < 0.5 ? 'Non chetosico' : blood < 1.5 ? 'Lieve' : blood < 3 ? 'Ottimale' : 'Alto';
                  const stateColor = !k.ketoBlood ? '' : blood < 0.5 ? 'text-gray-400' : blood < 1.5 ? 'text-yellow-600' : blood < 3 ? 'text-green-600 font-semibold' : 'text-orange-600';
                  return (
                    <tr key={k.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-2 py-1.5">
                        <input type="date" value={k.data} onChange={ev => updateKetone(k.id, 'data', ev.target.value)}
                          className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-32" />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <input type="number" step="0.1" value={k.ketoBlood} onChange={ev => updateKetone(k.id, 'ketoBlood', ev.target.value)}
                          placeholder="—" className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-20 text-center" />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <select value={k.ketoUrine} onChange={ev => updateKetone(k.id, 'ketoUrine', ev.target.value)}
                          className="border border-gray-200 rounded px-1 py-0.5 text-xs focus:outline-none">
                          <option value="">—</option>
                          <option>Negativo</option><option>Tracce</option><option>Piccolo</option><option>Moderato</option><option>Alto</option>
                        </select>
                      </td>
                      <td className={`px-2 py-1.5 text-xs ${stateColor}`}>{state}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Chetosi nutrizionale ottimale: 0.5–3.0 mmol/L ematici</p>
        </div>

        {/* Allowed / avoid */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Alimenti — Guida rapida</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">✅ Consentiti</div>
              <ul className="space-y-1">{ALLOWED_FOODS.map((f, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5"><span className="text-green-500">•</span>{f}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">❌ Da evitare</div>
              <ul className="space-y-1">{AVOID_FOODS.map((f, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5"><span className="text-red-400">•</span>{f}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
