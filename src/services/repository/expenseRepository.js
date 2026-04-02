import Connector from '../Connector';
import APIS from '../Apis';

export const getCategoriesApi         = (type)        => Connector.get(APIS.EXPENSE_CATEGORIES, { params: type ? { type } : {} });
export const createCategoryApi        = (data)        => Connector.post(APIS.EXPENSE_CATEGORIES, data);

export const createCashExpenseApi     = (data)        => Connector.post(APIS.CASH_EXPENSES, data);
export const createBulkCashExpenseApi = (data)        => Connector.post(APIS.CASH_EXPENSES_BULK, data);
export const getCashExpensesApi       = (params)      => Connector.get(APIS.CASH_EXPENSES, { params });
export const getCashMonthlySummaryApi = (month, year) => Connector.get(APIS.CASH_EXPENSES_SUMMARY, { params: { month, year } });
export const updateCashExpenseApi     = (id, data)    => Connector.put(APIS.CASH_EXPENSE_BY_ID(id), data);
export const deleteCashExpenseApi     = (id)          => Connector.delete(APIS.CASH_EXPENSE_BY_ID(id));

export const createUtilityBillApi     = (data)        => Connector.post(APIS.UTILITY_BILLS, data);
export const getUtilityBillsApi       = (params)      => Connector.get(APIS.UTILITY_BILLS, { params });
export const markUtilityPaidApi       = (id, data)    => Connector.patch(APIS.UTILITY_BILL_PAID(id), data);

export const createVendorExpenseApi   = (data)        => Connector.post(APIS.VENDOR_EXPENSES, data);
export const getVendorExpensesApi     = (params)      => Connector.get(APIS.VENDOR_EXPENSES, { params });
export const getVendorSummaryApi      = (month, year) => Connector.get(APIS.VENDOR_SUMMARY, { params: { month, year } });
export const updateVendorExpenseApi   = (id, data)    => Connector.put(APIS.VENDOR_EXPENSE_BY_ID(id), data);
export const deleteVendorExpenseApi   = (id)          => Connector.delete(APIS.VENDOR_EXPENSE_BY_ID(id));

export const recordCashReceivedApi    = (data)        => Connector.post(APIS.CASH_RECEIVED, data);
export const getCashReceivedApi       = (params)      => Connector.get(APIS.CASH_RECEIVED, { params });

export const setOpeningBalanceApi     = (data)        => Connector.post(APIS.EXPENSE_OPENING_BALANCE, data);
export const getCashBalanceApi        = (month, year) => Connector.get(APIS.EXPENSE_BALANCE, { params: { month, year } });

export const getMonthlySummaryApi     = (month, year) => Connector.get(APIS.EXPENSE_SUMMARY, { params: { month, year } });