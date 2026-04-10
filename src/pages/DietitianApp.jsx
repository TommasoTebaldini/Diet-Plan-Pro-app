import { useState } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  ClipboardList, FolderOpen, Heart, Activity, Dumbbell, Brain,
  Leaf, Droplets, MessageSquare, Baby, UtensilsCrossed,
  BookOpen, UserCheck, BarChart2, Pill, Lightbulb, Zap,
  ClipboardCheck, Microscope, LogOut, Users,
  Bot, Calendar, GraduationCap, Database as DatabaseIcon, ChefHat,
  Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PatientManager from './admin/PatientManager';
import PianoAlimentare from './dietitian/PianoAlimentare';
import ComingSoon from './dietitian/ComingSoon';
import GestioneDiabete from './dietitian/GestioneDiabete';
import InsuffPancreatica from './dietitian/InsuffPancreatica';
import NutrioneSportiva from './dietitian/NutrioneSportiva';
import DCA from './dietitian/DCA';
import DietaChetogenica from './dietitian/DietaChetogenica';
import Nefropatia from './dietitian/Nefropatia';
import Disfagia from './dietitian/Disfagia';
import Pediatria from './dietitian/Pediatria';
import RistorazioneCollettiva from './dietitian/RistorazioneCollettiva';
import LineeGuida from './dietitian/LineeGuida';
import ValutazionePaziente from './dietitian/ValutazionePaziente';
import NCPt from './dietitian/NCPt';
import DietePerPatologia from './dietitian/DietePerPatologia';
import ConsiglioNutrizionali from './dietitian/ConsiglioNutrizionali';
import BIA from './dietitian/BIA';
import Questionari from './dietitian/Questionari';
import StudiScientifici from './dietitian/StudiScientifici';
import AssistenteAI from './dietitian/AssistenteAI';
import Agenda from './dietitian/Agenda';
import CorsiECM from './dietitian/CorsiECM';
import AlimentiCREA from './dietitian/AlimentiCREA';
import Integratori from './dietitian/Integratori';
import Ricette from './dietitian/Ricette';

// ─── Sidebar nav structure ───────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'PIANO',
    items: [
      { to: '/dietitian/piano-alimentare',  icon: ClipboardList,   label: 'Piano Alimentare'   },
      { to: '/dietitian/cartelle-pazienti', icon: FolderOpen,      label: 'Cartelle Pazienti'  },
    ],
  },
  {
    label: 'SPECIALISTICA',
    items: [
      { to: '/dietitian/gestione-diabete',        icon: Heart,          label: 'Gestione Diabete'        },
      { to: '/dietitian/insuff-pancreatica',       icon: Activity,       label: 'Insuff. Pancreatica'     },
      { to: '/dietitian/nutrizione-sportiva',      icon: Dumbbell,       label: 'Nutrizione Sportiva'     },
      { to: '/dietitian/dca',                      icon: Brain,          label: 'DCA'                     },
      { to: '/dietitian/dieta-chetogenica',        icon: Leaf,           label: 'Dieta Chetogenica'       },
      { to: '/dietitian/nefropatia-irc',           icon: Droplets,       label: 'Nefropatia / IRC'        },
      { to: '/dietitian/disfagia',                 icon: MessageSquare,  label: 'Disfagia'                },
      { to: '/dietitian/pediatria',                icon: Baby,           label: 'Pediatria'               },
      { to: '/dietitian/ristorazione-collettiva',  icon: UtensilsCrossed,label: 'Ristorazione Collettiva' },
    ],
  },
  {
    label: 'STRUMENTI',
    items: [
      { to: '/dietitian/linee-guida',           icon: BookOpen,       label: 'Linee Guida'           },
      { to: '/dietitian/valutazione-paziente',  icon: UserCheck,      label: 'Valutazione Paziente'  },
      { to: '/dietitian/ncpt',                  icon: BarChart2,      label: 'NCPt'                  },
      { to: '/dietitian/diete-per-patologia',   icon: Pill,           label: 'Diete per Patologia'   },
      { to: '/dietitian/consigli-nutrizionali', icon: Lightbulb,      label: 'Consigli Nutrizionali' },
      { to: '/dietitian/bia',                   icon: Zap,            label: 'BIA'                   },
      { to: '/dietitian/questionari',           icon: ClipboardCheck, label: 'Questionari'           },
      { to: '/dietitian/studi-scientifici',     icon: Microscope,     label: 'Studi Scientifici'     },
      { to: '/dietitian/assistente-ai',         icon: Bot,            label: 'Assistente AI'         },
      { to: '/dietitian/agenda',                icon: Calendar,       label: 'Agenda'                },
      { to: '/dietitian/corsi-ecm',             icon: GraduationCap,  label: 'Corsi ECM'             },
    ],
  },
  {
    label: 'DATABASE',
    items: [
      { to: '/dietitian/alimenti-crea',  icon: DatabaseIcon, label: 'Alimenti CREA+BDA' },
      { to: '/dietitian/integratori',    icon: Pill,         label: 'Integratori e AFMS' },
      { to: '/dietitian/ricette',        icon: ChefHat,      label: 'Ricette'            },
    ],
  },
];

