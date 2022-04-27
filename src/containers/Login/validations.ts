import * as yup from 'yup';

import { ValidationLoginSchemaType } from '../../services/types';

const validationSchema: ValidationLoginSchemaType = {
  email: yup
    .string()
    .email('Email inválido')
    .required('Email é um campo obrigatório'),
  password: yup.string().required('Senha é um campo obrigatório'),
};

export default yup.object().shape(validationSchema);
