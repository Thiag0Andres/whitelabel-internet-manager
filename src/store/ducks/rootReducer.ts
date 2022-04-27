import { combineReducers } from 'redux';

import user from './user';
import auth from './auth';
import tables from './tables';

export default combineReducers({
  user,
  auth,
  tables,
});
