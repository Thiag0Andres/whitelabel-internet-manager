import * as yup from 'yup';

import { ValidationRedefinePasswordSchemaType } from '../../services/types';

const validationSchema: ValidationRedefinePasswordSchemaType = {
  token: yup.string().required('Token é obrigatório'),
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é um campo obrigatório'),
  password: yup.string().required('Senha é um campo obrigatório'),
  confirmPassword: yup
    .string()
    .required('Confirmar senha é um campo obrigatório'),
};

export default yup.object().shape(validationSchema);
