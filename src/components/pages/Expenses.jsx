import React, { useEffect, useState, useCallback } from 'react';
import {
  Plus, X, Trash2, Edit2, CheckCircle,
  Wallet, Zap, Users, ArrowDownCircle,
  BarChart3, IndianRupee, Tag, Settings
} from 'lucide-react';
import {
  getCategoriesApi, createCategoryApi,
  createCashExpenseApi, createBulkCashExpenseApi,
  getCashExpensesApi, updateCashExpenseApi, deleteCashExpenseApi,
  createUtilityBillApi, getUtilityBillsApi, markUtilityPaidApi,
  createVendorExpenseApi, getVendorExpensesApi, deleteVendorExpenseApi,
  recordCashReceivedApi, getCashReceivedApi,
  setOpeningBalanceApi, getCashBalanceApi,
  getMonthlySummaryApi,
} from '../../services/repository/expenseRepository';
import Loader from '../common/Loader';

const TABS = [
  { label: 'Overview',      icon: BarChart3 },
  { label: 'Cash Expenses', icon: Wallet },
  { label: 'Utility Bills', icon: Zap },
  { label: 'Vendor',        icon: Users },
  { label: 'Cash Ledger',   icon: ArrowDownCircle },
  { label: 'Categories',    icon: Tag },
];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const PAYMENT_MODES = ['cash','bank','upi','cheque'];

const inputCls = "w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5] focus:ring-1 focus:ring-[#CBDCEB] transition-all";

// ─── Isolated form components to prevent focus loss ──────────────────────────

