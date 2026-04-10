import { useState } from 'react';
import { ChevronRight, ChevronLeft, User, Heart, Scale } from 'lucide-react';

const steps = [
  { id: 'personal', label: 'Dati Personali', icon: User },
  { id: 'body',     label: 'Corporatura',    icon: Scale },
  { id: 'goal',     label: 'Obiettivo',      icon: Heart },
];

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
  const tdee = bmr * parseFloat(activity || 1.55);
  const goalAdjust = goals.find(g => g.value === profile.goal)?.adjustment || 0;
  return Math.round(tdee + goalAdjust);
}

export default function PatientOnboarding({ patientId, onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: 'male',
    weight: '',
    height: '',
    activity: '1.55',
    goal: 'maintain',
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const finish = () => {
    const tdee = calcTDEE(form);
    const profile = {
      ...form,
      weight: Number(form.weight),
      height: Number(form.height),
      calorieTarget: tdee || 2000,
      onboardingComplete: true,
    };
    localStorage.setItem(`diet-patient-${patientId}-profile`, JSON.stringify(profile));
    onComplete(profile);
  };

  const tdee = calcTDEE(form);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-2xl shadow-lg mb-3">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Benvenuto in Diet Plan Pro!</h1>
          <p className="text-gray-500 mt-1 text-sm">Compila il tuo profilo per iniziare</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-6 gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === step
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : i < step
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-white text-gray-400 border border-gray-200'
              }`}>
                <s.icon size={12} />
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 h-0.5 rounded-full ${i < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Step 0: Personal data */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-5">I tuoi dati personali</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nome <span className="text-red-400">*</span></label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Mario"
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cognome <span className="text-red-400">*</span></label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Rossi"
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data di nascita <span className="text-red-400">*</span></label>
                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sesso</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'male', label: '👨 Maschio' }, { value: 'female', label: '👩 Femmina' }].map(g => (
                    <label
                      key={g.value}
                      className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                        form.gender === g.value
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g.value}
                        checked={form.gender === g.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-sm font-medium text-gray-700">{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Body */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-5">La tua corporatura</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Peso (kg) <span className="text-red-400">*</span></label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="70"
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Altezza (cm) <span className="text-red-400">*</span></label>
                  <input
                    name="height"
                    type="number"
                    min="100"
                    max="250"
                    value={form.height}
                    onChange={handleChange}
                    placeholder="175"
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>
              {form.weight && form.height && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-emerald-700">
                    <span className="font-medium">BMI:</span>{' '}
                    {(form.weight / (form.height / 100) ** 2).toFixed(1)}
                    {' '}—{' '}
                    {(() => {
                      const bmi = form.weight / (form.height / 100) ** 2;
                      if (bmi < 18.5) return 'Sottopeso';
                      if (bmi < 25)   return 'Normopeso ✅';
                      if (bmi < 30)   return 'Sovrappeso';
                      return 'Obesità';
                    })()}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Livello di attività fisica</label>
                <select
                  name="activity"
                  value={form.activity}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {activityLevels.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Il tuo obiettivo</h2>
              <div className="grid grid-cols-1 gap-3">
                {goals.map(g => (
                  <label
                    key={g.value}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
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
                    <p className="font-semibold text-gray-800">{g.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {g.adjustment > 0 ? `+${g.adjustment}` : g.adjustment === 0 ? '±0' : g.adjustment} kcal rispetto al TDEE
                    </p>
                  </label>
                ))}
              </div>
              {tdee > 0 && (
                <div className="bg-emerald-50 rounded-xl p-4 mt-2">
                  <p className="text-sm font-semibold text-emerald-700">Fabbisogno calorico stimato</p>
                  <p className="text-2xl font-bold text-emerald-600">{tdee} kcal/giorno</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Formula di Mifflin-St Jeor</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} /> Indietro
            </button>

            {step < steps.length - 1 ? (
              <button
                onClick={next}
                disabled={
                  (step === 0 && (!form.firstName.trim() || !form.lastName.trim() || !form.birthDate)) ||
                  (step === 1 && (!form.weight || !form.height))
                }
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Avanti <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={finish}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                Inizia! 🎉
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
