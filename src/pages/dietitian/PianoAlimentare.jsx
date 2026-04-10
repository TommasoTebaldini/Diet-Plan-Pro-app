import { useState, useRef, useEffect, useCallback } from 'react';
import { foods } from '../../data/foods';
import {
  Save, Plus, X, ChevronUp, ChevronDown, GripVertical,
  Edit2, FileText, Printer, Undo, Search, FileSpreadsheet,
  ClipboardList,
} from 'lucide-react';

// ─── Meal templates ──────────────────────────────────────────────────────────
const PASTI_TEMPLATE = [
  { tipoId: 'colazione',       nome: 'Colazione',       colore: '#f97316', emoji: '🌅' },
  { tipoId: 'spuntino-mattina',nome: 'Spuntino Mattina',colore: '#10b981', emoji: '🍎' },
  { tipoId: 'pranzo',          nome: 'Pranzo',          colore: '#3b82f6', emoji: '🍽️' },
  { tipoId: 'merenda',         nome: 'Merenda',         colore: '#f59e0b', emoji: '🍊' },
  { tipoId: 'cena',            nome: 'Cena',            colore: '#6366f1', emoji: '🌙' },
  { tipoId: 'spuntino-sera',   nome: 'Spuntino Sera',   colore: '#ec4899', emoji: '🍵' },
];

const MICRONUTRIENTI = ['Calcio (mg)', 'Ferro (mg)', 'Magnesio (mg)', 'Potassio (mg)', 'Sodio (mg)', 'Zinco (mg)', 'Fosforo (mg)', 'Selenio (µg)', 'Col. (mg)'];

function uid() { return Math.random().toString(36).slice(2, 9); }

function emptyRiga() {
  return { id: uid(), alimentoId: null, alimentoNome: '', quantita: 8, fonte: '' };
}

function createPasto(template) {
  return {
    id: uid(),
    tipoId: template.tipoId,
    nome: template.nome,
    colore: template.colore,
    emoji: template.emoji,
    righe: [emptyRiga()],
    note: '',
    collapsed: false,
  };
}

function createGiorno(num) {
  return {
    id: uid(),
    nome: `Giorno ${num}`,
    pasti: PASTI_TEMPLATE.map(createPasto),
  };
}

function emptyPiano() {
  return {
    pazienteId: null,
    pazienteNome: '',
    dataPiano: new Date().toISOString().slice(0, 10),
    nomePiano: '',
    giorni: [createGiorno(1)],
  };
}

// ─── Nutrition helpers ────────────────────────────────────────────────────────
function nutritiRow(riga) {
  if (!riga.alimentoId) return null;
  const food = foods.find(f => f.id === riga.alimentoId);
  if (!food) return null;
  const q = Number(riga.quantita) || 0;
  const m = q / 100;
  return {
    kcal:  +(food.calories * m).toFixed(1),
    prot:  +(food.protein  * m).toFixed(1),
    fat:   +(food.fat      * m).toFixed(1),
    carbs: +(food.carbs    * m).toFixed(1),
  };
}

function pastoTotals(pasto) {
  let kcal = 0, prot = 0, fat = 0, carbs = 0;
  pasto.righe.forEach(r => {
    const n = nutritiRow(r);
    if (n) { kcal += n.kcal; prot += n.prot; fat += n.fat; carbs += n.carbs; }
  });
  return { kcal: +kcal.toFixed(1), prot: +prot.toFixed(1), fat: +fat.toFixed(1), carbs: +carbs.toFixed(1) };
}

function pianoTotals(piano) {
  let kcal = 0, prot = 0, fat = 0, carbs = 0;
  piano.giorni.forEach(g =>
    g.pasti.forEach(p => {
      const t = pastoTotals(p);
      kcal += t.kcal; prot += t.prot; fat += t.fat; carbs += t.carbs;
    })
  );
  return { kcal: +kcal.toFixed(1), prot: +prot.toFixed(1), fat: +fat.toFixed(1), carbs: +carbs.toFixed(1) };
}

