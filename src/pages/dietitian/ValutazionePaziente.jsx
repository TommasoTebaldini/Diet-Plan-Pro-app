import { useState } from 'react';
import { UserCheck } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

function calcBMI(weight, heightCm) {
  const h = Number(heightCm) / 100;
  const w = Number(weight);
  if (!h || !w) return null;
  return (w / (h * h)).toFixed(1);
}

function bmiCategory(bmi) {
  const b = Number(bmi);
  if (b < 16) return { label: 'Malnutrizione grave', color: 'bg-red-200 text-red-900' };
  if (b < 17) return { label: 'Malnutrizione moderata', color: 'bg-red-100 text-red-800' };
  if (b < 18.5) return { label: 'Sottopeso', color: 'bg-orange-100 text-orange-800' };
  if (b < 25) return { label: 'Normopeso ✓', color: 'bg-green-100 text-green-800' };
  if (b < 30) return { label: 'Sovrappeso', color: 'bg-yellow-100 text-yellow-800' };
  if (b < 35) return { label: 'Obesità I', color: 'bg-orange-100 text-orange-800' };
  if (b < 40) return { label: 'Obesità II', color: 'bg-red-100 text-red-800' };
  return { label: 'Obesità III (grave)', color: 'bg-red-200 text-red-900' };
}

function calcHarrisBenedict(sex, weight, heightCm, age, activity) {
  const w = Number(weight), h = Number(heightCm), a = Number(age);
  if (!w || !h || !a) return null;
  const bmr = sex === 'M'
    ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a
    : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  return Math.round(bmr * (factors[activity] || 1.2));
}

function calcMifflin(sex, weight, heightCm, age, activity) {
  const w = Number(weight), h = Number(heightCm), a = Number(age);
  if (!w || !h || !a) return null;
  const bmr = 10 * w + 6.25 * h - 5 * a + (sex === 'M' ? 5 : -161);
  const factors = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  return Math.round(bmr * (factors[activity] || 1.2));
}

const MNA_QUESTIONS = [
  { q: 'Riduzione dell\'assunzione di cibo negli ultimi 3 mesi a causa di perdita di appetito, problemi digestivi, difficoltà masticatorie o deglutitorie?', options: ['0 – Grave riduzione', '1 – Riduzione moderata', '2 – Nessuna riduzione'] },
  { q: 'Perdita di peso negli ultimi 3 mesi?', options: ['0 – > 3 kg', '1 – Non sa', '2 – 1–3 kg', '3 – Nessuna perdita'] },
  { q: 'Mobilità?', options: ['0 – A letto o sulla sedia', '1 – Si alza ma non esce di casa', '2 – Esce di casa'] },
  { q: 'Malattia acuta o stress psicologico negli ultimi 3 mesi?', options: ['0 – Sì', '2 – No'] },
  { q: 'Problemi neuropsicologici?', options: ['0 – Demenza grave o depressione', '1 – Demenza lieve', '2 – Nessun problema'] },
  { q: 'IMC (kg/m²)?', options: ['0 – < 19', '1 – 19–21', '2 – 21–23', '3 – ≥ 23'] },
];

