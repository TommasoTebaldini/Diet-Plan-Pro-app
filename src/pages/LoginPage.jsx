import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Stethoscope, HeartPulse } from 'lucide-react';

export default function LoginPage() {
  const { loginDietitian, loginPatient } = useAuth();
  const [tab, setTab]         = useState('patient'); // 'patient' | 'dietitian'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'dietitian') {
        const ok = await loginDietitian(username, password);
        if (!ok) setError('Credenziali non corrette.');
      } else {
        const ok = await loginPatient(username, password);
        if (!ok) setError('Credenziali non corrette. Contatta il tuo dietista.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-3xl">D</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Diet Plan Pro</h1>
          <p className="text-gray-500 mt-1">Accedi alla tua area personale</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Tab switcher */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <button
              onClick={() => { setTab('patient'); setUsername(''); setError(''); }}
              className={`py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                tab === 'patient'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <HeartPulse size={18} />
              Paziente
            </button>
            <button
              onClick={() => { setTab('dietitian'); setUsername(''); setError(''); }}
              className={`py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                tab === 'dietitian'
                  ? 'bg-emerald-50 text-emerald-600 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Stethoscope size={18} />
              Dietista
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {tab === 'patient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome utente</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Inserisci il tuo username"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>
            )}

            {tab === 'dietitian' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="La tua email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="La tua password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 disabled:opacity-60 transition-colors shadow-sm"
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>

            {tab === 'patient' && (
              <p className="text-center text-xs text-gray-400 mt-2">
                Non hai ancora un account? Contatta il tuo dietista per ricevere le credenziali di accesso.
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">Diet Plan Pro v1.0 &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

