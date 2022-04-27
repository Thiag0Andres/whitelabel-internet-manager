import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Col, Spinner, Form } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import FilterIcon from '@iconify-icons/bi/filter';
import SearchIcon from '@iconify-icons/heroicons-outline/search';
import eyeIcon from '@iconify-icons/bi/eye';
import upcScan from '@iconify-icons/bi/upc-scan';
import cashStack from '@iconify-icons/bi/cash-stack';
import trashIcon from '@iconify-icons/bi/trash';
import ReceiptIcon from '@iconify-icons/bi/receipt';

import { useDispatch, useSelector } from 'react-redux';
import { populateTransactions } from '../../store/ducks/tables/actions';
import { ApplicationState } from '../../store';

import { BILLS_TO_RECEIVE_HEADERS } from '../../constants/table-headers';
import {
  PagePath,
  Table,
  FilterModal,
  ReceiptModal,
  AcceptModal,
} from '../../components';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const TableBillsToReceive: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { transactions } = useSelector(
    (state: ApplicationState) => state.tables,
  );
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [loading, setLoading] = useState(false);
  const [filterModalShow, setFilterModalShow] = useState(false);
  const [receiptModalShow, setReceiptModalShow] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);
  const [actionIds, setActionIds] = useState<Array<any>>([]);
  const [query, setQuery] = useState('');
  const [valueInputFilter, setValueInputFilter] = useState('');
  const [id, setId] = useState<number>();

  const loadBillsToReceive = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(
        `transactions/search?limit=${1000}&providerId=${user.providerId}${
          query !== '' ? `&${query}` : ''
        }`,
        {
          headers: { Authorization: token },
        },
      )
      .then(response => {
        // console.log(response.data.data);
        dispatch(populateTransactions(response.data.data));
        setLoading(false);
      })
      .catch(error => {
        // console.log(error.response);
        setLoading(false);
        if (error.response.data.error.error_description) {
          toast.error(`${error.response.data.error.error_description}`);
        } else {
          toast.error(`${error.response.data.error}`);
        }
        if (error.response.data.status === 401) {
          history.push('/login');
        }
      });
  }, [dispatch, token, query]);

  useEffect(() => {
    loadBillsToReceive();
  }, [loadBillsToReceive]);

  const deleteTransaction = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);

    api
      .delete(`/transactions/${id}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        loadBillsToReceive();
        toast.success('Transação deletada');
        setAcceptModalShow(false);
      })
      .catch(error => {
        // console.log(error.response);
        setAcceptModalShow(false);
        if (error.response.data.error.error_description) {
          toast.error(`${error.response.data.error.error_description}`);
        } else {
          toast.error(`${error.response.data.error}`);
        }
        if (error.response.data.status === 401) {
          history.push('/login');
        }
      });
  };

  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setValueInputFilter(value);
  };

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const handleClose = () => {
    setFilterModalShow(false);
    setReceiptModalShow(false);
    setAcceptModalShow(false);
  };

  const handleSelectedOption = (e: any) => {
    const { value } = e.target;
    // console.log(event.target);

    if (actionIds.includes(value)) {
      const pos = actionIds.indexOf(value);
      actionIds.splice(pos, 1);
    } else {
      actionIds.push(value);
    }
  };

  return (
    <>
      <Container fluid className="container-bills-to-receive">
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <PagePath title="Contas a receber" />
          <div className="card-header">
            <Col className="input-container-icon" lg="4">
              <div className="icon-button-search">
                <Icon icon={SearchIcon} color="#ffffff" />
              </div>
              <Form.Control
                className="input-search"
                placeholder="Pesquisar..."
                value={valueInputFilter}
                onChange={handleFilterInputChange}
              />
            </Col>
            <div className="container-header-buttons">
              <Button
                style={{ marginRight: '0.625rem' }}
                className="primary-button outline-secundary"
                onClick={() => {
                  setQuery('');
                }}
              >
                <div className="icon-button ">
                  <Icon icon={trashIcon} color="#DB324F" />
                </div>
                Limpar filtro
              </Button>
              <Button
                style={{ width: '6.25rem', marginRight: '0.625rem' }}
                className="primary-button outline-primary"
                onClick={() => {
                  setFilterModalShow(true);
                }}
              >
                <div className="icon-button">
                  <Icon icon={FilterIcon} color="#59971f" />
                </div>
                Filtrar
              </Button>
              <Button
                style={{ marginRight: '0.625rem' }}
                className="primary-button outline-primary"
                onClick={() => {
                  onNavigationClick('/home/bills-to-receive/create');
                }}
              >
                <div className="icon-button">
                  <Icon icon={upcScan} color="#59971f" />
                </div>
                Gerar boletos
              </Button>
              <Button
                className="primary-button outline-primary"
                onClick={() => {
                  onNavigationClick('/home/bills-to-receive/include');
                }}
              >
                <div className="icon-button">
                  <Icon icon={cashStack} color="#59971f" />
                </div>
                Incluir nova
              </Button>
            </div>
          </div>
          <div className="card-content">
            <h2 className="subTitle marginBottom">Todos</h2>
            {!loading ? (
              <Table
                columns={BILLS_TO_RECEIVE_HEADERS}
                data={transactions}
                actions={
                  user &&
                  (user.userType === 'globaladmin' ||
                    user.userType === 'provider')
                    ? [
                        {
                          icon: {
                            name: 'eyeIcon',
                            type: eyeIcon,
                          },
                          onClick: (value: any) => {
                            onNavigationClick(
                              `/home/bills-to-receive/view/${value}`,
                            );
                          },
                        },
                        {
                          icon: {
                            name: 'trashIcon',
                            type: trashIcon,
                          },
                          onClick: (value: any) => {
                            setAcceptModalShow(true);
                            setId(value);
                          },
                        },
                      ]
                    : [
                        {
                          icon: {
                            name: 'eyeIcon',
                            type: eyeIcon,
                          },
                          onClick: (value: any) => {
                            onNavigationClick(
                              `/home/bills-to-receive/view/${value}`,
                            );
                          },
                        },
                      ]
                }
                valueInputFilter={valueInputFilter}
                onChange={handleSelectedOption}
              />
            ) : (
              <div className="container-spinner">
                <Spinner
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            )}
            <div className="container-footer-buttons">
              <Button
                className="primary-button"
                onClick={() => {
                  setReceiptModalShow(true);
                }}
              >
                <div className="icon-button">
                  <Icon icon={ReceiptIcon} color="#ffffff" />
                </div>
                Gerar NF-es
              </Button>
            </div>
          </div>
        </Col>
      </Container>
      <FilterModal
        value={filterModalShow}
        type="bills"
        handleClose={handleClose}
        setQuery={setQuery}
      />
      <ReceiptModal
        value={receiptModalShow}
        handleClose={handleClose}
        actionIds={actionIds}
      />
      <AcceptModal
        value={acceptModalShow}
        handleClose={handleClose}
        updateUser={deleteTransaction}
      />
    </>
  );
};

export default TableBillsToReceive;
