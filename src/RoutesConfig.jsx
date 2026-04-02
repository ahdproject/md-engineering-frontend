import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute  from './components/protected/ProtectedRoute';
import Layout          from './components/common/Layout';
import Login           from './components/pages/Login';
import Dashboard       from './components/pages/Dashboard';
import Users           from './components/pages/Users';
import ChemicalMasters from './components/pages/ChemicalMasters';
import StockEntry      from './components/pages/StockEntry';
import Employees       from './components/pages/Employees';
import Attendance      from './components/pages/Attendance';
import Salary          from './components/pages/Salary';
import Loans           from './components/pages/Loans';
import Expenses        from './components/pages/Expenses';

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/"           element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/users"      element={<Users />} />
          <Route path="/chemicals"  element={<ChemicalMasters />} />
          <Route path="/stock"      element={<StockEntry />} />
          <Route path="/employees"  element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/salary"     element={<Salary />} />
          <Route path="/loans"      element={<Loans />} />
          <Route path="/expenses"   element={<Expenses />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}