// ─── Food Autocomplete ────────────────────────────────────────────────────────
function FoodSearchCell({ value, alimentoId, onChange, onSelect }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(value);
  const ref = useRef(null);

  useEffect(() => { setQ(value); }, [value]);

  useEffect(() => {
    const handleClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = q.trim()
    ? foods.filter(f => f.name.toLowerCase().includes(q.toLowerCase())).slice(0, 10)
    : foods.slice(0, 10);

  const handleChange = (e) => {
    setQ(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (food) => {
    setQ(food.name);
    onSelect(food);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full">
      <input
        value={q}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        placeholder="Cerca alimento..."
        className="w-full text-xs px-2 py-1 bg-transparent focus:outline-none focus:bg-amber-50 rounded placeholder-gray-400"
      />
      {open && (
        <div className="absolute z-50 top-full left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-400">Nessun alimento trovato</div>
          ) : (
            filtered.map(food => (
              <button
                key={food.id}
                onMouseDown={() => handleSelect(food)}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 text-gray-700"
              >
                {food.name}
                <span className="text-gray-400 ml-1">{food.calories} kcal/100g</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Single Pasto section ─────────────────────────────────────────────────────
function PastoSection({ pasto, onUpdate, onRemove }) {
  const totals = pastoTotals(pasto);

  const updateRiga = (idx, field, val) => {
    const newRighe = pasto.righe.map((r, i) => i === idx ? { ...r, [field]: val } : r);
    onUpdate({ ...pasto, righe: newRighe });
  };

  const selectFood = (idx, food) => {
    const newRighe = pasto.righe.map((r, i) =>
      i === idx ? { ...r, alimentoId: food.id, alimentoNome: food.name } : r
    );
    onUpdate({ ...pasto, righe: newRighe });
  };

  const addRiga = () => onUpdate({ ...pasto, righe: [...pasto.righe, emptyRiga()] });

  const removeRiga = (idx) => {
    if (pasto.righe.length <= 1) return;
    onUpdate({ ...pasto, righe: pasto.righe.filter((_, i) => i !== idx) });
  };

  const toggleCollapse = () => onUpdate({ ...pasto, collapsed: !pasto.collapsed });

  const nd = <span className="text-gray-400">nd</span>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-3 shadow-sm">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${pasto.colore}dd, ${pasto.colore}aa)` }}
      >
        <GripVertical size={16} className="text-white/60 flex-shrink-0 cursor-grab" />
        <span className="text-lg">{pasto.emoji}</span>
        <span className="text-white font-semibold text-sm flex-1">{pasto.nome}</span>
        <button
          onClick={() => {}}
          className="p-1 text-white/70 hover:text-white transition-colors"
          title="Rinomina"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={onRemove}
          className="p-1 text-white/70 hover:text-white transition-colors"
          title="Elimina pasto"
        >
          <X size={14} />
        </button>
        <button
          onClick={toggleCollapse}
          className="p-1 text-white/70 hover:text-white transition-colors"
          title={pasto.collapsed ? 'Espandi' : 'Comprimi'}
        >
          {pasto.collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!pasto.collapsed && (
        <>
          {/* Micronutrients row */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-500 font-medium mr-1">Micronutrienti:</span>
            {MICRONUTRIENTI.map(m => (
              <span key={m} className="text-xs border border-gray-200 rounded-full px-2 py-0.5 text-gray-500 bg-white">
                {m}
              </span>
            ))}
          </div>

          {/* Food table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-xs">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="text-left px-3 py-2 font-medium w-[200px]">Alimento</th>
                  <th className="text-center px-2 py-2 font-medium w-[80px]">Qt (g)</th>
                  <th className="text-center px-2 py-2 font-medium w-[60px]">Kcal</th>
                  <th className="text-center px-2 py-2 font-medium w-[60px]">Prot</th>
                  <th className="text-center px-2 py-2 font-medium w-[60px]">Gr.Sat</th>
                  <th className="text-center px-2 py-2 font-medium w-[60px]">Gr.Tot</th>
                  <th className="text-center px-2 py-2 font-medium w-[60px]">Zucc</th>
                  <th className="text-center px-2 py-2 font-medium w-[60px]">CHO</th>
                  <th className="text-center px-2 py-2 font-medium w-[60px]">Fibra</th>
                  <th className="text-center px-2 py-2 font-medium w-[80px]">Fonte</th>
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {pasto.righe.map((riga, idx) => {
                  const n = nutritiRow(riga);
                  return (
                    <tr key={riga.id} className="border-b border-gray-100 bg-amber-50/30 hover:bg-amber-50">
                      <td className="px-2 py-1.5">
                        <FoodSearchCell
                          value={riga.alimentoNome}
                          alimentoId={riga.alimentoId}
                          onChange={(v) => updateRiga(idx, 'alimentoNome', v)}
                          onSelect={(food) => selectFood(idx, food)}
                        />
                        <div className="text-[10px] text-gray-400 pl-2">es. 1 cucchiaio</div>
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <input
                          type="number"
                          value={riga.quantita}
                          onChange={(e) => updateRiga(idx, 'quantita', e.target.value)}
                          min="0"
                          className="w-16 text-center text-xs px-1 py-0.5 bg-transparent border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-300"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-center text-gray-600">
                        {n ? n.kcal : nd}
                      </td>
                      <td className="px-2 py-1.5 text-center text-gray-600">
                        {n ? n.prot : nd}
                      </td>
                      <td className="px-2 py-1.5 text-center text-gray-400">{nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">
                        {n ? n.fat : nd}
                      </td>
                      <td className="px-2 py-1.5 text-center text-gray-400">{nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">
                        {n ? n.carbs : nd}
                      </td>
                      <td className="px-2 py-1.5 text-center text-gray-400">{nd}</td>
                      <td className="px-2 py-1.5 text-center">
                        <input
                          value={riga.fonte}
                          onChange={(e) => updateRiga(idx, 'fonte', e.target.value)}
                          placeholder="—"
                          className="w-full text-xs text-center px-1 py-0.5 bg-transparent focus:outline-none focus:bg-gray-50 rounded"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <button
                            onClick={() => {}}
                            className="text-gray-300 hover:text-gray-500 transition-colors"
                            title="Copia riga"
                          >
                            <FileText size={12} />
                          </button>
                          <button
                            onClick={() => removeRiga(idx)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                            title="Elimina riga"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Σ Totals row */}
                <tr style={{ background: `${pasto.colore}22` }}>
                  <td className="px-3 py-2 font-bold text-xs uppercase tracking-wide" style={{ color: pasto.colore }}>
                    Σ {pasto.nome.toUpperCase()}
                  </td>
                  <td className="px-2 py-2 text-center text-xs font-medium text-gray-500">—</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.kcal || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.prot || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">0</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.fat || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">0</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.carbs || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">0</td>
                  <td className="px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary + Notes */}
          <div className="px-4 py-2 flex items-center justify-between gap-4 bg-white border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {totals.kcal} kcal · P:{totals.prot}g · C:{totals.carbs}g · G:{totals.fat}g
            </span>
          </div>

          {/* Notes */}
          <div className="px-4 pb-3 bg-white">
            <textarea
              value={pasto.note}
              onChange={(e) => onUpdate({ ...pasto, note: e.target.value })}
              placeholder="📝 Note per questo pasto (orario, preparazione, varianti, avvertenze…)"
              rows={2}
              className="w-full text-xs px-3 py-2 border border-dashed border-amber-200 rounded-lg bg-amber-50/40 focus:outline-none focus:ring-1 focus:ring-amber-300 placeholder-gray-400 resize-none"
            />
          </div>

          {/* + Riga button */}
          <div className="px-4 pb-3 flex justify-end">
            <button
              onClick={addRiga}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors"
              style={{ background: pasto.colore }}
            >
              <Plus size={12} /> Riga
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main PianoAlimentare component ──────────────────────────────────────────
export default function PianoAlimentare() {
  const STORAGE_KEY = 'diet-piano-corrente';

  const [piano, setPiano] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : emptyPiano();
    } catch {
      return emptyPiano();
    }
  });

  const [giornoAttivo, setGiornoAttivo] = useState(0);
  const [saveMsg, setSaveMsg] = useState('');

  // Patient search state
  const [pazienteSearch, setPazienteSearch] = useState(piano.pazienteNome || '');
  const [pazienteOpen, setPazienteOpen] = useState(false);
  const [patients, setPatients] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('diet-patient-accounts') || '[]');
    } catch { return []; }
  });
  const pazienteRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (!pazienteRef.current?.contains(e.target)) setPazienteOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const totals = pianoTotals(piano);

  const savePiano = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(piano));
    setSaveMsg('Salvato!');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const nuovoPiano = () => {
    if (window.confirm('Creare un nuovo piano? I dati non salvati saranno persi.')) {
      const np = emptyPiano();
      setPiano(np);
      setGiornoAttivo(0);
      setPazienteSearch('');
    }
  };

  const addGiorno = () => {
    const newGiorni = [...piano.giorni, createGiorno(piano.giorni.length + 1)];
    setPiano({ ...piano, giorni: newGiorni });
    setGiornoAttivo(newGiorni.length - 1);
  };

  const removeGiorno = (idx) => {
    if (piano.giorni.length <= 1) return;
    const newGiorni = piano.giorni.filter((_, i) => i !== idx);
    setPiano({ ...piano, giorni: newGiorni });
    setGiornoAttivo(Math.min(giornoAttivo, newGiorni.length - 1));
  };

  const updatePasto = useCallback((gIdx, pIdx, updatedPasto) => {
    setPiano(prev => {
      const giorni = prev.giorni.map((g, gi) =>
        gi !== gIdx ? g : {
          ...g,
          pasti: g.pasti.map((p, pi) => pi !== pIdx ? p : updatedPasto),
        }
      );
      return { ...prev, giorni };
    });
  }, []);

  const removePasto = useCallback((gIdx, pIdx) => {
    setPiano(prev => {
      const giorni = prev.giorni.map((g, gi) =>
        gi !== gIdx ? g : { ...g, pasti: g.pasti.filter((_, pi) => pi !== pIdx) }
      );
      return { ...prev, giorni };
    });
  }, []);

  const addPasto = (gIdx) => {
    const g = piano.giorni[gIdx];
    const existingTypes = new Set(g.pasti.map(p => p.tipoId));
    const next = PASTI_TEMPLATE.find(t => !existingTypes.has(t.tipoId))
      || { tipoId: uid(), nome: 'Pasto', colore: '#10b981', emoji: '🍴' };
    const nuovoPasto = createPasto(next);
    const giorni = piano.giorni.map((gg, gi) =>
      gi !== gIdx ? gg : { ...gg, pasti: [...gg.pasti, nuovoPasto] }
    );
    setPiano({ ...piano, giorni });
  };

  const selectPaziente = (account) => {
    const profile = (() => {
      try { return JSON.parse(localStorage.getItem(`diet-patient-${account.id}-profile`) || 'null'); } catch { return null; }
    })();
    const nome = profile
      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || account.username
      : account.username;
    setPazienteSearch(nome);
    setPiano(prev => ({ ...prev, pazienteId: account.id, pazienteNome: nome }));
    setPazienteOpen(false);
  };

  const filteredPatients = pazienteSearch
    ? patients.filter(p => p.username.toLowerCase().includes(pazienteSearch.toLowerCase()))
    : patients;

  const giornoCorrente = piano.giorni[giornoAttivo] || piano.giorni[0];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <ClipboardList size={18} className="text-teal-600" />
        <h1 className="font-bold text-gray-800 text-base flex-1">Piano Alimentare</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={nuovoPiano}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Undo size={13} /> Annulla
          </button>
          <button
            onClick={() => addPasto(giornoAttivo)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            + Pasto
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={13} /> Excel
          </button>
          <button
            onClick={savePiano}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Save size={13} /> {saveMsg || 'Salva'}
          </button>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors"
            title="Stampa"
          >
            <Printer size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Teal header card */}
        <div className="rounded-xl mb-4 p-5" style={{ background: 'linear-gradient(135deg, #0f766e, #0d9488)' }}>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <ClipboardList size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Piano Alimentare</h2>
              <p className="text-teal-100 text-sm">Gestisci e salva i piani nutrizionali personalizzati per ogni paziente.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Cerca paziente */}
            <div>
              <label className="block text-xs font-semibold text-teal-100 mb-1 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-300 rounded-full inline-block"></span>
                Cartella Paziente
              </label>
              <div ref={pazienteRef} className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  value={pazienteSearch}
                  onChange={(e) => { setPazienteSearch(e.target.value); setPazienteOpen(true); }}
                  onFocus={() => setPazienteOpen(true)}
                  placeholder="Cerca paziente..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                {pazienteOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredPatients.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-gray-400">Nessun paziente trovato</div>
                    ) : (
                      filteredPatients.map(p => {
                        const profile = (() => {
                          try { return JSON.parse(localStorage.getItem(`diet-patient-${p.id}-profile`) || 'null'); } catch { return null; }
                        })();
                        const nome = profile
                          ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || p.username
                          : p.username;
                        return (
                          <button
                            key={p.id}
                            onMouseDown={() => selectPaziente(p)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 text-gray-700"
                          >
                            {nome} <span className="text-gray-400">({p.username})</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Data piano */}
            <div>
              <label className="block text-xs font-semibold text-teal-100 mb-1 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-300 rounded-full inline-block"></span>
                Data piano
              </label>
              <input
                type="date"
                value={piano.dataPiano}
                onChange={(e) => setPiano(prev => ({ ...prev, dataPiano: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>

            {/* Nome piano + Nuovo */}
            <div>
              <label className="block text-xs font-semibold text-teal-100 mb-1 flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-300 rounded-full inline-block"></span>
                Nome piano
              </label>
              <div className="flex gap-2">
                <input
                  value={piano.nomePiano}
                  onChange={(e) => setPiano(prev => ({ ...prev, nomePiano: e.target.value }))}
                  placeholder="es. Piano gennaio..."
                  className="flex-1 px-3 py-2 text-sm bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <button
                  onClick={nuovoPiano}
                  className="px-3 py-2 text-sm font-semibold text-white bg-teal-500 hover:bg-teal-400 rounded-lg transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  <Plus size={14} /> Nuovo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition totals bar */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 mb-4 flex flex-wrap items-center gap-3 shadow-sm">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
            📊 TOTALE
          </span>
          <span className="flex items-center gap-1 bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
            🔥 {totals.kcal} <span className="font-normal">kcal</span>
          </span>
          <span className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-semibold">
            {totals.prot} <span className="font-normal">g prot</span>
          </span>
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
            {totals.carbs} <span className="font-normal">g CHO</span>
          </span>
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-xs font-semibold">
            {totals.fat} <span className="font-normal">g grassi</span>
          </span>
          <span className="flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-semibold">
            0 <span className="font-normal">g fibra</span>
          </span>
        </div>

        {/* Day tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {piano.giorni.map((g, idx) => (
            <div key={g.id} className="flex items-center">
              <button
                onClick={() => setGiornoAttivo(idx)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  idx === giornoAttivo
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600'
                }`}
              >
                {g.nome}
              </button>
              {piano.giorni.length > 1 && (
                <button
                  onClick={() => removeGiorno(idx)}
                  className="ml-1 p-0.5 text-gray-300 hover:text-red-400 transition-colors"
                  title="Rimuovi giorno"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addGiorno}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-dashed border-teal-400 text-teal-600 hover:bg-teal-50 transition-all"
          >
            + Giorno
          </button>
        </div>

        {/* Meal sections */}
        {giornoCorrente && giornoCorrente.pasti.map((pasto, pIdx) => (
          <PastoSection
            key={pasto.id}
            pasto={pasto}
            onUpdate={(updated) => updatePasto(giornoAttivo, pIdx, updated)}
            onRemove={() => removePasto(giornoAttivo, pIdx)}
          />
        ))}

        {giornoCorrente && giornoCorrente.pasti.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">Nessun pasto in questo giorno.</p>
            <button
              onClick={() => addPasto(giornoAttivo)}
              className="mt-3 px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              + Aggiungi Pasto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
