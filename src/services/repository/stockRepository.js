import Connector from '../Connector';
import APIS from '../Apis';

export const createEntryApi    = (data)       => Connector.post(APIS.STOCK_ENTRY, data);
export const createBulkApi     = (data)       => Connector.post(APIS.STOCK_BULK, data);
export const getEntryByIdApi   = (id)         => Connector.get(APIS.STOCK_ENTRY_ID(id));
export const updateEntryApi    = (id, data)   => Connector.put(APIS.STOCK_ENTRY_ID(id), data);
export const deleteEntryApi    = (id, data)   => Connector.delete(APIS.STOCK_ENTRY_ID(id), { data });
export const getEntryLogApi    = (id)         => Connector.get(APIS.STOCK_ENTRY_LOG(id));
export const getByDateApi      = (date)       => Connector.get(APIS.STOCK_BY_DATE, { params: { date } });
export const getMonthlyApi     = (month,year) => Connector.get(APIS.STOCK_MONTHLY, { params: { month, year } });
export const getChemHistoryApi = (id)         => Connector.get(APIS.STOCK_CHEM_HISTORY(id));