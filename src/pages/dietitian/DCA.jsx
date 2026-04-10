import { useState } from 'react';
import { Brain, Plus, Trash2 } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const WARNING_SIGNS = [
  'Rifiuto persistente di mantenere un peso corporeo minimo normale',
  'Intensa paura di aumentare di peso',
  'Distorsione dell\'immagine corporea',
  'Abbuffate ricorrenti seguite da comportamenti compensatori',
  'Iperattività fisica incontrollabile',
  'Rituali alimentari rigidi (tagliare il cibo in piccoli pezzi, mescolare, etc.)',
  'Isolamento sociale intorno ai pasti',
  'Uso di lassativi, diuretici o emetici',
];

const COMMUNICATION_TIPS = [
  { tip: 'Non commentare il corpo o il peso', desc: 'Evitare commenti su aspetto fisico, anche se positivi. Focalizzarsi su salute e benessere.' },
  { tip: 'Approccio collaborativo', desc: 'Stabilire obiettivi condivisi. Il paziente è partner del percorso, non soggetto passivo.' },
  { tip: 'Validare le emozioni', desc: 'Riconoscere la difficoltà del percorso senza minimizzare né amplificare.' },
  { tip: 'Comunicazione chiara sui valori nutrizionali', desc: 'Presentare informazioni nutrizionali in modo neutro, evitando linguaggio moralizzante.' },
];

function emptyBMI() {
  return { id: Date.now(), data: new Date().toISOString().slice(0, 10), peso: '', altezza: '', note: '' };
}

function calcBMI(peso, altezza) {
  const p = Number(peso), h = Number(altezza) / 100;
  if (!p || !h) return null;
  return (p / (h * h)).toFixed(1);
}

function bmiClass(bmi) {
  const b = Number(bmi);
  if (b < 16) return { label: 'Malnutrizione grave', color: 'bg-red-200 text-red-800' };
  if (b < 18.5) return { label: 'Sottopeso', color: 'bg-orange-100 text-orange-800' };
  if (b < 25) return { label: 'Normopeso', color: 'bg-green-100 text-green-800' };
  if (b < 30) return { label: 'Sovrappeso', color: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Obesità', color: 'bg-red-100 text-red-800' };
}

export default function DCA() {
  const [entries, setEntries] = useState([emptyBMI()]);
  const [checklist, setChecklist] = useState({});
  const [planNotes, setPlanNotes] = useState('');

  const addEntry = () => setEntries(prev => [...prev, emptyBMI()]);
  const removeEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id));
  const updateEntry = (id, field, val) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  const toggleCheck = (i) => setChecklist(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Brain size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">DCA — Disturbi del Comportamento Alimentare</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🧠</span>
            <div>
              <h1 className="text-white font-bold text-lg">DCA — Disturbi del Comportamento Alimentare</h1>
              <p className="text-teal-100 text-sm mt-0.5">Monitoraggio BMI, piano nutrizionale orientato al recupero, segnali di allerta</p>
            </div>
          </div>
        </div>

        {/* BMI tracker */}
        <div className={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Storico BMI</h2>
            <button onClick={addEntry} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
              <Plus size={12} /> Aggiungi
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Data</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Peso (kg)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Altezza (cm)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">BMI</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Classificazione</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => {
                  const bmi = calcBMI(e.peso, e.altezza);
                  const cls = bmi ? bmiClass(bmi) : null;
                  return (
                    <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-2 py-1.5">
                        <input type="date" value={e.data} onChange={ev => updateEntry(e.id, 'data', ev.target.value)}
                          className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-32" />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <input type="number" step="0.1" value={e.peso} onChange={ev => updateEntry(e.id, 'peso', ev.target.value)}
                          placeholder="—" className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-16 text-center" />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <input type="number" value={e.altezza} onChange={ev => updateEntry(e.id, 'altezza', ev.target.value)}
                          placeholder="—" className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-16 text-center" />
                      </td>
                      <td className="px-2 py-1.5 text-center font-bold text-gray-700">{bmi || '—'}</td>
                      <td className="px-2 py-1.5">
                        {cls && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls.color}`}>{cls.label}</span>}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button onClick={() => removeEntry(e.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={12} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warning signs */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Checklist Segnali di Allerta</h2>
          <div className="space-y-2">
            {WARNING_SIGNS.map((sign, i) => (
              <label key={i} className="flex items-start gap-2 cursor-pointer group">
                <input type="checkbox" checked={!!checklist[i]} onChange={() => toggleCheck(i)}
                  className="mt-0.5 accent-teal-600 flex-shrink-0" />
                <span className={`text-sm ${checklist[i] ? 'text-red-600 font-medium' : 'text-gray-700'}`}>{sign}</span>
              </label>
            ))}
          </div>
          {Object.values(checklist).filter(Boolean).length > 0 && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
              ⚠️ {Object.values(checklist).filter(Boolean).length} segnale/i di allerta rilevato/i. Considerare consulenza multidisciplinare.
            </div>
          )}
        </div>

        {/* Communication tips */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Comunicazione Terapeutica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMMUNICATION_TIPS.map((t, i) => (
              <div key={i} className="bg-teal-50 border border-teal-100 rounded-lg p-3">
                <div className="font-semibold text-teal-800 text-sm mb-1">{t.tip}</div>
                <div className="text-xs text-gray-600">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan notes */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-2">Note piano nutrizionale orientato al recupero</h2>
          <textarea value={planNotes} onChange={e => setPlanNotes(e.target.value)}
            placeholder="Obiettivi di recupero, pasti strutturati, alimenti di comfort, progressione calorica..."
            rows={4}
            className="w-full text-sm px-3 py-2 border border-dashed border-teal-200 rounded-lg bg-teal-50/30 focus:outline-none focus:ring-1 focus:ring-teal-300 placeholder-gray-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
