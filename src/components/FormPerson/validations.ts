import * as yup from 'yup';

import { ValidationRegisterPersonSchemaType } from '../../services/types';
import {
  validateDate,
  validateCpf,
  checkName,
} from '../../services/validation';

const validationSchema: ValidationRegisterPersonSchemaType = {
  typePerson: yup.string().optional(),
  providerId: yup.string().required('providerId é obrigatório'),
  planId: yup.string().required('planId é obrigatório'),
  mkId: yup.string().required('mkId é obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é um campo obrigatório'),
  establishmentEmail: yup.string().when('typePerson', {
    is: 'Pessoa Jurídica',
    then: yup
      .string()
      .email('Email inválido')
      .required('Email é um campo obrigatório'),
  }),
  name: yup
    .string()
    .test('Validate name', 'Nome não pode ser simplificado', value =>
      checkName(String(value)),
    )
    .required('Nome é um campo obrigatório'),
  fantasyName: yup.string().when('typePerson', {
    is: 'Pessoa Jurídica',
    then: yup.string().required('Nome fantasia é um campo obrigatório'),
  }),
  socialReason: yup.string().when('typePerson', {
    is: 'Pessoa Jurídica',
    then: yup.string().required('Razão social é um campo obrigatório'),
  }),
  stateRegistration: yup.string().when('typePerson', {
    is: 'Pessoa Jurídica',
    then: yup.string().optional(),
  }),
  gender: yup.string().required('Sexo é um campo obrigatório'),
  userType: yup.string().required('Tipo de usuário obrigatório'),
  cpf: yup
    .string()
    .test('Validate cpf', 'CPF inválido', value => validateCpf(String(value)))
    .required('CPF é um campo obrigatório'),
  cnpj: yup.string().when('typePerson', {
    is: 'Pessoa Jurídica',
    then: yup.string().required('CNPJ é um campo obrigatório'),
  }),
  rg: yup.string().required('RG é um campo obrigatório'),
  emittingOrgan: yup.string().required('Orgão emissor é um campo obrigatório'),
  birthDate: yup
    .string()
    .test('Validate date', 'Data inválida', value => validateDate(value, 'min'))
    .required('Data de nascimento é um campo obrigatório'),
  phone: yup.string().required('Celular é um campo obrigatório'),
  phone2: yup.string().when('typePerson', {
    is: 'Pessoa Jurídica',
    then: yup.string().optional(),
  }),
  phone3: yup
    .string()
    .required('Celular é um campo obrigatório')
    .when('typePerson', {
      is: 'Pessoa Jurídica',
      then: yup.string().required('Celular é um campo obrigatório'),
    }),
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
  attendanceType: yup
    .string()
    .required('Tipo de atendimento é um campo obrigatório'),
  discount: yup
    .object()
    .optional()
    .shape({
      amount: yup.string().optional(),
      dueDate: yup
        .string()
        .test('Validate date', 'Data inválida', value =>
          validateDate(value, 'max'),
        )
        .optional(),
    }),
  increment: yup
    .object()
    .optional()
    .shape({
      amount: yup.string().optional(),
      dueDate: yup
        .string()
        .test('Validate date', 'Data inválida', value =>
          validateDate(value, 'max'),
        )
        .optional(),
    }),
  dueDate: yup.string().required('Dia de pagamento é um campo obrigatório'),
  tolerance: yup.string().required('Tolerância é um campo obrigatório'),
};

export default yup.object().shape(validationSchema);
