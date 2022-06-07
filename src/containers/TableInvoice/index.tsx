import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import FilterIcon from '@iconify-icons/bi/filter';
import eyeIcon from '@iconify-icons/bi/eye';
import trashIcon from '@iconify-icons/bi/trash';
import SearchIcon from '@iconify-icons/heroicons-outline/search';
import ReceiptIcon from '@iconify-icons/bi/receipt';

import { useDispatch, useSelector } from 'react-redux';
import { populateTransactions } from '../../store/ducks/tables/actions';
import { ApplicationState } from '../../store';

import { BILL_OF_SALE_HEADERS } from '../../constants/table-headers';
import { FilterModal, PagePath, Table } from '../../components';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const TableInvoice: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { transactions } = useSelector(
    (state: ApplicationState) => state.tables,
  );
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [valueInputFilter, setValueInputFilter] = useState('');
  const [query, setQuery] = useState('');
  const [actionIds, setActionIds] = useState<Array<any>>([]);
  const [ModalChoice, setModalChoice] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBillOfSale = useCallback(() => {
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
        const filteredOjs = response.data.data.filter((receipt: any) => {
          return receipt.receipt !== null;
        });

        dispatch(populateTransactions(filteredOjs));
        setLoading(false);
      })
      .catch(error => {
        // console.log(error.response);
        if (error.response.data.error.error_description) {
          toast.error(`${error.response.data.error.error_description}`);
        } else {
          toast.error(`${error.response.data.error}`);
        }
        if (error.response.data.status === 401) {
          history.push('/login');
        }
        setLoading(false);
      });
  }, [dispatch, token, query]);

  useEffect(() => {
    loadBillOfSale();
  }, [loadBillOfSale]);

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
    setModalChoice(false);
  };

  return (
    <>
      <Container fluid className="container-content">
        <Col
          className="container-cards"
          xl="12"
          lg="12"
          md="12"
          xs="12"
          sm="12"
        >
          <PagePath title="Notas Fiscais" />
          <div className="card-header">
            <Col className="input-container-icon" lg="4">
              <div className="icon-button-search">
                <Icon icon={SearchIcon} color="#ffffff" />
              </div>
              <Form.Control
                id="input-search"
                className="input-search"
                placeholder="Pesquisar..."
                value={valueInputFilter}
                onChange={handleFilterInputChange}
              />
            </Col>
            <div className="container-body-buttons">
              <Button
                id="button-filter"
                style={{ width: '6.25rem', marginRight: '0.625rem' }}
                className="primary-button outline-primary"
                onClick={() => {
                  setModalChoice(true);
                }}
              >
                <div className="icon-button">
                  <Icon icon={FilterIcon} color="#011A2C" />
                </div>
                Filtrar
              </Button>
              <Button
                id="clear-filters"
                className="primary-button outline-secundary"
                onClick={() => {
                  setValueInputFilter('');
                  setQuery('');
                }}
              >
                <div className="icon-button ">
                  <Icon icon={trashIcon} color="#DB324F" />
                </div>
                Limpar filtro
              </Button>
            </div>
          </div>
          <div className="card-content">
            <h2 className="subTitle marginBottom">Todas</h2>
            {!loading ? (
              <Table
                id="invoices-list"
                columns={BILL_OF_SALE_HEADERS}
                data={transactions}
                actions={[
                  {
                    icon: {
                      name: 'eyeIcon',
                      type: eyeIcon,
                    },
                    onClick: (value: any) => {
                      onNavigationClick(`/home/bill-of-sale/view/${value}`);
                    },
                  },
                ]}
                valueInputFilter={valueInputFilter}
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
          </div>
        </Col>
      </Container>
      <FilterModal
        value={ModalChoice}
        type="invoice"
        handleClose={handleClose}
        setQuery={setQuery}
      />
    </>
  );
};

export default TableInvoice;
