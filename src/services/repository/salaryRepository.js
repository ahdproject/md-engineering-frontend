import Connector from '../Connector';
import APIS from '../Apis';

export const computeSalaryApi     = (data)       => Connector.post(APIS.SALARY_COMPUTE, data);
export const getPayrollApi        = (month, year)=> Connector.get(APIS.SALARY_PAYROLL, { params: { month, year } });
export const getEmployeeSalaryApi = (id, month, year) => Connector.get(APIS.SALARY_EMPLOYEE(id), { params: { month, year } });
export const markPaidApi          = (id, data)   => Connector.patch(APIS.SALARY_MARK_PAID(id), data);
export const getLoanRepayApi      = (id)         => Connector.get(APIS.SALARY_LOAN_REPAY(id));