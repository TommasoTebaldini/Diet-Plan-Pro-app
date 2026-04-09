import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Database, User, TrendingUp, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';
import MealPlanner from './MealPlanner';
import FoodDatabase from './FoodDatabase';
import Profile from './Profile';
import Progress from './Progress';
import PatientManager from './admin/PatientManager';

const navItems = [
  { to: '/dietitian',              icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/dietitian/meal-planner', icon: CalendarDays,    label: 'Meal Planner' },
  { to: '/dietitian/food-database', icon: Database,       label: 'Food Database' },
  { to: '/dietitian/profile',      icon: User,            label: 'My Profile'   },
  { to: '/dietitian/progress',     icon: TrendingUp,      label: 'Progress'     },
  { to: '/dietitian/patients',     icon: Users,           label: 'Pazienti'     },
];

export default function DietitianApp() {
  const { logout } = useAuth();

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
              <p className="text-emerald-500 text-xs font-medium">Pro – Dietista</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dietitian'}
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
          <Route path="/dietitian"               element={<Dashboard />} />
          <Route path="/dietitian/meal-planner"  element={<MealPlanner />} />
          <Route path="/dietitian/food-database" element={<FoodDatabase />} />
          <Route path="/dietitian/profile"       element={<Profile />} />
          <Route path="/dietitian/progress"      element={<Progress />} />
          <Route path="/dietitian/patients"      element={<PatientManager />} />
        </Routes>
      </main>
    </div>
  );
}
