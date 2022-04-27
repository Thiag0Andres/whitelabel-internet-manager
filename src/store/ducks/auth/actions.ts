import { action } from 'typesafe-actions';
import { AuthTypes } from './types';

export const login = () => action(AuthTypes.LOGIN);

export const logout = () => action(AuthTypes.LOGOUT);
