// Get API base URL from environment or use default
let BASE = import.meta.env.VITE_API_BASE_URL;

// Fallback for production if env var is not set
if (!BASE || BASE === 'undefined' || BASE === '') {
  BASE = 'https://m-and-d-engineering-production.up.railway.app/api';
}

// Ensure BASE ends without trailing slash
BASE = BASE?.replace(/\/$/, '');

// Debug: Log the API base URL
if (typeof window !== 'undefined') {
  console.log('🔗 API Base URL:', BASE);
  console.log('🔍 Environment:', import.meta.env.MODE);
}

const APIS = {
  // Auth
  LOGIN:   `${BASE}/auth/login`,
  LOGOUT:  `${BASE}/auth/logout`,
  PROFILE: `${BASE}/auth/profile`,
  REFRESH: `${BASE}/auth/refresh`,

  // Users
  USERS:            `${BASE}/users`,
  USER_BY_ID:       (id) => `${BASE}/users/${id}`,
  USER_PERMISSIONS: (id) => `${BASE}/users/${id}/permissions`,

  // Chemical Masters
  CHEMICALS:          `${BASE}/masters/chemicals`,
  CHEMICAL_BY_ID:     (id) => `${BASE}/masters/chemicals/${id}`,
  CHEMICAL_RATE:      (id) => `${BASE}/masters/chemicals/${id}/rate`,
  CHEMICAL_RATE_HIST: (id) => `${BASE}/masters/chemicals/${id}/rate-history`,

  // Material Masters
  MATERIALS:          `${BASE}/masters/materials`,
  MATERIAL_BY_ID:     (id) => `${BASE}/masters/materials/${id}`,
  MATERIAL_RATE:      (id) => `${BASE}/masters/materials/${id}/rate`,
  MATERIAL_RATE_HIST: (id) => `${BASE}/masters/materials/${id}/rate-history`,

  // Stock
  STOCK_ENTRY:        `${BASE}/stock/entry`,
  STOCK_ENTRY_ID:     (id) => `${BASE}/stock/entry/${id}`,
  STOCK_ENTRY_LOG:    (id) => `${BASE}/stock/entry/${id}/log`,
  STOCK_BULK:         `${BASE}/stock/entry/bulk`,
  STOCK_BY_DATE:      `${BASE}/stock/date`,
  STOCK_DATE_RANGE:   `${BASE}/stock/date-range`,
  STOCK_MONTHLY:      `${BASE}/stock/monthly`,
  STOCK_CHEM_HISTORY: (id) => `${BASE}/stock/chemical/${id}/history`,

  // Employees
  EMPLOYEES:           `${BASE}/employees`,
  EMPLOYEE_BY_ID:      (id) => `${BASE}/employees/${id}`,
  EMPLOYEE_SALARY_CFG: (id) => `${BASE}/employees/${id}/salary-config`,

  // Attendance
  ATTENDANCE:          `${BASE}/attendance`,
  ATTENDANCE_DATE:     `${BASE}/attendance/date`,
  ATTENDANCE_MONTHLY:  `${BASE}/attendance/monthly`,
  ATTENDANCE_EMP_MON:  (id) => `${BASE}/attendance/employee/${id}/monthly`,
  ATTENDANCE_OVERTIME: `${BASE}/attendance/overtime`,
  ATTENDANCE_BY_ID:    (id) => `${BASE}/attendance/${id}`,

  // Loans
  LOANS:               `${BASE}/loans`,
  LOAN_BY_ID:          (id)  => `${BASE}/loans/${id}`,
  LOAN_BY_EMPLOYEE:    (id)  => `${BASE}/loans/employee/${id}`,
  LOAN_PENDING_EMIS:   `${BASE}/loans/pending-emis`,
  LOAN_CANCEL:         (id)  => `${BASE}/loans/${id}/cancel`,
  LOAN_WAIVE_EMI:      (id)  => `${BASE}/loans/emi/${id}/waive`,

  // Salary
  SALARY_COMPUTE:        `${BASE}/salary/compute`,
  SALARY_UPLOAD_PAYROLL: `${BASE}/salary/upload-payroll`,
  SALARY_PAYROLL_IMPORTS: `${BASE}/salary/payroll-imports`,
  SALARY_PAYROLL:        `${BASE}/salary/payroll`,
  SALARY_EMPLOYEE:       (id)  => `${BASE}/salary/employee/${id}`,
  SALARY_MARK_PAID:      (id)  => `${BASE}/salary/${id}/mark-paid`,
  SALARY_LOAN_REPAY:     (id)  => `${BASE}/salary/loan-repayments/${id}`,

  // Expenses
  EXPENSE_CATEGORIES:   `${BASE}/expenses/categories`,
  CASH_EXPENSES:        `${BASE}/expenses/cash`,
  CASH_EXPENSES_BULK:   `${BASE}/expenses/cash/bulk`,
  CASH_EXPENSES_SUMMARY:`${BASE}/expenses/cash/monthly-summary`,
  CASH_EXPENSE_BY_ID:   (id) => `${BASE}/expenses/cash/${id}`,
  UTILITY_BILLS:        `${BASE}/expenses/utility`,
  UTILITY_BILL_PAID:    (id) => `${BASE}/expenses/utility/${id}/paid`,
  VENDOR_EXPENSES:      `${BASE}/expenses/vendor`,
  VENDOR_EXPENSE_BY_ID: (id) => `${BASE}/expenses/vendor/${id}`,
  VENDOR_SUMMARY:       `${BASE}/expenses/vendor/summary`,
  CASH_RECEIVED:        `${BASE}/expenses/cash-received`,
  EXPENSE_OPENING_BALANCE: `${BASE}/expenses/balance/opening`,
  EXPENSE_BALANCE:      `${BASE}/expenses/balance`,
  EXPENSE_SUMMARY:      `${BASE}/expenses/summary`,

  // Bills (NEW)
  BILLS:              `${BASE}/bills`,
  BILLS_BY_ID:        (id) => `${BASE}/bills/${id}`,
  BILLS_SEND:         (id) => `${BASE}/bills/${id}/send`,
  BILLS_SYNC_MASTERS: `${BASE}/bills/sync/masters`,
};

export default APIS;