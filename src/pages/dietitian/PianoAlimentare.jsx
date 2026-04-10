import { useState, useRef, useEffect, useCallback } from 'react';
import { foods } from '../../data/foods';
import {
  Save, Plus, X, ChevronUp, ChevronDown, GripVertical,
  Edit2, FileText, Printer, Undo, Search, FileSpreadsheet,
  ClipboardList, RefreshCw, ArrowLeftRight,
} from 'lucide-react';

// ─── Meal templates ──────────────────────────────────────────────────────────
const PASTI_TEMPLATE = [
  { tipoId: 'colazione',        nome: 'Colazione',       emoji: '🌅' },
  { tipoId: 'spuntino-mattina', nome: 'Spuntino Mattina',emoji: '🍎' },
  { tipoId: 'pranzo',           nome: 'Pranzo',          emoji: '🍽️' },
  { tipoId: 'merenda',          nome: 'Merenda',         emoji: '🍊' },
  { tipoId: 'cena',             nome: 'Cena',            emoji: '🌙' },
  { tipoId: 'spuntino-sera',    nome: 'Spuntino Sera',   emoji: '🍵' },
];

const EMOJI_PICKS = ['🌅', '🍎', '🍽️', '🍊', '🌙', '🌛', '🥗', '☕'];

function uid() { return Math.random().toString(36).slice(2, 9); }

function emptyRiga() {
  // Default quantity of 8g matches the website UI convention (e.g. 1 spoonful)
  return { id: uid(), alimentoId: null, alimentoNome: '', quantita: 8, misura: '', fonte: '' };
}

function getMealColor(nome) {
  const n = (nome || '').toLowerCase();
  if (n.includes('colaz')) return 'linear-gradient(135deg,#92400E,#D97706)';
  if (n.includes('spunt') || n.includes('merend')) return 'linear-gradient(135deg,#065F46,#059669)';
  if (n.includes('pranzo')) return 'linear-gradient(135deg,#1E3A8A,#2563EB)';
  if (n.includes('cena')) return 'linear-gradient(135deg,#4C1D95,#7C3AED)';
  if (n.includes('pre-') || n.includes('pre ')) return 'linear-gradient(135deg,#9D174D,#DB2777)';
  if (n.includes('post') || n.includes('recup')) return 'linear-gradient(135deg,#065F46,#0F766E)';
  return 'linear-gradient(135deg,#1E293B,#334155)';
}

function createPasto(template) {
  return {
    id: uid(),
    tipoId: template.tipoId,
    nome: template.nome,
    colore: '#10b981',
    emoji: template.emoji || '🍽️',
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
    kcal:   +(food.calories * m).toFixed(1),
    prot:   +(food.protein  * m).toFixed(1),
    fat:    +(food.fat      * m).toFixed(1),
    fatSat: +((food.fatSat || 0) * m).toFixed(1),
    carbs:  +(food.carbs    * m).toFixed(1),
    sugar:  +((food.sugar  || 0) * m).toFixed(1),
    fiber:  +((food.fiber  || 0) * m).toFixed(1),
  };
}

function pastoTotals(pasto) {
  let kcal=0, prot=0, fat=0, fatSat=0, carbs=0, sugar=0, fiber=0;
  pasto.righe.forEach(r => {
    const n = nutritiRow(r);
    if (n) { kcal+=n.kcal; prot+=n.prot; fat+=n.fat; fatSat+=n.fatSat; carbs+=n.carbs; sugar+=n.sugar; fiber+=n.fiber; }
  });
  return {
    kcal:+kcal.toFixed(1), prot:+prot.toFixed(1), fat:+fat.toFixed(1),
    fatSat:+fatSat.toFixed(1), carbs:+carbs.toFixed(1), sugar:+sugar.toFixed(1), fiber:+fiber.toFixed(1),
  };
}

