import { action } from 'typesafe-actions';
import {
  TablesTypes,
  Providers,
  Clients,
  ServicePlans,
  Transactions,
  AuditLog,
  EquipmentManagement,
} from './types';

export const populateProviders = (data: Providers[]) =>
  action(TablesTypes.GET_PROVIDERS, data);

export const populateClients = (data: Clients[]) =>
  action(TablesTypes.GET_CLIENTS, data);

export const populateServicePlans = (data: ServicePlans[]) =>
  action(TablesTypes.GET_SERVICE_PLANS, data);

export const populateTransactions = (data: Transactions[]) =>
  action(TablesTypes.GET_TRANSACTIONS, data);

export const populateAuditLog = (data: AuditLog[]) =>
  action(TablesTypes.GET_AUDITLOG, data);
