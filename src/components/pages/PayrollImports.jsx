import React, { useEffect, useState } from 'react';
import { Eye, X, Download, IndianRupee } from 'lucide-react';
import { getPayrollImportsApi } from '../../services/repository/salaryRepository';
import Loader from '../common/Loader';

export default function PayrollImports() {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchImports = async () => {
    setLoading(true);
    try {
      const { data } = await getPayrollImportsApi(limit, offset);
      setImports(data.data.imports || []);
      setTotal(data.data.total || 0);
    } catch {
      setImports([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImports();
  }, [offset]);

  const formatCurrency = (num) => {
    return Number(num || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2d3748]">Payroll Imports History</h2>
        <button onClick={fetchImports}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl hover:bg-[#5a7eb0] transition-all shadow-md">
          <Download size={15} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] p-4">
          <p className="text-sm text-[#718096]">
            Showing <strong>{offset + 1}</strong> to <strong>{Math.min(offset + limit, total)}</strong> of <strong>{total}</strong> imports
          </p>
        </div>
      )}

      {/* Imports Table */}
      {loading ? <Loader /> : imports.length > 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F5EFE6]">
                <tr>{['ID', 'Employee', 'Finalized Amount', 'Deductions', 'Uploaded By', 'Upload Date', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-[#718096] whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE6]">
                {imports.map(r => (
                  <tr key={r.id} className="hover:bg-[#F5EFE6]">
                    <td className="px-4 py-3 text-[#2d3748] font-semibold">#{r.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#2d3748]">{r.employee_name || r.employee_excel_id || 'N/A'}</p>
                        <p className="text-xs text-[#718096]">{r.department}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#6D94C5]">
                      ₹{formatCurrency(r.finalized_amount)}
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">
                      -₹{formatCurrency(r.total_deductions)}
                    </td>
                    <td className="px-4 py-3 text-[#718096]">{r.uploaded_by_name || 'System'}</td>
                    <td className="px-4 py-3 text-xs text-[#718096]">{formatDate(r.uploaded_at)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDetailModal(r)}
                        className="text-xs px-3 py-1.5 bg-[#CBDCEB] text-[#6D94C5] rounded-lg hover:bg-[#6D94C5] hover:text-white transition-all font-medium flex items-center gap-1">
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8DFCA]">
          <IndianRupee size={40} className="text-[#CBDCEB] mx-auto mb-3" />
          <p className="text-[#718096] font-medium">No payroll imports yet</p>
          <p className="text-xs text-[#718096] mt-1">Imported payroll data will appear here</p>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-[#E8DFCA] p-4">
          <button onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 bg-[#E8DFCA] text-[#2d3748] rounded-lg disabled:opacity-50 hover:bg-[#6D94C5] hover:text-white transition disabled:hover:bg-[#E8DFCA] disabled:hover:text-[#2d3748]">
            ← Previous
          </button>
          <span className="text-sm text-[#718096]">
            Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
          </span>
          <button onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="px-4 py-2 bg-[#E8DFCA] text-[#2d3748] rounded-lg disabled:opacity-50 hover:bg-[#6D94C5] hover:text-white transition disabled:hover:bg-[#E8DFCA] disabled:hover:text-[#2d3748]">
            Next →
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-white">
              <div>
                <h3 className="font-bold text-[#2d3748]">Import Details</h3>
                <p className="text-xs text-[#6D94C5]">{detailModal.employee_name} · {formatDate(detailModal.uploaded_at)}</p>
              </div>
              <button onClick={() => setDetailModal(null)}><X size={20} className="text-[#718096]" /></button>
            </div>

            <div className="space-y-4">
              {/* Basic Info */}
              <div className="bg-[#F5EFE6] rounded-xl p-4">
                <p className="text-xs font-bold text-[#718096] mb-3 uppercase">Employee Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#718096]">Employee ID</p>
                    <p className="font-semibold text-[#2d3748]">{detailModal.employee_excel_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Name</p>
                    <p className="font-semibold text-[#2d3748]">{detailModal.employee_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Department</p>
                    <p className="font-semibold text-[#2d3748]">{detailModal.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Designation</p>
                    <p className="font-semibold text-[#2d3748]">{detailModal.designation}</p>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="bg-[#F5EFE6] rounded-xl p-4">
                <p className="text-xs font-bold text-[#718096] mb-3 uppercase">Attendance</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-[#718096]">Full Days</p>
                    <p className="font-semibold text-[#2d3748]">{detailModal.full_day || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Half Days</p>
                    <p className="font-semibold text-[#2d3748]">{detailModal.half_day || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#718096]">Paid Days</p>
                    <p className="font-semibold text-[#2d3748]">{detailModal.paid_days || 0}</p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-[#F5EFE6] rounded-xl p-4">
                <p className="text-xs font-bold text-[#718096] mb-3 uppercase">Earnings</p>
                <div className="space-y-2">
                  {[
                    ['Basic Salary', detailModal.basic_salary],
                    ['Dearness Allowance', detailModal.dearness_allowance],
                    ['House Rent Allowance', detailModal.house_rent_allowance],
                    ['Transportation Allowance', detailModal.transportation_allowance],
                    ['Overtime', detailModal.overtime],
                    ['Gross Income', detailModal.gross_income],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-[#718096]">{label}</span>
                      <span className="font-semibold text-[#2d3748]">₹{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions */}
              <div className="bg-[#F5EFE6] rounded-xl p-4">
                <p className="text-xs font-bold text-[#718096] mb-3 uppercase">Deductions</p>
                <div className="space-y-2">
                  {[
                    ['Provident Fund', detailModal.provident_fund],
                    ['ESIC', detailModal.esic_amount],
                    ['Professional Tax', detailModal.professional_tax],
                    ['Loan & Advance', detailModal.loan_advance],
                    ['Other Deductions', detailModal.other_deductions],
                    ['Total Deductions', detailModal.total_deductions],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-[#718096]">{label}</span>
                      <span className={`font-semibold ${label === 'Total Deductions' ? 'text-red-600' : 'text-[#2d3748]'}`}>
                        -₹{formatCurrency(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Amount */}
              <div className="bg-[#CBDCEB] rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#2d3748]">Finalized Amount</span>
                  <span className="text-2xl font-bold text-[#6D94C5]">₹{formatCurrency(detailModal.finalized_amount)}</span>
                </div>
              </div>

              {/* Bank Details */}
              {detailModal.bank_account_no && (
                <div className="bg-[#F5EFE6] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#718096] mb-3 uppercase">Bank Details</p>
                  <div className="space-y-2">
                    {[
                      ['Bank Name', detailModal.bank_name],
                      ['IFSC Code', detailModal.ifsc_code],
                      ['Account No', detailModal.bank_account_no],
                      ['Branch', detailModal.bank_branch_name],
                      ['Account Type', detailModal.account_type],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-[#718096]">{label}</span>
                        <span className="font-semibold text-[#2d3748]">{value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Info */}
              <div className="bg-[#F5EFE6] rounded-xl p-4 text-xs">
                <p className="text-[#718096]">Uploaded by <strong>{detailModal.uploaded_by_name || 'System'}</strong> on {formatDate(detailModal.uploaded_at)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
