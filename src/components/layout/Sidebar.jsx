import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Calendar, Umbrella, Laptop,
  ArrowLeftRight, Clock, Phone, LogOut, User
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/shifts', icon: Calendar, label: 'My Shifts' },
  { to: '/leaves', icon: Umbrella, label: 'Leave' },
  { to: '/wfh', icon: Laptop, label: 'Work From Home' },
  { to: '/swap', icon: ArrowLeftRight, label: 'Shift Swap' },
  { to: '/compoff', icon: Clock, label: 'Comp-Off' },
  { to: '/oncall', icon: Phone, label: 'On-Call' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-white text-xl font-bold">⚡ ShiftSync</h1>
        <p className="text-slate-400 text-xs mt-1">HR Operations Portal</p>
      </div>

      {/* User */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs">{user?.defaultShift}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}