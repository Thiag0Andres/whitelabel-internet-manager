import * as yup from 'yup';

import { ValidationRegisterProviderSchemaType } from '../../services/types';
import {
  validateDate,
  validateCpf,
  checkName,
} from '../../services/validation';

const validationSchema: ValidationRegisterProviderSchemaType = {
  planId: yup.string().required('Plano é obrigatório'),
  name: yup
    .string()
    .test('Validate name', 'Nome não pode ser simplificado', value =>
      checkName(String(value)),
    )
    .required('Nome do Responsável é um campo obrigatório'),
  gender: yup.string().required('Sexo é um campo obrigatório'),
  fantasyName: yup.string().required('Nome fantasia é um campo obrigatório'),
  socialReason: yup.string().required('Razão social é um campo obrigatório'),
  stateRegistration: yup.string().optional(),
  userType: yup.string().required('Tipo de usuário obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é um campo obrigatório'),
  establishmentEmail: yup
    .string()
    .email('Email inválido')
    .required('Email é um campo obrigatório'),
  cpf: yup
    .string()
    .test('Validate cpf', 'CPF inválido', value => validateCpf(String(value)))
    .required('CPF é um campo obrigatório'),
  cnpj: yup.string().required('CNPJ é um campo obrigatório'),
  rg: yup.string().required('RG é um campo obrigatório'),
  emittingOrgan: yup.string().required('Orgão emissor é um campo obrigatório'),
  birthDate: yup
    .string()
    .test('Validate date', 'Data inválida', value => validateDate(value, 'min'))
    .required('Data de nascimento é um campo obrigatório'),
  phone: yup.string().required('Celular é um campo obrigatório'),
  phone2: yup.string().optional(),
  phone3: yup.string().required('Celular é um campo obrigatório'),
  url: yup.string().optional(),
  address: yup.object().shape({
    zipcode: yup.string().required('CEP é um campo obrigatório'),
    state: yup.string().required('UF é um campo obrigatório'),
    city: yup.string().required('Cidade é um campo obrigatório'),
    street: yup.string().required('Logradouro é um campo obrigatório'),
    neighborhood: yup.string().required('Bairro é um campo obrigatório'),
    number: yup.string().required('Número é um campo obrigatório'),
    complement: yup.string().optional(),
    ibgeCode: yup.string().required('IbgeCode é obrigatório'),
  }),
};

export default yup.object().shape(validationSchema);
