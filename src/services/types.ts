import yup from 'yup';

export interface Options {
  name: string;
  value: any;
}

export interface ServicePlans {
  id?: string;
  name?: string;
  maxClients?: string;
  downloadSpeed?: string;
  uploadSpeed?: string;
  amount?: string;
  environmentType?: string;
  technologyType?: string;
  providerId: string;
  type: string;
  description: string;
  scmAmount: string;
  svaAmount: string;
  planType: string;
  cfop: string;
  icmsTax?: string;
  pisTax?: string;
  cofinsTax?: string;
  ibptTax?: string;
  ibptCityTax?: string;
  ibptStateTax?: string;
  ibptFederalTax?: string;
}

export interface MK {
  id?: string;
  providerId?: string;
  username?: string;
  secret?: string;
  ip?: string;
  type?: string;
  mkauthPassword?: string;
  maxClients?: string;
  installedMB?: string;
  ipFallback?: string;
  snmpCommunity?: string;
  snmpBoardId?: string;
  sshActive: boolean;
  sshPort?: string;
  ftpActive?: boolean;
  address?: {
    zipcode?: string;
    state?: string;
    city?: string;
    street?: string;
    neighborhood?: string;
    number?: number;
    ibgeCode?: string;
    complement?: string;
  };
}
export interface BillOfSale {
  receipt: {
    receiptUrl: string;
    receiptNumber: string;
  };
}
export interface BillsToReceive {
  userId: number;
  takerFullname: string;
  isPaid: boolean;
  isIndividual: boolean;
  billet: {
    billetUrl: string;
    billetStatus: string;
    billetNumber: string;
    chargeId: number;
    expireDate: string;
    total: number;
  };
}

export interface AuditLog {
  id: number;
  activity: string;
  name: string;
  time: string;
  date: string;
  previousState: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface ForgotForm {
  email: string;
}

export interface InfoCEP {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
}

export interface RegisterPerson {
  typePerson?: string;
  providerId: string;
  planId: string;
  mkId: string;
  email: string;
  establishmentEmail: string;
  name: string;
  fantasyName: string;
  socialReason: string;
  stateRegistration: string;
  userType: string;
  gender: string;
  cpf: string;
  cnpj: string;
  rg: string;
  birthDate: string;
  emittingOrgan: string;
  phone: string;
  phone2: string;
  phone3: string;
  address: {
    zipcode: string;
    state: string;
    city: string;
    street: string;
    neighborhood: string;
    number: string;
    complement: string;
    ibgeCode: string;
  };
  attendanceType: string;
  discount: {
    amount: string;
    dueDate: string;
  };
  increment: {
    amount: string;
    dueDate: string;
  };
  dueDate: string;
  tolerance: string;
}

export interface User {
  id?: number;
  socketId?: number;
  providerId?: number;
  planId?: number;
  mkId?: string;
  email?: string;
  establishmentEmail?: string;
  name?: string;
  fantasyName?: string;
  socialReason?: string;
  stateRegistration?: string;
  profilePicture?: string;
  gender?: string;
  userType?: string;
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
  discount?: {
    amount?: string;
    percentage?: number;
    dueDate?: string;
  };
  increment?: {
    amount?: string;
    percentage?: number;
    dueDate?: string;
  };
  dueDate?: string;
  tolerance?: number;
  cpf?: string;
  rg?: string;
  cnpj?: string;
  emittingOrgan?: string;
  phone?: string;
  phone2?: string;
  phone3?: string;
  attendanceType?: string;
  birthDate?: string;
  isAccountAccepted?: boolean;
  isAccountActive?: boolean;
  isAccountCompliant?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Provider {
  id?: string;
  planId?: string;
  responsibleName?: string;
  fantasyName?: string;
  socialReason?: string;
  phone?: string;
  phone2?: string;
  email?: string;
  cpf?: string;
  cnpj?: string;
  url?: string;
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
  bank?: string;
  logoUrl?: string;
  displayName?: string;
  theme1?: string;
  theme2?: string;
  theme3?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePlansForm {
  providerId: string;
  mkId: string;
  type: string;
  downloadSpeed: string;
  uploadSpeed: string;
  name: string;
  description: string;
  amount: string;
  environmentType: string;
  technologyType: string;
  maxClients?: string;
  scmAmount: string;
  svaAmount: string;
  planType: string;
  cfop: string;
  icmsTax?: string;
  pisTax?: string;
  cofinsTax?: string;
  ibptTax?: string;
  ibptCityTax?: string;
  ibptStateTax?: string;
  ibptFederalTax?: string;
}

export interface IReports {
  id: string;
  revenues: string;
  liquidRevenues: string;
  providersCount: string;
  usersCount: string;
  compliantUsersCount: string;
  defaultingUsersCount: string;
  type: string;
  createdAt: string;
  providerId: string;
  inactiveUsersCount: string;
}

export interface IBank {
  code: string | number;
  name: string;
}

export type ValidationLoginSchemaType = {
  [key in keyof Required<LoginForm>]: yup.SchemaOf<unknown>;
};

export type ValidationForgotPasswordSchemaType = {
  [key in keyof Required<ForgotForm>]: yup.SchemaOf<unknown>;
};

export type ValidationRegisterPersonSchemaType = {
  [key in keyof Required<RegisterPerson>]: yup.SchemaOf<unknown>;
};

export type ValidationServicePlansFormSchemaType = {
  [key in keyof Required<ServicePlansForm>]: yup.SchemaOf<unknown>;
};

export interface ListItemMenu {
  name: string;
  subName?: string;
  icon: string;
  routerName: string;
}
