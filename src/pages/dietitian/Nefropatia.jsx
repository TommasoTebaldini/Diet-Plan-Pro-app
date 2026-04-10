import { useState } from 'react';
import { Droplets } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const EGFR_STAGES = [
  { stage: 'G1', egfr: '≥ 90', label: 'Normale/elevata', potassio: '< 3500', fosforo: '700–900', sodio: '< 2300', proteine: '0.8 g/kg', color: 'bg-green-100 text-green-800' },
  { stage: 'G2', egfr: '60–89', label: 'Lievemente ridotta', potassio: '< 3500', fosforo: '700–900', sodio: '< 2000', proteine: '0.8 g/kg', color: 'bg-lime-100 text-lime-800' },
  { stage: 'G3a', egfr: '45–59', label: 'Riduzione lieve-moderata', potassio: '< 3000', fosforo: '600–800', sodio: '< 1800', proteine: '0.6–0.8 g/kg', color: 'bg-yellow-100 text-yellow-800' },
  { stage: 'G3b', egfr: '30–44', label: 'Riduzione moderata-grave', potassio: '< 2500', fosforo: '< 700', sodio: '< 1500', proteine: '0.6 g/kg', color: 'bg-orange-100 text-orange-800' },
  { stage: 'G4', egfr: '15–29', label: 'Riduzione grave', potassio: '< 2000', fosforo: '< 600', sodio: '< 1200', proteine: '0.6 g/kg', color: 'bg-red-100 text-red-800' },
  { stage: 'G5', egfr: '< 15', label: 'Insufficienza renale', potassio: '< 1500', fosforo: '< 500', sodio: '< 1000', proteine: '≥ 1.2 g/kg (dialisi)', color: 'bg-red-200 text-red-900' },
];

const FOOD_LISTS = {
  potassio: {
    limitati: ['Patate, pomodori, spinaci, bietole', 'Banane, kiwi, albicocche, prugne', 'Frutta secca, legumi'],
    consentiti: ['Riso, pasta, pane (senza sale)', 'Cavoli, insalata, cetrioli (lessati)', 'Mele, pere, fragole'],
  },
  fosforo: {
    limitati: ['Formaggi stagionati, latte intero', 'Legumi, noci, semi', 'Cola e bevande fosfatate', 'Sardine, alici'],
    consentiti: ['Albume d\'uovo', 'Riso bianco, pasta', 'Carne e pesce (con moderazione)'],
  },
  sodio: {
    limitati: ['Sale da cucina, dadi, salse', 'Salumi e insaccati', 'Formaggi salati, snack', 'Pane industriale'],
    consentiti: ['Spezie ed erbe aromatiche', 'Olio, aceto, limone', 'Alimenti freschi non trasformati'],
  },
};

export default function Nefropatia() {
  const [selectedStage, setSelectedStage] = useState('G3a');
  const [mineral, setMineral] = useState('potassio');
  const [weight, setWeight] = useState('');
  const [egfrVal, setEgfrVal] = useState('');

  const stage = EGFR_STAGES.find(s => s.stage === selectedStage);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Droplets size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Nefropatia / IRC</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Nefropatia / IRC</h1>
          <p className="text-teal-100 text-sm mt-0.5">Restrizione minerali, stadiazione eGFR e guida alimentare per insufficienza renale cronica</p>
        </div>

        {/* eGFR selector + limits */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Stadiazione eGFR e limiti nutrizionali</h2>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Stadio CKD</label>
              <select value={selectedStage} onChange={e => setSelectedStage(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300">
                {EGFR_STAGES.map(s => <option key={s.stage} value={s.stage}>{s.stage} — {s.label} (eGFR {s.egfr} mL/min)</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">eGFR misurato (mL/min)</label>
              <input type="number" value={egfrVal} onChange={e => setEgfrVal(e.target.value)} placeholder="es. 35"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Peso (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="es. 70"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
          </div>

          {stage && (
            <div className={`rounded-lg p-4 ${stage.color} mb-3`}>
              <div className="font-bold text-sm mb-2">Stadio {stage.stage} — {stage.label} (eGFR {stage.egfr} mL/min)</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div><div className="font-medium opacity-75">Potassio/die</div><div className="font-bold text-sm">{stage.potassio} mg</div></div>
                <div><div className="font-medium opacity-75">Fosforo/die</div><div className="font-bold text-sm">{stage.fosforo} mg</div></div>
                <div><div className="font-medium opacity-75">Sodio/die</div><div className="font-bold text-sm">{stage.sodio} mg</div></div>
                <div><div className="font-medium opacity-75">Proteine</div><div className="font-bold text-sm">{stage.proteine}{weight ? ` = ${(parseFloat(stage.proteine) * Number(weight)).toFixed(0)} g` : ''}</div></div>
              </div>
            </div>
          )}
        </div>

        {/* eGFR table */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Tabella stadi CKD</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Stadio</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">eGFR (mL/min)</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Descrizione</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">K (mg/die)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">P (mg/die)</th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600">Na (mg/die)</th>
                </tr>
              </thead>
              <tbody>
                {EGFR_STAGES.map(s => (
                  <tr key={s.stage} className={`border-b border-gray-100 cursor-pointer ${selectedStage === s.stage ? 'ring-2 ring-inset ring-teal-400' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelectedStage(s.stage)}>
                    <td className="px-3 py-1.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.stage}</span></td>
                    <td className="px-3 py-1.5 font-medium">{s.egfr}</td>
                    <td className="px-3 py-1.5 text-gray-600">{s.label}</td>
                    <td className="px-3 py-1.5 text-center">{s.potassio}</td>
                    <td className="px-3 py-1.5 text-center">{s.fosforo}</td>
                    <td className="px-3 py-1.5 text-center">{s.sodio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Food restriction guide */}
        <div className={CARD}>
          <h2 className="font-semibold text-gray-800 mb-3">Guida alimenti per minerale</h2>
          <div className="flex gap-2 mb-4">
            {Object.keys(FOOD_LISTS).map(m => (
              <button key={m} onClick={() => setMineral(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${mineral === m ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {m}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-red-600 mb-2">⚠ Limitati / da ridurre</div>
              <ul className="space-y-1">{FOOD_LISTS[mineral].limitati.map((f, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5"><span className="text-orange-400">•</span>{f}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-green-600 mb-2">✅ Consentiti</div>
              <ul className="space-y-1">{FOOD_LISTS[mineral].consentiti.map((f, i) => <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5"><span className="text-green-500">•</span>{f}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
