import React, { useEffect, useState } from 'react';
import { Play, CheckCircle, X, IndianRupee, TrendingUp, Users, Upload } from 'lucide-react';
import { computeSalaryApi, getPayrollApi, markPaidApi, uploadPayrollExcelApi } from '../../services/repository/salaryRepository';
import Loader from '../common/Loader';

export default function Salary() {
  const now = new Date();
  const [month, setMonth]         = useState(now.getMonth() + 1);
  const [year, setYear]           = useState(now.getFullYear());
  const [payroll, setPayroll]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [computing, setComputing] = useState(false);
  const [msg, setMsg]             = useState({ text: '', type: '' });
  const [detailModal, setDetailModal] = useState(null);
  const [markPaidModal, setMarkPaidModal] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [computeResult, setComputeResult] = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const { data } = await getPayrollApi(month, year);
      setPayroll(data.data?.payroll || []);
    } catch { setPayroll([]); }
    setLoading(false);
  };

  useEffect(() => { fetchPayroll(); }, [month, year]);

  const handleCompute = async () => {
    setComputing(true);
    setComputeResult(null);
    try {
      const { data } = await computeSalaryApi({ month, year });
      setComputeResult(data.data);
      flash(`Salary computed for ${data.data.processed} employees`);
      fetchPayroll();
    } catch (err) {
      flash(err.response?.data?.message || 'Error computing salary', 'error');
    }
    setComputing(false);
  };

  const handleMarkPaid = async (e) => {
    e.preventDefault();
    setSaving(true);
    const paid_on = e.target.paid_on.value;
    const remarks = e.target.remarks.value;
    try {
      await markPaidApi(markPaidModal.id, { paid_on, remarks });
      flash('Salary marked as paid');
      setMarkPaidModal(null);
      fetchPayroll();
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error');
    }
    setSaving(false);
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const { data } = await uploadPayrollExcelApi(file);
      setUploadResult({ type: 'success', text: `✓ Imported ${data.data.imported} records from Excel` });
      fetchPayroll(); // refresh the table
    } catch (err) {
      setUploadResult({ type: 'error', text: err.response?.data?.message || 'Upload failed' });
    }
    setUploading(false);
    e.target.value = ''; // reset input
  };

  const totals = payroll.reduce(
    (acc, r) => {
      acc.gross  += parseFloat(r.gross_salary   || 0);
      acc.loan   += parseFloat(r.loan_deduction || 0);
      acc.net    += parseFloat(r.net_salary     || 0);
      acc.unpaid += r.is_paid ? 0 : parseFloat(r.net_salary || 0);
      return acc;
    },
    { gross: 0, loan: 0, net: 0, unpaid: 0 }
  );

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2d3748]">Salary Management</h2>
        <button onClick={handleCompute} disabled={computing}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] disabled:opacity-60 transition-all shadow-md">
          <Play size={15} />
          {computing ? 'Computing...' : `Compute ${monthName}`}
        </button>
      </div>

      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Month Selector */}
      <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5 flex gap-4 items-end">
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
      </div>

      {/* Excel Upload Section */}
      <div className="bg-white rounded-2xl border border-[#E8DFCA] p-5 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#2D3748]">Import Payroll from Excel</h3>
            <p className="text-xs text-[#718096] mt-0.5">Upload your .xlsx payroll sheet — all fields will be parsed automatically</p>
          </div>
          <label className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition
            ${uploading
              ? 'bg-[#E8DFCA] text-[#718096] cursor-not-allowed'
              : 'bg-[#6D94C5] text-white hover:bg-[#5A80B0]'}`}>
            <Upload size={15} />
            {uploading ? 'Importing…' : 'Upload Excel'}
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              disabled={uploading}
              onChange={handleExcelUpload}
            />
          </label>
        </div>

        {uploadResult && (
          <div className={`mt-3 px-4 py-2 rounded-xl text-sm font-medium
            ${uploadResult.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {uploadResult.text}
          </div>
        )}
      </div>

      {/* Compute Result */}
      {computeResult && (
        <div className="bg-[#CBDCEB] rounded-2xl p-5">
          <p className="font-bold text-[#2d3748] mb-3">Computation Result — {monthName}</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              ['Processed', computeResult.processed, 'text-[#2d3748]'],
              ['Gross Total', `₹${Number(computeResult.totals?.total_gross_salary || 0).toLocaleString('en-IN')}`, 'text-[#2d3748]'],
              ['Loan Deductions', `₹${Number(computeResult.totals?.total_loan_deduction || 0).toLocaleString('en-IN')}`, 'text-red-600'],
              ['Net Payable', `₹${Number(computeResult.totals?.total_net_salary || 0).toLocaleString('en-IN')}`, 'text-[#6D94C5]'],
            ].map(([l, v, c]) => (
              <div key={l} className="bg-white rounded-xl p-3 text-center">
                <p className="text-xs text-[#718096]">{l}</p>
                <p className={`font-bold text-lg mt-0.5 ${c}`}>{v}</p>
              </div>
            ))}
          </div>
          {computeResult.errors_count > 0 && (
            <div className="mt-3 bg-red-50 rounded-xl p-3">
              <p className="text-xs font-bold text-red-600 mb-1">{computeResult.errors_count} errors:</p>
              {computeResult.errors?.map((e, i) => (
                <p key={i} className="text-xs text-red-500">{e.employee_name}: {e.error}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Cards */}
      {payroll.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Total Employees', payroll.length, Users, 'text-[#6D94C5]'],
            ['Gross Salary', `₹${Number(totals.gross).toLocaleString('en-IN')}`, TrendingUp, 'text-[#6D94C5]'],
            ['Loan Deductions', `₹${Number(totals.loan).toLocaleString('en-IN')}`, IndianRupee, 'text-red-500'],
            ['Net Payable', `₹${Number(totals.net).toLocaleString('en-IN')}`, IndianRupee, 'text-green-600'],
          ].map(([l, v, Icon, c]) => (
            <div key={l} className="bg-white rounded-xl border border-[#E8DFCA] p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F5EFE6] rounded-xl flex items-center justify-center">
                <Icon size={18} className={c} />
              </div>
              <div>
                <p className="text-xs text-[#718096]">{l}</p>
                <p className={`font-bold text-sm ${c}`}>{v}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payroll Table */}
      {loading ? <Loader /> : payroll.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8DFCA]">
            <p className="font-bold text-[#2d3748]">Payroll — {monthName}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5EFE6]">
                <tr>{['Employee','Present','OT Hrs','Base Pay','OT Pay','Gross','Loan Deduction','Net Salary','Status','Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#718096] whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE6]">
                {payroll.map(r => (
                  <tr key={r.id} className="hover:bg-[#F5EFE6]">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#2d3748] text-sm">{r.employee_name}</p>
                      <p className="text-xs text-[#718096]">{r.designation}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-green-600 font-bold">{r.present_days}</span>
                      <span className="text-[#718096] text-xs">/{r.working_days}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {parseFloat(r.total_overtime_hours) > 0
                        ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{r.total_overtime_hours}h</span>
                        : <span className="text-[#718096]">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-[#2d3748]">₹{Number(r.base_salary).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-amber-600">
                      {parseFloat(r.overtime_pay) > 0 ? `₹${Number(r.overtime_pay).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#2d3748]">₹{Number(r.gross_salary).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {parseFloat(r.loan_deduction) > 0
                        ? <span className="text-red-600 font-medium">-₹{Number(r.loan_deduction).toLocaleString('en-IN')}</span>
                        : <span className="text-[#718096]">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 font-bold text-[#6D94C5]">₹{Number(r.net_salary).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {r.is_paid
                        ? <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircle size={13} /> Paid
                          </span>
                        : <span className="text-xs text-orange-500 font-medium">Pending</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setDetailModal(r)}
                          className="text-xs px-3 py-1.5 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all font-medium">
                          View
                        </button>
                        {!r.is_paid && (
                          <button onClick={() => setMarkPaidModal(r)}
                            className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all font-medium">
                            Pay
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#E8DFCA]">
                <tr>
                  <td className="px-4 py-3 font-bold text-[#2d3748] text-xs" colSpan={5}>TOTAL</td>
                  <td className="px-4 py-3 font-bold text-[#2d3748]">₹{Number(totals.gross).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold text-red-600">-₹{Number(totals.loan).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-bold text-[#6D94C5]">₹{Number(totals.net).toLocaleString('en-IN')}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFCA]">
          <IndianRupee size={40} className="text-[#CBDCEB] mx-auto mb-3" />
          <p className="text-[#718096] font-medium">No payroll data for {monthName}</p>
          <p className="text-xs text-[#718096] mt-1">Click "Compute" to generate salary for this month</p>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#2d3748]">Salary Details</h3>
                <p className="text-xs text-[#6D94C5]">{detailModal.employee_name} · {monthName}</p>
              </div>
              <button onClick={() => setDetailModal(null)}><X size={20} className="text-[#718096]" /></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Present Days',    `${detailModal.present_days} / ${detailModal.working_days}`],
                  ['Absent Days',     detailModal.absent_days],
                  ['Total Hours',     `${detailModal.total_default_hours}h`],
                  ['Overtime Hours',  `${detailModal.total_overtime_hours}h`],
                ].map(([l, v]) => (
                  <div key={l} className="bg-[#F5EFE6] rounded-xl p-3">
                    <p className="text-xs text-[#718096]">{l}</p>
                    <p className="font-semibold text-[#2d3748]">{v}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#F5EFE6] rounded-xl p-4 space-y-3">
                {[
                  ['Base Salary',      `₹${Number(detailModal.base_salary).toLocaleString('en-IN')}`,    'text-[#2d3748]'],
                  ['Overtime Pay',     `₹${Number(detailModal.overtime_pay).toLocaleString('en-IN')}`,   'text-amber-600'],
                  ['Gross Salary',     `₹${Number(detailModal.gross_salary).toLocaleString('en-IN')}`,   'text-[#2d3748] font-bold'],
                  ['Loan Deduction',  `-₹${Number(detailModal.loan_deduction).toLocaleString('en-IN')}`, 'text-red-500'],
                  ['Net Salary',       `₹${Number(detailModal.net_salary).toLocaleString('en-IN')}`,     'text-[#6D94C5] font-bold text-lg'],
                ].map(([l, v, c]) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="text-sm text-[#718096]">{l}</span>
                    <span className={`text-sm ${c}`}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-[#CBDCEB] rounded-xl">
                <span className="text-sm font-semibold text-[#2d3748]">Payment Status</span>
                {detailModal.is_paid
                  ? <span className="flex items-center gap-1.5 text-green-600 font-semibold text-sm">
                      <CheckCircle size={16} /> Paid on {new Date(detailModal.paid_on).toLocaleDateString('en-IN')}
                    </span>
                  : <span className="text-orange-500 font-semibold text-sm">Pending</span>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Paid Modal */}
      {markPaidModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2d3748]">Mark as Paid</h3>
              <button onClick={() => setMarkPaidModal(null)}><X size={18} className="text-[#718096]" /></button>
            </div>
            <p className="text-sm text-[#718096] mb-4">
              Mark <strong>{markPaidModal.employee_name}</strong>'s salary of{' '}
              <strong className="text-[#6D94C5]">₹{Number(markPaidModal.net_salary).toLocaleString('en-IN')}</strong> as paid?
            </p>
            <form onSubmit={handleMarkPaid} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Payment Date</label>
                <input name="paid_on" type="date" required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Remarks (optional)</label>
                <input name="remarks" type="text" placeholder="e.g. Paid via ICICI bank transfer"
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 disabled:opacity-60 transition-all">
                  {saving ? 'Saving...' : 'Confirm Payment'}
                </button>
                <button type="button" onClick={() => setMarkPaidModal(null)}
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