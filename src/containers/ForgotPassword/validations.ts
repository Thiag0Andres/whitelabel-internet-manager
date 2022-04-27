import * as yup from 'yup';

import { ValidationForgotPasswordSchemaType } from '../../services/types';

const validationSchema: ValidationForgotPasswordSchemaType = {
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é um campo obrigatório'),
};

export default yup.object().shape(validationSchema);
