import { useState } from 'react';
import { Activity } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

export default function InsuffPancreatica() {
  const [fatG, setFatG] = useState('');
  const [pertUnits, setPertUnits] = useState('');
  const [note, setNote] = useState('');

  const calcPERT = (fat) => {
    const f = Number(fat);
    if (!f) return null;
    const lipaseMin = Math.round(f * 500);
    const lipaseMax = Math.round(f * 4000);
    return { min: lipaseMin, max: lipaseMax };
  };

  const pert = calcPERT(fatG);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Activity size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Insufficienza Pancreatica Esocrina</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>💊</span>
            <div>
              <h1 className="text-white font-bold text-lg">Insufficienza Pancreatica Esocrina</h1>
              <p className="text-teal-100 text-sm mt-0.5">Calcolo PERT, stima del contenuto lipidico e gestione del malassorbimento</p>
            </div>
          </div>
        </div>

        {/* Info malassorbimento */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-2">Malassorbimento dei grassi — Principi chiave</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {[
              { title: 'Steatocrito', desc: 'Marker di malassorbimento lipidico. Valori > 2% suggeriscono steatorrea significativa.' },
              { title: 'Feci oleose', desc: 'Segnale clinico di steatosi importante. Correlato a insufficienza > 90% della funzione esocrina.' },
              { title: 'Vitamine liposolubili', desc: 'Monitorare A, D, E, K: spesso carenti. Supplementare secondo dosaggi clinici.' },
            ].map(c => (
              <div key={c.title} className="bg-teal-50 rounded-lg p-3">
                <div className="font-semibold text-teal-800 mb-1">{c.title}</div>
                <div className="text-gray-600">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PERT calculator */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Calcolatore PERT (Terapia Enzimatica Sostitutiva)</h2>
          <p className="text-xs text-gray-500 mb-4">
            Dosaggio indicativo: 500–4000 U di lipasi per grammo di grasso ingerito. Il dosaggio deve essere personalizzato clinicamente.
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Grassi totali del pasto (g)</label>
              <input
                type="number" value={fatG} onChange={e => setFatG(e.target.value)}
                placeholder="es. 20"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            {pert && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-sm">
                <span className="text-gray-600">Lipasi: </span>
                <span className="font-bold text-emerald-700">{pert.min.toLocaleString()} – {pert.max.toLocaleString()} U</span>
                <div className="text-xs text-gray-400 mt-0.5">distribuire in capsule durante il pasto</div>
              </div>
            )}
          </div>
        </div>

        {/* Fat content of plan */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Stima lipidi dal piano alimentare</h2>
          <div className="flex items-end gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Unità PERT assunte oggi</label>
              <input
                type="number" value={pertUnits} onChange={e => setPertUnits(e.target.value)}
                placeholder="es. 75000"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="text-xs text-gray-500 pb-2">
              Max raccomandato: <strong>10.000 U lipasi/kg/die</strong> o <strong>4.000 U/g grasso</strong>
            </div>
          </div>
        </div>

        {/* Dietary guidelines */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Linee dietetiche generali</h2>
          <ul className="space-y-1.5 text-sm text-gray-700">
            {[
              'Non restringere eccessivamente i grassi: la dieta ipolipidica non sostituisce la PERT.',
              'Frazionare i pasti in 5–6 assunzioni per ridurre il carico enzimatico per pasto.',
              'Preferire grassi MCT (olio di cocco, margarine MCT) se tollerati.',
              'Assicurare adeguato apporto proteico (1.2–1.5 g/kg/die).',
              'Supplementare vitamina D, E, A, K e controllare i livelli periodicamente.',
              'Monitorare il peso corporeo e i parametri di stato nutrizionale.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-teal-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Notes */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-2">Note paziente specifiche</h2>
          <textarea
            value={note} onChange={e => setNote(e.target.value)}
            placeholder="Annotazioni terapeutiche, preferenze, controindicazioni..."
            rows={4}
            className="w-full text-sm px-3 py-2 border border-dashed border-teal-200 rounded-lg bg-teal-50/30 focus:outline-none focus:ring-1 focus:ring-teal-300 placeholder-gray-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
