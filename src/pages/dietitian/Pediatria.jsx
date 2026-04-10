import { useState } from 'react';
import { Baby } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const CALORIC_NEEDS = [
  { age: '0–6 mesi', kcal: '550 kcal/die', note: 'Solo latte materno o formula. Nessun alimento solido.' },
  { age: '6–12 mesi', kcal: '700 kcal/die', note: 'Inizio svezzamento. Latte materno + alimenti semisolidi.' },
  { age: '1–3 anni', kcal: '1100–1200 kcal/die', note: 'Dieta variegata. Latte intero 500 mL/die.' },
  { age: '4–6 anni', kcal: '1400–1600 kcal/die', note: 'Pasti strutturati. Ridurre succhi e zuccheri semplici.' },
  { age: '7–10 anni', kcal: '1700–2000 kcal/die', note: 'Aumenta il fabbisogno con l\'attività fisica scolastica.' },
  { age: '11–14 anni (F)', kcal: '2000–2200 kcal/die', note: 'Picco di crescita. Attenzione a ferro e calcio.' },
  { age: '11–14 anni (M)', kcal: '2200–2500 kcal/die', note: 'Picco di crescita. Proteine aumentate.' },
];

const COMPLEMENTARY = [
  { months: '6 mesi', intro: 'Cereali senza glutine (riso, mais), verdure passate, frutta frullata', avoid: 'Miele, sale, zucchero, latte vaccino intero, frutti di mare' },
  { months: '7–8 mesi', intro: 'Purea di carne magra, legumi passati (lenticchie rosse), formaggi freschi', avoid: 'Alimenti a rischio soffocamento (pezzi interi)' },
  { months: '9–10 mesi', intro: 'Pesce (merluzzo, sogliola), uova ben cotte, pasta piccola', avoid: 'Frutta secca intera, crostacei in grandi quantità' },
  { months: '11–12 mesi', intro: 'Cibi con piccoli pezzi morbidi, varietà ampliata', avoid: 'Sale aggiunto, salumi, alimenti ultra-processati' },
];

const PERCENTILE_TABLE = [
  { age: '0 m', p3F: '2.5', p50F: '3.2', p97F: '4.0', p3M: '2.7', p50M: '3.5', p97M: '4.3' },
  { age: '3 m', p3F: '4.6', p50F: '5.8', p97F: '7.1', p3M: '5.0', p50M: '6.4', p97M: '7.9' },
  { age: '6 m', p3F: '6.0', p50F: '7.3', p97F: '8.9', p3M: '6.4', p50M: '7.9', p97M: '9.6' },
  { age: '12 m', p3F: '7.7', p50F: '9.5', p97F: '11.5', p3M: '8.1', p50M: '10.2', p97M: '12.3' },
  { age: '24 m', p3F: '9.6', p50F: '12.0', p97F: '14.8', p3M: '10.0', p50M: '12.5', p97M: '15.3' },
  { age: '36 m', p3F: '11.0', p50F: '14.0', p97F: '17.5', p3M: '11.5', p50M: '14.5', p97M: '18.0' },
  { age: '5 a', p3F: '14.0', p50F: '18.5', p97F: '24.0', p3M: '14.5', p50M: '19.0', p97M: '25.0' },
  { age: '10 a', p3F: '24.0', p50F: '33.0', p97F: '46.0', p3M: '24.5', p50M: '33.5', p97M: '46.5' },
];

export default function Pediatria() {
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('F');

  const kcalPerKg = weight && age ? Math.round(Number(weight) * (Number(age) < 1 ? 90 : Number(age) < 3 ? 80 : Number(age) < 7 ? 75 : 60)) : null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Baby size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Pediatria</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>👶</span>
            <div>
              <h1 className="text-white font-bold text-lg">Pediatria</h1>
              <p className="text-teal-100 text-sm mt-0.5">Fabbisogno calorico per età, tabelle di crescita, allattamento e svezzamento</p>
            </div>
          </div>
        </div>

        {/* Caloric calculator */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Calcolatore fabbisogno calorico pediatrico</h2>
          <div className="flex flex-wrap items-end gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Peso (kg)</label>
              <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="es. 15"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Età (anni)</label>
              <input type="number" step="0.5" value={age} onChange={e => setAge(e.target.value)} placeholder="es. 3"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sesso</label>
              <select value={sex} onChange={e => setSex(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="F">Femmina</option>
                <option value="M">Maschio</option>
              </select>
            </div>
          </div>
          {kcalPerKg && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg px-4 py-2 text-sm">
              Fabbisogno stimato: <span className="font-bold text-teal-700 text-base">{kcalPerKg} kcal/die</span>
              <span className="text-xs text-gray-500 ml-2">(metodo kcal/kg per fascia d'età)</span>
            </div>
          )}
        </div>

        {/* Caloric needs table */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Fabbisogno calorico per fascia d'età (LARN)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[400px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Età</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Fabbisogno</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Note</th>
                </tr>
              </thead>
              <tbody>
                {CALORIC_NEEDS.map(r => (
                  <tr key={r.age} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-1.5 font-medium text-gray-700">{r.age}</td>
                    <td className="px-3 py-1.5 text-center font-bold text-teal-700">{r.kcal}</td>
                    <td className="px-3 py-1.5 text-gray-600">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth chart */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Peso — Percentili di riferimento OMS (kg)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Età</th>
                  <th className="text-center px-3 py-2 font-medium text-pink-600">P3 (F)</th>
                  <th className="text-center px-3 py-2 font-medium text-pink-600">P50 (F)</th>
                  <th className="text-center px-3 py-2 font-medium text-pink-600">P97 (F)</th>
                  <th className="text-center px-3 py-2 font-medium text-blue-600">P3 (M)</th>
                  <th className="text-center px-3 py-2 font-medium text-blue-600">P50 (M)</th>
                  <th className="text-center px-3 py-2 font-medium text-blue-600">P97 (M)</th>
                </tr>
              </thead>
              <tbody>
                {PERCENTILE_TABLE.map(r => (
                  <tr key={r.age} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-1.5 font-medium text-gray-700">{r.age}</td>
                    <td className="px-3 py-1.5 text-center text-pink-600">{r.p3F}</td>
                    <td className="px-3 py-1.5 text-center text-pink-700 font-bold">{r.p50F}</td>
                    <td className="px-3 py-1.5 text-center text-pink-600">{r.p97F}</td>
                    <td className="px-3 py-1.5 text-center text-blue-600">{r.p3M}</td>
                    <td className="px-3 py-1.5 text-center text-blue-700 font-bold">{r.p50M}</td>
                    <td className="px-3 py-1.5 text-center text-blue-600">{r.p97M}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complementary feeding */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Svezzamento — Calendario di introduzione</h2>
          <div className="space-y-3">
            {COMPLEMENTARY.map(c => (
              <div key={c.months} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                <div className="font-semibold text-teal-700 text-sm mb-1">{c.months}</div>
                <div className="text-xs text-gray-600 mb-1"><span className="text-green-600 font-medium">Introduce:</span> {c.intro}</div>
                <div className="text-xs text-gray-600"><span className="text-red-500 font-medium">Evitare:</span> {c.avoid}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
