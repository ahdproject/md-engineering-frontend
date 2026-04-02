import Connector from '../Connector';
import APIS from '../Apis';

export const getChemicalsApi    = ()        => Connector.get(APIS.CHEMICALS);
export const getChemByIdApi     = (id)      => Connector.get(APIS.CHEMICAL_BY_ID(id));
export const createChemicalApi  = (data)    => Connector.post(APIS.CHEMICALS, data);
export const updateChemicalApi  = (id,data) => Connector.put(APIS.CHEMICAL_BY_ID(id), data);
export const updateRateApi      = (id,data) => Connector.put(APIS.CHEMICAL_RATE(id), data);
export const getRateHistoryApi  = (id)      => Connector.get(APIS.CHEMICAL_RATE_HIST(id));