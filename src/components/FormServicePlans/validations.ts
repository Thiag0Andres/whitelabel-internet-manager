import * as yup from 'yup';

import { ValidationServicePlansFormSchemaType } from '../../services/types';

const validationSchema: ValidationServicePlansFormSchemaType = {
  providerId: yup.string().required('ProviderId é obrigatório'),
  mkId: yup.string().required('mkId é obrigatório'),
  type: yup.string().required('Tipo é obrigatório'),
  downloadSpeed: yup.string().required('Download é um campo obrigatório'),
  uploadSpeed: yup.string().required('Upload é um campo obrigatório'),
  name: yup.string().required('Nome é um campo obrigatório'),
  maxClients: yup
    .string()
    .required('Máximo de clientes é um campo obrigatório'),
  description: yup.string().optional(),
  amount: yup.string().required('Valor é um campo obrigatório'),
  environmentType: yup.string().required('Tipo do meio é um campo obrigatório'),
  technologyType: yup
    .string()
    .required('Tipo de tecnologia é um campo obrigatório'),
  cfop: yup.string().required('CFOP é um campo obrigatório'),
  planType: yup.string().required('planType é um campo obrigatório'),
  scmAmount: yup.string().optional(),
  svaAmount: yup.string().optional(),
  icmsTax: yup.string().optional(),
  pisTax: yup.string().optional(),
  cofinsTax: yup.string().optional(),
  ibptTax: yup.string().optional(),
  ibptCityTax: yup.string().optional(),
  ibptStateTax: yup.string().optional(),
  ibptFederalTax: yup.string().optional(),
};

export default yup.object().shape(validationSchema);
