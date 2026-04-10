import { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const QUESTIONNAIRES = [
  {
    id: 'ffq',
    name: 'FFQ — Food Frequency Questionnaire',
    desc: 'Stima la frequenza di consumo dei principali gruppi alimentari nell\'ultimo mese.',
    items: [
      { food: 'Carne rossa', freqs: ['Mai', '1×/mese', '1×/sett', '2–3×/sett', 'Quotidiano'] },
      { food: 'Pesce', freqs: ['Mai', '1×/mese', '1–2×/sett', '3–4×/sett', 'Quotidiano'] },
      { food: 'Frutta fresca', freqs: ['Mai', '1×/mese', '1×/sett', '3–5×/sett', 'Quotidiano'] },
      { food: 'Verdura fresca', freqs: ['Mai', '1×/mese', '1×/sett', '3–5×/sett', 'Quotidiano'] },
      { food: 'Legumi', freqs: ['Mai', '1×/mese', '1×/sett', '2–3×/sett', 'Quotidiano'] },
      { food: 'Cereali integrali', freqs: ['Mai', '1×/mese', '1×/sett', '3–5×/sett', 'Quotidiano'] },
      { food: 'Latticini', freqs: ['Mai', '1×/mese', '1×/sett', '3–5×/sett', 'Quotidiano'] },
      { food: 'Dolci e snack', freqs: ['Mai', '1×/mese', '1×/sett', '2–3×/sett', 'Quotidiano'] },
      { food: 'Bevande zuccherate', freqs: ['Mai', '1×/mese', '1×/sett', '3–5×/sett', 'Quotidiano'] },
      { food: 'Alcol', freqs: ['Mai', '1×/mese', '1×/sett', '2–3×/sett', 'Quotidiano'] },
    ],
  },
  {
    id: 'predimed',
    name: 'PREDIMED — Aderenza alla dieta mediterranea',
    desc: 'Valuta il grado di aderenza alla dieta mediterranea. Punteggio 0–14.',
    items: [
      { q: 'Usa olio d\'oliva come principale grasso da cucina?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Quante porzioni di olio d\'oliva consuma al giorno (es. 1 cucchiaio = 1 porzione)? ≥ 4?', options: [{ label: 'Sì (≥ 4)', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma ≥ 2 porzioni di verdura al giorno (1+ cruda)?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma ≥ 3 porzioni di frutta al giorno?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma < 1 porzione di carni rosse/trasformate al giorno?', options: [{ label: 'Sì (< 1)', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma ≥ 7 tazze di vino a settimana (facoltativo)?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma ≥ 3 porzioni di legumi a settimana?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma ≥ 3 porzioni di pesce/frutti di mare a settimana?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma < 2 volte a settimana prodotti di pasticceria commerciale?', options: [{ label: 'Sì (< 2)', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma ≥ 3 porzioni di frutta secca a settimana?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Preferisce pollo o pesce alla carne rossa?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
      { q: 'Consuma ≥ 2 volte a settimana salse a base di pomodoro (soffritto)?', options: [{ label: 'Sì', score: 1 }, { label: 'No', score: 0 }] },
    ],
  },
];

export default function Questionari() {
  const [activeQ, setActiveQ] = useState('ffq');
  const [answers, setAnswers] = useState({});

  const questionnaire = QUESTIONNAIRES.find(q => q.id === activeQ);
  const setAnswer = (key, val) => setAnswers(prev => ({ ...prev, [`${activeQ}-${key}`]: val }));
  const getAnswer = (key) => answers[`${activeQ}-${key}`] || '';

  const predimed = QUESTIONNAIRES.find(q => q.id === 'predimed');
  const predimedScore = predimed?.items.reduce((s, item, i) => {
    const ans = answers[`predimed-${i}`];
    const opt = item.options?.find(o => o.label === ans);
    return s + (opt?.score || 0);
  }, 0) || 0;

  const predimedClass = predimedScore >= 10 ? { label: 'Alta aderenza', color: 'bg-green-100 text-green-800' }
    : predimedScore >= 7 ? { label: 'Aderenza media', color: 'bg-yellow-100 text-yellow-800' }
    : { label: 'Bassa aderenza', color: 'bg-red-100 text-red-800' };

  const ffqAnswered = QUESTIONNAIRES[0].items.filter((_, i) => answers[`ffq-${i}`]).length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <ClipboardCheck size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Questionari</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Questionari Nutrizionali</h1>
          <p className="text-teal-100 text-sm mt-0.5">FFQ, PREDIMED e altri strumenti di valutazione dell'alimentazione</p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2 mb-4">
          {QUESTIONNAIRES.map(q => (
            <button key={q.id} onClick={() => setActiveQ(q.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${activeQ === q.id ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'}`}>
              {q.name.split(' — ')[0]}
            </button>
          ))}
        </div>

        {questionnaire && (
          <div className={CARD}>
            <div className="mb-3">
              <h2 className="font-bold text-gray-800">{questionnaire.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{questionnaire.desc}</p>
            </div>

            {/* FFQ */}
            {activeQ === 'ffq' && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-3 py-2 font-medium text-gray-600 w-40">Alimento</th>
                        {questionnaire.items[0].freqs.map(f => <th key={f} className="text-center px-2 py-2 font-medium text-gray-600">{f}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {questionnaire.items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-700">{item.food}</td>
                          {item.freqs.map(freq => (
                            <td key={freq} className="px-2 py-2 text-center">
                              <input type="radio" name={`ffq-${i}`} value={freq}
                                checked={getAnswer(i) === freq}
                                onChange={() => setAnswer(i, freq)}
                                className="accent-teal-600" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Completamento: {ffqAnswered}/{questionnaire.items.length} domande
                </div>
              </>
            )}

            {/* PREDIMED */}
            {activeQ === 'predimed' && (
              <>
                <div className="space-y-3">
                  {questionnaire.items.map((item, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700 mb-2">{i + 1}. {item.q}</p>
                      <div className="flex gap-3">
                        {item.options.map(opt => (
                          <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name={`predimed-${i}`} value={opt.label}
                              checked={getAnswer(i) === opt.label}
                              onChange={() => setAnswer(i, opt.label)}
                              className="accent-teal-600" />
                            <span className="text-sm text-gray-600">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Punteggio PREDIMED: {predimedScore}/14</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${predimedClass.color}`}>{predimedClass.label}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
