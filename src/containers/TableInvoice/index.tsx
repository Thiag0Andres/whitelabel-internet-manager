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
import {
  FilterModal,
  PagePath,
  ReceiptShippingModal,
  Table,
} from '../../components';

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
  const [url, setUrl] = useState('');
  const [actionIds, setActionIds] = useState<Array<any>>([]);
  const [ModalChoice, setModalChoice] = useState(false);
  const [receiptShippingModalShow, setReceiptShippingModalShow] =
    useState(false);
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

  const ReceiptShipping = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);
    if (actionIds.length) {
      const body = {
        transactionIds: actionIds,
        providerId: user.providerId,
      };

      // console.log(body);

      api
        .post(`/transactions/shippingreceipt21`, body, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data.data);
          setUrl(response.data.data);
          setReceiptShippingModalShow(true);
          toast.success('Arquivo de remessa gerado');
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
        });
    } else {
      toast.error(`Nenhuma nota fiscal selecionada`);
    }
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
    setModalChoice(false);
    setReceiptShippingModalShow(false);
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
                className="input-search"
                placeholder="Pesquisar..."
                value={valueInputFilter}
                onChange={handleFilterInputChange}
              />
            </Col>
            <div className="container-body-buttons">
              <Button
                style={{ width: '6.25rem', marginRight: '0.625rem' }}
                className="primary-button outline-primary"
                onClick={() => {
                  setModalChoice(true);
                }}
              >
                <div className="icon-button">
                  <Icon icon={FilterIcon} color="#59971f" />
                </div>
                Filtrar
              </Button>
              <Button
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
              {/*               <Button
                style={{
                  marginRight: '0.625rem',
                }}
                className="primary-button outline-secundary"
                onClick={handleClear}
              >
                <div className="icon-button">
                  <Icon icon={trashIcon} color="#DB324F" />
                </div>
                Limpar marcações
              </Button> */}
              <Button
                className="primary-button"
                type="submit"
                onClick={ReceiptShipping}
              >
                <div className="icon-button">
                  <Icon icon={ReceiptIcon} color="#ffffff" />
                </div>
                Arquivo de remessa
              </Button>
            </div>
          </div>
        </Col>
      </Container>
      <FilterModal
        value={ModalChoice}
        type="invoice"
        handleClose={handleClose}
        setQuery={setQuery}
      />
      <ReceiptShippingModal
        value={receiptShippingModalShow}
        handleClose={handleClose}
        url={url}
      />
    </>
  );
};

export default TableInvoice;
