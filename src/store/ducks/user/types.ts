/* eslint-disable camelcase */
/**
 * Action types
 * @UPDATE_USER update user infos
 * @REMOVE_USER remove user infos
 */
export enum UserTypes {
  UPDATE_USER = '@WhitelabelIM/HANDLE_USER',
  REMOVE_USER = '@WhitelabelIM/REMOVE_USER',
}

/**
 * Data types
 * @token : token of user
 * @name : name of user
 */

export interface User {
  id: number;
  socketId?: number;
  providerId?: number;
  planId?: number;
  email: string;
  name: string;
  fantasyName: string;
  socialReason: string;
  stateRegistration: string;
  profilePicture?: string;
  gender: string;
  userType: string;
  address: {
    zipcode: string;
    state: string;
    city: string;
    street: string;
    neighborhood: string;
    number: number;
    ibgeCode: number;
    complement: string;
  };
  discount: {
    amount?: number;
    percentage?: number;
    dueDate?: string;
  };
  increment: {
    amount?: number;
    percentage?: number;
    dueDate?: string;
  };
  dueDate?: string;
  tolerance?: number;
  cpf?: string;
  rg: string;
  cnpj?: string;

  emittingOrgan: string;
  phone?: string;
  phone2: string;
  phone3: string;
  attendanceType: string;
  birthDate?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  firstAccess: boolean;
}

/**
 * State type
 * @data : the constructionCompany
 */
export interface UserState {
  user: User;
}