function pianoTotals(piano) {
  let kcal=0, prot=0, fat=0, carbs=0, fiber=0;
  piano.giorni.forEach(g => g.pasti.forEach(p => {
    const t = pastoTotals(p);
    kcal+=t.kcal; prot+=t.prot; fat+=t.fat; carbs+=t.carbs; fiber+=t.fiber;
  }));
  return {
    kcal:+kcal.toFixed(1), prot:+prot.toFixed(1),
    fat:+fat.toFixed(1), carbs:+carbs.toFixed(1), fiber:+fiber.toFixed(1),
  };
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, footer, maxWidth = 'max-w-sm' }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">{footer}</div>}
      </div>
    </div>
  );
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
function PastoSection({ pasto, onUpdate, onRemove, onOpenRename, onOpenAlt }) {
  const totals = pastoTotals(pasto);
  const headerGradient = getMealColor(pasto.nome);

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
        style={{ background: headerGradient }}
      >
        <GripVertical size={16} className="text-white/60 flex-shrink-0 cursor-grab" />
        <span className="text-lg">{pasto.emoji}</span>
        <span className="text-white font-semibold text-sm flex-1">{pasto.nome}</span>
        <button
          onClick={onOpenRename}
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
                  <th className="w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                {pasto.righe.map((riga, idx) => {
                  const n = nutritiRow(riga);
                  const food = riga.alimentoId ? foods.find(f => f.id === riga.alimentoId) : null;
                  return (
                    <tr key={riga.id} className="border-b border-gray-100 bg-amber-50/30 hover:bg-amber-50">
                      <td className="px-2 py-1.5">
                        <FoodSearchCell
                          value={riga.alimentoNome}
                          alimentoId={riga.alimentoId}
                          onChange={(v) => updateRiga(idx, 'alimentoNome', v)}
                          onSelect={(food) => selectFood(idx, food)}
                        />
                        <div className="text-[10px] text-gray-400 pl-2">
                          <input
                            value={riga.misura || ''}
                            onChange={(e) => updateRiga(idx, 'misura', e.target.value)}
                            placeholder="es. 1 cucchiaio"
                            className="w-full bg-transparent focus:outline-none placeholder-gray-400"
                          />
                        </div>
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
                      <td className="px-2 py-1.5 text-center text-gray-600">{n ? n.kcal : nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">{n ? n.prot : nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">{n ? n.fatSat : nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">{n ? n.fat : nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">{n ? n.sugar : nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">{n ? n.carbs : nd}</td>
                      <td className="px-2 py-1.5 text-center text-gray-600">{n ? n.fiber : nd}</td>
                      <td className="px-2 py-1.5 text-center">
                        <input
                          value={riga.fonte}
                          onChange={(e) => updateRiga(idx, 'fonte', e.target.value)}
                          placeholder="—"
                          className="w-full text-xs text-center px-1 py-0.5 bg-transparent focus:outline-none focus:bg-gray-50 rounded"
                        />
                        {food && (
                          <span className="text-[9px] rounded px-1 bg-gray-100 text-gray-500 ml-1">
                            {food.src || 'custom'}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <button
                            onClick={() => onOpenAlt && onOpenAlt(idx)}
                            className="text-gray-300 hover:text-teal-500 transition-colors"
                            title="Alternative equivalenti"
                          >
                            <ArrowLeftRight size={12} />
                          </button>
                          <button
                            onClick={() => {
                              const copy = { ...riga, id: uid() };
                              const newRighe = [...pasto.righe];
                              newRighe.splice(idx + 1, 0, copy);
                              onUpdate({ ...pasto, righe: newRighe });
                            }}
                            className="text-gray-300 hover:text-gray-500 transition-colors"
                            title="Duplica riga"
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
                <tr className="bg-gray-50">
                  <td className="px-3 py-2 font-bold text-xs uppercase tracking-wide text-gray-700">
                    Σ {pasto.nome.toUpperCase()}
                  </td>
                  <td className="px-2 py-2 text-center text-xs font-medium text-gray-500">—</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.kcal || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.prot || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.fatSat || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.fat || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.sugar || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.carbs || 0}</td>
                  <td className="px-2 py-2 text-center text-xs font-bold text-gray-700">{totals.fiber || 0}</td>
                  <td className="px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary + Notes */}
          <div className="px-4 py-2 flex items-center justify-between gap-4 bg-white border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {totals.kcal} kcal · P:{totals.prot}g · C:{totals.carbs}g · G:{totals.fat}g · F:{totals.fiber}g
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
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700"
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
  const [canUndo, setCanUndo] = useState(false);
  const undoStack = useRef([]);

  // Toast
  const [toast, setToast] = useState({ msg: '', type: 'ok', visible: false });

  // Modals
  const [modalNewPasto, setModalNewPasto] = useState({ open: false, nome: '', emoji: '🍽️', afterIdx: -1 });
  const [modalRenamePasto, setModalRenamePasto] = useState({ open: false, gIdx: 0, pIdx: 0, nome: '', emoji: '' });
  const [modalNewGiorno, setModalNewGiorno] = useState({ open: false, nome: '', copiaFrom: '' });
  const [modalRenameGiorno, setModalRenameGiorno] = useState({ open: false, idx: 0, nome: '' });
  const [modalAlt, setModalAlt] = useState({ open: false, gIdx: 0, pIdx: 0, rIdx: 0 });
  const [altSearch, setAltSearch] = useState('');

  // Patient search state
  const [pazienteSearch, setPazienteSearch] = useState(piano.pazienteNome || '');
  const [pazienteOpen, setPazienteOpen] = useState(false);
  const [patients] = useState(() => {
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

  // ─── Undo helpers ───────────────────────────────────────────────────────────
  const pushUndo = () => {
    undoStack.current.push({ piano: JSON.parse(JSON.stringify(piano)), giornoAttivo });
    if (undoStack.current.length > 20) undoStack.current.shift();
    setCanUndo(true);
  };

  const doUndo = () => {
    if (!undoStack.current.length) return;
    const state = undoStack.current.pop();
    setPiano(state.piano);
    setGiornoAttivo(state.giornoAttivo);
    setCanUndo(undoStack.current.length > 0);
    showToast('↩ Azione annullata', 'info');
  };

  const toastTimer = useRef(null);

  const showToast = (msg, type = 'ok') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // ─── Save ──────────────────────────────────────────────────────────────────
  const savePiano = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(piano));
    showToast('💾 Piano salvato!', 'ok');
  };

  const nuovoPiano = () => {
    if (window.confirm('Creare un nuovo piano? I dati non salvati saranno persi.')) {
      const np = emptyPiano();
      setPiano(np);
      setGiornoAttivo(0);
      setPazienteSearch('');
    }
  };

  // ─── New pasto modal ───────────────────────────────────────────────────────
  const createNewPasto = () => {
    if (!modalNewPasto.nome.trim()) { showToast('Inserisci nome', 'err'); return; }
    pushUndo();
    const newP = {
      id: uid(),
      tipoId: uid(),
      nome: modalNewPasto.nome.trim(),
      colore: '#10b981',
      emoji: modalNewPasto.emoji || '🍽️',
      righe: [emptyRiga()],
      note: '',
      collapsed: false,
    };
    const afterIdx = modalNewPasto.afterIdx;
    const giorni = piano.giorni.map((g, gi) => {
      if (gi !== giornoAttivo) return g;
      const newPasti = [...g.pasti];
      if (afterIdx < 0) newPasti.unshift(newP);
      else newPasti.splice(afterIdx + 1, 0, newP);
      return { ...g, pasti: newPasti };
    });
    setPiano({ ...piano, giorni });
    setModalNewPasto({ open: false, nome: '', emoji: '🍽️', afterIdx: -1 });
    showToast(`✅ "${newP.nome}" aggiunto!`, 'ok');
  };

  // ─── Rename pasto ──────────────────────────────────────────────────────────
  const doRenamePasto = () => {
    if (!modalRenamePasto.nome.trim()) { showToast('Inserisci nome', 'err'); return; }
    pushUndo();
    const { gIdx, pIdx, nome, emoji } = modalRenamePasto;
    const giorni = piano.giorni.map((g, gi) =>
      gi !== gIdx ? g : {
        ...g,
        pasti: g.pasti.map((p, pi) =>
          pi !== pIdx ? p : { ...p, nome: nome.trim(), emoji: emoji || p.emoji }
        ),
      }
    );
    setPiano({ ...piano, giorni });
    setModalRenamePasto({ open: false, gIdx: 0, pIdx: 0, nome: '', emoji: '' });
    showToast('✏️ Pasto rinominato', 'ok');
  };

  // ─── New giorno ────────────────────────────────────────────────────────────
  const createNewGiorno = () => {
    if (!modalNewGiorno.nome.trim()) { showToast('Inserisci nome', 'err'); return; }
    pushUndo();
    let newG;
    if (modalNewGiorno.copiaFrom === '') {
      newG = { id: uid(), nome: modalNewGiorno.nome.trim(), pasti: PASTI_TEMPLATE.map(createPasto) };
    } else {
      const srcIdx = parseInt(modalNewGiorno.copiaFrom);
      const src = piano.giorni[srcIdx];
      newG = {
        id: uid(),
        nome: modalNewGiorno.nome.trim(),
        pasti: JSON.parse(JSON.stringify(src.pasti)).map(p => ({
          ...p, id: uid(), righe: p.righe.map(r => ({ ...r, id: uid() })),
        })),
      };
    }
    const newGiorni = [...piano.giorni, newG];
    setPiano({ ...piano, giorni: newGiorni });
    setGiornoAttivo(newGiorni.length - 1);
    setModalNewGiorno({ open: false, nome: '', copiaFrom: '' });
    showToast('📅 Giorno creato!', 'ok');
  };

  // ─── Rename giorno ─────────────────────────────────────────────────────────
  const doRenameGiorno = () => {
    if (!modalRenameGiorno.nome.trim()) { showToast('Inserisci nome', 'err'); return; }
    pushUndo();
    const giorni = piano.giorni.map((g, i) =>
      i !== modalRenameGiorno.idx ? g : { ...g, nome: modalRenameGiorno.nome.trim() }
    );
    setPiano({ ...piano, giorni });
    setModalRenameGiorno({ open: false, idx: 0, nome: '' });
    showToast('✏️ Giorno rinominato', 'ok');
  };

  // ─── Remove giorno ─────────────────────────────────────────────────────────
  const removeGiorno = (idx) => {
    if (piano.giorni.length <= 1) return;
    pushUndo();
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

  // ─── Alt modal current riga ────────────────────────────────────────────────
  const altCurrentRiga = modalAlt.open
    ? (piano.giorni[modalAlt.gIdx]?.pasti[modalAlt.pIdx]?.righe[modalAlt.rIdx] || null)
    : null;
  const altCurrentFood = altCurrentRiga?.alimentoId
    ? foods.find(f => f.id === altCurrentRiga.alimentoId)
    : null;

  const altFoods = (() => {
    if (!altCurrentFood || !altCurrentRiga) return [];
    const qty = Number(altCurrentRiga.quantita) || 100;
    const targetKcal = (altCurrentFood.calories * qty) / 100;
    return foods
      .filter(f => {
        if (f.id === altCurrentFood.id) return false;
        const fKcal = (f.calories * qty) / 100;
        return Math.abs(fKcal - targetKcal) / (targetKcal || 1) <= 0.1;
      })
      .filter(f => !altSearch || f.name.toLowerCase().includes(altSearch.toLowerCase()))
      .slice(0, 20);
  })();

  const applyAlt = (food) => {
    const { gIdx, pIdx, rIdx } = modalAlt;
    pushUndo();
    const giorni = piano.giorni.map((g, gi) =>
      gi !== gIdx ? g : {
        ...g,
        pasti: g.pasti.map((p, pi) =>
          pi !== pIdx ? p : {
            ...p,
            righe: p.righe.map((r, ri) =>
              ri !== rIdx ? r : { ...r, alimentoId: food.id, alimentoNome: food.name }
            ),
          }
        ),
      }
    );
    setPiano({ ...piano, giorni });
    setModalAlt({ open: false, gIdx: 0, pIdx: 0, rIdx: 0 });
    showToast(`🔄 Sostituito con ${food.name}`, 'ok');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <ClipboardList size={18} className="text-teal-600" />
        <h1 className="font-bold text-gray-800 text-base flex-1">Piano Alimentare</h1>

        <div className="flex items-center gap-1.5">
          <button
            onClick={doUndo}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg transition-colors ${
              canUndo ? 'text-gray-600 hover:bg-gray-50' : 'text-gray-300 opacity-50 cursor-not-allowed'
            }`}
          >
            <Undo size={13} /> Annulla
          </button>
          <button
            onClick={() => setModalNewPasto({ open: true, nome: '', emoji: '🍽️', afterIdx: giornoCorrente ? giornoCorrente.pasti.length - 1 : -1 })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            🍽️ Pasto
          </button>
          <button
            onClick={() => showToast('Funzione in sviluppo', 'info')} // TODO: implement Excel export
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet size={13} /> Excel
          </button>
          <button
            onClick={savePiano}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Save size={13} /> Salva
          </button>
          <span className="text-gray-300 mx-1">|</span>
          <button
            onClick={() => { document.body.removeAttribute('data-print-mode'); window.print(); }}
            className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors"
            title="Stampa PDF con calcoli nutrizionali"
          >
            🖨️
          </button>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors"
            title="Stampa piano senza calcoli"
            onClick={() => { document.body.setAttribute('data-print-mode', 'simple'); window.print(); document.body.removeAttribute('data-print-mode'); }}
          >
            📄
          </button>
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg transition-colors"
            title="Stampa compatta con kcal"
            onClick={() => { document.body.setAttribute('data-print-mode', 'compact'); window.print(); document.body.removeAttribute('data-print-mode'); }}
          >
            📋
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Teal header card */}
        <div className="rounded-xl mb-4 p-5" style={{ background: 'linear-gradient(135deg,#0F766E,#0C5F58)' }}>
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>📋</span>
            <div>
              <h2 className="text-white font-bold text-lg">Piano Alimentare</h2>
              <p className="text-teal-100 text-sm">Gestisci e salva i piani nutrizionali personalizzati per ogni paziente.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Cerca paziente */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-teal-100 mb-1">📁 Cartella Paziente</label>
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
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-semibold text-teal-100 mb-1">📅 Data piano</label>
              <input
                type="date"
                value={piano.dataPiano}
                onChange={(e) => setPiano(prev => ({ ...prev, dataPiano: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>

            {/* Nome piano + Nuovo */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-teal-100 mb-1">📋 Nome piano</label>
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
                  <RefreshCw size={14} /> Nuovo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Macro totals bar */}
        <div className="bg-white rounded-xl border border-green-100 px-5 py-3 mb-4 flex flex-wrap items-center gap-3 shadow-sm">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">📅 TOTALE</span>
          <span className="flex items-center gap-1 bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-xs font-semibold">
            🔥 {totals.kcal} <span className="font-normal">kcal</span>
          </span>
          <span className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-semibold">
            💪 {totals.prot} <span className="font-normal">g prot</span>
          </span>
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold">
            🍞 {totals.carbs} <span className="font-normal">g CHO</span>
          </span>
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-xs font-semibold">
            🧈 {totals.fat} <span className="font-normal">g grassi</span>
          </span>
          <span className="flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-semibold">
            🌿 {totals.fiber} <span className="font-normal">g fibra</span>
          </span>
        </div>

        {/* Day tabs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {piano.giorni.map((g, idx) => (
            <div key={g.id} className="flex items-center">
              <button
                onClick={() => setGiornoAttivo(idx)}
                onDoubleClick={() => setModalRenameGiorno({ open: true, idx, nome: g.nome })}
                onKeyDown={(e) => { if (e.key === 'F2' || (e.key === 'Enter' && idx === giornoAttivo)) setModalRenameGiorno({ open: true, idx, nome: g.nome }); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  idx === giornoAttivo
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-600'
                }`}
                title="Doppio click o F2 per rinominare"
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
            onClick={() => setModalNewGiorno({ open: true, nome: '', copiaFrom: '' })}
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
            onRemove={() => { pushUndo(); removePasto(giornoAttivo, pIdx); }}
            onOpenRename={() => setModalRenamePasto({ open: true, gIdx: giornoAttivo, pIdx, nome: pasto.nome, emoji: pasto.emoji })}
            onOpenAlt={(rIdx) => { setAltSearch(''); setModalAlt({ open: true, gIdx: giornoAttivo, pIdx, rIdx }); }}
          />
        ))}

        {/* Aggiungi pasto dashed area */}
        {giornoCorrente && (
          <div
            onClick={() => setModalNewPasto({ open: true, nome: '', emoji: '🍽️', afterIdx: giornoCorrente.pasti.length - 1 })}
            className="mt-1 border-2 border-dashed border-teal-400 bg-gradient-to-br from-teal-50 to-emerald-50 text-teal-700 font-semibold flex items-center justify-center gap-2 text-sm py-4 rounded-xl cursor-pointer hover:bg-teal-100 transition-all"
          >
            <span className="text-xl">＋</span><span>Aggiungi pasto</span>
          </div>
        )}
      </div>

      {/* ─── Modals ──────────────────────────────────────────────────────────── */}

      {/* Nuovo Pasto */}
      <Modal
        open={modalNewPasto.open}
        onClose={() => setModalNewPasto(s => ({ ...s, open: false }))}
        title="🍽️ Nuovo Pasto"
        footer={
          <>
            <button onClick={() => setModalNewPasto(s => ({ ...s, open: false }))} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Annulla</button>
            <button onClick={createNewPasto} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Crea Pasto</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nome pasto</label>
            <input
              autoFocus
              value={modalNewPasto.nome}
              onChange={(e) => setModalNewPasto(s => ({ ...s, nome: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && createNewPasto()}
              placeholder="es. Pre-workout"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Emoji</label>
            <div className="flex gap-2 items-center">
              <input
                value={modalNewPasto.emoji}
                onChange={(e) => setModalNewPasto(s => ({ ...s, emoji: e.target.value }))}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                style={{ width: 70 }}
              />
              <div className="flex gap-1 flex-wrap">
                {EMOJI_PICKS.map(em => (
                  <button key={em} onClick={() => setModalNewPasto(s => ({ ...s, emoji: em }))}
                    className="text-lg hover:scale-125 transition-transform">{em}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Inserisci dopo</label>
            <select
              value={modalNewPasto.afterIdx}
              onChange={(e) => setModalNewPasto(s => ({ ...s, afterIdx: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              <option value={-1}>— In cima —</option>
              {giornoCorrente && giornoCorrente.pasti.map((p, i) => (
                <option key={p.id} value={i}>Dopo {p.emoji} {p.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Rinomina Pasto */}
      <Modal
        open={modalRenamePasto.open}
        onClose={() => setModalRenamePasto(s => ({ ...s, open: false }))}
        title="✏️ Rinomina Pasto"
        maxWidth="max-w-xs"
        footer={
          <>
            <button onClick={() => setModalRenamePasto(s => ({ ...s, open: false }))} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Annulla</button>
            <button onClick={doRenamePasto} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Rinomina</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
            <input
              autoFocus
              value={modalRenamePasto.nome}
              onChange={(e) => setModalRenamePasto(s => ({ ...s, nome: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && doRenamePasto()}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Emoji</label>
            <input
              value={modalRenamePasto.emoji}
              onChange={(e) => setModalRenamePasto(s => ({ ...s, emoji: e.target.value }))}
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              style={{ width: 70 }}
            />
          </div>
        </div>
      </Modal>

      {/* Nuovo Giorno */}
      <Modal
        open={modalNewGiorno.open}
        onClose={() => setModalNewGiorno(s => ({ ...s, open: false }))}
        title="📅 Nuovo Giorno"
        footer={
          <>
            <button onClick={() => setModalNewGiorno(s => ({ ...s, open: false }))} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Annulla</button>
            <button onClick={createNewGiorno} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Crea Giorno</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nome giorno</label>
            <input
              autoFocus
              value={modalNewGiorno.nome}
              onChange={(e) => setModalNewGiorno(s => ({ ...s, nome: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && createNewGiorno()}
              placeholder="es. Giorno 2"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Copia da</label>
            <select
              value={modalNewGiorno.copiaFrom}
              onChange={(e) => setModalNewGiorno(s => ({ ...s, copiaFrom: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              <option value="">— Inizia vuoto —</option>
              {piano.giorni.map((g, i) => (
                <option key={g.id} value={i}>{g.nome}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-400">💡 Puoi anche usare "Diete per Patologia".</p>
        </div>
      </Modal>

      {/* Rinomina Giorno */}
      <Modal
        open={modalRenameGiorno.open}
        onClose={() => setModalRenameGiorno(s => ({ ...s, open: false }))}
        title="✏️ Rinomina Giorno"
        maxWidth="max-w-xs"
        footer={
          <>
            <button onClick={() => setModalRenameGiorno(s => ({ ...s, open: false }))} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Annulla</button>
            <button onClick={doRenameGiorno} className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700">Rinomina</button>
          </>
        }
      >
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
          <input
            autoFocus
            value={modalRenameGiorno.nome}
            onChange={(e) => setModalRenameGiorno(s => ({ ...s, nome: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && doRenameGiorno()}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>
      </Modal>

      {/* Alternative Equivalenti */}
      <Modal
        open={modalAlt.open}
        onClose={() => setModalAlt(s => ({ ...s, open: false }))}
        title="⇄ Alternative Equivalenti"
        maxWidth="max-w-lg"
        footer={
          <button onClick={() => setModalAlt(s => ({ ...s, open: false }))} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Chiudi</button>
        }
      >
        {altCurrentFood && altCurrentRiga ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Alternative a <strong>{altCurrentFood.name}</strong> ({altCurrentRiga.quantita}g)
            </p>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                value={altSearch}
                onChange={(e) => setAltSearch(e.target.value)}
                placeholder="Cerca alternativa..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            {altFoods.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Nessuna alternativa trovata</p>
            ) : (
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {altFoods.map(food => {
                  const qty = Number(altCurrentRiga.quantita) || 100;
                  const kcal = +((food.calories * qty) / 100).toFixed(1);
                  return (
                    <div key={food.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-100">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{food.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{kcal} kcal · {food.category}</span>
                      </div>
                      <button
                        onClick={() => applyAlt(food)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700"
                      >
                        Sostituisci
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">Seleziona un alimento per vedere le alternative</p>
        )}
      </Modal>

      {/* Toast */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${
          toast.type === 'ok' ? 'bg-emerald-600' : toast.type === 'err' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
