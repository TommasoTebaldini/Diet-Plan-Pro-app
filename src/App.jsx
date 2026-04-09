import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Database, User, TrendingUp } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';
import FoodDatabase from './pages/FoodDatabase';
import Profile from './pages/Profile';
import Progress from './pages/Progress';

const SEED_PROFILE = {
  name: 'Alex',
  age: 28,
  weight: 75,
  height: 175,
  gender: 'male',
  activity: '1.55',
  goal: 'maintain',
  calorieTarget: 2200,
};

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const SEED_MEAL_PLAN = {};
days.forEach(day => {
  SEED_MEAL_PLAN[day] = { breakfast: [], lunch: [], dinner: [], snacks: [] };
});
// Add some sample meals for monday
SEED_MEAL_PLAN.monday.breakfast = [{ foodId: 9, foodName: 'Oats', grams: 80 }];
SEED_MEAL_PLAN.monday.lunch = [{ foodId: 1, foodName: 'Chicken Breast', grams: 150 }, { foodId: 14, foodName: 'Broccoli', grams: 100 }];
SEED_MEAL_PLAN.monday.dinner = [{ foodId: 8, foodName: 'Brown Rice', grams: 150 }, { foodId: 2, foodName: 'Salmon', grams: 120 }];
SEED_MEAL_PLAN.monday.snacks = [{ foodId: 24, foodName: 'Avocado', grams: 80 }];

const today = new Date();
const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const todayKey = dayNames[today.getDay()];
if (todayKey !== 'monday') {
  SEED_MEAL_PLAN[todayKey].breakfast = [{ foodId: 4, foodName: 'Eggs', grams: 150 }];
  SEED_MEAL_PLAN[todayKey].lunch = [{ foodId: 3, foodName: 'Tuna (canned)', grams: 100 }, { foodId: 15, foodName: 'Spinach', grams: 80 }];
  SEED_MEAL_PLAN[todayKey].dinner = [{ foodId: 10, foodName: 'Whole Wheat Bread', grams: 60 }, { foodId: 1, foodName: 'Chicken Breast', grams: 180 }];
}

const SEED_PROGRESS = [
  { date: '2024-01-01', weight: 78 },
  { date: '2024-01-08', weight: 77.2 },
  { date: '2024-01-15', weight: 76.5 },
  { date: '2024-01-22', weight: 76 },
  { date: '2024-02-01', weight: 75.5 },
  { date: '2024-02-08', weight: 75 },
];

// Seed localStorage on first load
if (!localStorage.getItem('diet-profile')) {
  localStorage.setItem('diet-profile', JSON.stringify(SEED_PROFILE));
}
if (!localStorage.getItem('diet-meal-plan')) {
  localStorage.setItem('diet-meal-plan', JSON.stringify(SEED_MEAL_PLAN));
}
if (!localStorage.getItem('diet-progress')) {
  localStorage.setItem('diet-progress', JSON.stringify(SEED_PROGRESS));
}
if (!localStorage.getItem('diet-water')) {
  localStorage.setItem('diet-water', JSON.stringify(3));
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/meal-planner', icon: CalendarDays, label: 'Meal Planner' },
  { to: '/food-database', icon: Database, label: 'Food Database' },
  { to: '/profile', icon: User, label: 'My Profile' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
];

export default function App() {
  return (
    <BrowserRouter>
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
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
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
            <p className="text-xs text-gray-400 text-center">Diet Plan Pro v1.0</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/food-database" element={<FoodDatabase />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
