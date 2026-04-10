import { useState } from 'react';
import { ChefHat, Plus, Trash2, Search } from 'lucide-react';
import { foods } from '../../data/foods';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const CATEGORIES = ['Tutti', 'Primi piatti', 'Secondi', 'Contorni', 'Colazione', 'Snack', 'Dolci', 'Zuppe', 'Smoothie'];

function emptyIngredient() {
  return { id: Date.now() + Math.random(), foodId: null, foodName: '', quantity: 100 };
}

function emptyRecipe() {
  return {
    id: Date.now(),
    name: '',
    category: 'Primi piatti',
    servings: 2,
    prepTime: '',
    ingredients: [emptyIngredient()],
    instructions: '',
  };
}

const DEMO_RECIPES = [
  { id: 1, name: 'Pasta al pomodoro', category: 'Primi piatti', servings: 2, prepTime: '15 min', ingredients: [{ id: 1, foodId: 11, foodName: 'Pasta (secca)', quantity: 160 }, { id: 2, foodId: null, foodName: 'Passata di pomodoro', quantity: 200 }, { id: 3, foodId: null, foodName: 'Olio EVO', quantity: 10 }], instructions: 'Cuocere la pasta in acqua salata. Scaldare la passata con olio. Condire.' },
  { id: 2, name: 'Insalata di ceci', category: 'Secondi', servings: 1, prepTime: '10 min', ingredients: [{ id: 4, foodId: 45, foodName: 'Ceci', quantity: 150 }, { id: 5, foodId: null, foodName: 'Pomodorini', quantity: 100 }, { id: 6, foodId: null, foodName: 'Cetriolo', quantity: 80 }], instructions: 'Scolare i ceci, tagliare le verdure, condire con olio e limone.' },
  { id: 3, name: 'Petto di pollo al forno', category: 'Secondi', servings: 2, prepTime: '30 min', ingredients: [{ id: 7, foodId: 1, foodName: 'Petto di Pollo', quantity: 300 }, { id: 8, foodId: null, foodName: 'Rosmarino, limone, aglio', quantity: 10 }], instructions: 'Marinare il pollo con aromi. Cuocere in forno a 180°C per 25 min.' },
];

function calcNutrition(ingredients, servings) {
  let kcal = 0, prot = 0, fat = 0, carbs = 0, fiber = 0;
  ingredients.forEach(ing => {
    if (!ing.foodId) return;
    const food = foods.find(f => f.id === ing.foodId);
    if (!food) return;
    const m = ing.quantity / 100;
    kcal += food.calories * m;
    prot += food.protein * m;
    fat += food.fat * m;
    carbs += food.carbs * m;
    fiber += (food.fiber || 0) * m;
  });
  const s = servings || 1;
  return {
    kcal: Math.round(kcal / s),
    prot: (prot / s).toFixed(1),
    fat: (fat / s).toFixed(1),
    carbs: (carbs / s).toFixed(1),
    fiber: (fiber / s).toFixed(1),
  };
}

