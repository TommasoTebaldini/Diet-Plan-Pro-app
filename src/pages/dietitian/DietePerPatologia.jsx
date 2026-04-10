import { useState } from 'react';
import { Pill, ChevronDown, ChevronRight } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const PATHOLOGIES = [
  {
    id: 'diabete', name: 'Diabete mellito tipo 2', emoji: '🩸', color: 'bg-red-50 border-red-200',
    macros: 'CHO 45–55% EN, Prot 15–20%, Grassi 25–30%',
    favor: ['Cereali integrali', 'Legumi', 'Verdure non amidacee', 'Pesce', 'Olio EVO', 'Frutta (moderata)'],
    avoid: ['Zuccheri semplici aggiunti', 'Bevande zuccherate', 'Dolci e snack processati', 'Grassi saturi in eccesso'],
    keyNutrients: 'Fibre (25–30 g/die), Omega-3, Cromo, Magnesio',
    note: 'Privilegiare alimenti a basso indice glicemico. Frazionare i pasti. Limitare alcolici.',
  },
  {
    id: 'celiachia', name: 'Celiachia', emoji: '🌾', color: 'bg-yellow-50 border-yellow-200',
    macros: 'Dieta bilanciata, senza glutine. CHO da fonti senza glutine.',
    favor: ['Riso, mais, miglio, quinoa, grano saraceno', 'Patate', 'Legumi', 'Carne, pesce, uova', 'Latticini naturali', 'Frutta e verdura'],
    avoid: ['Grano, orzo, segale, farro, kamut', 'Pane/pasta/pizza tradizionali', 'Birra di malto', 'Prodotti con contaminazione crociata'],
    keyNutrients: 'Ferro, Calcio, B12, Folati, Fibra (spesso carenti)',
    note: 'Verificare etichette per glutine nascosto. Attenzione alla contaminazione crociata in cucina.',
  },
  {
    id: 'dislipidem', name: 'Dislipidemia', emoji: '💉', color: 'bg-orange-50 border-orange-200',
    macros: 'Grassi < 30% EN, Saturi < 7%, Colesterolo < 200 mg/die',
    favor: ['Olio EVO', 'Pesce grasso (salmone, sgombro)', 'Frutta secca (noci)', 'Avena e crusca', 'Legumi', 'Verdura e frutta'],
    avoid: ['Carni grasse e salumi', 'Formaggi ad alto contenuto lipidico', 'Burro e strutto', 'Fritti', 'Dolci con grassi trans'],
    keyNutrients: 'Omega-3 EPA+DHA, Fibre solubili, Steroli vegetali, Vitamina E',
    note: 'Ridurre i grassi saturi e trans. Aumentare fibre solubili (pectine, beta-glucani).',
  },
  {
    id: 'ipertensione', name: 'Ipertensione arteriosa', emoji: '❤️', color: 'bg-pink-50 border-pink-200',
    macros: 'Dieta DASH: bilanciata, ricca di K, Ca, Mg; Sodio < 2300 mg/die',
    favor: ['Frutta e verdura (8–10 porzioni/die)', 'Cereali integrali', 'Latticini magri', 'Legumi', 'Frutta secca'],
    avoid: ['Sale e alimenti salati', 'Salumi e insaccati', 'Snack e patatine', 'Bevande alcoliche in eccesso', 'Caffeina in eccesso'],
    keyNutrients: 'Potassio (3500 mg/die), Calcio, Magnesio, Omega-3',
    note: 'Approccio DASH dimostra riduzione di 8–14 mmHg PAS. Ridurre l\'alcol.',
  },
  {
    id: 'gerd', name: 'GERD / Reflusso gastroesofageo', emoji: '🔥', color: 'bg-amber-50 border-amber-200',
    macros: 'Dieta normocalorica, pasti piccoli e frequenti',
    favor: ['Cereali integrali', 'Verdure non acide', 'Frutta non citrica', 'Carne magra', 'Pesce', 'Yogurt magro'],
    avoid: ['Pomodori e succhi acidi', 'Agrumi', 'Cioccolato', 'Menta piperita', 'Alcol e caffè', 'Cibi grassi e fritti', 'Spezie piccanti'],
    keyNutrients: 'Fibra alimentare, Omega-3',
    note: 'Evitare di sdraiarsi entro 3h dal pasto. Non indossare indumenti stretti. Elevare la testata del letto.',
  },
  {
    id: 'ibs', name: 'IBS — Sindrome intestino irritabile', emoji: '🫃', color: 'bg-green-50 border-green-200',
    macros: 'Dieta Low-FODMAP nelle fasi acute; poi reintroduzione graduale',
    favor: ['Riso, patate, polenta', 'Carne e pesce magri', 'Uova', 'Lattuga, carote, zucchine', 'Fragole, mirtilli', 'Latte senza lattosio'],
    avoid: ['Legumi in grandi quantità', 'Cipolla, aglio', 'Fruttosio e polialcoli', 'Frumento in grandi dosi', 'Dolcificanti (sorbitolo, mannitolo)'],
    keyNutrients: 'Fibra solubile (psillio), Probiotici (Lactobacillus rhamnosus)',
    note: 'Protocollo Low-FODMAP: fase eliminazione 4–6 settimane, poi reintroduzione sistematica.',
  },
  {
    id: 'obesita', name: 'Obesità', emoji: '⚖️', color: 'bg-indigo-50 border-indigo-200',
    macros: 'Deficit calorico 500–1000 kcal/die, Prot ≥ 1.2 g/kg, CHO 45–55%, Grassi 25–35%',
    favor: ['Verdure abbondanti', 'Proteine magre', 'Cereali integrali', 'Legumi', 'Frutta intera', 'Acqua come bevanda principale'],
    avoid: ['Bevande caloriche (succhi, alcolici)', 'Snack ultra-processati', 'Dolci e dessert', 'Porzioni eccessive di cereali raffinati'],
    keyNutrients: 'Fibra, Vitamina D, Omega-3',
    note: 'Obiettivo: -0.5–1 kg/settimana. Combinare con attività fisica (150 min/sett moderata). Monitoring comportamentale.',
  },
  {
    id: 'irc', name: 'Insufficienza renale cronica', emoji: '🫘', color: 'bg-blue-50 border-blue-200',
    macros: 'Proteine 0.6–0.8 g/kg (no dialisi), > 1.2 g/kg (dialisi); K, P, Na limitati',
    favor: ['Riso e pasta bianchi (non integrali)', 'Albume d\'uovo', 'Verdure a basso contenuto di potassio', 'Frutta (mela, pera, fragole)'],
    avoid: ['Alimenti ricchi di potassio (patate, banane)', 'Fosforo (latticini, legumi, cola)', 'Sale e alimenti salati', 'Proteine in eccesso'],
    keyNutrients: 'Controllo di K, P, Na; supplementazione vitaminica selettiva',
    note: 'Vedi sezione Nefropatia/IRC per calcolatori specifici. Adattare in base allo stadio eGFR.',
  },
];

