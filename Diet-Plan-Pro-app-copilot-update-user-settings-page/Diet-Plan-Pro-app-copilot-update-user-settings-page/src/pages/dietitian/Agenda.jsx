import { useState } from 'react';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const APPOINTMENT_TYPES = ['Prima visita', 'Controllo', 'BIA', 'Educazione nutrizionale', 'Consulenza online', 'Urgenza'];
const TYPE_COLORS = {
  'Prima visita': 'bg-blue-100 text-blue-800 border-blue-200',
  'Controllo': 'bg-green-100 text-green-800 border-green-200',
  'BIA': 'bg-purple-100 text-purple-800 border-purple-200',
  'Educazione nutrizionale': 'bg-teal-100 text-teal-800 border-teal-200',
  'Consulenza online': 'bg-amber-100 text-amber-800 border-amber-200',
  'Urgenza': 'bg-red-100 text-red-800 border-red-200',
};

const HOURS = Array.from({ length: 22 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

function dateStr(date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date) {
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
}

export default function Agenda() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [appointments, setAppointments] = useState([
    { id: 1, date: dateStr(new Date()), time: '09:00', patient: 'Mario Rossi', type: 'Prima visita', note: '' },
    { id: 2, date: dateStr(new Date()), time: '10:30', patient: 'Anna Bianchi', type: 'Controllo', note: 'Portare esami' },
  ]);
  const [form, setForm] = useState({ date: dateStr(new Date()), time: '09:00', patient: '', type: 'Prima visita', note: '' });
  const [showForm, setShowForm] = useState(false);

  const monday = getMonday(new Date(Date.now() + weekOffset * 7 * 86400000));
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

  const addAppointment = () => {
    if (!form.patient) return;
    setAppointments(prev => [...prev, { ...form, id: Date.now() }]);
    setForm(prev => ({ ...prev, patient: '', note: '' }));
    setShowForm(false);
  };

  const removeAppointment = (id) => setAppointments(prev => prev.filter(a => a.id !== id));

  const apptForDate = (date) => appointments.filter(a => a.date === dateStr(date)).sort((a, b) => a.time.localeCompare(b.time));

  const upcoming = appointments
    .filter(a => a.date >= dateStr(new Date()))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 10);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Calendar size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Agenda</span>
        <button onClick={() => setShowForm(true)}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg">
          <Plus size={12} /> Nuovo appuntamento
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>📅</span>
            <div>
              <h1 className="text-white font-bold text-lg">Agenda Appuntamenti</h1>
              <p className="text-teal-100 text-sm mt-0.5">Vista settimanale, prossimi appuntamenti e gestione calendario</p>
            </div>
          </div>
        </div>

        {/* Add appointment form */}
        {showForm && (
          <div className={CARD}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800">Nuovo appuntamento</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ora</label>
                <select value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Paziente</label>
                <input type="text" value={form.patient} onChange={e => setForm(p => ({ ...p, patient: e.target.value }))}
                  placeholder="Nome paziente"
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                  {APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Note</label>
              <input type="text" value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Note opzionali..."
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <button onClick={addAppointment} disabled={!form.patient}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg">
              Salva appuntamento
            </button>
          </div>
        )}

        {/* Week navigation */}
        <div className={CARD}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setWeekOffset(w => w - 1)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50">← Sett. prec.</button>
            <span className="text-sm font-semibold text-gray-800">
              {formatDate(weekDates[0])} – {formatDate(weekDates[6])}
            </span>
            <button onClick={() => setWeekOffset(w => w + 1)}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50">Sett. succ. →</button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((date, i) => {
              const dayAppts = apptForDate(date);
              const isToday = dateStr(date) === dateStr(new Date());
              return (
                <div key={i} className={`rounded-lg p-2 min-h-24 ${isToday ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className={`text-xs font-semibold mb-1.5 ${isToday ? 'text-teal-700' : 'text-gray-600'}`}>
                    <span className="block">{DAYS[i].slice(0, 3)}</span>
                    <span className={`text-base ${isToday ? 'text-teal-700' : 'text-gray-800'}`}>{date.getDate()}</span>
                  </div>
                  <div className="space-y-1">
                    {dayAppts.map(a => (
                      <div key={a.id} className={`text-[10px] px-1.5 py-0.5 rounded border ${TYPE_COLORS[a.type] || 'bg-gray-100 text-gray-600 border-gray-200'} leading-tight`}>
                        <span className="font-medium">{a.time}</span> {a.patient}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming list */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Prossimi appuntamenti</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Nessun appuntamento in programma</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <Clock size={14} className="text-teal-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-gray-800">{a.patient}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[a.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>{a.type}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(a.date).toLocaleDateString('it-IT', { weekday: 'long', day: '2-digit', month: 'long' })} ore {a.time}
                      {a.note && <span className="ml-2 text-gray-400">· {a.note}</span>}
                    </div>
                  </div>
                  <button onClick={() => removeAppointment(a.id)} className="text-gray-300 hover:text-red-400 flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
