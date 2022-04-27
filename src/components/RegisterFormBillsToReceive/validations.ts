import * as yup from 'yup';

import { ValidationMultiplebilletSchemaType } from '../../services/types';
import { validateDate } from '../../services/validation';

const validationSchema: ValidationMultiplebilletSchemaType = {
  type: yup.string().required('type obrigatório'),
  userId: yup.string().required('userId obrigatório'),
  dueDate: yup
    .string()
    .test('Validate date', 'Data inválida', value => validateDate(value, 'max'))
    .required('Data de vencimeto é um campo obrigatório'),
  installments: yup.string().required('Quantidades de boletos é obrigatório'),
};

export default yup.object().shape(validationSchema);
