import { useState } from 'react';
import { User, Save, Calculator } from 'lucide-react';

const activityLevels = [
  { value: '1.2',   label: 'Sedentario (poco o nessun esercizio)' },
  { value: '1.375', label: 'Leggermente attivo (1-3 giorni/sett.)' },
  { value: '1.55',  label: 'Moderatamente attivo (3-5 giorni/sett.)' },
  { value: '1.725', label: 'Molto attivo (6-7 giorni/sett.)' },
  { value: '1.9',   label: 'Estremamente attivo (lavoro fisico)' },
];

const goals = [
  { value: 'lose',     label: '🔥 Perdere peso',     adjustment: -500 },
  { value: 'maintain', label: '⚖️ Mantenere il peso', adjustment: 0   },
  { value: 'gain',     label: '💪 Aumentare massa',  adjustment: +500 },
];

function calcTDEE(profile) {
  const { weight, height, birthDate, gender, activity } = profile;
  if (!weight || !height || !birthDate) return 0;
  const age = Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  let bmr;
  if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  }
  const tdee       = bmr * parseFloat(activity || 1.55);
  const goalAdjust = goals.find(g => g.value === profile.goal)?.adjustment || 0;
  return Math.round(tdee + goalAdjust);
}

export default function PatientProfile({ patientId, profile, onUpdate }) {
  const [form, setForm]   = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const tdee = calcTDEE(form);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyTDEE = () => {
    setForm(prev => ({ ...prev, calorieTarget: tdee }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...form,
      weight:        Number(form.weight),
      height:        Number(form.height),
      calorieTarget: Number(form.calorieTarget),
    };
    localStorage.setItem(`diet-patient-${patientId}-profile`, JSON.stringify(updated));
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bmi = form.weight && form.height
    ? (form.weight / (form.height / 100) ** 2).toFixed(1)
    : null;

  const age = form.birthDate
    ? Math.floor((Date.now() - new Date(form.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Il mio Profilo</h2>
        <p className="text-gray-500 mt-1">Aggiorna le tue informazioni personali e i tuoi obiettivi</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <User size={18} className="text-emerald-500" /> Dati Personali
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nome</label>
              <input
                name="firstName"
                value={form.firstName || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cognome</label>
              <input
                name="lastName"
                value={form.lastName || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Data di nascita</label>
              <input
                name="birthDate"
                type="date"
                value={form.birthDate || ''}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            {age && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Età</label>
                <div className="px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-700">{age} anni</div>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sesso</label>
              <select
                name="gender"
                value={form.gender || 'male'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="male">Maschio</option>
                <option value="female">Femmina</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Livello di attività</label>
              <select
                name="activity"
                value={form.activity || '1.55'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {activityLevels.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Peso (kg)</label>
              <input
                name="weight"
                type="number"
                step="0.1"
                value={form.weight || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Altezza (cm)</label>
              <input
                name="height"
                type="number"
                value={form.height || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          {bmi && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
              <p className="text-sm text-emerald-700">
                <span className="font-semibold">BMI:</span> {bmi} —{' '}
                {(() => {
                  const b = Number(bmi);
                  if (b < 18.5) return 'Sottopeso';
                  if (b < 25)   return 'Normopeso ✅';
                  if (b < 30)   return 'Sovrappeso';
                  return 'Obesità';
                })()}
              </p>
            </div>
          )}
        </div>

        {/* Goal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Obiettivo</h3>
          <div className="grid grid-cols-3 gap-3">
            {goals.map(g => (
              <label
                key={g.value}
                className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                  form.goal === g.value
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="goal"
                  value={g.value}
                  checked={form.goal === g.value}
                  onChange={handleChange}
                  className="hidden"
                />
                <p className="text-sm font-medium text-gray-700">{g.label}</p>
              </label>
            ))}
          </div>
        </div>

        {/* TDEE Calculator */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Calculator size={18} className="text-emerald-500" /> Target Calorico
          </h3>
          {tdee > 0 && (
            <div className="bg-emerald-50 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">TDEE Stimato</p>
                <p className="text-2xl font-bold text-emerald-600">{tdee} kcal/giorno</p>
                <p className="text-xs text-emerald-600 mt-0.5">Formula di Mifflin-St Jeor</p>
              </div>
              <button
                type="button"
                onClick={applyTDEE}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                Applica
              </button>
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Target calorico giornaliero</label>
            <input
              name="calorieTarget"
              type="number"
              value={form.calorieTarget || 2000}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          <Save size={16} />
          {saved ? 'Profilo Salvato!' : 'Salva Profilo'}
        </button>
      </form>
    </div>
  );
}
