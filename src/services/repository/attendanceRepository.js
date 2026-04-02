import Connector from '../Connector';
import APIS from '../Apis';

export const markAttendanceApi    = (data)           => Connector.post(APIS.ATTENDANCE, data);
export const getByDateApi         = (date)           => Connector.get(APIS.ATTENDANCE_DATE, { params: { date } });
export const getMonthlyAllApi     = (month, year)    => Connector.get(APIS.ATTENDANCE_MONTHLY, { params: { month, year } });
export const getEmployeeMonthApi  = (id, month, year)=> Connector.get(APIS.ATTENDANCE_EMP_MON(id), { params: { month, year } });
export const addOvertimeApi       = (data)           => Connector.post(APIS.ATTENDANCE_OVERTIME, data);
export const updateAttendanceApi  = (id, data)       => Connector.put(APIS.ATTENDANCE_BY_ID(id), data);