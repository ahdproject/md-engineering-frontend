import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock, Plus, ChevronDown, ChevronUp, X } from 'lucide-react';
import { getEmployeesApi } from '../../services/repository/employeeRepository';
import {
  markAttendanceApi, getByDateApi,
  getMonthlyAllApi, addOvertimeApi
} from '../../services/repository/attendanceRepository';
import Loader from '../common/Loader';

const STATUSES = ['present', 'absent', 'half_day', 'leave', 'holiday'];

const STATUS_STYLE = {
  present:  'bg-green-100 text-green-700',
  absent:   'bg-red-100 text-red-600',
  half_day: 'bg-orange-100 text-orange-600',
  leave:    'bg-blue-100 text-blue-600',
  holiday:  'bg-purple-100 text-purple-600',
};

const TABS = ['Mark Attendance', 'View By Date', 'Monthly Summary'];

export default function Attendance() {
  const [tab, setTab]             = useState(0);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState({ text: '', type: '' });
  const [saving, setSaving]       = useState(false);

  // Mark attendance state
  const [markDate, setMarkDate]   = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords]     = useState([]);

  // View by date
  const [viewDate, setViewDate]   = useState(new Date().toISOString().split('T')[0]);
  const [viewData, setViewData]   = useState(null);
  const [loadingView, setLoadingView] = useState(false);

  // Monthly summary
  const now = new Date();
  const [month, setMonth]         = useState(now.getMonth() + 1);
  const [year, setYear]           = useState(now.getFullYear());
  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  // Overtime modal
  const [otModal, setOtModal]     = useState(null);
  const [otForm, setOtForm]       = useState({ overtime_hours: '', ot_remark: '' });

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    getEmployeesApi().then(({ data }) => {
      const emps = data.data?.employees || [];
      setEmployees(emps);
      setRecords(emps.map(e => ({
        employee_id: e.id,
        name: e.name,
        status: 'present',
        check_in: '09:00',
        check_out: '18:00',
        actual_hours: e.default_daily_hours || 8,
        overtime_hours: 0,
        ot_remark: '',
      })));
    });
  }, []);

  const updateRecord = (empId, field, value) => {
    setRecords(prev => prev.map(r =>
      r.employee_id === empId ? { ...r, [field]: value } : r
    ));
  };

  const handleMarkAttendance = async () => {
    setSaving(true);
    try {
      const payload = {
        date: markDate,
        records: records.map(r => ({
          employee_id:    r.employee_id,
          status:         r.status,
          check_in:       r.status === 'present' || r.status === 'half_day' ? r.check_in : undefined,
          check_out:      r.status === 'present' || r.status === 'half_day' ? r.check_out : undefined,
          actual_hours:   parseFloat(r.actual_hours) || 0,
          overtime_hours: parseFloat(r.overtime_hours) || 0,
          ot_remark:      r.ot_remark || undefined,
        })),
      };
      const { data } = await markAttendanceApi(payload);
      flash(`Attendance marked for ${data.data.saved_count} employees on ${markDate}`);
    } catch (err) {
      flash(err.response?.data?.message || 'Error marking attendance', 'error');
    }
    setSaving(false);
  };

  const fetchByDate = async () => {
    setLoadingView(true);
    try {
      const { data } = await getByDateApi(viewDate);
      setViewData(data.data);
    } catch { setViewData(null); flash('No records for this date', 'error'); }
    setLoadingView(false);
  };

  const fetchMonthly = async () => {
    setLoadingMonth(true);
    try {
      const { data } = await getMonthlyAllApi(month, year);
      setMonthlyData(data.data?.employees || []);
    } catch { setMonthlyData([]); }
    setLoadingMonth(false);
  };

  const handleAddOT = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addOvertimeApi({
        employee_id:    otModal.employee_id,
        date:           viewDate,
        overtime_hours: parseFloat(otForm.overtime_hours),
        ot_remark:      otForm.ot_remark,
      });
      flash('Overtime added');
      setOtModal(null);
      setOtForm({ overtime_hours: '', ot_remark: '' });
      fetchByDate();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-[#2d3748]">Attendance</h2>

      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-[#E8DFCA] p-1 rounded-xl w-fit">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${tab === i ? 'bg-white text-[#6D94C5] shadow-sm' : 'text-[#718096] hover:text-[#2d3748]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab 0 — Mark Attendance */}
      {tab === 0 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5 flex items-center gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#718096] mb-1.5">Date</label>
              <input type="date" value={markDate}
                onChange={e => setMarkDate(e.target.value)}
                className="px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
            </div>
            <div className="flex-1" />
            <div className="flex gap-2 text-xs">
              {Object.entries(STATUS_STYLE).map(([s, cls]) => (
                <span key={s} className={`px-2 py-1 rounded-full font-medium capitalize ${cls}`}>{s.replace('_', ' ')}</span>
              ))}
            </div>
          </div>

          {records.length === 0
            ? <div className="text-center py-12 text-[#718096]">No employees found. Add employees first.</div>
            : (
              <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F5EFE6]">
                    <tr>
                      {['Employee', 'Status', 'Check In', 'Check Out', 'Hours', 'OT Hrs', 'OT Remark'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#718096]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EFE6]">
                    {records.map(r => (
                      <tr key={r.employee_id} className={r.status === 'absent' ? 'bg-red-50/40' : ''}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#CBDCEB] rounded-lg flex items-center justify-center text-xs font-bold text-[#6D94C5]">
                              {r.name.charAt(0)}
                            </div>
                            <span className="font-medium text-[#2d3748] text-xs">{r.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select value={r.status}
                            onChange={e => updateRecord(r.employee_id, 'status', e.target.value)}
                            className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer ${STATUS_STYLE[r.status]}`}>
                            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input type="time" value={r.check_in}
                            disabled={r.status === 'absent' || r.status === 'holiday'}
                            onChange={e => updateRecord(r.employee_id, 'check_in', e.target.value)}
                            className="text-xs px-2 py-1.5 border border-[#E8DFCA] rounded-lg bg-[#F5EFE6] disabled:opacity-40 w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="time" value={r.check_out}
                            disabled={r.status === 'absent' || r.status === 'holiday'}
                            onChange={e => updateRecord(r.employee_id, 'check_out', e.target.value)}
                            className="text-xs px-2 py-1.5 border border-[#E8DFCA] rounded-lg bg-[#F5EFE6] disabled:opacity-40 w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" step="0.5" value={r.actual_hours}
                            disabled={r.status === 'absent' || r.status === 'holiday'}
                            onChange={e => updateRecord(r.employee_id, 'actual_hours', e.target.value)}
                            className="text-xs px-2 py-1.5 border border-[#E8DFCA] rounded-lg bg-[#F5EFE6] disabled:opacity-40 w-16" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" step="0.5" min="0" value={r.overtime_hours}
                            disabled={r.status !== 'present'}
                            onChange={e => updateRecord(r.employee_id, 'overtime_hours', e.target.value)}
                            className="text-xs px-2 py-1.5 border border-[#E8DFCA] rounded-lg bg-[#F5EFE6] disabled:opacity-40 w-16" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" value={r.ot_remark} placeholder="Reason"
                            disabled={parseFloat(r.overtime_hours) === 0}
                            onChange={e => updateRecord(r.employee_id, 'ot_remark', e.target.value)}
                            className="text-xs px-2 py-1.5 border border-[#E8DFCA] rounded-lg bg-[#F5EFE6] disabled:opacity-40 w-32" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-5 py-4 border-t border-[#E8DFCA] flex items-center justify-between">
                  <p className="text-xs text-[#718096]">{records.length} employees</p>
                  <button onClick={handleMarkAttendance} disabled={saving}
                    className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                    {saving ? 'Saving...' : `Save Attendance for ${markDate}`}
                  </button>
                </div>
              </div>
            )
          }
        </div>
      )}

      {/* Tab 1 — View By Date */}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5 flex gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#718096] mb-1.5">Select Date</label>
              <input type="date" value={viewDate} onChange={e => setViewDate(e.target.value)}
                className="px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
            </div>
            <button onClick={fetchByDate}
              className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all">
              Fetch
            </button>
          </div>

          {loadingView ? <Loader /> : viewData && (
            <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              <div className="px-5 py-4 bg-[#F5EFE6] border-b border-[#E8DFCA] flex gap-4">
                {[
                  ['Total', viewData.records?.length || 0],
                  ['Present', viewData.records?.filter(r => r.status === 'present').length || 0],
                  ['Absent', viewData.records?.filter(r => r.status === 'absent').length || 0],
                  ['Half Day', viewData.records?.filter(r => r.status === 'half_day').length || 0],
                ].map(([l, v]) => (
                  <div key={l} className="bg-white rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-[#718096]">{l}</p>
                    <p className="text-lg font-bold text-[#6D94C5]">{v}</p>
                  </div>
                ))}
              </div>
              <table className="w-full text-sm">
                <thead className="bg-[#F5EFE6]">
                  <tr>{['Employee','Status','Check In','Check Out','Hours','OT Hrs','Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-bold text-[#718096]">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {(viewData.records || []).map(r => (
                    <tr key={r.id} className="hover:bg-[#F5EFE6]">
                      <td className="px-4 py-3 font-medium text-[#2d3748]">{r.employee_name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_STYLE[r.status]}`}>
                          {r.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#718096] text-xs">{r.check_in || '—'}</td>
                      <td className="px-4 py-3 text-[#718096] text-xs">{r.check_out || '—'}</td>
                      <td className="px-4 py-3 text-[#2d3748] font-medium">{r.actual_hours}h</td>
                      <td className="px-4 py-3">
                        {parseFloat(r.overtime_hours) > 0
                          ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">+{r.overtime_hours}h OT</span>
                          : <span className="text-xs text-[#718096]">—</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setOtModal(r); setOtForm({ overtime_hours: r.overtime_hours || '', ot_remark: r.ot_remark || '' }); }}
                          className="text-xs px-3 py-1.5 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all font-medium flex items-center gap-1">
                          <Clock size={12} /> OT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2 — Monthly Summary */}
      {tab === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5 flex gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-[#718096] mb-1.5">Month</label>
              <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
                className="px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2025, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
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

          {loadingMonth ? <Loader /> : monthlyData.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F5EFE6]">
                  <tr>{['Employee','Present','Absent','Half Day','Leave','Total Hrs','OT Hrs',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#718096]">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {monthlyData.map(e => (
                    <React.Fragment key={e.employee_id}>
                      <tr className="hover:bg-[#F5EFE6]">
                        <td className="px-4 py-3 font-semibold text-[#2d3748]">{e.employee_name}</td>
                        <td className="px-4 py-3 text-green-600 font-bold">{e.present}</td>
                        <td className="px-4 py-3 text-red-500 font-bold">{e.absent}</td>
                        <td className="px-4 py-3 text-orange-500 font-bold">{e.half_day}</td>
                        <td className="px-4 py-3 text-blue-500 font-bold">{e.leave}</td>
                        <td className="px-4 py-3 text-[#2d3748] font-medium">{Number(e.total_hours).toFixed(1)}h</td>
                        <td className="px-4 py-3">
                          {parseFloat(e.total_overtime) > 0
                            ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">+{Number(e.total_overtime).toFixed(1)}h</span>
                            : <span className="text-[#718096]">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setExpandedRow(expandedRow === e.employee_id ? null : e.employee_id)}
                            className="text-[#718096] hover:text-[#6D94C5]">
                            {expandedRow === e.employee_id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>
                      </tr>
                      {expandedRow === e.employee_id && (
                        <tr>
                          <td colSpan={8} className="px-5 py-4 bg-[#F5EFE6]">
                            <div className="grid grid-cols-5 gap-3">
                              {[
                                ['Present', e.present, 'text-green-600'],
                                ['Absent', e.absent, 'text-red-500'],
                                ['Half Day', e.half_day, 'text-orange-500'],
                                ['Leave', e.leave, 'text-blue-500'],
                                ['Total Days', e.total_days, 'text-[#6D94C5]'],
                              ].map(([l, v, c]) => (
                                <div key={l} className="bg-white rounded-xl p-3 text-center">
                                  <p className="text-xs text-[#718096]">{l}</p>
                                  <p className={`text-xl font-bold ${c}`}>{v}</p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* OT Modal */}
      {otModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#2d3748]">Add Overtime</h3>
                <p className="text-xs text-[#6D94C5]">{otModal.employee_name} · {viewDate}</p>
              </div>
              <button onClick={() => setOtModal(null)}><X size={18} className="text-[#718096]" /></button>
            </div>
            <form onSubmit={handleAddOT} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Overtime Hours</label>
                <input type="number" step="0.5" min="0.5" required value={otForm.overtime_hours}
                  onChange={e => setOtForm(p => ({ ...p, overtime_hours: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Reason</label>
                <input type="text" required value={otForm.ot_remark} placeholder="e.g. Rush order"
                  onChange={e => setOtForm(p => ({ ...p, ot_remark: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setOtModal(null)}
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