import * as yup from 'yup';

import { ValidationEmitReceiptFormSchemaType } from '../../services/types';
import { validateDate } from '../../services/validation';

const validationSchema: ValidationEmitReceiptFormSchemaType = {
  transactionIds: yup.array().required('transactionIds é obrigatório'),
  providerId: yup.string().required('providerId é obrigatório'),
  emissionDate: yup
    .string()
    .test('Validate date', 'Data inválida', value => validateDate(value, 'min'))
    .required('Data de emissão é um campo obrigatório'),
  message: yup.string().optional(),
};

export default yup.object().shape(validationSchema);
