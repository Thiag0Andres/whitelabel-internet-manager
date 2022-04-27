/* eslint-disable no-nested-ternary */
import { renderStatus } from '../components/Table';
import {
  formatDate,
  formatHour,
  cnpjMask,
  cpfMask,
  currencyConvert,
  moneyFormat,
} from '../services/mask';

export const CLIENTS_HEADERS = [
  {
    Header: 'id',
    accessor: 'id',
    type: 'not_view',
  },
  {
    Header: 'Nome',
    accessor: 'name',
  },
  {
    Header: 'CPF/CNPJ',
    accessor: (props: any) =>
      props.cnpj ? cnpjMask(String(props.cnpj)) : cpfMask(String(props.cpf)),
  },
  {
    Header: 'Plano',
    accessor: 'planId',
  },
  {
    Header: 'Status',
    accessor: (props: any) => renderStatus(props.status),
  },
  {
    Header: ' ',
    accessor: 'actions_clicks',
    type: 'actions_clicks',
  },
];

export const BILL_OF_SALE_HEADERS = [
  {
    Header: 'id',
    accessor: 'id',
    type: 'not_view',
  },
  {
    Header: 'Nº da nota',
    accessor: 'receipt.receiptNumber',
  },
  {
    Header: 'Tomador',
    accessor: 'takerFullname',
  },
  {
    Header: 'Emissão',
    accessor: 'receipt.emissionDate',
  },
  {
    Header: 'Valor',
    accessor: (props: any) => moneyFormat(Number(props.amount) / 100),
  },
  {
    Header: ' ',
    accessor: 'actions',
    type: 'actions',
  },
  {
    Header: ' ',
    accessor: 'actions_clicks',
    type: 'actions_clicks',
  },
];

export const SERVICE_PLANS_HEADERS = [
  {
    Header: 'id',
    accessor: 'id',
    type: 'not_view',
  },
  {
    Header: 'Plano',
    accessor: 'name',
  },
  {
    Header: 'Download',
    accessor: (props: any) => `${props.downloadSpeed}mb`,
  },
  {
    Header: 'Upload',
    accessor: (props: any) => `${props.uploadSpeed}mb`,
  },
  {
    Header: 'Valor do plano',
    accessor: (props: any) =>
      moneyFormat(Number(currencyConvert(String(props.amount)))),
  },
  {
    Header: 'Tecnologia',
    accessor: 'technologyType',
  },
  {
    Header: ' ',
    accessor: 'actions_clicks',
    type: 'actions_clicks',
  },
];

export const BILLS_TO_RECEIVE_HEADERS = [
  {
    Header: 'id',
    accessor: 'id',
    type: 'not_view',
  },
  {
    Header: 'Vencimento',
    accessor: 'billet.expireDate',
  },
  {
    Header: 'Tomador',
    accessor: 'takerFullname',
  },
  {
    Header: 'Valor do plano',
    accessor: (props: any) => moneyFormat(Number(props.amount) / 100),
  },
  {
    Header: 'Pagamento',
    accessor: (props: any) =>
      formatHour(props.createdAt) === formatHour(props.updatedAt) &&
      formatDate(props.createdAt) === formatDate(props.updatedAt)
        ? ' '
        : formatDate(props.updatedAt),
  },
  {
    Header: 'Nº da nota',
    accessor: (props: any) =>
      props.billet.billetNumber
        ? props.billet.billetNumber
        : props.isIndividual
        ? ''
        : 'carnê',
  },
  {
    Header: 'Status',
    accessor: (props: any) =>
      props.billet.billetStatus
        ? renderStatus(props.billet.billetStatus)
        : props.isPaid
        ? renderStatus('paid')
        : renderStatus('waiting'),
  },
  {
    Header: ' ',
    accessor: 'actions',
    type: 'actions',
  },
  {
    Header: ' ',
    accessor: 'actions_clicks',
    type: 'actions_clicks',
  },
];

export const AUDIT_LOG_HEADERS = [
  {
    Header: 'id',
    accessor: 'id',
    type: 'not_view',
  },
  {
    Header: 'Atividade',
    accessor: 'activity',
  },
  {
    Header: 'Autor',
    accessor: 'name',
  },
  {
    Header: 'Horário',
    accessor: 'time',
  },
  {
    Header: 'Data',
    accessor: 'date',
  },
  {
    Header: ' ',
    accessor: 'actions_clicks',
    type: 'actions_clicks',
  },
];
