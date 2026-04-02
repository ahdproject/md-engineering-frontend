import React, { useEffect, useState } from 'react';
import { UserPlus, Edit2, ChevronDown, ChevronUp, Settings, X } from 'lucide-react';
import {
  getEmployeesApi, createEmployeeApi,
  updateEmployeeApi, setSalaryConfigApi, getSalaryConfigApi
} from '../../services/repository/employeeRepository';
import Loader from '../common/Loader';

export default function Employees() {
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [editEmp, setEditEmp]       = useState(null);
  const [salaryModal, setSalaryModal] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [msg, setMsg]               = useState({ text: '', type: '' });
  const [saving, setSaving]         = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', designation: '', joining_date: ''
  });
  const [salaryForm, setSalaryForm] = useState({
    default_daily_hours: 8,
    hourly_rate: '',
    overtime_multiplier: 1.5,
    effective_from: new Date().toISOString().split('T')[0],
  });

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getEmployeesApi();
      setEmployees(data.data?.employees || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openSalaryModal = async (emp) => {
    setSalaryModal(emp);
    setSalaryForm({
      default_daily_hours: emp.default_daily_hours || 8,
      hourly_rate: emp.hourly_rate ? String(emp.hourly_rate) : '',
      overtime_multiplier: emp.overtime_multiplier || 1.5,
      effective_from: new Date().toISOString().split('T')[0],
    });
    try {
      const { data } = await getSalaryConfigApi(emp.id);
      setSalaryHistory(data.data?.history || []);
    } catch { setSalaryHistory([]); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editEmp) {
        await updateEmployeeApi(editEmp.id, form);
        flash('Employee updated');
      } else {
        await createEmployeeApi(form);
        flash('Employee created');
      }
      setShowForm(false);
      setEditEmp(null);
      setForm({ name: '', phone: '', designation: '', joining_date: '' });
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
    setSaving(false);
  };

  const handleSalaryConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setSalaryConfigApi(salaryModal.id, {
        ...salaryForm,
        hourly_rate: parseFloat(salaryForm.hourly_rate),
        default_daily_hours: parseFloat(salaryForm.default_daily_hours),
        overtime_multiplier: parseFloat(salaryForm.overtime_multiplier),
      });
      flash('Salary config saved');
      setSalaryModal(null);
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
    setSaving(false);
  };

  const openEdit = (emp) => {
    setEditEmp(emp);
    setForm({
      name: emp.name, phone: emp.phone || '',
      designation: emp.designation || '',
      joining_date: emp.joining_date?.split('T')[0] || '',
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2d3748]">Employees</h2>
        <button onClick={() => { setShowForm(p => !p); setEditEmp(null); setForm({ name:'', phone:'', designation:'', joining_date:'' }); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6D94C5] hover:bg-[#5a7eb0] text-white text-sm font-semibold rounded-xl transition-all">
          <UserPlus size={16} /> Add Employee
        </button>
      </div>

      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
          <h3 className="font-bold text-[#2d3748] mb-5">
            {editEmp ? `Edit — ${editEmp.name}` : 'New Employee'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                ['Full Name', 'name', 'text', 'Ramesh Nair', true],
                ['Phone', 'phone', 'text', '9876543210', false],
                ['Designation', 'designation', 'text', 'Electroplating Operator', false],
                ['Joining Date', 'joining_date', 'date', '', false],
              ].map(([l, k, t, ph, req]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">{l}</label>
                  <input type={t} required={req} value={form[k]} placeholder={ph}
                    onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                {saving ? 'Saving...' : editEmp ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditEmp(null); }}
                className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl hover:bg-[#d4cdb8] transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? <Loader /> : (
        <div className="space-y-3">
          {employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-11 h-11 bg-[#CBDCEB] rounded-xl flex items-center justify-center font-bold text-[#6D94C5] text-lg shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2d3748]">{emp.name}</p>
                  <p className="text-xs text-[#718096]">{emp.designation || 'No designation'} · {emp.phone || 'No phone'}</p>
                </div>
                <div className="text-right">
                  {emp.hourly_rate
                    ? <p className="text-sm font-bold text-[#6D94C5]">₹{emp.hourly_rate}/hr</p>
                    : <p className="text-xs text-orange-500 font-medium">Rate not set</p>
                  }
                  <p className="text-xs text-[#718096]">{emp.default_daily_hours || 8}hrs/day</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(emp)}
                    className="p-2 bg-[#E8DFCA] text-[#718096] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => openSalaryModal(emp)}
                    className="p-2 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all">
                    <Settings size={14} />
                  </button>
                  <button onClick={() => setExpanded(expanded === emp.id ? null : emp.id)}
                    className="p-2 text-[#718096] hover:text-[#6D94C5] transition-colors">
                    {expanded === emp.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>
              {expanded === emp.id && (
                <div className="px-5 pb-4 border-t border-[#F5EFE6] pt-3 grid grid-cols-3 gap-4">
                  {[
                    ['Employee ID', `#${emp.id}`],
                    ['Joining Date', emp.joining_date ? new Date(emp.joining_date).toLocaleDateString('en-IN') : 'N/A'],
                    ['Status', emp.is_active ? 'Active' : 'Inactive'],
                    ['Default Hours', `${emp.default_daily_hours || 8} hrs/day`],
                    ['Hourly Rate', emp.hourly_rate ? `₹${emp.hourly_rate}` : 'Not set'],
                    ['OT Multiplier', `${emp.overtime_multiplier || 1.5}x`],
                  ].map(([l, v]) => (
                    <div key={l} className="bg-[#F5EFE6] rounded-xl p-3">
                      <p className="text-xs text-[#718096]">{l}</p>
                      <p className="text-sm font-semibold text-[#2d3748] mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {!employees.length && (
            <div className="text-center py-16 text-[#718096]">No employees yet. Add your first employee.</div>
          )}
        </div>
      )}

      {/* Salary Config Modal */}
      {salaryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#2d3748]">Salary Configuration</h3>
                <p className="text-xs text-[#6D94C5]">{salaryModal.name}</p>
              </div>
              <button onClick={() => setSalaryModal(null)}><X size={20} className="text-[#718096]" /></button>
            </div>

            <form onSubmit={handleSalaryConfig} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">
                    Hourly Rate (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number" step="0.01" min="1"
                    required
                    value={salaryForm.hourly_rate}
                    placeholder="e.g. 120"
                    onChange={e => setSalaryForm(p => ({ ...p, hourly_rate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm
                               bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]
                               placeholder:text-[#CBDCEB]"
                  />
                  {!salaryForm.hourly_rate && (
                    <p className="text-xs text-red-500 mt-1">Hourly rate is required</p>
                  )}
                </div>
                {[
                  ['Default Daily Hours', 'default_daily_hours', 'number', '8'],
                  ['OT Multiplier', 'overtime_multiplier', 'number', '1.5'],
                  ['Effective From', 'effective_from', 'date', ''],
                ].map(([l, k, t, ph]) => (
                  <div key={k}>
                    <label className="block text-xs font-semibold text-[#718096] mb-1.5">{l}</label>
                    <input type={t} required value={salaryForm[k]} placeholder={ph} step="0.01"
                      onChange={e => setSalaryForm(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
                  </div>
                ))}
              </div>

              {/* Monthly estimate */}
              {salaryForm.hourly_rate && (
                <div className="bg-[#CBDCEB] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#6D94C5] mb-1">Monthly Estimate (26 working days)</p>
                  <p className="text-lg font-bold text-[#2d3748]">
                    ₹{(parseFloat(salaryForm.hourly_rate) * parseFloat(salaryForm.default_daily_hours) * 26).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-[#6D94C5] mt-0.5">Base only · excludes overtime</p>
                </div>
              )}

              {/* History */}
              {salaryHistory.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-[#718096] mb-2">Previous Configs</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {salaryHistory.map(h => (
                      <div key={h.id} className="flex items-center justify-between bg-[#F5EFE6] rounded-lg px-3 py-2 text-xs">
                        <span className="text-[#2d3748] font-medium">₹{h.hourly_rate}/hr · {h.default_daily_hours}hrs</span>
                        <span className="text-[#718096]">from {new Date(h.effective_from).toLocaleDateString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                  {saving ? 'Saving...' : 'Save Config'}
                </button>
                <button type="button" onClick={() => setSalaryModal(null)}
                  className="flex-1 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}