// ─── Sidebar content (shared between desktop and mobile drawer) ──────────────
function SidebarContent({ onNavClick, logout }) {
  return (
    <>
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="text-white font-extrabold text-xl leading-tight tracking-tight">
          DietPlan<br />Pro
        </div>
        <div className="text-gray-400 text-xs mt-0.5">V1.0</div>
      </div>

      <div className="border-t border-white/10 mx-3 mb-2" />

      {/* Nav sections */}
      <nav className="flex-1 px-2 pb-4 overflow-y-auto">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="mb-2">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              {section.label}
            </p>
            {section.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all mb-0.5 ${
                    isActive
                      ? 'bg-teal-600/30 text-teal-300'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={15} className="flex-shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Esci */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
        >
          <LogOut size={14} />
          Esci
        </button>
      </div>
    </>
  );
}

// ─── DietitianApp ─────────────────────────────────────────────────────────────
export default function DietitianApp() {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto"
        style={{ width: 200, background: '#1B2838', minHeight: '100vh' }}
      >
        <SidebarContent onNavClick={undefined} logout={logout} />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 md:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: '#1B2838' }}
      >
        {/* Close button */}
        <button
          onClick={() => setDrawerOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1"
          aria-label="Chiudi menu"
        >
          <X size={20} />
        </button>
        <SidebarContent onNavClick={() => setDrawerOpen(false)} logout={logout} />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 md:hidden flex-shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Apri menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-gray-800 text-base">DietPlan Pro</span>
        </div>

        <Routes>
          <Route index element={<Navigate to="/dietitian/piano-alimentare" replace />} />
          <Route path="piano-alimentare"        element={<PianoAlimentare />} />
          <Route path="cartelle-pazienti"       element={<PatientManager />} />
          <Route path="gestione-diabete"        element={<GestioneDiabete />} />
          <Route path="insuff-pancreatica"      element={<InsuffPancreatica />} />
          <Route path="nutrizione-sportiva"     element={<NutrioneSportiva />} />
          <Route path="dca"                     element={<DCA />} />
          <Route path="dieta-chetogenica"       element={<DietaChetogenica />} />
          <Route path="nefropatia-irc"          element={<Nefropatia />} />
          <Route path="disfagia"                element={<Disfagia />} />
          <Route path="pediatria"               element={<Pediatria />} />
          <Route path="ristorazione-collettiva" element={<RistorazioneCollettiva />} />
          <Route path="linee-guida"             element={<LineeGuida />} />
          <Route path="valutazione-paziente"    element={<ValutazionePaziente />} />
          <Route path="ncpt"                    element={<NCPt />} />
          <Route path="diete-per-patologia"     element={<DietePerPatologia />} />
          <Route path="consigli-nutrizionali"   element={<ConsiglioNutrizionali />} />
          <Route path="bia"                     element={<BIA />} />
          <Route path="questionari"             element={<Questionari />} />
          <Route path="studi-scientifici"       element={<StudiScientifici />} />
          <Route path="assistente-ai"           element={<AssistenteAI />} />
          <Route path="agenda"                  element={<Agenda />} />
          <Route path="corsi-ecm"               element={<CorsiECM />} />
          <Route path="alimenti-crea"           element={<AlimentiCREA />} />
          <Route path="integratori"             element={<Integratori />} />
          <Route path="ricette"                 element={<Ricette />} />
          <Route path="*"                       element={<Navigate to="/dietitian/piano-alimentare" replace />} />
        </Routes>
      </main>
    </div>
  );
}