function CashExpenseForm({ categories, onSave, onCancel, initial }) {
  const [date, setDate]           = useState(initial?.date    || new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(initial?.category_id || '');
  const [amount, setAmount]       = useState(initial?.amount  || '');
  const [desc, setDesc]           = useState(initial?.description || '');
  const [mode, setMode]           = useState(initial?.payment_mode || 'cash');
  const [saving, setSaving]       = useState(false);
  const [err, setErr]             = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) { setErr('Enter a valid amount'); return; }
    if (!categoryId) { setErr('Select a category'); return; }
    setSaving(true);
    setErr('');
    await onSave({ date, category_id: parseInt(categoryId), amount: parseFloat(amount), description: desc, payment_mode: mode });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
      <h3 className="font-bold text-[#2d3748] mb-5">{initial ? 'Edit Expense' : 'New Cash Expense'}</h3>
      {err && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Date *</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Category *</label>
            <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputCls}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Amount (₹) *</label>
            <input
              type="number" step="0.01" min="0.01" required
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 850"
              className={inputCls}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Payment Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)} className={inputCls}>
              {PAYMENT_MODES.slice(0,3).map(m => <option key={m} value={m} className="capitalize">{m}</option>)}
            </select>
          </div>
          <div className="col-span-full">
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Description</label>
            <input
              type="text" value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional details"
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
            {saving ? 'Saving...' : initial ? 'Update' : 'Save Expense'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl hover:bg-[#d4cdb8] transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function BulkExpenseForm({ categories, onSave, onCancel }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rows, setRows] = useState([
    { category_id: '', amount: '', description: '', payment_mode: 'cash' }
  ]);
  const [saving, setSaving]   = useState(false);

  const update = (i, field, val) => {
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val };
      return next;
    });
  };

  const addRow = () => setRows(p => [...p, { category_id: '', amount: '', description: '', payment_mode: 'cash' }]);
  const removeRow = (i) => setRows(p => p.filter((_, j) => j !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = rows.filter(r => r.category_id && r.amount && parseFloat(r.amount) > 0);
    if (!valid.length) return;
    setSaving(true);
    await onSave({
      date,
      entries: valid.map(r => ({
        category_id: parseInt(r.category_id),
        amount: parseFloat(r.amount),
        description: r.description || undefined,
        payment_mode: r.payment_mode,
      })),
    });
    setSaving(false);
  };

  const validCount = rows.filter(r => r.category_id && r.amount).length;

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[#2d3748]">Bulk Cash Entry</h3>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#718096]">Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="px-3 py-1.5 border border-[#E8DFCA] rounded-lg text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-bold text-[#718096] mb-2 px-1">
          <span className="col-span-3">Category *</span>
          <span className="col-span-2">Amount (₹) *</span>
          <span className="col-span-4">Description</span>
          <span className="col-span-2">Mode</span>
          <span className="col-span-1" />
        </div>
        <div className="space-y-2 mb-4">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#F5EFE6] rounded-xl p-2">
              <div className="col-span-3">
                <select value={row.category_id} onChange={e => update(i, 'category_id', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8DFCA] rounded-lg text-xs bg-white focus:outline-none focus:border-[#6D94C5]">
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <input
                  type="number" step="0.01" min="0" value={row.amount}
                  onChange={e => update(i, 'amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-[#E8DFCA] rounded-lg text-xs bg-white focus:outline-none focus:border-[#6D94C5]"
                />
              </div>
              <div className="col-span-4">
                <input
                  type="text" value={row.description}
                  onChange={e => update(i, 'description', e.target.value)}
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-[#E8DFCA] rounded-lg text-xs bg-white focus:outline-none focus:border-[#6D94C5]"
                />
              </div>
              <div className="col-span-2">
                <select value={row.payment_mode} onChange={e => update(i, 'payment_mode', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8DFCA] rounded-lg text-xs bg-white focus:outline-none focus:border-[#6D94C5]">
                  {PAYMENT_MODES.slice(0,3).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="col-span-1 flex justify-center">
                {rows.length > 1 && (
                  <button type="button" onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={addRow}
            className="text-sm text-[#6D94C5] hover:text-[#5a7eb0] font-semibold flex items-center gap-1 transition-colors">
            <Plus size={14} /> Add Row
          </button>
          <div className="flex-1" />
          <button type="submit" disabled={saving || validCount === 0}
            className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
            {saving ? 'Saving...' : `Save ${validCount} ${validCount === 1 ? 'entry' : 'entries'}`}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function UtilityForm({ month, year, onSave, onCancel }) {
  const [billType, setBillType] = useState('Light Bill');
  const [amount, setAmount]     = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate]   = useState('');
  const [billNo, setBillNo]     = useState('');
  const [remarks, setRemarks]   = useState('');
  const [saving, setSaving]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ bill_type: billType, amount: parseFloat(amount), bill_date: billDate, due_date: dueDate || undefined, month, year, bill_no: billNo || undefined, remarks: remarks || undefined });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
      <h3 className="font-bold text-[#2d3748] mb-5">Add Utility Bill</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Bill Type *</label>
            <select required value={billType} onChange={e => setBillType(e.target.value)} className={inputCls}>
              {['Light Bill','Water Bill','Gas Bill','Internet','Telephone'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Amount (₹) *</label>
            <input type="number" step="0.01" min="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Bill Date *</label>
            <input type="date" required value={billDate} onChange={e => setBillDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Bill Number</label>
            <input type="text" value={billNo} onChange={e => setBillNo(e.target.value)} placeholder="Reference no" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Remarks</label>
            <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optional" className={inputCls} />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
            {saving ? 'Saving...' : 'Save Bill'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function VendorForm({ onSave, onCancel }) {
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount]         = useState('');
  const [date, setDate]             = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose]       = useState('');
  const [mode, setMode]             = useState('cash');
  const [refNo, setRefNo]           = useState('');
  const [saving, setSaving]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ vendor_name: vendorName, amount: parseFloat(amount), date, purpose: purpose || undefined, payment_mode: mode, reference_no: refNo || undefined });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
      <h3 className="font-bold text-[#2d3748] mb-5">New Vendor Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Vendor Name *</label>
            <input type="text" required value={vendorName} onChange={e => setVendorName(e.target.value)} placeholder="Alok, J&J, Jain Hardware..." className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Amount (₹) *</label>
            <input type="number" step="0.01" min="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Date *</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Payment Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)} className={inputCls}>
              {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Purpose</label>
            <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="What for?" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Reference No</label>
            <input type="text" value={refNo} onChange={e => setRefNo(e.target.value)} placeholder="Invoice / bill no" className={inputCls} />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function CashReceivedForm({ onSave, onCancel }) {
  const [date, setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [billNo, setBillNo] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ date, amount: parseFloat(amount), source: source || undefined, bill_no: billNo || undefined });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-green-200 p-6">
      <h3 className="font-bold text-[#2d3748] mb-5">Record Cash Received</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Date *</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Amount (₹) *</label>
            <input type="number" step="0.01" min="0.01" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Source</label>
            <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="From whom / bill no" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Bill No</label>
            <input type="text" value={billNo} onChange={e => setBillNo(e.target.value)} placeholder="Bill number" className={inputCls} />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 disabled:opacity-60 transition-all">
            {saving ? 'Saving...' : 'Record'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function OpeningBalanceForm({ month, year, monthName, onSave, onCancel }) {
  const [amount, setAmount] = useState('');
  const [note, setNote]     = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ month, year, amount: parseFloat(amount), note: note || undefined });
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#CBDCEB] p-6">
      <h3 className="font-bold text-[#2d3748] mb-5">Set Opening Balance — {monthName} {year}</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Opening Balance (₹) *</label>
            <input type="number" step="0.01" min="0" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 5000" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1.5">Note</label>
            <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Carry forward from last month" className={inputCls} />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
            {saving ? 'Saving...' : 'Set Balance'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Expenses() {
  const now = new Date();
  const [tab, setTab]       = useState(0);
  const [month, setMonth]   = useState(now.getMonth() + 1);
  const [year, setYear]     = useState(now.getFullYear());
  const [msg, setMsg]       = useState({ text: '', type: '' });

  // Data states
  const [categories, setCategories]     = useState([]);
  const [cashExpenses, setCashExpenses] = useState([]);
  const [utilities, setUtilities]       = useState([]);
  const [vendors, setVendors]           = useState([]);
  const [cashReceived, setCashReceived] = useState([]);
  const [balance, setBalance]           = useState(null);
  const [summary, setSummary]           = useState(null);

  // Loading states
  const [loadingSummary, setLoadingSummary]   = useState(false);
  const [loadingCash, setLoadingCash]         = useState(false);
  const [loadingUtil, setLoadingUtil]         = useState(false);
  const [loadingVendor, setLoadingVendor]     = useState(false);

  // Form visibility
  const [showCashForm, setShowCashForm]       = useState(false);
  const [showBulk, setShowBulk]               = useState(false);
  const [editExpense, setEditExpense]         = useState(null);
  const [showUtilForm, setShowUtilForm]       = useState(false);
  const [showVendorForm, setShowVendorForm]   = useState(false);
  const [showReceivedForm, setShowReceivedForm] = useState(false);
  const [showOpeningForm, setShowOpeningForm] = useState(false);

  // Category management
  const [allCategories, setAllCategories]     = useState([]);
  const [newCatName, setNewCatName]           = useState('');
  const [newCatType, setNewCatType]           = useState('cash');
  const [catSaving, setCatSaving]             = useState(false);

  const flash = useCallback((text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  }, []);

  const monthName = MONTHS[month - 1];

  // Loaders
  const loadCategories = useCallback(async () => {
    try {
      const { data } = await getCategoriesApi('cash');
      setCategories(data.data?.categories || []);
    } catch {}
  }, []);

  const loadAllCategories = useCallback(async () => {
    try {
      const { data } = await getCategoriesApi();
      setAllCategories(data.data?.categories || []);
    } catch {}
  }, []);

  const loadSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const { data } = await getMonthlySummaryApi(month, year);
      setSummary(data.data);
    } catch { setSummary(null); }
    setLoadingSummary(false);
  }, [month, year]);

  const loadCash = useCallback(async () => {
    setLoadingCash(true);
    try {
      const { data } = await getCashExpensesApi({ month, year });
      setCashExpenses(data.data?.expenses || []);
    } catch { setCashExpenses([]); }
    setLoadingCash(false);
  }, [month, year]);

  const loadUtility = useCallback(async () => {
    setLoadingUtil(true);
    try {
      const { data } = await getUtilityBillsApi({ month, year });
      setUtilities(data.data?.bills || []);
    } catch { setUtilities([]); }
    setLoadingUtil(false);
  }, [month, year]);

  const loadVendor = useCallback(async () => {
    setLoadingVendor(true);
    try {
      const { data } = await getVendorExpensesApi({ month, year });
      setVendors(data.data?.expenses || []);
    } catch { setVendors([]); }
    setLoadingVendor(false);
  }, [month, year]);

  const loadLedger = useCallback(async () => {
    try {
      const [recRes, balRes] = await Promise.all([
        getCashReceivedApi({ month, year }),
        getCashBalanceApi(month, year),
      ]);
      setCashReceived(recRes.data.data?.records || []);
      setBalance(balRes.data.data);
    } catch {}
  }, [month, year]);

  useEffect(() => { loadCategories(); }, []);

  useEffect(() => {
    if (tab === 0) loadSummary();
    if (tab === 1) { loadCash(); }
    if (tab === 2) loadUtility();
    if (tab === 3) loadVendor();
    if (tab === 4) loadLedger();
    if (tab === 5) loadAllCategories();
  }, [tab, month, year]);

  // Handlers
  const handleCashSave = async (formData) => {
    try {
      if (editExpense) {
        await updateCashExpenseApi(editExpense.id, formData);
        flash('Expense updated');
      } else {
        await createCashExpenseApi(formData);
        flash('Cash expense recorded');
      }
      setShowCashForm(false);
      setEditExpense(null);
      loadCash();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error saving expense', 'error');
    }
  };

  const handleBulkSave = async (formData) => {
    try {
      const { data } = await createBulkCashExpenseApi(formData);
      flash(`${data.data.saved_count} expenses saved`);
      setShowBulk(false);
      loadCash();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleDeleteCash = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteCashExpenseApi(id);
      flash('Expense deleted');
      loadCash();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleUtilSave = async (formData) => {
    try {
      await createUtilityBillApi(formData);
      flash('Utility bill saved');
      setShowUtilForm(false);
      loadUtility();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleMarkUtilPaid = async (id) => {
    try {
      await markUtilityPaidApi(id, { paid_on: now.toISOString().split('T')[0] });
      flash('Bill marked as paid');
      loadUtility();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleVendorSave = async (formData) => {
    try {
      await createVendorExpenseApi(formData);
      flash('Vendor expense recorded');
      setShowVendorForm(false);
      loadVendor();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm('Delete this vendor expense?')) return;
    try {
      await deleteVendorExpenseApi(id);
      flash('Vendor expense deleted');
      loadVendor();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleReceivedSave = async (formData) => {
    try {
      await recordCashReceivedApi(formData);
      flash('Cash received recorded');
      setShowReceivedForm(false);
      loadLedger();
      loadSummary();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleOpeningSave = async (formData) => {
    try {
      await setOpeningBalanceApi(formData);
      flash('Opening balance set');
      setShowOpeningForm(false);
      loadLedger();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatSaving(true);
    try {
      await createCategoryApi({ name: newCatName.trim(), type: newCatType });
      flash('Category created');
      setNewCatName('');
      setNewCatType('cash');
      loadAllCategories();
      loadCategories();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
    setCatSaving(false);
  };

  const TYPE_COLORS = {
    cash:    'bg-orange-100 text-orange-700',
    utility: 'bg-blue-100 text-blue-700',
    vendor:  'bg-purple-100 text-purple-700',
    labour:  'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-[#2d3748]">Expenses</h2>
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1">Month</label>
            <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
              {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#718096] mb-1">Year</label>
            <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))}
              className="w-24 px-3 py-2 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
          </div>
        </div>
      </div>

      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#E8DFCA] p-1 rounded-xl overflow-x-auto">
        {TABS.map(({ label, icon: Icon }, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${tab === i ? 'bg-white text-[#6D94C5] shadow-sm' : 'text-[#718096] hover:text-[#2d3748]'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── TAB 0: OVERVIEW ── */}
      {tab === 0 && (
        loadingSummary ? <Loader /> : summary ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ['Cash Expenses',   summary.summary?.cash_expenses,   'text-orange-500'],
                ['Utility Bills',   summary.summary?.utility_bills,   'text-blue-500'],
                ['Vendor Expenses', summary.summary?.vendor_expenses,  'text-purple-500'],
                ['Total Expenses',  summary.summary?.total_expenses,   'text-red-500'],
                ['Cash Received',   summary.summary?.cash_received,    'text-green-600'],
                ['Cash In Hand',    summary.summary?.current_balance,  'text-[#6D94C5]'],
              ].map(([l, v, c]) => (
                <div key={l} className="bg-white rounded-xl border border-[#E8DFCA] p-4">
                  <p className="text-xs text-[#718096] font-medium">{l}</p>
                  <p className={`text-xl font-bold mt-1 ${c}`}>₹{Number(v || 0).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Cash by Category */}
              <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
                <p className="font-bold text-[#2d3748] mb-4 flex items-center gap-2"><Wallet size={16} className="text-[#6D94C5]" /> Cash Breakdown</p>
                {summary.breakdowns?.by_category?.length
                  ? summary.breakdowns.by_category.map((c, i) => (
                    <div key={i} className="mb-2.5">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-[#2d3748] truncate">{c.category}</span>
                        <span className="font-bold text-[#6D94C5]">₹{Number(c.total).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-1.5 bg-[#E8DFCA] rounded-full">
                        <div className="h-full bg-[#6D94C5] rounded-full"
                          style={{ width: `${summary.summary.cash_expenses > 0 ? Math.min(100, (c.total / summary.summary.cash_expenses) * 100) : 0}%` }} />
                      </div>
                    </div>
                  ))
                  : <p className="text-xs text-[#718096] text-center py-6">No cash expenses</p>
                }
              </div>

              {/* Vendors */}
              <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
                <p className="font-bold text-[#2d3748] mb-4 flex items-center gap-2"><Users size={16} className="text-[#6D94C5]" /> Vendor Payments</p>
                {summary.breakdowns?.by_vendor?.length
                  ? summary.breakdowns.by_vendor.map((v, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#F5EFE6] rounded-lg px-3 py-2 mb-2">
                      <span className="text-xs font-medium text-[#2d3748]">{v.vendor_name}</span>
                      <span className="text-xs font-bold text-[#6D94C5]">₹{Number(v.total).toLocaleString('en-IN')}</span>
                    </div>
                  ))
                  : <p className="text-xs text-[#718096] text-center py-6">No vendor payments</p>
                }
              </div>

              {/* Utilities */}
              <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
                <p className="font-bold text-[#2d3748] mb-4 flex items-center gap-2"><Zap size={16} className="text-[#6D94C5]" /> Utility Bills</p>
                {summary.breakdowns?.utilities?.length
                  ? summary.breakdowns.utilities.map((u, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#F5EFE6] rounded-lg px-3 py-2 mb-2">
                      <div>
                        <p className="text-xs font-medium text-[#2d3748]">{u.bill_type}</p>
                        <p className="text-xs text-[#718096]">₹{Number(u.amount).toLocaleString('en-IN')}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.is_paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                        {u.is_paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  ))
                  : <p className="text-xs text-[#718096] text-center py-6">No utility bills</p>
                }
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFCA]">
            <IndianRupee size={40} className="text-[#CBDCEB] mx-auto mb-3" />
            <p className="text-[#718096]">No data for {monthName} {year}</p>
          </div>
        )
      )}

      {/* ── TAB 1: CASH EXPENSES ── */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button onClick={() => { setShowCashForm(p => !p); setEditExpense(null); if (showBulk) setShowBulk(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
              <Plus size={15} /> Add Expense
            </button>
            <button onClick={() => { setShowBulk(p => !p); if (showCashForm) setShowCashForm(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl hover:bg-[#d4cdb8] transition-all">
              <Plus size={15} /> Bulk Entry
            </button>
          </div>

          {showCashForm && (
            <CashExpenseForm
              key={editExpense?.id || 'new'}
              categories={categories}
              onSave={handleCashSave}
              onCancel={() => { setShowCashForm(false); setEditExpense(null); }}
              initial={editExpense ? {
                date: editExpense.date?.split('T')[0],
                category_id: editExpense.category_id,
                amount: editExpense.amount,
                description: editExpense.description,
                payment_mode: editExpense.payment_mode,
              } : null}
            />
          )}

          {showBulk && (
            <BulkExpenseForm
              categories={categories}
              onSave={handleBulkSave}
              onCancel={() => setShowBulk(false)}
            />
          )}

          {loadingCash ? <Loader /> : (
            <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              {cashExpenses.length ? (
                <>
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5EFE6]">
                      <tr>{['Date','Category','Amount','Mode','Description','By','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#718096]">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6]">
                      {cashExpenses.map(e => (
                        <tr key={e.id} className="hover:bg-[#F5EFE6]">
                          <td className="px-4 py-3 text-xs text-[#718096]">{new Date(e.date).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3 font-medium text-[#2d3748]">{e.category_name}</td>
                          <td className="px-4 py-3 font-bold text-[#6D94C5]">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${e.payment_mode === 'cash' ? 'bg-green-100 text-green-700' : e.payment_mode === 'bank' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                              {e.payment_mode}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#718096] max-w-xs truncate">{e.description || '—'}</td>
                          <td className="px-4 py-3 text-xs text-[#718096]">{e.entered_by_name}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => { setEditExpense(e); setShowCashForm(true); setShowBulk(false); }}
                                className="p-1.5 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all">
                                <Edit2 size={12} />
                              </button>
                              <button onClick={() => handleDeleteCash(e.id)}
                                className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 bg-[#F5EFE6] border-t border-[#E8DFCA] flex justify-between items-center">
                    <span className="text-xs text-[#718096]">{cashExpenses.length} entries</span>
                    <span className="text-sm font-bold text-[#6D94C5]">
                      Total: ₹{cashExpenses.reduce((s, e) => s + parseFloat(e.amount), 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-[#718096]">No cash expenses for {monthName} {year}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: UTILITY BILLS ── */}
      {tab === 2 && (
        <div className="space-y-4">
          <button onClick={() => setShowUtilForm(p => !p)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
            <Plus size={15} /> Add Bill
          </button>

          {showUtilForm && <UtilityForm month={month} year={year} onSave={handleUtilSave} onCancel={() => setShowUtilForm(false)} />}

          {loadingUtil ? <Loader /> : (
            <div className="space-y-3">
              {utilities.length ? utilities.map(b => (
                <div key={b.id} className={`bg-white rounded-2xl border p-5 ${b.is_paid ? 'border-green-200' : 'border-[#E8DFCA]'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={16} className="text-[#6D94C5]" />
                        <p className="font-bold text-[#2d3748]">{b.bill_type}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.is_paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
                          {b.is_paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      <p className="text-xs text-[#718096]">
                        {new Date(b.bill_date).toLocaleDateString('en-IN')}
                        {b.due_date && ` · Due: ${new Date(b.due_date).toLocaleDateString('en-IN')}`}
                        {b.bill_no && ` · #${b.bill_no}`}
                      </p>
                      {b.is_paid && b.paid_on && (
                        <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                          <CheckCircle size={11} /> Paid {new Date(b.paid_on).toLocaleDateString('en-IN')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-xl font-bold text-[#6D94C5]">₹{Number(b.amount).toLocaleString('en-IN')}</p>
                      {!b.is_paid && (
                        <button onClick={() => handleMarkUtilPaid(b.id)}
                          className="px-4 py-2 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600 transition-all">
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )) : <div className="text-center py-12 bg-white rounded-2xl border border-[#E8DFCA] text-[#718096]">No utility bills for {monthName} {year}</div>}

              {utilities.length > 0 && (
                <div className="bg-[#CBDCEB] rounded-xl p-4 flex justify-between items-center">
                  <span className="font-semibold text-[#2d3748]">Total</span>
                  <span className="font-bold text-lg text-[#6D94C5]">₹{utilities.reduce((s, b) => s + parseFloat(b.amount), 0).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: VENDOR EXPENSES ── */}
      {tab === 3 && (
        <div className="space-y-4">
          <button onClick={() => setShowVendorForm(p => !p)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
            <Plus size={15} /> Add Vendor Expense
          </button>

          {showVendorForm && <VendorForm onSave={handleVendorSave} onCancel={() => setShowVendorForm(false)} />}

          {loadingVendor ? <Loader /> : (
            <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              {vendors.length ? (
                <>
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5EFE6]">
                      <tr>{['Date','Vendor','Amount','Mode','Purpose','Ref','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#718096]">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6]">
                      {vendors.map(v => (
                        <tr key={v.id} className="hover:bg-[#F5EFE6]">
                          <td className="px-4 py-3 text-xs text-[#718096]">{new Date(v.date).toLocaleDateString('en-IN')}</td>
                          <td className="px-4 py-3 font-semibold text-[#2d3748]">{v.vendor_name}</td>
                          <td className="px-4 py-3 font-bold text-[#6D94C5]">₹{Number(v.amount).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${v.payment_mode === 'cash' ? 'bg-green-100 text-green-700' : v.payment_mode === 'bank' ? 'bg-blue-100 text-blue-700' : v.payment_mode === 'cheque' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-700'}`}>
                              {v.payment_mode}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#718096] max-w-xs truncate">{v.purpose || '—'}</td>
                          <td className="px-4 py-3 text-xs text-[#718096]">{v.reference_no || '—'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDeleteVendor(v.id)}
                              className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-3 bg-[#F5EFE6] border-t border-[#E8DFCA] flex justify-between">
                    <span className="text-xs text-[#718096]">{vendors.length} entries</span>
                    <span className="text-sm font-bold text-[#6D94C5]">Total: ₹{vendors.reduce((s, v) => s + parseFloat(v.amount), 0).toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-[#718096]">No vendor expenses for {monthName} {year}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 4: CASH LEDGER ── */}
      {tab === 4 && (
        <div className="space-y-4">
          {/* Balance Cards */}
          {balance && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#6D94C5] rounded-2xl p-5 text-white">
                <p className="text-xs text-[#CBDCEB] font-medium">Cash In Hand</p>
                <p className="text-3xl font-bold mt-1">₹{Number(balance.current_balance || 0).toLocaleString('en-IN')}</p>
                <p className="text-xs text-[#CBDCEB] mt-1">{monthName} {year}</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
                <p className="text-xs text-[#718096]">Total Received</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  +₹{(balance.ledger?.filter(l => l.type === 'received').reduce((s, l) => s + parseFloat(l.amount), 0) || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
                <p className="text-xs text-[#718096]">Total Cash Spent</p>
                <p className="text-xl font-bold text-red-500 mt-1">
                  -₹{(balance.ledger?.filter(l => l.type === 'expense').reduce((s, l) => s + parseFloat(l.amount), 0) || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          )}

          {/* What is Cash Ledger — info banner */}
          <div className="bg-[#CBDCEB] rounded-xl p-4 text-xs text-[#2d3748]">
            <p className="font-bold mb-1">What is Cash Ledger?</p>
            <p>Tracks physical cash in hand — opening balance + cash received from clients − cash expenses = cash available right now in the drawer/safe.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setShowReceivedForm(p => !p); setShowOpeningForm(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-all">
              <Plus size={15} /> Cash Received
            </button>
            <button onClick={() => { setShowOpeningForm(p => !p); setShowReceivedForm(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl hover:bg-[#d4cdb8] transition-all">
              <IndianRupee size={15} /> Set Opening Balance
            </button>
          </div>

          {showReceivedForm && <CashReceivedForm onSave={handleReceivedSave} onCancel={() => setShowReceivedForm(false)} />}
          {showOpeningForm && <OpeningBalanceForm month={month} year={year} monthName={monthName} onSave={handleOpeningSave} onCancel={() => setShowOpeningForm(false)} />}

          {/* Cash Received Table */}
          {cashReceived.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E8DFCA]">
                <p className="font-bold text-[#2d3748] text-sm">Cash Received — {monthName} {year}</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-[#F5EFE6]">
                  <tr>{['Date','Amount','Source','Bill No','By'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-[#718096]">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {cashReceived.map(r => (
                    <tr key={r.id} className="hover:bg-[#F5EFE6]">
                      <td className="px-4 py-3 text-xs text-[#718096]">{new Date(r.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3 font-bold text-green-600">+₹{Number(r.amount).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-[#2d3748]">{r.source || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#718096]">{r.bill_no || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#718096]">{r.entered_by_name}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F5EFE6]">
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-xs text-[#718096]">{cashReceived.length} entries</td>
                    <td className="px-4 py-2 font-bold text-green-600 text-sm text-right">
                      ₹{cashReceived.reduce((s, r) => s + parseFloat(r.amount), 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Ledger Timeline */}
          {balance?.ledger?.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E8DFCA]">
                <p className="font-bold text-[#2d3748] text-sm">Ledger — All Transactions</p>
              </div>
              <div className="divide-y divide-[#F5EFE6] max-h-96 overflow-y-auto">
                {[...balance.ledger].reverse().map((l, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-[#F5EFE6]">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${l.type === 'received' || l.type === 'opening' ? 'bg-green-500' : 'bg-red-400'}`} />
                      <div>
                        <p className="text-xs font-medium text-[#2d3748] capitalize">{l.type.replace('_', ' ')}</p>
                        <p className="text-xs text-[#718096]">{l.note || '—'} · {new Date(l.date).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${l.type === 'received' || l.type === 'opening' ? 'text-green-600' : 'text-red-500'}`}>
                        {l.type === 'expense' ? '-' : '+'}₹{Number(l.amount).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-[#718096]">Bal: ₹{Number(l.balance_after).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 5: CATEGORIES ── */}
      {tab === 5 && (
        <div className="space-y-5">
          {/* Create Category */}
          <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
            <h3 className="font-bold text-[#2d3748] mb-5 flex items-center gap-2">
              <Tag size={16} className="text-[#6D94C5]" /> Create New Category
            </h3>
            <form onSubmit={handleCreateCategory}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="e.g. Parking, Cleaning, Repairs..."
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">Type *</label>
                  <select value={newCatType} onChange={e => setNewCatType(e.target.value)} className={inputCls}>
                    <option value="cash">Cash Expense</option>
                    <option value="utility">Utility Bill</option>
                    <option value="vendor">Vendor Payment</option>
                    <option value="labour">Labour</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={catSaving || !newCatName.trim()}
                className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                {catSaving ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>

          {/* All Categories */}
          <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E8DFCA] flex items-center justify-between">
              <p className="font-bold text-[#2d3748]">All Categories</p>
              <span className="text-xs text-[#718096]">{allCategories.length} categories</span>
            </div>
            {allCategories.length ? (
              <div className="divide-y divide-[#F5EFE6]">
                {allCategories.map(c => (
                  <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#F5EFE6]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#CBDCEB] rounded-lg flex items-center justify-center">
                        <Tag size={14} className="text-[#6D94C5]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#2d3748] text-sm">{c.name}</p>
                        <p className="text-xs text-[#718096]">ID: {c.id}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${TYPE_COLORS[c.type] || 'bg-gray-100 text-gray-600'}`}>
                      {c.type.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-[#718096] text-sm">No categories yet</div>
            )}
          </div>

          {/* Info */}
          <div className="bg-[#F5EFE6] rounded-xl p-4 text-xs text-[#718096]">
            <p className="font-bold text-[#2d3748] mb-1">Note about deleting categories</p>
            <p>Categories with existing expense entries cannot be deleted — doing so would break historical records. To remove a category from dropdowns, contact your system administrator to mark it inactive in the database directly.</p>
          </div>
        </div>
      )}
    </div>
  );
}