export default function ValutazionePaziente() {
  const [form, setForm] = useState({ weight: '', height: '', age: '', sex: 'F', activity: 'moderate', waist: '', hip: '' });
  const [mnaAnswers, setMnaAnswers] = useState({});

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));
  const bmi = calcBMI(form.weight, form.height);
  const bmiCat = bmi ? bmiCategory(bmi) : null;
  const hb = calcHarrisBenedict(form.sex, form.weight, form.height, form.age, form.activity);
  const mifflin = calcMifflin(form.sex, form.weight, form.height, form.age, form.activity);

  // Ideal weight (Lorenz / Broca)
  const h = Number(form.height);
  const lorenzoIdeal = h ? (form.sex === 'M' ? h - 100 - (h - 150) / 4 : h - 100 - (h - 150) / 2) : null;
  const brocaIdeal = h ? (form.sex === 'M' ? h - 100 : h - 104) : null;

  // Waist-hip ratio
  const whr = form.waist && form.hip ? (Number(form.waist) / Number(form.hip)).toFixed(2) : null;

  // MNA score
  const mnaScore = Object.values(mnaAnswers).reduce((s, v) => s + Number(v), 0);
  const mnaTotal = Object.keys(mnaAnswers).length;
  const mnaRisk = mnaTotal === 6
    ? mnaScore >= 12 ? { label: 'Normale', color: 'bg-green-100 text-green-800' }
    : mnaScore >= 8 ? { label: 'A rischio di malnutrizione', color: 'bg-yellow-100 text-yellow-800' }
    : { label: 'Malnutrito', color: 'bg-red-100 text-red-800' }
    : null;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <UserCheck size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Valutazione Paziente</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Valutazione Paziente</h1>
          <p className="text-teal-100 text-sm mt-0.5">BMI, peso ideale, TDEE (Harris-Benedict / Mifflin), composizione corporea, MNA-SF</p>
        </div>

        {/* Input form */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Dati antropometrici</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {[
              { label: 'Peso (kg)', field: 'weight', type: 'number', placeholder: 'es. 70' },
              { label: 'Altezza (cm)', field: 'height', type: 'number', placeholder: 'es. 170' },
              { label: 'Età (anni)', field: 'age', type: 'number', placeholder: 'es. 35' },
              { label: 'Vita (cm)', field: 'waist', type: 'number', placeholder: 'es. 80' },
              { label: 'Fianchi (cm)', field: 'hip', type: 'number', placeholder: 'es. 100' },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                <input type={f.type} value={form[f.field]} onChange={e => set(f.field, e.target.value)}
                  placeholder={f.placeholder}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Sesso</label>
              <select value={form.sex} onChange={e => set('sex', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="F">Femmina</option>
                <option value="M">Maschio</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Livello attività</label>
              <select value={form.activity} onChange={e => set('activity', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="sedentary">Sedentario</option>
                <option value="light">Leggero</option>
                <option value="moderate">Moderato</option>
                <option value="active">Attivo</option>
                <option value="very_active">Molto attivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {bmi && (
          <div className={CARD}>
            <h2 className="font-semibold text-gray-800 mb-3">Risultati</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">BMI</div>
                <div className="text-2xl font-bold text-gray-800">{bmi}</div>
                {bmiCat && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bmiCat.color}`}>{bmiCat.label}</span>}
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Peso ideale Lorenz</div>
                <div className="text-xl font-bold text-teal-700">{lorenzoIdeal ? lorenzoIdeal.toFixed(1) : '—'} kg</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">Peso ideale Broca</div>
                <div className="text-xl font-bold text-teal-700">{brocaIdeal ? brocaIdeal.toFixed(1) : '—'} kg</div>
              </div>
              {whr && (
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Rapporto vita/fianchi</div>
                  <div className="text-xl font-bold text-gray-800">{whr}</div>
                  <div className="text-xs text-gray-500">
                    {form.sex === 'M' ? (Number(whr) > 0.9 ? '⚠ Rischio cardiovascolare' : '✓ Normale') : (Number(whr) > 0.85 ? '⚠ Rischio cardiovascolare' : '✓ Normale')}
                  </div>
                </div>
              )}
            </div>

            {(hb || mifflin) && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-emerald-700 mb-1">TDEE Harris-Benedict</div>
                  <div className="text-xl font-bold text-emerald-700">{hb} kcal/die</div>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-teal-700 mb-1">TDEE Mifflin-St Jeor</div>
                  <div className="text-xl font-bold text-teal-700">{mifflin} kcal/die</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MNA-SF */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-1">MNA-SF — Screening rischio malnutrizione</h2>
          <p className="text-xs text-gray-500 mb-4">Mini Nutritional Assessment Short Form — per pazienti anziani</p>
          <div className="space-y-4">
            {MNA_QUESTIONS.map((q, qi) => (
              <div key={qi} className="border border-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-700 mb-2 font-medium">{qi + 1}. {q.q}</p>
                <div className="space-y-1">
                  {q.options.map((opt, oi) => {
                    const score = opt.split(' – ')[0];
                    return (
                      <label key={oi} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`mna-${qi}`} value={score}
                          checked={mnaAnswers[qi] === score}
                          onChange={() => setMnaAnswers(prev => ({ ...prev, [qi]: score }))}
                          className="accent-teal-600" />
                        <span className="text-xs text-gray-600">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {mnaRisk && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm font-semibold ${mnaRisk.color}`}>
              Punteggio MNA-SF: {mnaScore}/14 — {mnaRisk.label}
            </div>
          )}
          {!mnaRisk && mnaTotal > 0 && (
            <div className="mt-3 text-xs text-gray-400">Rispondere a tutte le domande per ottenere la classificazione.</div>
          )}
        </div>
      </div>
    </div>
  );
}
