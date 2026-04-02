import Connector from '../Connector';
import APIS from '../Apis';

export const createLoanApi      = (data)       => Connector.post(APIS.LOANS, data);
export const getAllLoansApi     = (params)     => Connector.get(APIS.LOANS, { params });
export const getLoanByIdApi     = (id)         => Connector.get(APIS.LOAN_BY_ID(id));
export const getLoanByEmployeeApi = (id)       => Connector.get(APIS.LOAN_BY_EMPLOYEE(id));
export const getPendingEmisApi  = ()           => Connector.get(APIS.LOAN_PENDING_EMIS);
export const cancelLoanApi      = (id, data)   => Connector.post(APIS.LOAN_CANCEL(id), data);
export const waiveEmiApi        = (id, data)   => Connector.post(APIS.LOAN_WAIVE_EMI(id), data);