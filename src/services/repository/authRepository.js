import Connector from '../Connector';
import APIS from '../Apis';

export const loginApi    = (data) => Connector.post(APIS.LOGIN, data);
export const logoutApi   = ()     => Connector.post(APIS.LOGOUT);
export const profileApi  = ()     => Connector.get(APIS.PROFILE);