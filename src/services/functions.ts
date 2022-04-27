/* eslint-disable consistent-return */
export const groupItems = (arr: any, groupBy: string) =>
  arr.reduce((result: any, item: any) => {
    // eslint-disable-next-line no-param-reassign
    (result[item[groupBy]] = result[item[groupBy]] || []).push(item);
    return result;
  }, {});

export const transformDate = (date: string) => {
  const splitDate = date.split('/') || [];

  const [year, month, day] = [
    Number(splitDate[2]),
    Number(splitDate[1]),
    Number(splitDate[0]),
  ];

  const formattedDate = String(
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  );

  return formattedDate;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const renderTextStatus = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Pago';

    case 'new':
      return 'Novo';

    case 'waiting':
      return 'Pendente';

    case 'unpaid':
      return 'Não Pago';

    case 'expired':
      return 'Expirado';

    case 'up_to_date':
      return 'Em dia';

    case 'finished':
      return 'Finalizado';

    default:
      break;
  }
};
