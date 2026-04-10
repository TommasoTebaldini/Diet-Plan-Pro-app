import { useState, useMemo } from 'react';
import { foods } from '../../data/foods';
import { Plus, X, Search, ChefHat, Trash2, BookOpen, Edit2, Check } from 'lucide-react';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function calcRecipeNutrition(ingredients) {
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  ingredients.forEach(ing => {
    const food = foods.find(f => f.id === ing.foodId);
    if (food) {
      const m = ing.grams / 100;
      calories += food.calories * m;
      protein  += food.protein  * m;
      carbs    += food.carbs    * m;
      fat      += food.fat      * m;
    }
  });
  return { calories, protein, carbs, fat };
}

function NutritionBadge({ label, value, unit = 'g', color }) {
  return (
    <div className={`text-center px-3 py-2 rounded-xl ${color}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold text-sm">{Math.round(value)}{unit}</p>
    </div>
  );
}

// ── Food picker modal ──────────────────────────────────────────────────────────
function FoodPickerModal({ onAdd, onClose }) {
  const [search, setSearch]             = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams]               = useState(100);

  const filtered = useMemo(
    () => foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const handleAdd = () => {
    if (!selectedFood) return;
    onAdd({ foodId: selectedFood.id, foodName: selectedFood.name, grams: Number(grams) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Aggiungi ingrediente</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca alimenti..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filtered.slice(0, 60).map(food => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedFood?.id === food.id
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{food.name}</span>
                <span className="text-xs text-gray-400 ml-2">{food.calories} kcal/100g</span>
              </button>
            ))}
          </div>
          {selectedFood && (
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-sm font-medium text-emerald-700 mb-2">{selectedFood.name}</p>
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-600">Grammi:</label>
                <input
                  type="number"
                  value={grams}
                  onChange={e => setGrams(e.target.value)}
                  min="1"
                  max="2000"
                  className="w-24 px-2 py-1 border border-emerald-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
                <span className="text-xs text-emerald-600 font-medium">
                  = {Math.round(selectedFood.calories * grams / 100)} kcal
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleAdd}
            disabled={!selectedFood}
            className="w-full py-2.5 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Recipe editor (create / edit) ──────────────────────────────────────────────
function RecipeEditor({ recipe, onSave, onCancel }) {
  const [form, setForm] = useState({
    name:         recipe?.name         || '',
    description:  recipe?.description  || '',
    servings:     recipe?.servings      || 1,
    ingredients:  recipe?.ingredients  || [],
  });
  const [showPicker, setShowPicker] = useState(false);

  const nutrition = useMemo(() => calcRecipeNutrition(form.ingredients), [form.ingredients]);
  const perServing = {
    calories: nutrition.calories / (form.servings || 1),
    protein:  nutrition.protein  / (form.servings || 1),
    carbs:    nutrition.carbs    / (form.servings || 1),
    fat:      nutrition.fat      / (form.servings || 1),
  };

  const addIngredient = (ing) => {
    setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, ing] }));
  };

  const removeIngredient = (idx) => {
    setForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = () => {
    if (!form.name.trim() || form.ingredients.length === 0) return;
    onSave({
      id:          recipe?.id || generateId(),
      name:        form.name.trim(),
      description: form.description.trim(),
      servings:    Number(form.servings) || 1,
      ingredients: form.ingredients,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ChefHat size={20} className="text-emerald-500" />
            {recipe ? 'Modifica Ricetta' : 'Nuova Ricetta'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Nome ricetta <span className="text-red-400">*</span></label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="es. Pasta al pomodoro"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Descrizione (opzionale)</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Breve descrizione della ricetta..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Porzioni</label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.servings}
                onChange={e => setForm(p => ({ ...p, servings: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Ingredienti <span className="text-red-400">*</span></label>
              <button
                onClick={() => setShowPicker(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-medium hover:bg-emerald-600 transition-colors"
              >
                <Plus size={14} /> Aggiungi
              </button>
            </div>
            {form.ingredients.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                Nessun ingrediente aggiunto
              </div>
            ) : (
              <div className="space-y-2">
                {form.ingredients.map((ing, i) => {
                  const food = foods.find(f => f.id === ing.foodId);
                  return (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{ing.foodName}</span>
                        <span className="text-xs text-gray-400 ml-2">{ing.grams}g</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-emerald-600 font-medium">
                          {food ? Math.round(food.calories * ing.grams / 100) : 0} kcal
                        </span>
                        <button
                          onClick={() => removeIngredient(i)}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nutrition preview */}
          {form.ingredients.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-emerald-700 mb-3">
                Valori nutrizionali per porzione ({form.servings} {Number(form.servings) === 1 ? 'porzione' : 'porzioni'} totali)
              </p>
              <div className="grid grid-cols-4 gap-2">
                <NutritionBadge label="Calorie" value={perServing.calories} unit=" kcal" color="bg-orange-50" />
                <NutritionBadge label="Proteine" value={perServing.protein} color="bg-blue-50" />
                <NutritionBadge label="Carboidrati" value={perServing.carbs} color="bg-amber-50" />
                <NutritionBadge label="Grassi" value={perServing.fat} color="bg-rose-50" />
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || form.ingredients.length === 0}
            className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} /> Salva Ricetta
          </button>
        </div>
      </div>

      {showPicker && (
        <FoodPickerModal onAdd={addIngredient} onClose={() => setShowPicker(false)} />
      )}
    </div>
  );
}

// ── Recipe card ────────────────────────────────────────────────────────────────
function RecipeCard({ recipe, onEdit, onDelete, onAddToDiary }) {
  const nutrition = useMemo(() => calcRecipeNutrition(recipe.ingredients), [recipe.ingredients]);
  const perServing = {
    calories: nutrition.calories / (recipe.servings || 1),
    protein:  nutrition.protein  / (recipe.servings || 1),
    carbs:    nutrition.carbs    / (recipe.servings || 1),
    fat:      nutrition.fat      / (recipe.servings || 1),
  };
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-sm">{recipe.name}</h3>
            {recipe.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{recipe.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{recipe.servings} porzione{recipe.servings !== 1 ? 'i' : ''}</p>
          </div>
          <div className="flex gap-1 ml-3">
            <button
              onClick={() => onEdit(recipe)}
              className="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(recipe.id)}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Nutrition per serving */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          <div className="text-center bg-orange-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-400">kcal</p>
            <p className="font-bold text-orange-500 text-sm">{Math.round(perServing.calories)}</p>
          </div>
          <div className="text-center bg-blue-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-400">Prot.</p>
            <p className="font-bold text-blue-500 text-sm">{Math.round(perServing.protein)}g</p>
          </div>
          <div className="text-center bg-amber-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-400">Carb.</p>
            <p className="font-bold text-amber-500 text-sm">{Math.round(perServing.carbs)}g</p>
          </div>
          <div className="text-center bg-rose-50 rounded-lg p-1.5">
            <p className="text-xs text-gray-400">Gras.</p>
            <p className="font-bold text-rose-500 text-sm">{Math.round(perServing.fat)}g</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-right mb-3">per porzione</p>

        {/* Toggle ingredients */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1 mb-3"
        >
          <BookOpen size={12} />
          {expanded ? 'Nascondi ingredienti' : `Mostra ${recipe.ingredients.length} ingredienti`}
        </button>

        {expanded && (
          <div className="bg-gray-50 rounded-xl p-3 space-y-1 mb-3">
            {recipe.ingredients.map((ing, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-gray-700">{ing.foodName}</span>
                <span className="text-gray-400">{ing.grams}g</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => onAddToDiary(recipe)}
          className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
        >
          <Plus size={14} /> Aggiungi al Diario
        </button>
      </div>
    </div>
  );
}

// ── Add-to-diary modal ─────────────────────────────────────────────────────────
function AddToDiaryModal({ recipe, patientId, onClose }) {
  const SLOTS      = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const SLOT_LABELS = { breakfast: '🌅 Colazione', lunch: '☀️ Pranzo', dinner: '🌙 Cena', snacks: '🍎 Spuntini' };
  const diaryKey   = `diet-patient-${patientId}-diary`;

  const [date, setDate]   = useState(new Date().toISOString().split('T')[0]);
  const [slot, setSlot]   = useState('lunch');
  const [servings, setServings] = useState(1);
  const [saved, setSaved] = useState(false);

  const nutrition = useMemo(() => {
    const n = calcRecipeNutrition(recipe.ingredients);
    const factor = servings / (recipe.servings || 1);
    return {
      calories: n.calories * factor,
      protein:  n.protein  * factor,
      carbs:    n.carbs    * factor,
      fat:      n.fat      * factor,
    };
  }, [recipe, servings]);

  const handleAdd = () => {
    const diary = JSON.parse(localStorage.getItem(diaryKey) || '{}');
    const day   = diary[date] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    const factor = Number(servings) / (recipe.servings || 1);

    // Add each ingredient scaled to servings
    recipe.ingredients.forEach(ing => {
      const scaledGrams = Math.round(ing.grams * factor);
      day[slot] = [
        ...(day[slot] || []),
        { foodId: ing.foodId, foodName: ing.foodName, grams: scaledGrams, fromRecipe: recipe.name },
      ];
    });

    diary[date] = day;
    localStorage.setItem(diaryKey, JSON.stringify(diary));
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">Aggiungi al Diario</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700 mb-1">{recipe.name}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Data</label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Pasto</label>
            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    slot === s ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {SLOT_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Numero di porzioni</label>
            <input
              type="number"
              min="0.5"
              max="10"
              step="0.5"
              value={servings}
              onChange={e => setServings(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Calorie:</span>
              <span className="font-semibold text-emerald-700">{Math.round(nutrition.calories)} kcal</span>
            </div>
            <div className="flex justify-between text-gray-500 mt-1">
              <span>P: {Math.round(nutrition.protein)}g</span>
              <span>C: {Math.round(nutrition.carbs)}g</span>
              <span>G: {Math.round(nutrition.fat)}g</span>
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={saved}
            className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
              saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {saved ? <><Check size={16} /> Aggiunto!</> : <><Plus size={16} /> Aggiungi</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Recipes page ──────────────────────────────────────────────────────────
export default function PatientRecipes({ patientId }) {
  const storageKey = `diet-patient-${patientId}-recipes`;

  const [recipes, setRecipesState] = useState(() =>
    JSON.parse(localStorage.getItem(storageKey) || '[]')
  );
  const [search, setSearch]           = useState('');
  const [showEditor, setShowEditor]   = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [addToDiaryRecipe, setAddToDiaryRecipe] = useState(null);

  const setRecipes = (updater) => {
    setRecipesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const handleSave = (recipe) => {
    setRecipes(prev => {
      const idx = prev.findIndex(r => r.id === recipe.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = recipe;
        return updated;
      }
      return [...prev, recipe];
    });
    setShowEditor(false);
    setEditingRecipe(null);
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
    setShowEditor(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Eliminare questa ricetta?')) return;
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const filtered = useMemo(
    () => recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
    [recipes, search]
  );

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ChefHat size={24} className="text-emerald-500" /> Le mie Ricette
          </h2>
          <p className="text-gray-500 mt-1">Crea e gestisci le tue ricette personalizzate</p>
        </div>
        <button
          onClick={() => { setEditingRecipe(null); setShowEditor(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
        >
          <Plus size={18} /> Nuova Ricetta
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca nelle tue ricette..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>
      </div>

      {/* Recipe grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddToDiary={setAddToDiaryRecipe}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ChefHat size={48} className="mx-auto mb-4 text-gray-200" />
          {recipes.length === 0 ? (
            <>
              <p className="text-lg font-medium text-gray-500">Nessuna ricetta ancora</p>
              <p className="text-sm text-gray-400 mt-1 mb-6">
                Crea la tua prima ricetta per aggiungere velocemente i tuoi pasti al diario
              </p>
              <button
                onClick={() => { setEditingRecipe(null); setShowEditor(true); }}
                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                Crea la prima ricetta
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-500">Nessun risultato</p>
              <p className="text-sm text-gray-400 mt-1">Prova con un termine diverso</p>
            </>
          )}
        </div>
      )}

      {showEditor && (
        <RecipeEditor
          recipe={editingRecipe}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditingRecipe(null); }}
        />
      )}

      {addToDiaryRecipe && (
        <AddToDiaryModal
          recipe={addToDiaryRecipe}
          patientId={patientId}
          onClose={() => setAddToDiaryRecipe(null)}
        />
      )}
    </div>
  );
}
