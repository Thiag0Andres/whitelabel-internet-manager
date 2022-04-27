import { Reducer } from 'redux';
import { TablesTypes, TablesState } from './types';

const INITIAL_STATE: TablesState = {
  providers: [],
  clients: [],
  servicePlans: [],
  transactions: [],
  auditLog: [],
  equipmentManagement: [],
};

const reducer: Reducer<TablesState> = (state = INITIAL_STATE, action) => {
  const updateTable = state;

  switch (action.type) {
    case TablesTypes.GET_PROVIDERS:
      updateTable.providers = action.payload;

      return { ...state, ...updateTable };

    case TablesTypes.GET_CLIENTS:
      updateTable.clients = action.payload;

      return { ...state, ...updateTable };

    case TablesTypes.GET_SERVICE_PLANS:
      updateTable.servicePlans = action.payload;

      return { ...state, ...updateTable };

    case TablesTypes.GET_TRANSACTIONS:
      updateTable.transactions = action.payload;

      return { ...state, ...updateTable };

    case TablesTypes.GET_AUDITLOG:
      updateTable.auditLog = action.payload;

      return { ...state, ...updateTable };

    default:
      return state;
  }
};

export default reducer;
