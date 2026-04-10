import { useState } from 'react';
import { BarChart2 } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const NCP_DIAGNOSES = [
  'NI-1.1 – Assunzione energetica aumentata',
  'NI-1.2 – Assunzione energetica ridotta',
  'NI-5.1 – Assunzione proteica inadeguata',
  'NI-5.6 – Assunzione lipidica eccessiva',
  'NI-5.8 – Assunzione di CHO inadeguata',
  'NI-5.10 – Assunzione di fibre inadeguata',
  'NC-2.2 – Cambiamenti ponderali involontari',
  'NC-3.2 – Malnutrizione',
  'NB-1.1 – Conoscenze e credenze alimentari errate',
  'NB-1.3 – Non-aderenza alla raccomandazione nutrizionale',
  'NB-2.1 – Attività fisica eccessiva',
  'NB-2.2 – Inattività fisica',
];

const NCP_INTERVENTIONS = [
  'ND-1.1 – Modifica della dieta generale',
  'ND-1.2 – Dieta specifica (celiachia, renale, diabetica)',
  'ND-2.1 – Formula enterale',
  'ND-2.2 – Nutrizione parenterale',
  'ND-3.1 – Supplementazione vitaminica/minerale',
  'ND-4.1 – Modifica consistenza alimentare',
  'E-1.1 – Educazione nutrizionale individuale',
  'C-1.1 – Colloquio motivazionale',
  'RC-1.1 – Collaborazione con il team multidisciplinare',
  'RC-1.3 – Riferimento ad altro professionista',
];

export default function NCPt() {
  const [assessment, setAssessment] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [etiologia, setEtiologia] = useState('');
  const [segni, setSegni] = useState('');
  const [intervention, setIntervention] = useState('');
  const [interventionNote, setInterventionNote] = useState('');
  const [monitoring, setMonitoring] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [printMode, setPrintMode] = useState(false);

  const diagLabel = diagnosis === '__custom__' ? customDiagnosis : diagnosis;
  const adimeSummary = diagLabel
    ? `PES: ${diagLabel} correlato a ${etiologia || '___'} come evidenziato da ${segni || '___'}`
    : '';

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <BarChart2 size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">NCPt — Nutrition Care Process</span>
        <div className="ml-auto">
          <button onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-teal-700 border border-teal-300 rounded-lg hover:bg-teal-50">
            🖨 Stampa
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">NCPt — Nutrition Care Process</h1>
          <p className="text-teal-100 text-sm mt-0.5">Documentazione ADIME: Assessment, Diagnosi, Intervento, Monitoraggio/Valutazione</p>
        </div>

        {adimeSummary && (
          <div className="bg-teal-50 border border-teal-300 rounded-xl px-4 py-3 mb-4 text-sm">
            <span className="font-semibold text-teal-800">Enunciato PES: </span>
            <span className="text-gray-700">{adimeSummary}</span>
          </div>
        )}

        {/* A – Assessment */}
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">A</span>
            <h2 className="font-semibold text-gray-800">Assessment — Valutazione nutrizionale</h2>
          </div>
          <textarea value={assessment} onChange={e => setAssessment(e.target.value)}
            placeholder="Anamnesi alimentare, dati antropometrici (peso, altezza, BMI), esami di laboratorio, storia clinica, farmaci, fattori funzionali e psicosociali rilevanti..."
            rows={5}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400 resize-none"
          />
        </div>

        {/* D – Diagnosis */}
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">D</span>
            <h2 className="font-semibold text-gray-800">Diagnosi Nutrizionale (PES)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Problema (terminologia NCP)</label>
              <select value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300">
                <option value="">— Seleziona diagnosi —</option>
                {NCP_DIAGNOSES.map(d => <option key={d} value={d}>{d}</option>)}
                <option value="__custom__">Altra (personalizzata)</option>
              </select>
              {diagnosis === '__custom__' && (
                <input value={customDiagnosis} onChange={e => setCustomDiagnosis(e.target.value)}
                  placeholder="Diagnosi personalizzata..."
                  className="mt-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Eziologia (correlato a...)</label>
              <textarea value={etiologia} onChange={e => setEtiologia(e.target.value)}
                placeholder="es. ridotto apporto calorico correlato a perdita di appetito post-chemioterapia..."
                rows={2}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400 resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Segni e sintomi (come evidenziato da...)</label>
              <textarea value={segni} onChange={e => setSegni(e.target.value)}
                placeholder="es. perdita di peso del 5% in 3 mesi, albumina 3.0 g/dL, riduzione introito < 75% fabbisogno..."
                rows={2}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400 resize-none" />
            </div>
          </div>
        </div>

        {/* I – Intervention */}
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">I</span>
            <h2 className="font-semibold text-gray-800">Intervento Nutrizionale</h2>
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">Tipo di intervento (terminologia NCP)</label>
            <select value={intervention} onChange={e => setIntervention(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-teal-300">
              <option value="">— Seleziona intervento —</option>
              {NCP_INTERVENTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <textarea value={interventionNote} onChange={e => setInterventionNote(e.target.value)}
            placeholder="Descrizione dettagliata dell'intervento: obiettivi specifici, piano alimentare prescritto, educazione fornita, materiale consegnato, modifiche comportamentali consigliate..."
            rows={4}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400 resize-none"
          />
        </div>

        {/* M/E – Monitoring & Evaluation */}
        <div className={CARD}>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">M/E</span>
            <h2 className="font-semibold text-gray-800">Monitoraggio ed Valutazione</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Indicatori da monitorare</label>
              <textarea value={monitoring} onChange={e => setMonitoring(e.target.value)}
                placeholder="es. peso corporeo settimanale, esami ematochimici mensili (albumina, proteine totali), revisione diario alimentare..."
                rows={3}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400 resize-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Valutazione degli esiti</label>
              <textarea value={evaluation} onChange={e => setEvaluation(e.target.value)}
                placeholder="Comparare con obiettivi. Descrivere i progressi, le barriere incontrate, eventuali revisioni al piano..."
                rows={3}
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 placeholder-gray-400 resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
