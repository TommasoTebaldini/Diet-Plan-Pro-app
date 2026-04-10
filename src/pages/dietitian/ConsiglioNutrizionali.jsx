import { useState } from 'react';
import { Lightbulb, Printer } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const GOALS = [
  'Perdere peso', 'Aumentare massa muscolare', 'Migliorare performance sportiva',
  'Gestire il diabete', 'Ridurre il colesterolo', 'Migliorare la digestione',
  'Dieta vegetariana/vegana', 'Recupero post-operatorio', 'Gravidanza/allattamento',
];

const RESTRICTIONS = [
  'Nessuna', 'Senza glutine', 'Senza lattosio', 'Vegetariano', 'Vegano',
  'Senza uova', 'Senza pesce/carne', 'Low-FODMAP', 'Iposodica',
];

const PREFERENCES = [
  'Cucina mediterranea', 'Cucina asiatica', 'Cucina veloce (max 20 min)',
  'Piatti economici', 'Meal prep settimanale', 'No cottura (raw food)',
];

const TEMPLATES = {
  'Perdere peso + Nessuna + Cucina mediterranea': {
    title: '🥗 Piano dimagrante mediterraneo',
    tips: [
      'Crea un deficit di 500 kcal/die rispetto al tuo fabbisogno. Non scendere sotto le 1200 kcal (F) o 1500 kcal (M).',
      'Abbondante verdura (almeno 500 g/die) a ogni pasto: occupa volume nello stomaco e sazia con poche calorie.',
      'Proteine ad ogni pasto (carne magra, pesce, legumi, latticini magri): aumentano la sazietà e preservano la massa muscolare.',
      'Cereali integrali: pasta, riso, pane integrali a porzioni moderate (60-80 g crudi).',
      'Grassi buoni: olio EVO 2-3 cucchiai/die; frutta secca (10-15g/die); evita grassi saturi e fritti.',
      'Elimina bevande caloriche: succhi, alcolici, bibite. Bevi 2L di acqua/die.',
      'Fraziona in 4-5 pasti: riduce la fame e stabilizza la glicemia.',
      'Tecniche di cottura: al vapore, alla griglia, al forno, brasato — evita la frittura.',
    ],
    foods: 'Ortaggi a foglia, pomodori, zucchine, melanzane, peperoni | Pesce azzurro 2-3×/sett | Legumi 3-4×/sett | Frutta fresca (2 porzioni/die) | Olio EVO come condimento principale',
  },
  'Gestire il diabete + Nessuna + Cucina mediterranea': {
    title: '🩸 Piano diabete mediterraneo',
    tips: [
      'Privilegia alimenti a basso indice glicemico (IG): pasta al dente, legumi, pane di segale, cereali integrali.',
      'Controlla la porzione di carboidrati: 45-60g CHO per pasto principale, 15-30g per spuntino.',
      'Abbina sempre CHO a proteine e/o grassi per abbassare il IG del pasto.',
      'Fibra ad ogni pasto: rallenta l\'assorbimento del glucosio. Obiettivo 25-30g/die.',
      'Frutta intera (non succhi): 2 porzioni/die, lontano dai pasti principali.',
      'Attività fisica post-prandiale: 15-20 min di camminata riduce la glicemia postprandiale del 20-30%.',
      'Monitoraggio glicemico: idealmente rilevare pre e 2h post-pasto durante l\'ottimizzazione.',
    ],
    foods: 'Pasta integrale, orzo, farro | Legumi quotidiani | Pesce 3×/sett | Verdure abbondanti | Frutta di bosco, mele, pere | Olio EVO, noci, mandorle',
  },
};

function getTemplate(goal, restriction, preference) {
  const key1 = `${goal} + ${restriction} + ${preference}`;
  if (TEMPLATES[key1]) return TEMPLATES[key1];
  return {
    title: `📋 Consigli per: ${goal}`,
    tips: [
      `Obiettivo "${goal}": valutare il fabbisogno energetico individuale tramite il calcolatore TDEE nella sezione Valutazione Paziente.`,
      'Adottare un\'alimentazione varia e bilanciata basata sulla dieta mediterranea come riferimento di base.',
      'Pianificare i pasti in anticipo per evitare scelte alimentari impulsive e migliorare l\'aderenza al piano.',
      'Idratazione: bere almeno 1.5-2L di acqua al giorno, riducendo bevande zuccherate e alcoliche.',
      'Attività fisica: associare sempre a un intervento nutrizionale per ottimizzare i risultati.',
      restriction !== 'Nessuna' ? `Restrizione "${restriction}": verificare l\'adeguatezza nutrizionale e supplementare se necessario.` : 'Nessuna restrizione rilevata: varietà alimentare come strategia principale.',
      'Follow-up regolare: monitorare peso, parametri clinici e aderenza ogni 2-4 settimane.',
    ],
    foods: 'Verdura abbondante | Frutta fresca | Cereali preferibilmente integrali | Proteine di qualità (legumi, pesce, carne magra) | Grassi sani (EVO, frutta secca)',
  };
}

export default function ConsiglioNutrizionali() {
  const [goal, setGoal] = useState('');
  const [restriction, setRestriction] = useState('');
  const [preference, setPreference] = useState('');
  const [generated, setGenerated] = useState(null);

  const generate = () => {
    if (!goal) return;
    setGenerated(getTemplate(goal, restriction || 'Nessuna', preference || 'Cucina mediterranea'));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Lightbulb size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Consigli Nutrizionali</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Consigli Nutrizionali Personalizzati</h1>
          <p className="text-teal-100 text-sm mt-0.5">Genera schede di consigli personalizzate in base a obiettivo, restrizioni e preferenze</p>
        </div>

        {/* Generator */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Generatore di consigli</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Obiettivo del paziente *</label>
              <select value={goal} onChange={e => setGoal(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="">— Seleziona obiettivo —</option>
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Restrizioni dietetiche</label>
              <select value={restriction} onChange={e => setRestriction(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="">Nessuna</option>
                {RESTRICTIONS.slice(1).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Preferenze culinarie</label>
              <select value={preference} onChange={e => setPreference(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="">Nessuna preferenza</option>
                {PREFERENCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <button onClick={generate} disabled={!goal}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors">
            ✨ Genera consigli
          </button>
        </div>

        {/* Generated advice */}
        {generated && (
          <div className={CARD}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="font-bold text-gray-800 text-base">{generated.title}</h2>
              <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-800 border border-teal-300 px-3 py-1.5 rounded-lg">
                <Printer size={12} /> Stampa
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {generated.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-teal-50 border border-teal-100">
                  <span className="bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="text-xs font-semibold text-emerald-700 mb-1">🥦 Alimenti consigliati</div>
              <p className="text-xs text-gray-700">{generated.foods}</p>
            </div>

            <p className="mt-3 text-xs text-gray-400 italic">
              ⚠️ Questi consigli sono di supporto alla valutazione clinica e non sostituiscono la prescrizione dietetica personalizzata.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
