import React, { useEffect, useState } from 'react';
import { Plus, X, Eye, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { getEmployeesApi } from '../../services/repository/employeeRepository';
import {
  createLoanApi, getAllLoansApi, getLoanByIdApi,
  cancelLoanApi, waiveEmiApi
} from '../../services/repository/loanRepository';
import Loader from '../common/Loader';

const STATUS_STYLE = {
  active:    'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const EMI_STATUS = {
  pending:  'bg-orange-100 text-orange-600',
  deducted: 'bg-green-100 text-green-700',
  waived:   'bg-gray-100 text-gray-600',
};

export default function Loans() {
  const [loans, setLoans]         = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [msg, setMsg]             = useState({ text: '', type: '' });
  const [saving, setSaving]       = useState(false);

  const [form, setForm] = useState({
    employee_id: '', loan_amount: '', tenure_months: '',
    deduction_start: '', purpose: '',
  });

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [lRes, eRes] = await Promise.all([
        getAllLoansApi(filterStatus ? { status: filterStatus } : {}),
        getEmployeesApi(),
      ]);
      setLoans(lRes.data.data?.loans || []);
      setEmployees(eRes.data.data?.employees || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus]);

  const emiAmount = form.loan_amount && form.tenure_months
    ? (parseFloat(form.loan_amount) / parseInt(form.tenure_months)).toFixed(2)
    : null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createLoanApi({
        ...form,
        employee_id:    parseInt(form.employee_id),
        loan_amount:    parseFloat(form.loan_amount),
        tenure_months:  parseInt(form.tenure_months),
      });
      flash('Loan created with EMI schedule');
      setShowForm(false);
      setForm({ employee_id:'', loan_amount:'', tenure_months:'', deduction_start:'', purpose:'' });
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Error creating loan', 'error');
    }
    setSaving(false);
  };

  const openDetail = async (loan) => {
    try {
      const { data } = await getLoanByIdApi(loan.id);
      setDetailModal(data.data);
    } catch {}
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setSaving(true);
    const reason = e.target.reason.value;
    try {
      await cancelLoanApi(cancelModal.id, { cancel_reason: reason });
      flash('Loan cancelled');
      setCancelModal(null);
      load();
      if (detailModal?.id === cancelModal.id) setDetailModal(null);
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
    setSaving(false);
  };

  const handleWaiveEmi = async (emiId) => {
    const reason = prompt('Enter waive reason:');
    if (!reason) return;
    try {
      await waiveEmiApi(emiId, { waive_reason: reason });
      flash('EMI waived');
      openDetail(detailModal);
      load();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2d3748]">Loan Management</h2>
        <button onClick={() => setShowForm(p => !p)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
          <Plus size={16} /> New Loan
        </button>
      </div>

      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        {[['All', ''], ['Active', 'active'], ['Completed', 'completed'], ['Cancelled', 'cancelled']].map(([l, v]) => (
          <button key={v} onClick={() => setFilterStatus(v)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${filterStatus === v ? 'bg-[#6D94C5] text-white' : 'bg-[#E8DFCA] text-[#718096] hover:text-[#2d3748]'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
          <h3 className="font-bold text-[#2d3748] mb-5">Create New Loan</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Employee</label>
                <select required value={form.employee_id}
                  onChange={e => setForm(p => ({ ...p, employee_id: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
                  <option value="">Select employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Loan Amount (₹)</label>
                <input type="number" required min="1" value={form.loan_amount} placeholder="50000"
                  onChange={e => setForm(p => ({ ...p, loan_amount: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Tenure (Months)</label>
                <input type="number" required min="1" max="120" value={form.tenure_months} placeholder="10"
                  onChange={e => setForm(p => ({ ...p, tenure_months: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Deduction Start Date</label>
                <input type="date" required value={form.deduction_start}
                  onChange={e => setForm(p => ({ ...p, deduction_start: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Purpose (optional)</label>
                <input type="text" value={form.purpose} placeholder="Medical emergency, personal need..."
                  onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
            </div>

            {/* EMI Preview */}
            {emiAmount && (
              <div className="bg-[#CBDCEB] rounded-xl p-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-[#6D94C5] font-medium">Loan Amount</p>
                  <p className="text-lg font-bold text-[#2d3748]">₹{Number(form.loan_amount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6D94C5] font-medium">Monthly EMI</p>
                  <p className="text-lg font-bold text-[#6D94C5]">₹{Number(emiAmount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6D94C5] font-medium">Tenure</p>
                  <p className="text-lg font-bold text-[#2d3748]">{form.tenure_months} months</p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                {saving ? 'Creating...' : 'Create Loan'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loans List */}
      {loading ? <Loader /> : (
        <div className="space-y-3">
          {loans.map(loan => (
            <div key={loan.id} className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#CBDCEB] rounded-xl flex items-center justify-center font-bold text-[#6D94C5] shrink-0">
                  {loan.employee_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-[#2d3748]">{loan.employee_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[loan.status]}`}>
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#718096]">{loan.purpose || 'No purpose specified'} · Approved by {loan.approved_by_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2d3748]">₹{Number(loan.loan_amount).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-[#6D94C5]">EMI: ₹{Number(loan.emi_amount).toLocaleString('en-IN')} × {loan.tenure_months}mo</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#718096]">Outstanding</p>
                  <p className="font-bold text-orange-500">₹{Number(loan.outstanding).toLocaleString('en-IN')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openDetail(loan)}
                    className="p-2 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all">
                    <Eye size={15} />
                  </button>
                  {loan.status === 'active' && (
                    <button onClick={() => setCancelModal(loan)}
                      className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                      <XCircle size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {loan.status === 'active' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#718096] mb-1.5">
                    <span>Paid: ₹{Number(loan.total_paid).toLocaleString('en-IN')}</span>
                    <span>{Math.round((loan.total_paid / loan.loan_amount) * 100)}% complete</span>
                  </div>
                  <div className="h-2 bg-[#E8DFCA] rounded-full overflow-hidden">
                    <div className="h-full bg-[#6D94C5] rounded-full transition-all"
                      style={{ width: `${Math.min(100, (loan.total_paid / loan.loan_amount) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
          {!loans.length && (
            <div className="text-center py-16 text-[#718096]">No loans found.</div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#2d3748]">Loan Details</h3>
                <p className="text-xs text-[#6D94C5]">{detailModal.employee_name} · Loan #{detailModal.id}</p>
              </div>
              <button onClick={() => setDetailModal(null)}><X size={20} className="text-[#718096]" /></button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                ['Loan Amount',  `₹${Number(detailModal.loan_amount).toLocaleString('en-IN')}`],
                ['Monthly EMI',  `₹${Number(detailModal.emi_amount).toLocaleString('en-IN')}`],
                ['Tenure',       `${detailModal.tenure_months} months`],
                ['Total Paid',   `₹${Number(detailModal.total_paid).toLocaleString('en-IN')}`],
                ['Outstanding',  `₹${Number(detailModal.outstanding).toLocaleString('en-IN')}`],
                ['Start Date',   new Date(detailModal.deduction_start).toLocaleDateString('en-IN')],
              ].map(([l, v]) => (
                <div key={l} className="bg-[#F5EFE6] rounded-xl p-3">
                  <p className="text-xs text-[#718096]">{l}</p>
                  <p className="font-bold text-[#2d3748] mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            {/* EMI Schedule */}
            <p className="font-bold text-[#2d3748] mb-3">EMI Schedule</p>
            <div className="space-y-2">
              {(detailModal.emi_schedule || []).map(emi => (
                <div key={emi.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${emi.status === 'deducted' ? 'bg-green-50 border-green-100' : emi.status === 'waived' ? 'bg-gray-50 border-gray-100' : 'bg-white border-[#E8DFCA]'}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-[#CBDCEB] text-[#6D94C5] rounded-full flex items-center justify-center text-xs font-bold">{emi.emi_number}</span>
                    <div>
                      <p className="text-sm font-medium text-[#2d3748]">
                        {new Date(emi.due_year, emi.due_month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-[#718096]">₹{Number(emi.emi_amount).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${EMI_STATUS[emi.status]}`}>
                      {emi.status}
                    </span>
                    {emi.status === 'pending' && detailModal.status === 'active' && (
                      <button onClick={() => handleWaiveEmi(emi.id)}
                        className="text-xs px-3 py-1 bg-[#E8DFCA] text-[#718096] rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-all font-medium">
                        Waive
                      </button>
                    )}
                    {emi.status === 'deducted' && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={22} className="text-red-500" />
              <h3 className="font-bold text-[#2d3748]">Cancel Loan</h3>
            </div>
            <p className="text-sm text-[#718096] mb-4">
              Cancel loan of <strong>₹{Number(cancelModal.loan_amount).toLocaleString('en-IN')}</strong> for <strong>{cancelModal.employee_name}</strong>?
              All pending EMIs will be waived.
            </p>
            <form onSubmit={handleCancel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Reason</label>
                <input name="reason" type="text" required placeholder="Reason for cancellation"
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-red-300" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60 transition-all">
                  {saving ? 'Cancelling...' : 'Cancel Loan'}
                </button>
                <button type="button" onClick={() => setCancelModal(null)}
                  className="flex-1 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
                  Go Back
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}