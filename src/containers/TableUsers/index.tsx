import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import FilterIcon from '@iconify-icons/bi/filter';
import SearchIcon from '@iconify-icons/heroicons-outline/search';
import eyeIcon from '@iconify-icons/bi/eye';
import trashIcon from '@iconify-icons/bi/trash';

import { useDispatch, useSelector } from 'react-redux';
import {
  populateProviders,
  populateClients,
} from '../../store/ducks/tables/actions';
import { ApplicationState } from '../../store';

import { PagePath, FilterModal, Table, AcceptModal } from '../../components';

import { CLIENTS_HEADERS } from '../../constants/table-headers';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const TableUsers: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state: ApplicationState) => state.user);
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { clients, providers } = useSelector(
    (state: ApplicationState) => state.tables,
  );
  const [valueInputFilter, setValueInputFilter] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [ModalChoice, setModalChoice] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);
  const [id, setId] = useState<number>();

  const loadProviders = useCallback(() => {
    setLoading(true);

    api
      .get(`providers?limit=${1000}`, { headers: { Authorization: token } })
      .then(response => {
        // console.log(response.data.data);
        dispatch(populateProviders(response.data.data));
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
  }, [dispatch, token]);

  const loadClients = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(
        `users/search?limit=${1000}&userType=client&providerId=${
          user.providerId
        }${query !== '' ? `&${query}` : ''}`,
        {
          headers: { Authorization: token },
        },
      )
      .then(response => {
        // console.log(response.data.data);
        dispatch(populateClients(response.data.data));
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
    if (user && user.userType === 'globaladmin') {
      loadProviders();
    } else {
      loadClients();
    }
  }, [loadProviders, loadClients]);

  const deleteUser = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);

    api
      .delete(
        `/${
          user && user.userType === 'globaladmin' ? 'providers' : 'users'
        }/${id}`,
        {
          headers: { Authorization: token },
        },
      )
      .then(() => {
        if (user && user.userType === 'globaladmin') {
          toast.success('Provedor deletado');
          loadProviders();
        } else {
          toast.success('Cliente bloqueado');
          loadClients();
        }

        setAcceptModalShow(false);
      })
      .catch(error => {
        // console.log(error.response);
        if (error.response.data.error.error_description) {
          toast.error(`${error.response.data.error.error_description}`);
        } else {
          toast.error(`${error.response.data.error}`);
        }

        setAcceptModalShow(false);
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
    setModalChoice(false);
    setAcceptModalShow(false);
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
          <PagePath
            title={
              user && user.userType === 'globaladmin'
                ? 'Provedores'
                : 'Clientes'
            }
          />
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
            <h2 className="subTitle marginBottom">
              {user && user.userType === 'globaladmin'
                ? 'Provedores'
                : 'Clientes'}
            </h2>
            {!loading ? (
              <div>
                <Table
                  id="users-list"
                  columns={CLIENTS_HEADERS}
                  data={clients}
                  actions={
                    user && user.userType === 'provider'
                      ? [
                          {
                            icon: {
                              name: 'eyeIcon',
                              type: eyeIcon,
                            },
                            onClick: (value: any) => {
                              onNavigationClick(
                                user && user.userType === 'globaladmin'
                                  ? `/home/providers/view/${value}`
                                  : `/home/clients/view/${value}`,
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
                                user && user.userType === 'globaladmin'
                                  ? `/home/providers/view/${value}`
                                  : `/home/clients/view/${value}`,
                              );
                            },
                          },
                        ]
                  }
                  valueInputFilter={valueInputFilter}
                />
              </div>
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
        type="user"
        handleClose={handleClose}
        setQuery={setQuery}
      />

      <AcceptModal
        value={acceptModalShow}
        handleClose={handleClose}
        updateUser={deleteUser}
      />
    </>
  );
};

export default TableUsers;