export default function DietePerPatologia() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Pill size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Diete per Patologia</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
          <h1 className="text-white font-bold text-lg">Diete per Patologia</h1>
          <p className="text-teal-100 text-sm mt-0.5">Schede di riferimento rapido per le principali patologie nutrizionali</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PATHOLOGIES.map(p => (
            <div key={p.id} className={`border rounded-xl overflow-hidden ${p.color}`}>
              <button
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:opacity-90 transition-opacity text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.emoji}</span>
                  <span className="font-semibold text-gray-800 text-sm">{p.name}</span>
                </div>
                {expanded === p.id
                  ? <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
                  : <ChevronRight size={16} className="text-gray-500 flex-shrink-0" />
                }
              </button>

              {expanded === p.id && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-600 mb-1">📊 Obiettivi macronutrienti</div>
                    <p className="text-xs text-gray-700">{p.macros}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-xs font-semibold text-green-700 mb-1">✅ Da privilegiare</div>
                      <ul className="space-y-0.5">{p.favor.map((f, i) => <li key={i} className="text-xs text-gray-700">• {f}</li>)}</ul>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <div className="text-xs font-semibold text-red-600 mb-1">❌ Da limitare/evitare</div>
                      <ul className="space-y-0.5">{p.avoid.map((f, i) => <li key={i} className="text-xs text-gray-700">• {f}</li>)}</ul>
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="text-xs font-semibold text-teal-700 mb-1">💊 Nutrienti chiave</div>
                    <p className="text-xs text-gray-700">{p.keyNutrients}</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-600 mb-1">📝 Note cliniche</div>
                    <p className="text-xs text-gray-700 italic">{p.note}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
