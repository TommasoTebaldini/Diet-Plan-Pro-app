import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, Save, Calculator } from 'lucide-react';

const activityLevels = [
  { value: '1.2', label: 'Sedentary (little or no exercise)' },
  { value: '1.375', label: 'Lightly active (1-3 days/week)' },
  { value: '1.55', label: 'Moderately active (3-5 days/week)' },
  { value: '1.725', label: 'Very active (6-7 days/week)' },
  { value: '1.9', label: 'Super active (physical job)' },
];

const goals = [
  { value: 'lose', label: '🔥 Lose Weight', adjustment: -500 },
  { value: 'maintain', label: '⚖️ Maintain Weight', adjustment: 0 },
  { value: 'gain', label: '💪 Gain Weight', adjustment: +500 },
];

function calcTDEE(profile) {
  const { weight, height, age, gender, activity } = profile;
  if (!weight || !height || !age) return 0;
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

export default function Profile() {
  const [profile, setProfile] = useLocalStorage('diet-profile', {});
  const [form, setForm] = useState({
    name: '', age: '', weight: '', height: '',
    gender: 'male', activity: '1.55', goal: 'maintain', calorieTarget: 2000,
    ...profile
  });
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
    setProfile({ ...form, calorieTarget: Number(form.calorieTarget) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <p className="text-gray-500 mt-1">Set your personal info and nutrition goals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><User size={18} className="text-emerald-500" /> Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
              <input name="weight" type="number" step="0.1" value={form.weight} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
              <input name="height" type="number" value={form.height} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Activity Level</label>
              <select name="activity" value={form.activity} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300">
                {activityLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Your Goal</h3>
          <div className="grid grid-cols-3 gap-3">
            {goals.map(g => (
              <label key={g.value} className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${form.goal === g.value ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="goal" value={g.value} checked={form.goal === g.value} onChange={handleChange} className="hidden" />
                <p className="text-sm font-medium text-gray-700">{g.label}</p>
              </label>
            ))}
          </div>
        </div>

        {/* TDEE Calculator */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Calculator size={18} className="text-emerald-500" /> Calorie Target</h3>
          {tdee > 0 && (
            <div className="bg-emerald-50 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">Estimated TDEE</p>
                <p className="text-2xl font-bold text-emerald-600">{tdee} kcal/day</p>
                <p className="text-xs text-emerald-600 mt-0.5">Based on Mifflin-St Jeor formula</p>
              </div>
              <button type="button" onClick={applyTDEE}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors">
                Apply
              </button>
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Daily Calorie Target</label>
            <input name="calorieTarget" type="number" value={form.calorieTarget} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300" />
          </div>
        </div>

        <button type="submit"
          className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
          <Save size={16} />
          {saved ? 'Profile Saved!' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
