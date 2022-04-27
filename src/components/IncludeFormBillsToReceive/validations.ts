import * as yup from 'yup';

import { ValidationEmitBilletSchemaType } from '../../services/types';
import { validateDate } from '../../services/validation';

const validationSchema: ValidationEmitBilletSchemaType = {
  isIndividual: yup.boolean().optional(),
  institution: yup.string().when('isIndividual', {
    is: Boolean(0),
    then: yup.string().required('Instituição é um campo obrigatório'),
  }),
  userId: yup.string().optional(),
  expireDate: yup
    .string()
    .test('Validate date', 'Data inválida', value => validateDate(value, 'max'))
    .required('Data de vencimento é um campo obrigatório'),
  amount: yup.string().required('Valor é um campo obrigatório'),
  message: yup.string().optional(),
};

export default yup.object().shape(validationSchema);
