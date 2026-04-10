import { useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const GI_CARDS = [
  { label: 'Basso (< 55)', color: 'bg-green-100 text-green-800', foods: 'Legumi, pasta al dente, latte, mela, pera' },
  { label: 'Medio (55–70)', color: 'bg-yellow-100 text-yellow-800', foods: 'Riso basmati, pane integrale, succo d\'arancia' },
  { label: 'Alto (> 70)', color: 'bg-red-100 text-red-800', foods: 'Pane bianco, riso brillato, patate al forno, glucosio' },
];

function emptyEntry() {
  return { id: Date.now(), data: new Date().toISOString().slice(0, 10), ora: '08:00', glicemia: '', insulina: '', note: '' };
}

export default function GestioneDiabete() {
  const [hba1c, setHba1c] = useState('');
  const [entries, setEntries] = useState([emptyEntry()]);

  const addEntry = () => setEntries(prev => [...prev, emptyEntry()]);
  const removeEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id));
  const updateEntry = (id, field, val) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));

  const avgGlicemia = entries.length
    ? (entries.reduce((s, e) => s + (Number(e.glicemia) || 0), 0) / entries.filter(e => e.glicemia).length || 0).toFixed(0)
    : '—';

  const carbUnitMeal = (cho) => cho ? (Number(cho) / 15).toFixed(1) : '—';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Heart size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Gestione Diabete</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Header */}
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>💉</span>
            <div>
              <h1 className="text-white font-bold text-lg">Gestione Diabete</h1>
              <p className="text-teal-100 text-sm mt-0.5">Monitoraggio glicemico, conteggio carboidrati e diario insulinico</p>
            </div>
          </div>
        </div>

        {/* HbA1c + Summary */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Parametri clinici</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">HbA1c (%)</label>
              <input
                type="number" step="0.1" value={hba1c} onChange={e => setHba1c(e.target.value)}
                placeholder="es. 6.5"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              {hba1c && (
                <span className={`ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${Number(hba1c) < 7 ? 'bg-green-100 text-green-700' : Number(hba1c) < 8 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {Number(hba1c) < 7 ? 'Ottimale' : Number(hba1c) < 8 ? 'Discreto' : 'Non ottimale'}
                </span>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Glicemia media (mg/dL)</label>
              <span className="inline-block border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 w-32 text-center font-semibold text-teal-700">{avgGlicemia}</span>
            </div>
          </div>
        </div>

        {/* Carb counting */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Conteggio Carboidrati</h2>
          <p className="text-xs text-gray-500 mb-3">1 Unità carboidrati (UC) = 15 g di CHO</p>
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">CHO totali del pasto (g)</label>
              <input id="cho" type="number" placeholder="es. 60"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-teal-300"
                onChange={e => document.getElementById('uc-result').textContent = carbUnitMeal(e.target.value) + ' UC'}
              />
            </div>
            <div className="pb-0.5">
              <span className="text-xs text-gray-500">= </span>
              <span id="uc-result" className="text-lg font-bold text-teal-700">— UC</span>
            </div>
          </div>
        </div>

        {/* Glycemic index */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Indice Glicemico — Riferimento rapido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {GI_CARDS.map(g => (
              <div key={g.label} className={`rounded-lg p-3 ${g.color}`}>
                <div className="font-semibold text-sm mb-1">{g.label}</div>
                <div className="text-xs">{g.foods}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Glycemic diary */}
        <div className={CARD}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Diario Glicemico</h2>
            <button onClick={addEntry} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
              <Plus size={12} /> Aggiungi
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Data</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Ora</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Glicemia (mg/dL)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Insulina (U)</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Note</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-2 py-1.5">
                      <input type="date" value={e.data} onChange={ev => updateEntry(e.id, 'data', ev.target.value)}
                        className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-32" />
                    </td>
                    <td className="px-2 py-1.5">
                      <input type="time" value={e.ora} onChange={ev => updateEntry(e.id, 'ora', ev.target.value)}
                        className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-24" />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <input type="number" value={e.glicemia} onChange={ev => updateEntry(e.id, 'glicemia', ev.target.value)}
                        placeholder="—"
                        className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-20 text-center" />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <input type="number" value={e.insulina} onChange={ev => updateEntry(e.id, 'insulina', ev.target.value)}
                        placeholder="—"
                        className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-16 text-center" />
                    </td>
                    <td className="px-2 py-1.5">
                      <input value={e.note} onChange={ev => updateEntry(e.id, 'note', ev.target.value)}
                        placeholder="..."
                        className="border border-gray-200 rounded px-2 py-0.5 text-xs focus:outline-none w-full" />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <button onClick={() => removeEntry(e.id)} className="text-gray-300 hover:text-red-400">
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
