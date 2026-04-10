import { useState, useMemo } from 'react';
import { Database, Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { foods } from '../../data/foods';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const COLUMNS = [
  { key: 'name', label: 'Alimento', align: 'left' },
  { key: 'category', label: 'Categoria', align: 'left' },
  { key: 'calories', label: 'Kcal', align: 'center' },
  { key: 'protein', label: 'Prot (g)', align: 'center' },
  { key: 'fat', label: 'Grassi (g)', align: 'center' },
  { key: 'carbs', label: 'CHO (g)', align: 'center' },
  { key: 'fiber', label: 'Fibra (g)', align: 'center' },
];

export default function AlimentiCREA() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tutti');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(null);

  const categories = useMemo(() => ['Tutti', ...Array.from(new Set(foods.map(f => f.category))).sort()], []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let result = foods;
    if (category !== 'Tutti') result = result.filter(f => f.category === category);
    if (search.trim()) result = result.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    return [...result].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [search, category, sortKey, sortDir]);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={10} className="opacity-20" />;
    return sortDir === 'asc' ? <ChevronUp size={10} className="text-teal-400" /> : <ChevronDown size={10} className="text-teal-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Database size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Alimenti CREA+BDA</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Database Alimenti CREA+BDA</h1>
          <p className="text-teal-100 text-sm mt-0.5">Tabelle di composizione degli alimenti — ricerca, filtro e profilo nutrizionale completo</p>
        </div>

        {/* Search + filter */}
        <div className={CARD}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cerca alimento..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="text-xs text-gray-400 mt-2">{filtered.length} alimenti · valori per 100 g</div>
        </div>

        {/* Food detail modal */}
        {selected && (
          <div className={CARD + ' border-teal-300 bg-teal-50'}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-800 text-base">{selected.name}</h2>
                <span className="text-xs text-teal-600 font-medium">{selected.category} · per 100 g · fonte: {selected.src}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {[
                { label: 'Calorie', value: selected.calories, unit: 'kcal', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                { label: 'Proteine', value: selected.protein, unit: 'g', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'Grassi tot.', value: selected.fat, unit: 'g', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                { label: 'Gr. saturi', value: selected.fatSat ?? '—', unit: selected.fatSat != null ? 'g' : '', color: 'bg-red-50 border-red-200 text-red-700' },
                { label: 'CHO', value: selected.carbs, unit: 'g', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Zuccheri', value: selected.sugar ?? '—', unit: selected.sugar != null ? 'g' : '', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                { label: 'Fibra', value: selected.fiber ?? '—', unit: selected.fiber != null ? 'g' : '', color: 'bg-teal-50 border-teal-200 text-teal-700' },
              ].map(n => (
                <div key={n.label} className={`border rounded-lg p-2 text-center ${n.color}`}>
                  <div className="text-xs opacity-70 mb-0.5">{n.label}</div>
                  <div className="font-bold text-sm">{n.value} <span className="text-xs font-normal">{n.unit}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className={CARD}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="bg-gray-800 text-white">
                  {COLUMNS.map(col => (
                    <th key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`px-3 py-2 font-medium cursor-pointer hover:bg-gray-700 select-none ${col.align === 'center' ? 'text-center' : 'text-left'}`}>
                      <span className="flex items-center gap-1 justify-center">
                        {col.align === 'center' && <SortIcon col={col.key} />}
                        {col.label}
                        {col.align === 'left' && <SortIcon col={col.key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((food, i) => (
                  <tr key={food.id}
                    onClick={() => setSelected(selected?.id === food.id ? null : food)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${selected?.id === food.id ? 'bg-teal-50' : i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100'}`}>
                    <td className="px-3 py-1.5 font-medium text-gray-800">{food.name}</td>
                    <td className="px-3 py-1.5 text-gray-500">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{food.category}</span>
                    </td>
                    <td className="px-3 py-1.5 text-center font-semibold text-orange-600">{food.calories}</td>
                    <td className="px-3 py-1.5 text-center text-blue-600">{food.protein}</td>
                    <td className="px-3 py-1.5 text-center text-amber-600">{food.fat}</td>
                    <td className="px-3 py-1.5 text-center text-green-600">{food.carbs}</td>
                    <td className="px-3 py-1.5 text-center text-teal-600">{food.fiber ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">Nessun alimento trovato</div>
          )}
        </div>
      </div>
    </div>
  );
}
