import { useState } from 'react';
import { GraduationCap, CheckCircle, Circle } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const CATEGORIES = ['Tutti', 'Nutrizione clinica', 'Dietetica pratica', 'Patologie', 'Metodologia', 'Comunicazione'];

const COURSES = [
  { id: 1, title: 'Nutrizione clinica nel paziente critico', category: 'Nutrizione clinica', credits: 8, duration: '4h', provider: 'FNO TSRM PSTRP', level: 'Avanzato', completed: false, deadline: '2025-12-31', desc: 'Gestione nutrizionale della nutrizione enterale e parenterale nei reparti di terapia intensiva.' },
  { id: 2, title: 'Dieta mediterranea: evidenze e applicazioni cliniche', category: 'Dietetica pratica', credits: 6, duration: '3h', provider: 'ANDID', level: 'Base', completed: true, deadline: '2025-06-30', desc: 'Applicazione pratica della dieta mediterranea nella prevenzione delle patologie cronico-degenerative.' },
  { id: 3, title: 'Gestione nutrizionale del diabete mellito tipo 2', category: 'Patologie', credits: 10, duration: '5h', provider: 'SID', level: 'Intermedio', completed: false, deadline: '2025-09-30', desc: 'Strategie nutrizionali evidence-based per il trattamento del diabete tipo 2, conteggio CHO e indice glicemico.' },
  { id: 4, title: 'BIA e composizione corporea nella pratica clinica', category: 'Metodologia', credits: 6, duration: '3h', provider: 'SINPE', level: 'Intermedio', completed: true, deadline: '2025-08-31', desc: 'Interpretazione dei parametri BIA, angolo di fase e valutazione della composizione corporea.' },
  { id: 5, title: 'Comunicazione terapeutica con il paziente obeso', category: 'Comunicazione', credits: 5, duration: '2.5h', provider: 'ANSISA', level: 'Base', completed: false, deadline: '2025-11-30', desc: 'Tecniche motivazionali e approccio non stigmatizzante nella gestione del paziente sovrappeso/obeso.' },
  { id: 6, title: 'Nutrizione enterale domiciliare: prescrizione e follow-up', category: 'Nutrizione clinica', credits: 8, duration: '4h', provider: 'SINPE', level: 'Avanzato', completed: false, deadline: '2026-03-31', desc: 'Indicazioni, formulazioni e monitoraggio della nutrizione enterale in ambito domiciliare (NED).' },
  { id: 7, title: 'Dieta chetogenica: indicazioni e sicurezza clinica', category: 'Patologie', credits: 7, duration: '3.5h', provider: 'SIPN', level: 'Intermedio', completed: false, deadline: '2025-10-31', desc: 'Evidenze scientifiche, protocolli e gestione degli effetti avversi della dieta chetogenica.' },
  { id: 8, title: 'Alimentazione complementare e svezzamento responsivo', category: 'Dietetica pratica', credits: 5, duration: '2.5h', provider: 'SIPNEI', level: 'Base', completed: true, deadline: '2025-07-31', desc: 'Approcci moderni allo svezzamento: BLW, svezzamento tradizionale e autonomia alimentare del bambino.' },
  { id: 9, title: 'Nutrizione e microbiota: evidenze cliniche', category: 'Nutrizione clinica', credits: 6, duration: '3h', provider: 'SICCR', level: 'Intermedio', completed: false, deadline: '2025-12-15', desc: 'Interazione tra alimentazione e microbiota intestinale: prebiotici, probiotici e simbiotici.' },
  { id: 10, title: 'Metodologia NCPt: Nutrition Care Process', category: 'Metodologia', credits: 8, duration: '4h', provider: 'ANDID', level: 'Intermedio', completed: false, deadline: '2026-01-31', desc: 'Applicazione del Nutrition Care Process nella pratica clinica: terminologia standardizzata e documentazione.' },
];

const LEVEL_COLORS = { 'Base': 'bg-green-100 text-green-700', 'Intermedio': 'bg-blue-100 text-blue-700', 'Avanzato': 'bg-purple-100 text-purple-700' };

export default function CorsiECM() {
  const [completed, setCompleted] = useState(() => {
    const init = {};
    COURSES.forEach(c => { init[c.id] = c.completed; });
    return init;
  });
  const [category, setCategory] = useState('Tutti');

  const toggleComplete = (id) => setCompleted(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = category === 'Tutti' ? COURSES : COURSES.filter(c => c.category === category);
  const totalCredits = COURSES.reduce((s, c) => s + c.credits, 0);
  const earnedCredits = COURSES.filter(c => completed[c.id]).reduce((s, c) => s + c.credits, 0);
  const completedCount = COURSES.filter(c => completed[c.id]).length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <GraduationCap size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Corsi ECM</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🎓</span>
            <div>
              <h1 className="text-white font-bold text-lg">Corsi ECM</h1>
              <p className="text-teal-100 text-sm mt-0.5">Educazione Continua in Medicina — crediti, progressi e certificati</p>
            </div>
          </div>
        </div>

        {/* Progress summary */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Riepilogo crediti ECM</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-teal-50 rounded-lg p-3 text-center">
              <div className="text-xs text-teal-600 mb-1">Crediti acquisiti</div>
              <div className="text-2xl font-bold text-teal-700">{earnedCredits}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Crediti totali disponibili</div>
              <div className="text-2xl font-bold text-gray-700">{totalCredits}</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <div className="text-xs text-emerald-600 mb-1">Corsi completati</div>
              <div className="text-2xl font-bold text-emerald-700">{completedCount}/{COURSES.length}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-teal-600 h-3 rounded-full transition-all"
              style={{ width: `${totalCredits ? (earnedCredits / totalCredits) * 100 : 0}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">{totalCredits ? Math.round((earnedCredits / totalCredits) * 100) : 0}% completato</div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === cat ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Course list */}
        <div className="space-y-3">
          {filtered.map(course => (
            <div key={course.id} className={`bg-white rounded-xl border p-4 transition-all ${completed[course.id] ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggleComplete(course.id)} className="mt-0.5 flex-shrink-0">
                  {completed[course.id]
                    ? <CheckCircle size={20} className="text-green-500" />
                    : <Circle size={20} className="text-gray-300 hover:text-teal-400 transition-colors" />
                  }
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEVEL_COLORS[course.level]}`}>{course.level}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{course.category}</span>
                    <span className="text-xs text-teal-700 font-semibold">{course.credits} crediti</span>
                    <span className="text-xs text-gray-400">{course.duration}</span>
                  </div>
                  <h3 className={`font-semibold text-sm ${completed[course.id] ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{course.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 mb-1">Provider: {course.provider} · Scadenza: {new Date(course.deadline).toLocaleDateString('it-IT')}</p>
                  <p className="text-xs text-gray-600">{course.desc}</p>
                  {completed[course.id] && (
                    <button className="mt-2 text-xs text-teal-600 hover:text-teal-800 font-medium border border-teal-200 px-3 py-1 rounded-lg">
                      📜 Scarica certificato
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