export default function Ricette() {
  const [recipes, setRecipes] = useState(DEMO_RECIPES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tutti');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = recipes.filter(r =>
    (category === 'Tutti' || r.category === category) &&
    (!search.trim() || r.name.toLowerCase().includes(search.toLowerCase()))
  );

  const startNew = () => { setEditing(emptyRecipe()); setShowForm(true); };
  const startEdit = (r) => { setEditing({ ...r, ingredients: [...r.ingredients.map(i => ({ ...i }))] }); setShowForm(true); };

  const saveRecipe = () => {
    if (!editing?.name) return;
    setRecipes(prev => {
      const idx = prev.findIndex(r => r.id === editing.id);
      if (idx >= 0) return prev.map(r => r.id === editing.id ? editing : r);
      return [...prev, editing];
    });
    setShowForm(false);
    setEditing(null);
  };

  const deleteRecipe = (id) => setRecipes(prev => prev.filter(r => r.id !== id));

  const updateIngredient = (idx, field, val) => {
    setEditing(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === idx ? { ...ing, [field]: val } : ing),
    }));
  };

  const selectFood = (idx, food) => {
    setEditing(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === idx ? { ...ing, foodId: food.id, foodName: food.name } : ing),
    }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <ChefHat size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Ricette</span>
        <button onClick={startNew} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
          <Plus size={12} /> Nuova ricetta
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Ricette</h1>
          <p className="text-teal-100 text-sm mt-0.5">Crea e gestisci ricette con calcolo automatico dei valori nutrizionali</p>
        </div>

        {/* Recipe editor */}
        {showForm && editing && (
          <div className={CARD}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">{editing.id && DEMO_RECIPES.find(r => r.id === editing.id) ? 'Modifica ricetta' : 'Nuova ricetta'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Nome ricetta</label>
                <input value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                  placeholder="es. Pasta al pesto"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Categoria</label>
                <select value={editing.category} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                  {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Porzioni</label>
                <input type="number" min="1" value={editing.servings} onChange={e => setEditing(p => ({ ...p, servings: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Ingredienti</label>
                <button onClick={() => setEditing(p => ({ ...p, ingredients: [...p.ingredients, emptyIngredient()] }))}
                  className="text-xs text-teal-600 hover:text-teal-800">+ Aggiungi</button>
              </div>
              <div className="space-y-2">
                {editing.ingredients.map((ing, idx) => (
                  <div key={ing.id} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        value={ing.foodName}
                        onChange={e => updateIngredient(idx, 'foodName', e.target.value)}
                        list={`food-list-${idx}`}
                        placeholder="Cerca alimento..."
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-teal-300"
                      />
                      <datalist id={`food-list-${idx}`}>
                        {foods.filter(f => f.name.toLowerCase().includes((ing.foodName || '').toLowerCase())).slice(0, 10).map(f => (
                          <option key={f.id} value={f.name} />
                        ))}
                      </datalist>
                    </div>
                    <div className="flex items-center gap-1">
                      <input type="number" min="0" value={ing.quantity}
                        onChange={e => updateIngredient(idx, 'quantity', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-16 text-center focus:outline-none focus:ring-1 focus:ring-teal-300" />
                      <span className="text-xs text-gray-400">g</span>
                    </div>
                    <button onClick={() => setEditing(p => ({ ...p, ingredients: p.ingredients.filter((_, i) => i !== idx) }))}
                      className="text-gray-300 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Procedimento</label>
              <textarea value={editing.instructions} onChange={e => setEditing(p => ({ ...p, instructions: e.target.value }))}
                placeholder="Descrivi i passaggi di preparazione..."
                rows={3}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none" />
            </div>

            <div className="flex gap-2">
              <button onClick={saveRecipe} disabled={!editing.name}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg">
                Salva ricetta
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">
                Annulla
              </button>
            </div>
          </div>
        )}

        {/* Search + filter */}
        <div className={CARD}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cerca ricetta..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${category === cat ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(recipe => {
            const nutri = calcNutrition(recipe.ingredients, recipe.servings);
            return (
              <div key={recipe.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{recipe.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{recipe.category}</span>
                      <span className="text-xs text-gray-400">{recipe.servings} porz.</span>
                      {recipe.prepTime && <span className="text-xs text-gray-400">⏱ {recipe.prepTime}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(recipe)} className="text-xs text-teal-600 hover:text-teal-800 px-2 py-1 border border-teal-200 rounded-lg">Modifica</button>
                    <button onClick={() => deleteRecipe(recipe.id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 border border-red-100 rounded-lg">Elimina</button>
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {[
                    { label: 'Kcal', value: nutri.kcal, color: 'text-orange-600' },
                    { label: 'Prot', value: `${nutri.prot}g`, color: 'text-blue-600' },
                    { label: 'CHO', value: `${nutri.carbs}g`, color: 'text-green-600' },
                    { label: 'Grassi', value: `${nutri.fat}g`, color: 'text-amber-600' },
                  ].map(m => (
                    <div key={m.label} className="bg-gray-50 rounded p-1.5 text-center">
                      <div className="text-[10px] text-gray-400">{m.label}</div>
                      <div className={`text-xs font-bold ${m.color}`}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Ingredients list */}
                <div className="text-xs text-gray-500 mb-2">
                  {recipe.ingredients.map(i => i.foodName).filter(Boolean).join(', ')}
                </div>

                {recipe.instructions && (
                  <p className="text-xs text-gray-600 italic">{recipe.instructions}</p>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-10 text-gray-400">
              <ChefHat size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nessuna ricetta trovata</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
