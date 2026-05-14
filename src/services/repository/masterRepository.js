import Connector from '../Connector';
import APIS from '../Apis';

// Chemicals
export const getChemicalsApi    = ()        => Connector.get(APIS.CHEMICALS);
export const getChemByIdApi     = (id)      => Connector.get(APIS.CHEMICAL_BY_ID(id));
export const createChemicalApi  = (data)    => Connector.post(APIS.CHEMICALS, data);
export const updateChemicalApi  = (id,data) => Connector.put(APIS.CHEMICAL_BY_ID(id), data);
export const deleteChemicalApi  = (id)      => Connector.delete(APIS.CHEMICAL_BY_ID(id));
export const updateRateApi      = (id,data) => Connector.put(APIS.CHEMICAL_RATE(id), data);
export const getRateHistoryApi  = (id)      => Connector.get(APIS.CHEMICAL_RATE_HIST(id));

// Materials
export const getMaterialsApi    = ()        => Connector.get(APIS.MATERIALS);
export const getMatByIdApi      = (id)      => Connector.get(APIS.MATERIAL_BY_ID(id));
export const createMaterialApi  = (data)    => Connector.post(APIS.MATERIALS, data);
export const updateMaterialApi  = (id,data) => Connector.put(APIS.MATERIAL_BY_ID(id), data);
export const deleteMaterialApi  = (id)      => Connector.delete(APIS.MATERIAL_BY_ID(id));
export const updateMatRateApi   = (id,data) => Connector.put(APIS.MATERIAL_RATE(id), data);
export const getMatRateHistApi  = (id)      => Connector.get(APIS.MATERIAL_RATE_HIST(id));