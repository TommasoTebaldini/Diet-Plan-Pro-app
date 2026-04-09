import { useState } from 'react';
import { Users, Plus, Trash2, Key, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hashPassword } from '../../utils/crypto';

const MIN_PASSWORD_LENGTH = 6;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function PatientManager() {
  const { changeDietitianPassword } = useAuth();
  const [accounts, setAccounts] = useState(() =>
    JSON.parse(localStorage.getItem('diet-patient-accounts') || '[]')
  );
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [adminPwForm, setAdminPwForm]     = useState({ current: '', next: '', confirm: '' });
  const [adminPwError, setAdminPwError]   = useState('');
  const [adminPwSuccess, setAdminPwSuccess] = useState('');

  const saveAccounts = (updated) => {
    setAccounts(updated);
    localStorage.setItem('diet-patient-accounts', JSON.stringify(updated));
  };

  const addAccount = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username e password sono obbligatori.');
      return;
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setError(`La password deve avere almeno ${MIN_PASSWORD_LENGTH} caratteri.`);
      return;
    }
    if (accounts.find(a => a.username === form.username.trim())) {
      setError('Username già in uso.');
      return;
    }
    const passwordHash = await hashPassword(form.password.trim());
    const newAccount   = { id: generateId(), username: form.username.trim(), passwordHash };
    saveAccounts([...accounts, newAccount]);
    setForm({ username: '', password: '' });
    setSuccess('Account creato con successo!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const deleteAccount = (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo account? Tutti i dati del paziente saranno persi.')) return;
    const keysToRemove = Object.keys(localStorage).filter(k => k.startsWith(`diet-patient-${id}-`));
    keysToRemove.forEach(k => localStorage.removeItem(k));
    saveAccounts(accounts.filter(a => a.id !== id));
  };

  const changeAdminPassword = async (e) => {
    e.preventDefault();
    setAdminPwError('');
    const storedHash    = localStorage.getItem('diet-dietitian-password');
    const currentHashed = await hashPassword(adminPwForm.current);
    const defaultHash   = await hashPassword('admin123');
    const isValid       = storedHash ? currentHashed === storedHash : currentHashed === defaultHash;
    if (!isValid) {
      setAdminPwError('Password attuale non corretta.');
      return;
    }
    if (adminPwForm.next.length < MIN_PASSWORD_LENGTH) {
      setAdminPwError(`La nuova password deve avere almeno ${MIN_PASSWORD_LENGTH} caratteri.`);
      return;
    }
    if (adminPwForm.next !== adminPwForm.confirm) {
      setAdminPwError('Le password non coincidono.');
      return;
    }
    await changeDietitianPassword(adminPwForm.next);
    setAdminPwForm({ current: '', next: '', confirm: '' });
    setAdminPwSuccess('Password cambiata con successo!');
    setTimeout(() => setAdminPwSuccess(''), 3000);
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Gestione Pazienti</h2>
        <p className="text-gray-500 mt-1">Crea e gestisci gli account dei tuoi pazienti</p>
      </div>

      {/* Create account */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus size={18} className="text-emerald-500" /> Nuovo Account Paziente
        </h3>
        <form onSubmit={addAccount} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              value={form.username}
              onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
              placeholder="es. mario.rossi"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-sm text-gray-600 mb-1">Password (min. {MIN_PASSWORD_LENGTH} caratteri)</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Password iniziale"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <Plus size={14} /> Crea Account
          </button>
        </form>
        {error   && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {success && <p className="text-emerald-600 text-sm mt-3">{success}</p>}
      </div>

      {/* Accounts list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users size={18} className="text-emerald-500" />
          <h3 className="font-semibold text-gray-700">Pazienti Registrati ({accounts.length})</h3>
        </div>
        {accounts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nessun paziente registrato</p>
            <p className="text-sm mt-1">Crea il primo account sopra</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Profilo</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {accounts.map(account => {
                const profile = JSON.parse(localStorage.getItem(`diet-patient-${account.id}-profile`) || 'null');
                return (
                  <tr key={account.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{account.username}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {profile
                        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Profilo incompleto'
                        : 'Non ancora configurato'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => deleteAccount(account.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Change admin password */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Lock size={18} className="text-emerald-500" /> Cambia Password Amministratore
        </h3>
        <form onSubmit={changeAdminPassword} className="space-y-3 max-w-sm">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password attuale</label>
            <input
              type="password"
              value={adminPwForm.current}
              onChange={e => setAdminPwForm(p => ({ ...p, current: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nuova password</label>
            <input
              type="password"
              value={adminPwForm.next}
              onChange={e => setAdminPwForm(p => ({ ...p, next: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Conferma nuova password</label>
            <input
              type="password"
              value={adminPwForm.confirm}
              onChange={e => setAdminPwForm(p => ({ ...p, confirm: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          {adminPwError   && <p className="text-red-500 text-sm">{adminPwError}</p>}
          {adminPwSuccess && <p className="text-emerald-600 text-sm">{adminPwSuccess}</p>}
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <Key size={14} /> Cambia Password
          </button>
        </form>
      </div>
    </div>
  );
}

