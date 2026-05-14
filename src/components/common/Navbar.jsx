import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeSwitcher from './ThemeSwitcher';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/users':     'User Management',
  '/chemicals': 'Chemical Masters',
  '/stock':     'Stock Entry',
};

export default function Navbar() {
  const { pathname } = useLocation();
  const { user }     = useSelector(s => s.auth);
  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <header className="h-20 bg-white border-b-2 border-gray-200 px-8 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-black font-poppins">{TITLES[pathname] || 'M&D ERP'}</h1>
        <p className="text-sm text-gray-600 font-poppins font-medium">{today}</p>
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <span className="text-sm bg-black text-white px-4 py-2 rounded-full font-semibold capitalize shadow-md border border-gray-800">
          {user?.role}
        </span>
      </div>
    </header>
  );
}