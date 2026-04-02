import Connector from '../Connector';
import APIS from '../Apis';

export const getUsersApi       = ()         => Connector.get(APIS.USERS);
export const getUserByIdApi    = (id)        => Connector.get(APIS.USER_BY_ID(id));
export const createUserApi     = (data)      => Connector.post(APIS.USERS, data);
export const updatePermApi     = (id, data)  => Connector.patch(APIS.USER_PERMISSIONS(id), data);
export const deactivateUserApi = (id)        => Connector.delete(APIS.USER_BY_ID(id));