import { ListItemMenu } from '../services/types';

export const LIST_MENU_PROVIDER: ListItemMenu[] = [
  {
    name: 'Painel de controle',
    icon: 'PdC',
    routerName: 'dashboard',
  },
  { name: 'Clientes', icon: 'provedores', routerName: 'clients' },
  { name: 'Cadastrar', icon: 'cadastrar', routerName: 'register' },
  { name: 'Notas fiscais', icon: 'NF', routerName: 'bill-of-sale' },
  {
    name: 'Planos de serviço',
    icon: 'PdS',
    routerName: 'service-plans',
  },
  { name: 'Contas a receber', icon: 'CaR', routerName: 'bills-to-receive' },
  { name: 'Log de auditoria', icon: 'LdA', routerName: 'audit-log' },
];
