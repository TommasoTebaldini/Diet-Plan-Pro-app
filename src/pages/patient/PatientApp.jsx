import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Database, User, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PatientOnboarding from './PatientOnboarding';
import PatientDashboard from './PatientDashboard';
import PatientMealPlanner from './PatientMealPlanner';
import PatientFoodDatabase from './PatientFoodDatabase';
import PatientProfile from './PatientProfile';
import PatientProgress from './PatientProgress';

const navItems = [
  { to: '/patient',              icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/patient/meal-planner', icon: CalendarDays,    label: 'Piano Pasti'  },
  { to: '/patient/foods',        icon: Database,        label: 'Alimenti'     },
  { to: '/patient/profile',      icon: User,            label: 'Profilo'      },
  { to: '/patient/progress',     icon: TrendingUp,      label: 'Progressi'    },
];

export default function PatientApp() {
  const { session, logout } = useAuth();
  const patientId = session?.patientId;

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem(`diet-patient-${patientId}-profile`);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem(`diet-patient-${patientId}-profile`, JSON.stringify(profile));
    }
  }, [profile, patientId]);

  if (!profile?.onboardingComplete) {
    return (
      <PatientOnboarding
        patientId={patientId}
        onComplete={(p) => setProfile(p)}
      />
    );
  }

  const firstName = profile.firstName || session.username;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight">Diet Plan</h1>
              <p className="text-emerald-500 text-xs font-medium">Pro</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
            <p className="text-xs text-gray-500">Ciao,</p>
            <p className="font-semibold text-emerald-700 text-sm">{firstName} {profile.lastName || ''}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/patient'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={16} />
            Esci
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/patient"              element={<PatientDashboard   patientId={patientId} profile={profile} />} />
          <Route path="/patient/meal-planner" element={<PatientMealPlanner patientId={patientId} />} />
          <Route path="/patient/foods"        element={<PatientFoodDatabase />} />
          <Route path="/patient/profile"      element={<PatientProfile     patientId={patientId} profile={profile} onUpdate={setProfile} />} />
          <Route path="/patient/progress"     element={<PatientProgress    patientId={patientId} profile={profile} />} />
        </Routes>
      </main>
    </div>
  );
}
