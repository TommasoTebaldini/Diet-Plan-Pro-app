import { useState } from 'react';
import { Pill, Search } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const CATEGORIES = ['Tutti', 'Vitamine', 'Minerali', 'Proteine', 'Omega-3', 'Probiotici', 'Fitoterapici', 'Altro'];

const SUPPLEMENTS = [
  { id: 1, name: 'Vitamina D3 (colecalciferolo)', category: 'Vitamine', dosage: '1000–4000 UI/die', indications: 'Deficit documentato (25-OH-VitD < 30 ng/mL), osteoporosi, anziani, limitata esposizione solare', contraindications: 'Ipercalcemia, sarcoidosi, intossicazione da vitamina D', notes: 'Assumere con un pasto grasso per ottimizzare l\'assorbimento. Monitorare calcemia se dosi elevate.' },
  { id: 2, name: 'Vitamina B12 (cianocobalamina/metilcobalamina)', category: 'Vitamine', dosage: '1000 μg/die (orale) o 1000 μg/sett (IM)', indications: 'Carenza documentata, dieta vegana/vegetariana, gastropatia atrofica, metformina > 3 anni', contraindications: 'Rara: allergia al cobalto', notes: 'Forma metilcobalamina preferita nei deficit neurologici. Orale ad alte dosi efficace come parenterale.' },
  { id: 3, name: 'Acido folico (folati)', category: 'Vitamine', dosage: '400 μg/die (prevenzione); 5 mg/die (terapeutica)', indications: 'Gravidanza (pre-concezionale e I trimestre), anemia megaloblastica, methotrexate', contraindications: 'Non usare ad alte dosi senza escludere deficit di B12', notes: 'Iniziare almeno 1 mese prima del concepimento. Continuare per tutta la gravidanza.' },
  { id: 4, name: 'Ferro (solfato ferroso)', category: 'Minerali', dosage: '80–200 mg Fe elementare/die', indications: 'Anemia sideropenica documentata (Hb < 12 g/dL F, < 13 g/dL M + ferritina bassa)', contraindications: 'Emocromatosi, talassemia, infiammazione acuta (blocco ferroportina)', notes: 'Assumere a stomaco vuoto con vitamina C. Può causare stipsi, nausea. Colorazione feci nere normale.' },
  { id: 5, name: 'Calcio carbonato/citrato', category: 'Minerali', dosage: '500–1000 mg/die (in dosi frazionate)', indications: 'Osteoporosi, ipocalcemia, dieta povera di latticini', contraindications: 'Ipercalcemia, calcolosi renale (ossalato), insufficienza renale grave', notes: 'Carbonato richiede acidità gastrica (assumere ai pasti). Citrato meglio tollerato e assorbito.' },
  { id: 6, name: 'Magnesio (citrato/glicerofosfato)', category: 'Minerali', dosage: '300–400 mg/die', indications: 'Crampi muscolari, emicrania, ansia, insonnia, diabete tipo 2', contraindications: 'Insufficienza renale grave (eGFR < 30)', notes: 'Glicerofosfato meglio tollerato a livello intestinale. Citrato può avere effetto lassativo.' },
  { id: 7, name: 'Zinco (gluconato/bisglicinato)', category: 'Minerali', dosage: '15–30 mg/die', indications: 'Deficit da dieta vegana, malassorbimento, guarigione ferite ritardata, acne', contraindications: 'Non assumere con rame a lungo termine (competizione)', notes: 'Supplementare rame (2 mg/die) se zinco > 40 mg/die per oltre 3 mesi.' },
  { id: 8, name: 'Omega-3 (EPA+DHA)', category: 'Omega-3', dosage: '1–4 g/die EPA+DHA', indications: 'Ipertrigliceridemia (>2 g/die), rischio cardiovascolare, infiammazione', contraindications: 'Anticoagulanti (attenzione a dosi > 3 g), chirurgia imminente', notes: 'REDUCE-IT: 4 g EPA/die riduce CV in ipertrigliceridemia. Assumere ai pasti per ridurre il riflusso.' },
  { id: 9, name: 'Whey protein (proteine siero del latte)', category: 'Proteine', dosage: '20–40 g/dose (post-workout)', indications: 'Insufficiente apporto proteico, sarcopenia, recovery atletico, anziani', contraindications: 'Allergia al latte, insufficienza renale grave (senza indicazione), fenilchetonuria', notes: 'Concentrato contiene lattosio: usare isolato in caso di intolleranza. Biodisponibilità elevata.' },
  { id: 10, name: 'Vitamina C (acido ascorbico)', category: 'Vitamine', dosage: '500–1000 mg/die', indications: 'Scorbuto, supporto immunitario, aumento assorbimento ferro non-eme', contraindications: 'Calcolosi renale da ossalati (dosi > 1g/die), emocromatosi', notes: 'Antiossidante idrosolubile. Utile da assumere insieme al ferro. Dosi > 2g possono causare diarrea.' },
  { id: 11, name: 'Vitamina E (tocoferolo)', category: 'Vitamine', dosage: '100–400 UI/die', indications: 'Deficit da malassorbimento lipidico (colestasi, celiachia), steatoepatite non alcolica', contraindications: 'Anticoagulanti (aumenta rischio emorragico ad alte dosi), prochirurgia', notes: 'Assumere con un pasto grasso. Dosi > 400 UI/die non raccomandate in prevenzione primaria (HOPE).' },
  { id: 12, name: 'Probiotici (Lactobacillus / Bifidobacterium)', category: 'Probiotici', dosage: '1–10 miliardi UFC/die (ceppo-specifico)', indications: 'IBS, diarrea da antibiotici, sindromi disbiosi, pouchite', contraindications: 'Immunodepressione grave, endocardite batterica recente', notes: 'Efficacia ceppo-specifica. Conservare in frigorifero se indicato. Assumere distante dagli antibiotici.' },
  { id: 13, name: 'Creatina monoidrato', category: 'Proteine', dosage: '3–5 g/die (mantenimento)', indications: 'Miglioramento performance in sport di potenza, sarcopenia negli anziani', contraindications: 'Malattia renale cronica (usare con cautela), disidratazione', notes: 'Loading: 20 g/die × 5 giorni, poi 3–5 g/die mantenimento. Aumentare idratazione. Sicura a lungo termine.' },
  { id: 14, name: 'Vitamina K2 (MK-7)', category: 'Vitamine', dosage: '90–180 μg/die', indications: 'Osteoporosi (combinata con D3 + calcio), calcificazioni vascolari, anticoagulati (con cautela)', contraindications: 'Warfarin (altera INR — consultare medico)', notes: 'Attiva le proteine ossee (osteocalcina) e inibisce le calcificazioni vascolari (MGP). Liposolubile.' },
  { id: 15, name: 'Iodio', category: 'Minerali', dosage: '150–300 μg/die', indications: 'Deficit da dieta vegana, gravidanza/allattamento, ipotiroidismo carenziale', contraindications: 'Ipertiroidismo, tiroidite di Hashimoto (cautela)', notes: 'Il sale iodato (1 g = 30 μg iodio) copre parzialmente il fabbisogno. Supplementare in gravidanza.' },
];

