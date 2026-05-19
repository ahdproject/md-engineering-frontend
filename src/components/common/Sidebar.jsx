import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Users, FlaskConical,
  PackageSearch, UserCheck, CalendarDays,
  IndianRupee, Landmark, Receipt, LogOut, Package, FileText
} from 'lucide-react';
import { clearCredentials } from '../../app/authSlice';
import { logoutApi } from '../../services/repository/authRepository';

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/users',      label: 'User Management', icon: Users },
  { to: '/chemicals',  label: 'Chemicals',        icon: FlaskConical },
  { to: '/materials',  label: 'Materials',        icon: Package },
  { to: '/stock',      label: 'Stock Entry',      icon: PackageSearch },
  { to: '/employees',  label: 'Employees',        icon: UserCheck },
  { to: '/attendance', label: 'Attendance',       icon: CalendarDays },
  { to: '/salary',     label: 'Salary',           icon: IndianRupee },
  { to: '/loans',      label: 'Loans',            icon: Landmark },
  { to: '/expenses',   label: 'Expenses',         icon: Receipt },
  { to: '/bills',      label: 'Bills',            icon: FileText },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  const handleLogout = async () => {
    try { await logoutApi(); } catch {}
    dispatch(clearCredentials());
    navigate('/login');
  };

  return (
    <aside className="w-60 min-h-screen bg-black border-r border-gray-800 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">M&D</span>
          </div>
          <div>
            <p className="font-bold text-white text-sm">M&D Engineers</p>
            <p className="text-xs text-gray-400">ERP System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
               ${isActive
                 ? 'bg-white text-black shadow-md'
                 : 'text-gray-300 hover:bg-gray-900 hover:text-white'}`
            }>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-900 rounded-xl mb-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black text-xs font-bold shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-900 hover:text-red-400 transition-colors font-medium">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}