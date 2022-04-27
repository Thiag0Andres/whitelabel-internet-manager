/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import './styles.scss';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from 'react-table';
import { Form } from 'react-bootstrap';
import { Pagination as PaginateMUI } from '@material-ui/lab';

// Icons
import { Icon } from '@iconify/react';
import { ReactComponent as ArrowDownIcon } from '../../images/icons/arrow-down.svg';
import { ReactComponent as ArrowUpIcon } from '../../images/icons/arrow-up.svg';
import { ReactComponent as ArrowDefaultIcon } from '../../images/icons/arrow-default.svg';

interface IActions {
  icon: {
    name: string;
    type: any;
  };
  onClick: (param: string) => void;
}
interface TableProps {
  onViewClick?: (id: number) => void;
  onChange?: (e: any) => void;
  columns: Array<any>;
  data: Array<any>;
  actions?: IActions[];
  valueInputFilter?: string;
  viewAction?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const renderStatus = (status: string) => {
  switch (status) {
    case 'compliant':
      return <span className="active">Ativo</span>;

    case 'inactive':
      return <span className="blocked">Bloqueado</span>;

    case 'defaulting':
      return <span className="defaulter">Inadimplente</span>;

    case 'paid':
      return <span className="active">Pago</span>;

    case 'new':
      return <span className="active">Novo</span>;

    case 'waiting':
      return <span className="defaulter">Pendente</span>;

    case 'unpaid':
      return <span className="defaulter">Não Pago</span>;

    case 'expired':
      return <span className="blocked">Expirado</span>;

    case 'up_to_date':
      return <span className="defaulter">Em dia</span>;

    case 'finished':
      return <span className="active">Finalizado</span>;

    default:
      break;
  }
};

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onViewClick,
  actions,
  onChange,
  valueInputFilter,
  viewAction,
}: TableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setGlobalFilter,
    pageOptions,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    setGlobalFilter(valueInputFilter);
  }, [valueInputFilter]);

  const [isHover, setIsHover] = useState(false);

  const colors = {
    standard_color: '#CCD1E6',
    hover_eyeIcon: '#011A2C',
    hover_trashIcon: '#db324f',
  };

  return (
    <div className="container-table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(
                (column: any) =>
                  column.type !== 'not_view' && (
                    <th
                      key={+column.id / 999}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.type !== 'actions' &&
                        column.type !== 'actions_clicks' && (
                          <div className="header-container">
                            {column.render('Header')}
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <ArrowDownIcon />
                              ) : (
                                <ArrowUpIcon />
                              )
                            ) : (
                              <ArrowDefaultIcon />
                            )}
                          </div>
                        )}
                    </th>
                  ),
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any, index: any) => {
                  return (
                    <>
                      {cell.column.type !== 'not_view' && (
                        <td
                          key={`${cell.value}_${index}`}
                          onClick={() => {
                            return onViewClick
                              ? onViewClick(row.original.id)
                              : null;
                          }}
                        >
                          {cell.value}
                        </td>
                      )}
                      {cell.column.type === 'actions' &&
                        viewAction !== 'notShow' && (
                          <td>
                            <Form.Check
                              inline
                              name="id"
                              value={row.original.id}
                              type="checkbox"
                              onChange={onChange ? e => onChange(e) : undefined}
                            />
                          </td>
                        )}
                      {cell.column.type === 'actions_clicks' && (
                        <td>
                          <div className="container-table-icon">
                            {actions?.map((action, index) => {
                              const { icon, onClick } = action;
                              return (
                                <button
                                  type="button"
                                  className={`icon-button ${String(icon.name)}`}
                                  key={index.toString()}
                                  onClick={() => onClick(cell.row.original.id)}
                                  onMouseOver={() => setIsHover(true)}
                                  onMouseOut={() => setIsHover(false)}
                                >
                                  {icon.name === 'eyeIcon' ? (
                                    <Icon
                                      icon={icon.type}
                                      color={
                                        isHover
                                          ? `${colors.hover_eyeIcon}`
                                          : `${colors.standard_color}`
                                      }
                                    />
                                  ) : (
                                    <Icon
                                      icon={icon.type}
                                      color={
                                        isHover
                                          ? `${colors.hover_trashIcon}`
                                          : `${colors.standard_color}`
                                      }
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      )}
                    </>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <p>
          página {pageIndex + 1} de {pageOptions.length}
        </p>
        <PaginateMUI
          page={pageIndex + 1}
          count={pageOptions.length}
          siblingCount={0}
          showFirstButton
          showLastButton
          onChange={(event, value) => {
            gotoPage(value - 1);
          }}
        />
      </div>
    </div>
  );
};

export default Table;
