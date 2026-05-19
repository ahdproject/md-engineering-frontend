import Connector from '../Connector';
import APIS from '../Apis';

// Get all bills with filters
export const getBillsApi = (params) => Connector.get(APIS.BILLS, { params });

// Get single bill by ID
export const getBillByIdApi = (id) => Connector.get(APIS.BILLS_BY_ID(id));

// Create new bill
export const createBillApi = (data) => Connector.post(APIS.BILLS, data);

// Update bill
export const updateBillApi = (id, data) => Connector.put(APIS.BILLS_BY_ID(id), data);

// Delete bill
export const deleteBillApi = (id) => Connector.delete(APIS.BILLS_BY_ID(id));

// Send bill (to customer)
export const sendBillApi = (id, data) => Connector.post(APIS.BILLS_SEND(id), data);

// Sync bills with BMS masters
export const syncBillMastersApi = (data) => Connector.post(APIS.BILLS_SYNC_MASTERS, data);
