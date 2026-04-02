import React, { useEffect, useState } from 'react';
import { Plus, Calendar, BarChart3, History, Trash2, Edit2, X, AlertCircle } from 'lucide-react';
import { getChemicalsApi } from '../../services/repository/masterRepository';
import { createEntryApi, getByDateApi, getMonthlyApi, updateEntryApi, deleteEntryApi, getEntryLogApi } from '../../services/repository/stockRepository';
import Loader from '../common/Loader';

const TABS = ['Date Entry','By Date','Monthly Summary'];

export default function StockEntry() {
  const [tab, setTab]           = useState(0);
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState({ text:'', type:'' });

  // Entry form
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], chemical_id:'', entry_type:'purchase', quantity:'', quantity_unit:'ltr', use_master_rate:true, rate:'', rate_unit:'per ltr', rate_override_reason:'', remark:'' });
  const [saving, setSaving] = useState(false);

  // By date
  const [dateQ, setDateQ]     = useState(new Date().toISOString().split('T')[0]);
  const [dateData, setDateData] = useState(null);
  const [loadingDate, setLoadingDate] = useState(false);

  // Monthly
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());
  const [monthly, setMonthly] = useState(null);
  const [loadingMonth, setLoadingMonth] = useState(false);

  // Edit modal
  const [editEntry, setEditEntry]   = useState(null);
  const [editForm, setEditForm]     = useState({ quantity:'', change_reason:'' });
  const [editSaving, setEditSaving] = useState(false);

  // Audit log modal
  const [logEntry, setLogEntry] = useState(null);
  const [logData, setLogData]   = useState([]);

  const flash = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text:'', type:'' }), 3000); };

  useEffect(() => {
    getChemicalsApi().then(({ data }) => setChemicals(data.data?.chemicals || []));
  }, []);

  // Auto-set unit when chemical changes
  const handleChemChange = (id) => {
    const chem = chemicals.find(c => String(c.id) === String(id));
    setForm(p => ({ ...p, chemical_id: id, quantity_unit: chem?.unit || 'ltr', rate_unit: `per ${chem?.unit || 'ltr'}` }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, chemical_id: parseInt(form.chemical_id), quantity: parseFloat(form.quantity) };
      if (form.use_master_rate) { delete payload.rate; delete payload.rate_override_reason; }
      else payload.rate = parseFloat(form.rate);
      await createEntryApi(payload);
      flash('Stock entry saved successfully');
      setForm(p => ({ ...p, chemical_id:'', quantity:'', remark:'', rate:'', rate_override_reason:'' }));
    } catch (err) { flash(err.response?.data?.message || 'Error saving entry', 'error'); }
    setSaving(false);
  };

  const fetchByDate = async () => {
    setLoadingDate(true);
    try { const { data } = await getByDateApi(dateQ); setDateData(data.data); }
    catch { setDateData(null); flash('No entries found for this date', 'error'); }
    setLoadingDate(false);
  };

  const fetchMonthly = async () => {
    setLoadingMonth(true);
    try { const { data } = await getMonthlyApi(month, year); setMonthly(data.data); }
    catch { setMonthly(null); }
    setLoadingMonth(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      await updateEntryApi(editEntry.id, { quantity: parseFloat(editForm.quantity), change_reason: editForm.change_reason });
      flash('Entry updated. Stock chain recalculated.');
      setEditEntry(null);
      if (tab === 1) fetchByDate();
    } catch (err) { flash(err.response?.data?.message || 'Error', 'error'); }
    setEditSaving(false);
  };

  const handleDelete = async (entry) => {
    const reason = prompt('Enter reason for deletion:');
    if (!reason) return;
    try {
      await deleteEntryApi(entry.id, { reason });
      flash('Entry deleted. Stock chain recalculated.');
      fetchByDate();
    } catch (err) { flash(err.response?.data?.message || 'Error', 'error'); }
  };

  const openLog = async (entry) => {
    setLogEntry(entry);
    try { const { data } = await getEntryLogApi(entry.id); setLogData(data.data?.log || []); }
    catch { setLogData([]); }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <h2 className="text-lg font-bold text-[#2d3748]">Stock Entry</h2>

      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          <AlertCircle size={14} /> {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-[#E8DFCA] p-1 rounded-xl w-fit">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${tab === i ? 'bg-white text-[#6D94C5] shadow-sm' : 'text-[#718096] hover:text-[#2d3748]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0 — Entry Form */}
      {tab === 0 && (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
          <h3 className="font-bold text-[#2d3748] mb-5 flex items-center gap-2">
            <Plus size={18} className="text-[#6D94C5]" /> New Stock Entry
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Date</label>
                <input type="date" required value={form.date}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Chemical</label>
                <select required value={form.chemical_id} onChange={e => handleChemChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
                  <option value="">Select chemical</option>
                  {chemicals.map(c => <option key={c.id} value={c.id}>{c.name} ({c.unit})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Entry Type</label>
                <select value={form.entry_type} onChange={e => setForm(p => ({ ...p, entry_type: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
                  <option value="purchase">Purchase</option>
                  <option value="usage">Usage</option>
                  <option value="adjustment">Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Quantity</label>
                <div className="flex gap-2">
                  <input type="number" step="0.001" required value={form.quantity} placeholder="0.00"
                    onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
                    className="flex-1 px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
                  <span className="px-3 py-2.5 bg-[#CBDCEB] text-[#6D94C5] rounded-xl text-sm font-medium min-w-fit">{form.quantity_unit}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Rate Source</label>
                <div className="flex gap-2 mt-1">
                  {[['Master Rate', true],['Override', false]].map(([l, v]) => (
                    <button key={l} type="button" onClick={() => setForm(p => ({ ...p, use_master_rate: v }))}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${form.use_master_rate === v ? 'bg-[#6D94C5] text-white' : 'bg-[#E8DFCA] text-[#718096]'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {!form.use_master_rate && (
                <div>
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">Override Rate</label>
                  <input type="number" step="0.01" required={!form.use_master_rate} value={form.rate} placeholder="Rate"
                    onChange={e => setForm(p => ({ ...p, rate: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
                </div>
              )}

            </div>

            {!form.use_master_rate && (
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Override Reason</label>
                <input type="text" required={!form.use_master_rate} value={form.rate_override_reason} placeholder="Why is rate different?"
                  onChange={e => setForm(p => ({ ...p, rate_override_reason: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#718096] mb-1.5">Remark (optional)</label>
              <input type="text" value={form.remark} placeholder="e.g. Monthly stock refill"
                onChange={e => setForm(p => ({ ...p, remark: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
            </div>

            <button type="submit" disabled={saving}
              className="px-8 py-3 bg-[#6D94C5] text-white font-semibold text-sm rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all shadow-md">
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 1 — By Date */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Select Date</label>
                <input type="date" value={dateQ} onChange={e => setDateQ(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <button onClick={fetchByDate}
                className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
                Fetch
              </button>
            </div>
          </div>

          {loadingDate ? <Loader /> : dateData && (
            <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              <div className="px-5 py-4 bg-[#F5EFE6] border-b border-[#E8DFCA] flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2d3748]">{dateData.date}</p>
                  <p className="text-xs text-[#6D94C5]">{dateData.entries?.length || 0} entries</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold text-[#6D94C5]">₹{Number(dateData.day_total?.grand_total || 0).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-[#718096]">GST: ₹{Number(dateData.day_total?.total_gst || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5EFE6]">
                    <tr>{['Chemical','Type','Qty','Rate','Stock Before','Stock After','Amount','Actions'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-[#718096]">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFE6]">
                    {(dateData.entries || []).map(e => (
                      <tr key={e.id} className="hover:bg-[#F5EFE6] transition-colors">
                        <td className="px-4 py-3 font-medium text-[#2d3748]">{e.chemical_name}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${e.entry_type === 'purchase' ? 'bg-green-100 text-green-700' : e.entry_type === 'usage' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                            {e.entry_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#2d3748]">{e.quantity} {e.quantity_unit}</td>
                        <td className="px-4 py-3 text-[#6D94C5] font-medium">₹{Number(e.rate).toFixed(2)}</td>
                        <td className="px-4 py-3 text-[#718096]">{e.stock_before}</td>
                        <td className="px-4 py-3 font-semibold text-[#2d3748]">{e.stock_after}</td>
                        <td className="px-4 py-3 font-bold text-[#6D94C5]">₹{Number(e.total_amount).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button onClick={() => { setEditEntry(e); setEditForm({ quantity: e.quantity, change_reason:'' }); }}
                              className="p-1.5 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => openLog(e)}
                              className="p-1.5 bg-[#E8DFCA] text-[#718096] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all">
                              <History size={13} />
                            </button>
                            <button onClick={() => handleDelete(e)}
                              className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2 — Monthly Summary */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5">
            <div className="flex gap-3 items-end">
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Month</label>
                <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
                  className="px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
                  {[...Array(12)].map((_,i) => <option key={i+1} value={i+1}>{new Date(2025,i).toLocaleString('default',{month:'long'})}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Year</label>
                <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))}
                  className="w-28 px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <button onClick={fetchMonthly}
                className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
                Generate
              </button>
            </div>
          </div>

          {loadingMonth ? <Loader /> : monthly && (
            <div className="space-y-4">
              {/* Totals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  ['Total Entries',  monthly.monthly_totals?.total_entries || 0, false],
                  ['Total Sales',    `₹${Number(monthly.monthly_totals?.total_sales_amount || 0).toLocaleString('en-IN')}`, false],
                  ['Total GST',      `₹${Number(monthly.monthly_totals?.total_gst || 0).toLocaleString('en-IN')}`, false],
                  ['Grand Total',    `₹${Number(monthly.monthly_totals?.grand_total || 0).toLocaleString('en-IN')}`, true],
                ].map(([l, v, bold]) => (
                  <div key={l} className="bg-white rounded-xl border border-[#E8DFCA] p-4">
                    <p className="text-xs text-[#718096] font-medium">{l}</p>
                    <p className={`text-xl font-bold mt-1 ${bold ? 'text-[#6D94C5]' : 'text-[#2d3748]'}`}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Chemical breakdown */}
              <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8DFCA]">
                  <p className="font-bold text-[#2d3748]">{monthly.month} {monthly.year} — Chemical Breakdown</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5EFE6]">
                      <tr>{['Chemical','Unit','Purchased','Used','Sales','GST','Total','Entries'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-[#718096]">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6]">
                      {(monthly.chemical_wise_summary || []).map(c => (
                        <tr key={c.chemical_id} className="hover:bg-[#F5EFE6] transition-colors">
                          <td className="px-4 py-3 font-semibold text-[#2d3748]">{c.chemical_name}</td>
                          <td className="px-4 py-3"><span className="bg-[#CBDCEB] text-[#6D94C5] text-xs px-2 py-0.5 rounded-full">{c.unit}</span></td>
                          <td className="px-4 py-3 text-green-600 font-medium">{Number(c.total_purchased).toFixed(3)}</td>
                          <td className="px-4 py-3 text-orange-500 font-medium">{Number(c.total_used).toFixed(3)}</td>
                          <td className="px-4 py-3">₹{Number(c.total_sales_amount).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3">₹{Number(c.total_gst).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 font-bold text-[#6D94C5]">₹{Number(c.total_amount).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-center text-[#718096]">{c.entry_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#2d3748]">Edit Entry</h3>
                <p className="text-xs text-[#6D94C5]">{editEntry.chemical_name} · {editEntry.entry_type}</p>
              </div>
              <button onClick={() => setEditEntry(null)} className="text-[#718096] hover:text-red-500"><X size={20} /></button>
            </div>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">New Quantity</label>
                <input type="number" step="0.001" required value={editForm.quantity}
                  onChange={e => setEditForm(p => ({ ...p, quantity: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Reason for Change</label>
                <input type="text" required value={editForm.change_reason} placeholder="Why are you changing this?"
                  onChange={e => setEditForm(p => ({ ...p, change_reason: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={editSaving}
                  className="flex-1 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                  {editSaving ? 'Saving...' : 'Update Entry'}
                </button>
                <button type="button" onClick={() => setEditEntry(null)}
                  className="flex-1 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {logEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#2d3748]">Audit Log</h3>
                <p className="text-xs text-[#6D94C5]">{logEntry.chemical_name} · Entry #{logEntry.id}</p>
              </div>
              <button onClick={() => { setLogEntry(null); setLogData([]); }} className="text-[#718096] hover:text-red-500"><X size={20} /></button>
            </div>
            {logData.length === 0
              ? <p className="text-center text-[#718096] text-sm py-8">No changes recorded for this entry</p>
              : <div className="space-y-3 max-h-72 overflow-y-auto">
                  {logData.map(l => (
                    <div key={l.id} className="bg-[#F5EFE6] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#6D94C5] uppercase">{l.field_changed}</span>
                        <span className="text-xs text-[#718096]">{new Date(l.changed_at).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-red-500 line-through">{l.old_value}</span>
                        <span className="text-[#718096]">→</span>
                        <span className="text-green-600 font-medium">{l.new_value}</span>
                      </div>
                      <p className="text-xs text-[#718096] mt-1">{l.change_reason}</p>
                      <p className="text-xs text-[#6D94C5] mt-0.5">by {l.changed_by}</p>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>
      )}
    </div>
  );
}