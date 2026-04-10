import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Search } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const GUIDELINES = [
  {
    category: 'Macronutrienti',
    items: [
      { title: 'Proteine (LARN 2014)', content: 'Adulti: 0.9 g/kg/die. Anziani (>65 anni): 1.1 g/kg/die. Gravidanza: +17 g/die I trim., +21 g/die II, +22 g/die III. Allattamento: +19 g/die. Atleti: 1.2–2.0 g/kg/die.' },
      { title: 'Lipidi totali', content: 'Adulti: 20–35% dell\'energia totale. Acidi grassi saturi: < 10% EN. Acidi grassi polinsaturi omega-6: 4–8% EN. Omega-3 (ALA): 0.5% EN. EPA+DHA: 250 mg/die.' },
      { title: 'Carboidrati', content: 'Adulti: 45–60% dell\'energia totale. Zuccheri aggiunti: < 15% EN (meglio < 10%). Fibre: 25–30 g/die (bambini: 8.4 + età in anni g/die).' },
      { title: 'Fibra alimentare', content: 'Adulti: 25 g/die (F), 30 g/die (M). Bambini: ETà (anni) + 5 g/die secondo formula AAP. Funzione: riduce il rischio CV, migliora la glicemia postprandiale, effetto prebiotico.' },
    ],
  },
  {
    category: 'Micronutrienti chiave',
    items: [
      { title: 'Vitamina D', content: 'RDA: 15 μg/die (600 UI) adulti. Anziani >70a: 20 μg/die (800 UI). Neonati: 10 μg/die. Intossicazione: > 100 μg/die. Fonti: pesce grasso, uova, sole, alimenti arricchiti.' },
      { title: 'Calcio', content: 'Adulti: 1000 mg/die. Donne post-menopausa/anziani: 1200 mg/die. Adolescenti (11–17a): 1200 mg/die. Fonti: latte, formaggi, verdure a foglia, legumi, acque calciche.' },
      { title: 'Ferro', content: 'Uomini: 10 mg/die. Donne fertili: 18 mg/die. Gravidanza: 27 mg/die. Ferro eme (carne): biodisponibilità 15–35%. Ferro non-eme (vegetale): 2–20%, migliorato da vitamina C.' },
      { title: 'Folati (B9)', content: 'Adulti: 400 μg DFE/die. Gravidanza (pre-concezionale): 600 μg/die (400 μg da integratori). Allattamento: 500 μg/die. Fonti: verdure a foglia, legumi, cereali integrali, fegato.' },
      { title: 'Sodio', content: 'OMS raccomanda < 2000 mg/die (< 5 g sale/die). LARN: < 2400 mg/die. Ipertensione: < 1500 mg/die (DASH). Fonti principali: pane, formaggi, salumi, piatti pronti, salse.' },
      { title: 'Iodio', content: 'Adulti: 150 μg/die. Gravidanza e allattamento: 200–250 μg/die. Sale iodato (30 mg KIO3/kg sale): 5 g sale/die copre ~100 μg. Fonti: pesce, frutti di mare, latte, sale iodato.' },
    ],
  },
  {
    category: 'Linee guida per l\'infanzia',
    items: [
      { title: 'Allattamento', content: 'OMS raccomanda allattamento esclusivo per i primi 6 mesi. Continuare fino a 24 mesi con introduzione di alimenti complementari. Il latte materno copre i fabbisogni eccetto vitamina D (supplementare 400 UI/die).' },
      { title: 'Svezzamento', content: 'Iniziare a 6 mesi con alimenti a basso rischio allergenico. Non ritardare l\'introduzione di alimenti allergizzanti (uova, arachidi, pesce) oltre l\'anno. Evitare miele, sale e zucchero nel primo anno.' },
    ],
  },
  {
    category: 'Diete speciali — riferimenti',
    items: [
      { title: 'Dieta mediterranea', content: 'Abbondante: olio EVO, verdura, frutta, legumi, cereali integrali, pesce. Moderata: latticini, uova, pollame. Occasionale: carne rossa, dolci. Punteggio PREDIMED correlato con riduzione rischio CV.' },
      { title: 'Dieta DASH', content: 'Frutti e verdure: 8–10 porzioni/die. Cereali integrali: 6–8. Latticini magri: 2–3. Carni magre: ≤ 2. Frutta secca: 4–5/sett. Sale: < 2300 mg/die. Riduce PAS di 8–14 mmHg.' },
    ],
  },
];

export default function LineeGuida() {
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  const filtered = GUIDELINES.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.content.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <BookOpen size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Linee Guida Nutrizionali</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <div className="flex items-start gap-4">
            <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>📋</span>
            <div>
              <h1 className="text-white font-bold text-lg">Linee Guida Nutrizionali</h1>
              <p className="text-teal-100 text-sm mt-0.5">Riferimenti LARN, OMS, EFSA — accordions ricercabili per categoria</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={CARD}>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cerca linea guida, nutriente, raccomandazione..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
        </div>

        {/* Accordions */}
        {filtered.map(cat => (
          <div key={cat.category} className={CARD}>
            <h2 className="font-semibold text-gray-800 mb-3 text-base border-b border-gray-100 pb-2">{cat.category}</h2>
            <div className="space-y-2">
              {cat.items.map((item, i) => {
                const key = `${cat.category}-${i}`;
                const isOpen = openItems[key];
                return (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="font-medium text-gray-800 text-sm">{item.title}</span>
                      {isOpen ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 bg-teal-50 border-t border-gray-100 text-sm text-gray-700 leading-relaxed">
                        {item.content}
                        <div className="mt-2">
                          <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                            📖 Vedi fonte LARN / OMS →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search size={32} className="mx-auto mb-2 opacity-50" />
            <p>Nessun risultato per "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
