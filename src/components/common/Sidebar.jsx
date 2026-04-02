import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Users, FlaskConical,
  PackageSearch, UserCheck, CalendarDays,
  IndianRupee, Landmark, Receipt, LogOut
} from 'lucide-react';
import { clearCredentials } from '../../app/authSlice';
import { logoutApi } from '../../services/repository/authRepository';

const NAV = [
  { to: '/dashboard',  label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/users',      label: 'User Management', icon: Users },
  { to: '/chemicals',  label: 'Chemicals',        icon: FlaskConical },
  { to: '/stock',      label: 'Stock Entry',      icon: PackageSearch },
  { to: '/employees',  label: 'Employees',        icon: UserCheck },
  { to: '/attendance', label: 'Attendance',       icon: CalendarDays },
  { to: '/salary',     label: 'Salary',           icon: IndianRupee },
  { to: '/loans',      label: 'Loans',            icon: Landmark },
  { to: '/expenses',   label: 'Expenses',         icon: Receipt },
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
    <aside className="w-60 min-h-screen bg-[#E8DFCA] border-r border-[#CBDCEB] flex flex-col">
      <div className="px-5 py-5 border-b border-[#CBDCEB]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#6D94C5] rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">M&D</span>
          </div>
          <div>
            <p className="font-bold text-[#2d3748] text-sm">M&D Engineers</p>
            <p className="text-xs text-[#6D94C5]">ERP System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
               ${isActive
                 ? 'bg-[#6D94C5] text-white shadow-sm'
                 : 'text-[#4a5568] hover:bg-[#CBDCEB] hover:text-[#6D94C5]'}`
            }>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#CBDCEB]">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#F5EFE6] rounded-xl mb-2">
          <div className="w-8 h-8 bg-[#6D94C5] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2d3748] truncate">{user?.name}</p>
            <p className="text-xs text-[#6D94C5] capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}