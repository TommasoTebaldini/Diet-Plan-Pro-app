import { useState } from 'react';
import { Microscope, Star, Search } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const CATEGORIES = ['Tutti', 'Diabete', 'Obesità', 'Cardiovascolare', 'Cancro', 'Microbiota', 'Sarcopenia', 'Dieta mediterranea'];

const STUDIES = [
  { id: 1, title: 'PREDIMED: Prevención con Dieta Mediterránea', authors: 'Estruch R, et al.', journal: 'N Engl J Med', year: 2013, category: 'Cardiovascolare', summary: 'La dieta mediterranea supplementata con olio EVO o noci riduce il rischio di eventi cardiovascolari maggiori del 30% rispetto a una dieta ipograssa in soggetti ad alto rischio cardiovascolare.', impact: 'Altissimo', doi: '10.1056/NEJMoa1200303' },
  { id: 2, title: 'Look AHEAD: Effetti dell\'intervento intensivo sullo stile di vita sul peso e la comorbidità del T2D', authors: 'Wing RR, et al.', journal: 'N Engl J Med', year: 2013, category: 'Diabete', summary: 'L\'intervento intensivo sullo stile di vita (dieta + esercizio) in pazienti obesi con T2D ha prodotto una perdita di peso significativa ma non ha ridotto gli eventi cardiovascolari rispetto al controllo.', impact: 'Alto', doi: '10.1056/NEJMoa1212914' },
  { id: 3, title: 'Microbiota intestinale e obesità: una revisione sistematica', authors: 'Cani PD, et al.', journal: 'Cell Metabolism', year: 2019, category: 'Microbiota', summary: 'Il microbiota intestinale svolge un ruolo chiave nella regolazione del metabolismo energetico e nell\'insorgenza dell\'obesità attraverso vari meccanismi, inclusa la produzione di SCFA e LPS.', impact: 'Alto', doi: '10.1016/j.cmet.2019.01.004' },
  { id: 4, title: 'Dieta chetogenica nel diabete tipo 2: RCT a 12 mesi', authors: 'Hallberg SJ, et al.', journal: 'Diabetes Therapy', year: 2018, category: 'Diabete', summary: 'Il 60% dei partecipanti alla dieta chetogenica ha raggiunto la remissione del diabete a 12 mesi vs il 2% nel gruppo controllo. Riduzione media dell\'HbA1c da 7.6% a 6.3%.', impact: 'Alto', doi: '10.1007/s13300-018-0373-9' },
  { id: 5, title: 'WCRF/AICR: dieta, nutrizione, attività fisica e cancro', authors: 'World Cancer Research Fund', journal: 'WCRF Int Report', year: 2018, category: 'Cancro', summary: 'Raccomandazioni basate sull\'evidenza: limitare il consumo di carni processate, alcol, alimenti ultra-processati; aumentere frutta, verdura, cereali integrali e attività fisica per prevenire il cancro.', impact: 'Altissimo', doi: 'wcrf.org' },
  { id: 6, title: 'Restrizione proteica e progressione della nefropatia cronica', authors: 'Kalantar-Zadeh K, et al.', journal: 'J Am Soc Nephrol', year: 2017, category: 'Cardiovascolare', summary: 'La restrizione proteica a 0.6-0.8 g/kg/die rallenta la progressione della CKD e riduce la necessità di dialisi. La dieta a basso contenuto proteico rimane una strategia nutrizionale fondamentale nella CKD.', impact: 'Alto', doi: '10.1681/ASN.2017030374' },
  { id: 7, title: 'Supplementazione di vitamina D e mortalità cardiovascolare: meta-analisi', authors: 'Barbarawi M, et al.', journal: 'JAMA Cardiology', year: 2019, category: 'Cardiovascolare', summary: 'La supplementazione di vitamina D non ha ridotto significativamente gli eventi cardiovascolari maggiori, ma ha mostrato benefici in sottogruppi carenti. L\'evidenza sulla mortalità è ancora inconcludente.', impact: 'Alto', doi: '10.1001/jamacardio.2019.1870' },
  { id: 8, title: 'Dieta iperproteica e composizione corporea negli anziani: sarcopenia', authors: 'Bauer J, et al.', journal: 'J Am Med Dir Assoc', year: 2013, category: 'Sarcopenia', summary: 'Un apporto proteico di 1.0-1.2 g/kg/die è raccomandato negli anziani sani, e 1.2-1.5 g/kg/die in quelli con patologie per preservare la massa muscolare e prevenire la sarcopenia.', impact: 'Alto', doi: '10.1016/j.jamda.2013.05.021' },
  { id: 9, title: 'Ultra-processed food consumption and risk of overweight: PURE study', authors: 'Louzada ML, et al.', journal: 'Public Health Nutrition', year: 2015, category: 'Obesità', summary: 'Il consumo di alimenti ultra-processati (classificazione NOVA) è associato a un maggiore rischio di sovrappeso e obesità indipendentemente dal contenuto calorico totale.', impact: 'Alto', doi: '10.1017/S1368980015002165' },
  { id: 10, title: 'Omega-3 e riduzione dei trigliceridi: revisione sistematica e meta-analisi', authors: 'Bernasconi AA, et al.', journal: 'Mayo Clin Proc', year: 2021, category: 'Cardiovascolare', summary: 'EPA e DHA ad alte dosi (≥ 2g/die) riducono significativamente i trigliceridi plasmatici (−25–30%) e gli eventi cardiovascolari in soggetti ad alto rischio (REDUCE-IT, STRENGTH).', impact: 'Alto', doi: '10.1016/j.mayocp.2020.12.029' },
  { id: 11, title: 'Digiuno intermittente vs restrizione calorica: RCT 12 mesi', authors: 'Lowe DA, et al.', journal: 'JAMA Internal Medicine', year: 2020, category: 'Obesità', summary: 'Il digiuno intermittente (16:8) non ha mostrato vantaggi significativi rispetto alla restrizione calorica continua per la perdita di peso. Entrambi gli approcci efficaci a 12 mesi.', impact: 'Alto', doi: '10.1001/jamainternmed.2020.4153' },
  { id: 12, title: 'Probiotici e sindrome metabolica: trial randomizzato', authors: 'Gonai M, et al.', journal: 'Nutrients', year: 2018, category: 'Microbiota', summary: 'La supplementazione con Lactobacillus gasseri BNR17 ha ridotto il peso corporeo, il girovita e i livelli di glucosio a digiuno in soggetti con sovrappeso e sindrome metabolica.', impact: 'Medio', doi: '10.3390/nu10040394' },
  { id: 13, title: 'DASH diet and blood pressure: DASH Collaborative Research Group', authors: 'Appel LJ, et al.', journal: 'N Engl J Med', year: 1997, category: 'Cardiovascolare', summary: 'La dieta DASH ha ridotto la pressione sistolica di 11.4 mmHg e la diastolica di 5.5 mmHg in soggetti ipertesi rispetto alla dieta controllo. Risultati confermati in RCT multipli.', impact: 'Altissimo', doi: '10.1056/NEJM199704173361601' },
  { id: 14, title: 'Dieta mediterranea e declino cognitivo: studio longitudinale', authors: 'Scarmeas N, et al.', journal: 'Annals of Neurology', year: 2006, category: 'Dieta mediterranea', summary: 'Un\'alta aderenza alla dieta mediterranea è associata a riduzione del rischio di malattia di Alzheimer del 40% e a progressione più lenta del declino cognitivo nell\'arco di 7 anni di follow-up.', impact: 'Alto', doi: '10.1002/ana.20731' },
  { id: 15, title: 'Celiachia e dieta gluten-free: rischi nutrizionali', authors: 'Saturni L, et al.', journal: 'Nutrients', year: 2010, category: 'Cancro', summary: 'La dieta priva di glutine, se non pianificata adeguatamente, porta a carenze di ferro, calcio, zinco, magnesio, B12 e fibre. Il dietista deve supervisionare attentamente l\'apporto nutrizionale.', impact: 'Medio', doi: '10.3390/nu2010016' },
];

