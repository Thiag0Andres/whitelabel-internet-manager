/* eslint-disable camelcase */
export enum TablesTypes {
  GET_PROVIDERS = '@WhitelabelIM/GET_PROVIDERS',
  GET_CLIENTS = '@WhitelabelIM/GET_CLIENTS',
  GET_SERVICE_PLANS = '@WhitelabelIM/GET_SERVICE_PLANS',
  GET_TRANSACTIONS = '@WhitelabelIM/GET_TRANSACTIONS',
  GET_AUDITLOG = '@WhitelabelIM/GET_AUDITLOG',
}

export interface Providers {
  id: number;
  responsibleName: string;
  cnpj: string;
}

export interface Clients {
  id: number;
  providerId: number;
  planId: number;
  name: string;
  userType: string;
  cpf: string;
  isAccountActive: boolean;
}

export interface ServicePlans {
  id: number;
  providerId: number;
  downloadSpeed: number;
  uploadSpeed: number;
  name: string;
  description: string;
  amount: number;
  maxClients: null;
  environmentType: string;
  technologyType: string;
  type: string;
}

export interface Transactions {
  id: number;
  userId: number;
  takerFullname: string;
  amount: number;
  billet: {
    expireDate: string;
    billetNumber: string;
    billetUrl: string;
    billetStatus: string;
  };
  receipt: {
    emissionDate: string;
    receiptNumber: string;
    receiptUrl: string;
  };
}

export interface AuditLog {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentManagement {
  id: number;
  providerId: number;
  username: string;
  secret: string;
  ip: string;
  type: undefined;
  mkauthPassword: undefined;
  maxClients: string;
  installedMB: undefined;
  ipFallback: undefined;
  snmpCommunity: undefined;
  snmpBoardId: undefined;
  sshActive: boolean;
  sshPort: undefined;
  ftpActive: boolean;
  address?: {
    zipcode?: string;
    state?: string;
    city?: string;
    street?: string;
    neighborhood?: string;
    number?: number;
    ibgeCode?: number;
    complement?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TablesState {
  providers: Providers[];
  clients: Clients[];
  servicePlans: ServicePlans[];
  transactions: Transactions[];
  auditLog: AuditLog[];
  equipmentManagement: EquipmentManagement[];
}
