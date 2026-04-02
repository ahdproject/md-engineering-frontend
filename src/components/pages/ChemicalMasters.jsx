import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, History, Edit2, X, Check } from 'lucide-react';
import { getChemicalsApi, createChemicalApi, updateRateApi, getRateHistoryApi } from '../../services/repository/masterRepository';
import Loader from '../common/Loader';

export default function ChemicalMasters() {
  const [chemicals, setChemicals] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [rateModal, setRateModal] = useState(null);
  const [histModal, setHistModal] = useState(null);
  const [history, setHistory]     = useState([]);
  const [msg, setMsg]             = useState({ text:'', type:'' });

  const [newChem, setNewChem] = useState({ name:'', unit:'ltr', default_rate:'', hsn_code:'9988', gst_rate:18 });
  const [rateForm, setRateForm] = useState({ new_rate:'', effective_from:'', reason:'' });

  const load = async () => {
    setLoading(true);
    try { const { data } = await getChemicalsApi(); setChemicals(data.data?.chemicals || []); }
    catch {} setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const flash = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text:'', type:'' }), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createChemicalApi({ ...newChem, default_rate: parseFloat(newChem.default_rate) });
      flash('Chemical added successfully');
      setShowAdd(false);
      setNewChem({ name:'', unit:'ltr', default_rate:'', hsn_code:'9988', gst_rate:18 });
      load();
    } catch (err) { flash(err.response?.data?.message || 'Error', 'error'); }
  };

  const handleRateChange = async (e) => {
    e.preventDefault();
    try {
      await updateRateApi(rateModal.id, { ...rateForm, new_rate: parseFloat(rateForm.new_rate) });
      flash(`Rate updated for ${rateModal.name}`);
      setRateModal(null);
      setRateForm({ new_rate:'', effective_from:'', reason:'' });
      load();
    } catch (err) { flash(err.response?.data?.message || 'Error', 'error'); }
  };

  const openHistory = async (chem) => {
    setHistModal(chem);
    try { const { data } = await getRateHistoryApi(chem.id); setHistory(data.data?.history || []); }
    catch { setHistory([]); }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2d3748]">Chemical Masters</h2>
        <button onClick={() => setShowAdd(p => !p)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
          <Plus size={16} /> Add Chemical
        </button>
      </div>

      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
          <h3 className="font-bold text-[#2d3748] mb-5">Add New Chemical</h3>
          <form onSubmit={handleAdd}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
              {[['Chemical Name','name','text','BK 67 A'],['Default Rate','default_rate','number','237.07'],['HSN Code','hsn_code','text','9988']].map(([l,k,t,ph]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">{l}</label>
                  <input type={t} required value={newChem[k]} placeholder={ph}
                    onChange={e => setNewChem(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Unit</label>
                <select value={newChem.unit} onChange={e => setNewChem(p => ({ ...p, unit: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
                  <option value="ltr">Litre (ltr)</option>
                  <option value="kgs">Kilograms (kgs)</option>
                  <option value="Nos">Numbers (Nos)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">GST Rate (%)</label>
                <input type="number" value={newChem.gst_rate}
                  onChange={e => setNewChem(p => ({ ...p, gst_rate: parseFloat(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">Add Chemical</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl hover:bg-[#d4cdb8] transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? <Loader /> : (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5EFE6]">
                <tr>{['#','Name','Unit','Current Rate','HSN','GST%','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#718096]">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE6]">
                {chemicals.map((c,i) => (
                  <tr key={c.id} className="hover:bg-[#F5EFE6] transition-colors">
                    <td className="px-4 py-3 text-[#718096] text-xs">{i+1}</td>
                    <td className="px-4 py-3 font-semibold text-[#2d3748]">{c.name}</td>
                    <td className="px-4 py-3"><span className="bg-[#CBDCEB] text-[#6D94C5] text-xs px-2 py-0.5 rounded-full font-medium">{c.unit}</span></td>
                    <td className="px-4 py-3 font-bold text-[#6D94C5]">₹{Number(c.default_rate).toFixed(2)}</td>
                    <td className="px-4 py-3 text-[#718096] text-xs">{c.hsn_code}</td>
                    <td className="px-4 py-3 text-[#718096] text-xs">{c.gst_rate}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setRateModal(c); setRateForm({ new_rate: c.default_rate, effective_from: new Date().toISOString().split('T')[0], reason:'' }); }}
                          className="p-1.5 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all" title="Change Rate">
                          <TrendingUp size={14} />
                        </button>
                        <button onClick={() => openHistory(c)}
                          className="p-1.5 bg-[#E8DFCA] text-[#718096] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all" title="Rate History">
                          <History size={14} />
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

      {/* Rate Change Modal */}
      {rateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#2d3748]">Change Rate</h3>
                <p className="text-xs text-[#6D94C5]">{rateModal.name} · Current: ₹{rateModal.default_rate}</p>
              </div>
              <button onClick={() => setRateModal(null)} className="text-[#718096] hover:text-red-500"><X size={20} /></button>
            </div>
            <form onSubmit={handleRateChange} className="space-y-4">
              {[['New Rate','new_rate','number','245.00'],['Effective From','effective_from','date',''],['Reason','reason','text','Supplier revised price']].map(([l,k,t,ph]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">{l}</label>
                  <input type={t} required value={rateForm[k]} placeholder={ph}
                    onChange={e => setRateForm(p => ({ ...p, [k]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">Update Rate</button>
                <button type="button" onClick={() => setRateModal(null)} className="flex-1 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {histModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#2d3748]">Rate History</h3>
                <p className="text-xs text-[#6D94C5]">{histModal.name}</p>
              </div>
              <button onClick={() => { setHistModal(null); setHistory([]); }} className="text-[#718096] hover:text-red-500"><X size={20} /></button>
            </div>
            {history.length === 0
              ? <p className="text-center text-[#718096] text-sm py-8">No rate changes recorded</p>
              : <div className="space-y-3 max-h-72 overflow-y-auto">
                  {history.map(h => (
                    <div key={h.id} className="bg-[#F5EFE6] rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                        <span className="text-red-500 line-through">₹{h.old_rate}</span>
                        <span className="text-[#718096]">→</span>
                        <span className="text-[#6D94C5]">₹{h.new_rate}</span>
                      </div>
                      <p className="text-xs text-[#718096]">{h.reason}</p>
                      <p className="text-xs text-[#6D94C5] mt-1">by {h.changed_by}</p>
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