import Connector from '../Connector';
import APIS from '../Apis';

export const getEmployeesApi      = ()         => Connector.get(APIS.EMPLOYEES);
export const getEmployeeByIdApi   = (id)        => Connector.get(APIS.EMPLOYEE_BY_ID(id));
export const createEmployeeApi    = (data)      => Connector.post(APIS.EMPLOYEES, data);
export const updateEmployeeApi    = (id, data)  => Connector.put(APIS.EMPLOYEE_BY_ID(id), data);
export const setSalaryConfigApi   = (id, data)  => Connector.post(APIS.EMPLOYEE_SALARY_CFG(id), data);
export const getSalaryConfigApi   = (id)        => Connector.get(APIS.EMPLOYEE_SALARY_CFG(id));