export default function Integratori() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tutti');
  const [expanded, setExpanded] = useState(null);

  const filtered = SUPPLEMENTS.filter(s =>
    (category === 'Tutti' || s.category === category) &&
    (!search.trim() || s.name.toLowerCase().includes(search.toLowerCase()) || s.indications.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Pill size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Integratori e AFMS</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Integratori e Alimenti a Fini Medici Speciali</h1>
          <p className="text-teal-100 text-sm mt-0.5">Dosaggi, indicazioni e controindicazioni degli integratori nutrizionali principali</p>
        </div>

        {/* Search + filter */}
        <div className={CARD}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cerca integratore, indicazione..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${category === cat ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">{filtered.length} integratori</div>
        </div>

        {/* Supplement cards */}
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="w-full flex items-start justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">{s.name}</span>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{s.category}</span>
                  </div>
                  <div className="text-xs text-gray-500">Dose: <span className="font-medium text-gray-700">{s.dosage}</span></div>
                </div>
                <span className="text-gray-400 text-lg flex-shrink-0">{expanded === s.id ? '−' : '+'}</span>
              </button>

              {expanded === s.id && (
                <div className="px-4 pb-4 space-y-2 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-2.5">
                      <div className="text-xs font-semibold text-green-700 mb-1">✅ Indicazioni</div>
                      <p className="text-xs text-gray-700">{s.indications}</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                      <div className="text-xs font-semibold text-red-600 mb-1">⚠ Controindicazioni</div>
                      <p className="text-xs text-gray-700">{s.contraindications}</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                      <div className="text-xs font-semibold text-blue-700 mb-1">📝 Note pratiche</div>
                      <p className="text-xs text-gray-700">{s.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <Pill size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nessun integratore trovato</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
