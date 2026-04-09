import { useState } from 'react';
import { Plus, Trash2, TrendingDown, TrendingUp, Minus, Ruler } from 'lucide-react';

const MEASURE_FIELDS = [
  { key: 'waist',  label: 'Vita',    unit: 'cm', color: 'text-emerald-600' },
  { key: 'hips',   label: 'Fianchi', unit: 'cm', color: 'text-blue-600'    },
  { key: 'chest',  label: 'Petto',   unit: 'cm', color: 'text-purple-600'  },
  { key: 'arm',    label: 'Braccio', unit: 'cm', color: 'text-amber-600'   },
  { key: 'thigh',  label: 'Coscia',  unit: 'cm', color: 'text-rose-600'    },
];

function WeightChart({ entries }) {
  const recent = entries.slice(-10);
  if (recent.length < 2) return null;
  const maxW   = Math.max(...recent.map(e => e.weight));
  const minW   = Math.min(...recent.map(e => e.weight));
  const range  = maxW - minW || 1;
  const chartH = 160;
  const chartW = 500;
  const barW   = Math.max(20, (chartW - 40) / recent.length - 8);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="font-semibold text-gray-700 mb-4">Grafico Peso (ultimi 10 valori)</h3>
      <div className="overflow-x-auto">
        <svg width={chartW} height={chartH + 40} className="mx-auto">
          {[0, 0.25, 0.5, 0.75, 1].map(pct => {
            const y = chartH - pct * chartH;
            const w = minW + pct * range;
            return (
              <g key={pct}>
                <line x1="30" y1={y} x2={chartW} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                <text x="28" y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{w.toFixed(1)}</text>
              </g>
            );
          })}
          {recent.map((entry, i) => {
            const x    = 35 + i * (barW + 8);
            const barH = ((entry.weight - minW) / range) * (chartH - 20) + 20;
            const y    = chartH - barH;
            return (
              <g key={i}>
                <rect x={x} y={y} width={barW} height={barH} rx="4" fill="#10b981" opacity="0.8" />
                <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">
                  {entry.date.slice(5)}
                </text>
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="500">
                  {entry.weight}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function PatientProgress({ patientId, profile }) {
  const storageKey     = `diet-patient-${patientId}-progress`;
  const measureKey     = `diet-patient-${patientId}-measures`;

  // Weight entries
  const [entries, setEntriesState] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || '[]')
  );
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
  });

  // Body measurements entries
  const [measures, setMeasuresState] = useState(() =>
    JSON.parse(localStorage.getItem(measureKey) || '[]')
  );
  const [measureForm, setMeasureForm] = useState({
    date:  new Date().toISOString().split('T')[0],
    waist: '', hips: '', chest: '', arm: '', thigh: '',
  });

  const [activeTab, setActiveTab] = useState('weight');

  const setEntries = (updater) => {
    setEntriesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const setMeasures = (updater) => {
    setMeasuresState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(measureKey, JSON.stringify(next));
      return next;
    });
  };

  const addEntry = (e) => {
    e.preventDefault();
    if (!form.weight) return;
    setEntries(prev =>
      [...prev, { date: form.date, weight: Number(form.weight) }]
        .sort((a, b) => a.date.localeCompare(b.date))
    );
    setForm(prev => ({ ...prev, weight: '' }));
  };

  const removeEntry = (idx) => {
    setEntries(prev => prev.filter((_, i) => i !== idx));
  };

  const addMeasure = (e) => {
    e.preventDefault();
    const hasValue = MEASURE_FIELDS.some(f => measureForm[f.key]);
    if (!hasValue) return;
    const entry = { date: measureForm.date };
    MEASURE_FIELDS.forEach(f => {
      if (measureForm[f.key]) entry[f.key] = Number(measureForm[f.key]);
    });
    setMeasures(prev =>
      [...prev, entry].sort((a, b) => a.date.localeCompare(b.date))
    );
    setMeasureForm(prev => ({
      ...prev,
      waist: '', hips: '', chest: '', arm: '', thigh: '',
    }));
  };

  const removeMeasure = (idx) => {
    setMeasures(prev => prev.filter((_, i) => i !== idx));
  };

  const trend = entries.length >= 2
    ? entries[entries.length - 1].weight - entries[0].weight
    : 0;

  const targetWeight = profile?.goal === 'lose'
    ? (profile?.weight ? profile.weight - 5 : null)
    : profile?.goal === 'gain'
    ? (profile?.weight ? profile.weight + 5 : null)
    : null;

  const latestMeasure = measures.length > 0 ? measures[measures.length - 1] : null;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Progressi</h2>
        <p className="text-gray-500 mt-1">Monitora il tuo peso e le tue misure nel tempo</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('weight')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'weight' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ⚖️ Peso
        </button>
        <button
          onClick={() => setActiveTab('measures')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'measures' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Ruler size={14} /> Misure Corporee
        </button>
      </div>

      {/* ── WEIGHT TAB ────────────────────────────────────────────────── */}
      {activeTab === 'weight' && (
        <>
          {/* Stats row */}
          {entries.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Peso Attuale</p>
                <p className="text-2xl font-bold text-gray-800">
                  {entries[entries.length - 1].weight} <span className="text-sm font-normal text-gray-400">kg</span>
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Peso Iniziale</p>
                <p className="text-2xl font-bold text-gray-800">
                  {entries[0].weight} <span className="text-sm font-normal text-gray-400">kg</span>
                </p>
              </div>
              <div className={`rounded-2xl shadow-sm border p-4 text-center ${
                trend < 0 ? 'bg-emerald-50 border-emerald-100' :
                trend > 0 ? 'bg-rose-50 border-rose-100'       :
                'bg-gray-50 border-gray-100'
              }`}>
                <p className="text-xs text-gray-500 mb-1">Variazione Totale</p>
                <p className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                  trend < 0 ? 'text-emerald-600' :
                  trend > 0 ? 'text-rose-500'    :
                  'text-gray-600'
                }`}>
                  {trend < 0 ? <TrendingDown size={20} /> : trend > 0 ? <TrendingUp size={20} /> : <Minus size={20} />}
                  {trend > 0 ? '+' : ''}{trend.toFixed(1)} kg
                </p>
              </div>
            </div>
          )}

          {/* Objective card */}
          {profile?.weight && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">Il tuo obiettivo</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {profile.goal === 'lose'     ? '🔥 Perdere peso'      :
                   profile.goal === 'gain'     ? '💪 Aumentare massa'   :
                   '⚖️ Mantenere il peso'}
                </p>
              </div>
              {targetWeight && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Obiettivo indicativo</p>
                  <p className="text-lg font-bold text-emerald-600">{targetWeight} kg</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-gray-500">Target calorico</p>
                <p className="text-lg font-bold text-emerald-600">{profile.calorieTarget || 2000} kcal</p>
              </div>
            </div>
          )}

          <WeightChart entries={entries} />

          {/* Add weight form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-emerald-500" /> Registra Peso
            </h3>
            <form onSubmit={addEntry} className="flex gap-3 flex-wrap">
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Peso (kg)"
                value={form.weight}
                onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                className="w-36 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> Aggiungi
              </button>
            </form>
          </div>

          {/* Weight table */}
          {entries.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Peso</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Variazione</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...entries].reverse().map((entry, i, arr) => {
                    const prev = arr[i + 1];
                    const diff = prev ? entry.weight - prev.weight : null;
                    return (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-3 text-sm text-gray-700">{entry.date}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-800">{entry.weight} kg</td>
                        <td className="px-6 py-3 text-sm">
                          {diff !== null && (
                            <span className={diff < 0 ? 'text-emerald-600' : diff > 0 ? 'text-rose-500' : 'text-gray-400'}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => removeEntry(entries.length - 1 - i)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {entries.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Nessun dato registrato</p>
              <p className="text-sm mt-1">Inizia registrando il tuo peso sopra</p>
            </div>
          )}
        </>
      )}

      {/* ── MEASURES TAB ──────────────────────────────────────────────── */}
      {activeTab === 'measures' && (
        <>
          {/* Latest snapshot */}
          {latestMeasure && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
              <p className="text-xs text-gray-500 mb-3">Ultima rilevazione: {latestMeasure.date}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {MEASURE_FIELDS.map(f => latestMeasure[f.key] ? (
                  <div key={f.key} className="text-center bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">{f.label}</p>
                    <p className={`text-lg font-bold ${f.color}`}>{latestMeasure[f.key]} cm</p>
                  </div>
                ) : null)}
              </div>
            </div>
          )}

          {/* Add measurements form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-emerald-500" /> Registra Misure
            </h3>
            <form onSubmit={addMeasure} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data</label>
                <input
                  type="date"
                  value={measureForm.date}
                  onChange={e => setMeasureForm(p => ({ ...p, date: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {MEASURE_FIELDS.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-gray-600 mb-1">{f.label} (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="—"
                      value={measureForm[f.key]}
                      onChange={e => setMeasureForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-2 py-2 border border-gray-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> Salva Misure
              </button>
            </form>
          </div>

          {/* Measurements history */}
          {measures.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Data</th>
                      {MEASURE_FIELDS.map(f => (
                        <th key={f.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{f.label}</th>
                      ))}
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...measures].reverse().map((m, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-sm text-gray-700 font-medium">{m.date}</td>
                        {MEASURE_FIELDS.map(f => (
                          <td key={f.key} className={`px-4 py-3 text-sm font-semibold ${f.color}`}>
                            {m[f.key] ? `${m[f.key]} cm` : <span className="text-gray-300">—</span>}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => removeMeasure(measures.length - 1 - i)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Ruler size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg">Nessuna misura registrata</p>
              <p className="text-sm mt-1">Inizia registrando le tue misure corporee sopra</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
