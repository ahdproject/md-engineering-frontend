import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
    <header className="h-20 bg-gradient-to-r from-[#F5EFE6] to-[#FAF7F2] border-b-2 border-[#CBDCEB] px-8 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-[#2d3748] font-poppins">{TITLES[pathname] || 'M&D ERP'}</h1>
        <p className="text-sm text-[#6D94C5] font-poppins font-medium">{today}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm bg-gradient-to-r from-[#CBDCEB] to-[#D5E5F0] text-[#2d3748] px-4 py-2 rounded-full font-semibold capitalize shadow-sm border border-[#B8D0E8]">
          {user?.role}
        </span>
      </div>
    </header>
  );
}