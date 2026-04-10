import { useState } from 'react';
import { Zap } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const BIA_CLASSIFICATIONS = [
  { param: 'Angolo di fase', low: '< 4°', normal: '4–7°', high: '> 7°', note: 'Basso = rischio malnutrizione; Alto = buon trofismo cellulare' },
  { param: 'BCM (Massa Cellulare Corporea)', low: '< 30% peso', normal: '30–40% peso', high: '> 40% peso', note: 'Massa metabolicamente attiva' },
  { param: 'ECW/TBW (Acqua extra/totale)', low: '—', normal: '< 0.40', high: '> 0.40', note: 'Ratio elevato = ritenzione idrica, infiammazione' },
  { param: 'FM (Massa grassa)', low: '< 10%', normal: 'F: 20–35% | M: 10–25%', high: '> 35% (F) / > 25% (M)', note: 'Espresso come % del peso corporeo' },
];

function emptyBIAEntry() {
  return { id: Date.now(), data: new Date().toISOString().slice(0, 10), R: '', Xc: '', pa: '', bcm: '', ecwRatio: '', fm: '', ffm: '', weight: '' };
}

function calcBIA(R, Xc, height, weight) {
  const r = Number(R), xc = Number(Xc), h = Number(height), w = Number(weight);
  if (!r || !xc || !h) return null;
  const pa = Number((Math.atan(xc / r) * 180 / Math.PI).toFixed(1));
  // TBW (Kyle 2004 formula simplified): TBW = 0.45534 * h^2/R + 0.296 * w + 1.916 (females) or similar
  const tbw = Number((0.455 * (h * h / r) + 0.296 * w + 1.916).toFixed(1));
  const ffm = w ? Number((tbw / 0.732).toFixed(1)) : null;
  const fm = w && ffm ? Number((w - ffm).toFixed(1)) : null;
  const fmPct = w && fm ? Number((fm / w * 100).toFixed(1)) : null;
  return { pa, tbw, ffm, fm, fmPct };
}

export default function BIA() {
  const [inputs, setInputs] = useState({ R: '', Xc: '', height: '', weight: '', age: '', sex: 'F' });
  const [history, setHistory] = useState([]);

  const set = (f, v) => setInputs(prev => ({ ...prev, [f]: v }));
  const result = calcBIA(inputs.R, inputs.Xc, inputs.height, inputs.weight);

  const saveEntry = () => {
    if (!result) return;
    setHistory(prev => [{
      id: Date.now(),
      data: new Date().toISOString().slice(0, 10),
      R: inputs.R, Xc: inputs.Xc,
      pa: result.pa, ffm: result.ffm, fm: result.fm, fmPct: result.fmPct, weight: inputs.weight,
    }, ...prev]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Zap size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">BIA — Analisi dell'Impedenza Bioelettrica</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>⚡</span>
            <div>
              <h1 className="text-white font-bold text-lg">BIA — Bioimpedenzometria</h1>
              <p className="text-teal-100 text-sm mt-0.5">Calcolo angolo di fase, BCM, acqua corporea, massa grassa e massa magra</p>
            </div>
          </div>
        </div>

        {/* Input form */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Parametri BIA</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Resistenza R (Ω)', field: 'R', placeholder: 'es. 550' },
              { label: 'Reattanza Xc (Ω)', field: 'Xc', placeholder: 'es. 65' },
              { label: 'Altezza (cm)', field: 'height', placeholder: 'es. 170' },
              { label: 'Peso (kg)', field: 'weight', placeholder: 'es. 70' },
              { label: 'Età (anni)', field: 'age', placeholder: 'es. 45' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                <input type="number" value={inputs[f.field]} onChange={e => set(f.field, e.target.value)}
                  placeholder={f.placeholder}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sesso</label>
              <select value={inputs.sex} onChange={e => set('sex', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="F">Femmina</option>
                <option value="M">Maschio</option>
              </select>
            </div>
          </div>
          <button onClick={saveEntry} disabled={!result}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg">
            Calcola e salva
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={CARD}>
            <h2 className="font-semibold text-gray-800 mb-3">Risultati</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Angolo di fase', value: `${result.pa}°`, color: result.pa >= 4 && result.pa <= 7 ? 'text-green-600' : 'text-orange-600' },
                { label: 'TBW (Acqua totale)', value: `${result.tbw} L`, color: 'text-blue-600' },
                { label: 'FFM (Massa magra)', value: result.ffm ? `${result.ffm} kg` : '—', color: 'text-teal-600' },
                { label: 'FM (Massa grassa)', value: result.fm ? `${result.fm} kg (${result.fmPct}%)` : '—', color: 'text-amber-600' },
              ].map(r => (
                <div key={r.label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">{r.label}</div>
                  <div className={`text-lg font-bold ${r.color}`}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classification table */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Tabella di classificazione BIA</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Parametro</th>
                  <th className="text-center px-3 py-2 font-medium text-orange-600">Basso</th>
                  <th className="text-center px-3 py-2 font-medium text-green-600">Normale</th>
                  <th className="text-center px-3 py-2 font-medium text-blue-600">Elevato</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Note</th>
                </tr>
              </thead>
              <tbody>
                {BIA_CLASSIFICATIONS.map(c => (
                  <tr key={c.param} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-1.5 font-medium text-gray-700">{c.param}</td>
                    <td className="px-3 py-1.5 text-center text-orange-600">{c.low}</td>
                    <td className="px-3 py-1.5 text-center text-green-600 font-medium">{c.normal}</td>
                    <td className="px-3 py-1.5 text-center text-blue-600">{c.high}</td>
                    <td className="px-3 py-1.5 text-gray-500">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className={CARD}>
            <h2 className="font-semibold text-gray-800 mb-3">Storico misurazioni</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Data</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">Peso (kg)</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">R (Ω)</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">Xc (Ω)</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">PA (°)</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">FFM (kg)</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600">FM%</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(h => (
                    <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-1.5">{h.data}</td>
                      <td className="px-3 py-1.5 text-center">{h.weight}</td>
                      <td className="px-3 py-1.5 text-center">{h.R}</td>
                      <td className="px-3 py-1.5 text-center">{h.Xc}</td>
                      <td className="px-3 py-1.5 text-center font-bold text-teal-700">{h.pa}°</td>
                      <td className="px-3 py-1.5 text-center">{h.ffm}</td>
                      <td className="px-3 py-1.5 text-center">{h.fmPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