export default function StudiScientifici() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tutti');
  const [favorites, setFavorites] = useState({});

  const toggleFav = (id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  const filtered = STUDIES.filter(s =>
    (category === 'Tutti' || s.category === category) &&
    (!search || s.title.toLowerCase().includes(search.toLowerCase()) || s.authors.toLowerCase().includes(search.toLowerCase()) || s.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Microscope size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Studi Scientifici</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Studi Scientifici</h1>
          <p className="text-teal-100 text-sm mt-0.5">Biblioteca di riferimenti nutrizionali selezionati dalla letteratura scientifica</p>
        </div>

        {/* Search + Filter */}
        <div className={CARD}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Cerca titolo, autori, parole chiave..."
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
          <div className="text-xs text-gray-400 mt-2">{filtered.length} studi trovati</div>
        </div>

        {/* Study cards */}
        <div className="space-y-3">
          {filtered.map(study => (
            <div key={study.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      study.impact === 'Altissimo' ? 'bg-red-100 text-red-700' :
                      study.impact === 'Alto' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>{study.impact} impatto</span>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{study.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-0.5">{study.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{study.authors} · {study.journal} · {study.year}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{study.summary}</p>
                  <div className="mt-2">
                    <span className="text-xs text-teal-600 font-medium">DOI: {study.doi}</span>
                  </div>
                </div>
                <button onClick={() => toggleFav(study.id)} title={favorites[study.id] ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                  className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${favorites[study.id] ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'}`}>
                  <Star size={16} fill={favorites[study.id] ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Microscope size={32} className="mx-auto mb-2 opacity-50" />
              <p>Nessuno studio trovato per "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
