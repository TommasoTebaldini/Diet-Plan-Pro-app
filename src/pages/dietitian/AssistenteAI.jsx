import { useState, useRef, useEffect } from 'react';
import { Bot, Send } from 'lucide-react';

const HEADER_BG = { background: 'linear-gradient(135deg,#0F766E,#0C5F58)' };
const CARD = 'bg-white rounded-xl border border-gray-200 p-5 mb-4';

const QUICK_QUESTIONS = [
  'Calcola fabbisogno calorico per un uomo 70 kg, 35 anni, attività moderata',
  'Suggerisci un piano alimentare settimanale per perdere peso',
  'Analizza una dieta mediterranea tipo',
  'Qual è il fabbisogno proteico per un anziano di 75 anni?',
  'Come impostare una dieta per celiachia?',
];

const DEMO_RESPONSES = {
  'Calcola fabbisogno calorico per un uomo 70 kg, 35 anni, attività moderata':
    `**Calcolo fabbisogno calorico**\n\nUsando la formula di Mifflin-St Jeor:\n• BMR = 10 × 70 + 6.25 × 175 - 5 × 35 + 5 = **1,617 kcal/die**\n• Con attività moderata (×1.55): **~2,506 kcal/die**\n\nUsando Harris-Benedict:\n• BMR = 88.36 + 13.4 × 70 + 4.8 × 175 - 5.68 × 35 = **1,724 kcal/die**\n• Con attività moderata (×1.55): **~2,672 kcal/die**\n\n📌 **Stima media: 2,500–2,700 kcal/die**\n\nDistribuzione macronutrienti suggerita:\n• Proteine: 105–140 g (1.5–2 g/kg)\n• Carboidrati: 313–375 g (50–60% EN)\n• Grassi: 70–90 g (25–35% EN)`,
  'Suggerisci un piano alimentare settimanale per perdere peso':
    `**Piano alimentare per perdita di peso (deficit 500 kcal)**\n\n**Colazione (tutti i giorni):**\nYogurt greco 0% + 30g fiocchi avena + frutti di bosco + 1 caffè\n\n**Pranzo rotazione settimanale:**\n• Lun/Gio: Pasta integrale 70g + verdure grigliate + 100g petto di pollo\n• Mar/Ven: Insalata mista + 150g tonno al naturale + 30g pane integrale\n• Mer/Sab: Minestrone di legumi + 1 uovo sodo + frutta\n• Dom: Riso basmati + 150g pesce al vapore + verdure\n\n**Cena:**\nProteine magre (150g) + verdure abbondanti + fonte di grassi sani\n\n**Spuntini:**\n• Mattina: 1 frutto\n• Pomeriggio: 30g frutta secca\n\n⚠️ Questo è un esempio indicativo. La prescrizione dietetica richiede valutazione individuale.`,
  default:
    `**Risposta assistente AI nutrizionale**\n\nGrazie per la domanda. Come assistente AI di supporto, posso fornire informazioni generali di nutrizione clinica.\n\nPer una risposta precisa, considera di:\n1. Usare i calcolatori nelle sezioni specifiche (Valutazione Paziente, BIA, Gestione Diabete)\n2. Consultare le Linee Guida LARN per i valori di riferimento\n3. Personalizzare sempre sulla base della valutazione clinica individuale del paziente\n\n*Ricorda: questa è una demo. In un sistema di produzione, qui si troverebbe un modello LLM addestrato su nutrizione clinica.*`,
};

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-bold text-gray-800 mb-1">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith('• ')) {
      return <li key={i} className="ml-4 text-sm text-gray-700">{line.slice(2)}</li>;
    }
    if (line.startsWith('*') && line.endsWith('*')) {
      return <p key={i} className="text-xs text-gray-400 italic mt-2">{line.slice(1, -1)}</p>;
    }
    if (line.trim() === '') return <div key={i} className="h-1" />;
    return <p key={i} className="text-sm text-gray-700">{line}</p>;
  });
}

export default function AssistenteAI() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Ciao! Sono il tuo assistente nutrizionale AI. Posso aiutarti con calcoli nutrizionali, informazioni sulle linee guida e supporto alla prescrizione dietetica. Come posso aiutarti?', ts: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg, ts: new Date() }]);
    setIsTyping(true);
    setTimeout(() => {
      const response = DEMO_RESPONSES[msg] || DEMO_RESPONSES.default;
      setMessages(prev => [...prev, { role: 'assistant', text: response, ts: new Date() }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <Bot size={18} className="text-teal-600" />
        <span className="font-semibold text-gray-800">Assistente AI Nutrizionale</span>
        <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Demo</span>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header card */}
        <div className="px-4 pt-4 pb-0">
          <div className="rounded-xl mb-4 p-5" style={HEADER_BG}>
            <div className="flex items-start gap-4">
              <span className="text-5xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🤖</span>
              <div>
                <h1 className="text-white font-bold text-lg">Assistente AI Nutrizionale</h1>
                <p className="text-teal-100 text-sm mt-0.5">Supporto clinico basato su linee guida nutrizionali. Demo — non per uso diagnostico.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick questions */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs bg-white border border-teal-200 text-teal-700 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors truncate max-w-xs">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-2xl px-4 py-3 ${msg.role === 'user'
                ? 'bg-teal-600 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 rounded-bl-sm shadow-sm'
              }`}>
                {msg.role === 'user'
                  ? <p className="text-sm text-white">{msg.text}</p>
                  : <div className="space-y-0.5">{formatMessage(msg.text)}</div>
                }
                <p className={`text-right text-xs mt-1 ${msg.role === 'user' ? 'text-teal-200' : 'text-gray-300'}`}>
                  {msg.ts.toLocaleTimeString('it', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 pt-2 bg-gray-50 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Scrivi una domanda nutrizionale... (Invio per inviare, Shift+Invio per andare a capo)"
              rows={2}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none bg-white"
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || isTyping}
              className="p-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl transition-colors flex-shrink-0">
              <Send size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            ⚠️ Demo — Le risposte sono esemplificative e non sostituiscono la valutazione clinica professionale
          </p>
        </div>
      </div>
    </div>
  );
}
