import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import BoxSeamIcon from '@iconify-icons/bi/box-seam';
import SearchIcon from '@iconify-icons/heroicons-outline/search';
import eyeIcon from '@iconify-icons/bi/eye';
import trashIcon from '@iconify-icons/bi/trash';

import { useSelector, useDispatch } from 'react-redux';
import { populateServicePlans } from '../../store/ducks/tables/actions';
import { ApplicationState } from '../../store';

import { SERVICE_PLANS_HEADERS } from '../../constants/table-headers';
import { AcceptModal, PagePath, Table } from '../../components';

import api from '../../services/api';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const TableServicePlans: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { servicePlans } = useSelector(
    (state: ApplicationState) => state.tables,
  );
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [valueInputFilter, setValueInputFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);
  const [id, setId] = useState<number>();

  const loadServicePlans = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(
        `plans/search?limit=${1000}&type=${
          user.userType === 'globaladmin' ? 'provider' : 'client'
        }${
          user.userType === 'globaladmin'
            ? ''
            : `&providerId=${user.providerId}`
        }`,
        { headers: { Authorization: token } },
      )
      .then(response => {
        // console.log(response.data.data);
        dispatch(populateServicePlans(response.data.data));
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

  useEffect(() => {
    loadServicePlans();
  }, [loadServicePlans]);

  const deletePlan = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);

    api
      .delete(`/plans/${id}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        loadServicePlans();
        toast.success('Plano deletado');
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

  const handleClose = () => {
    setAcceptModalShow(false);
  };

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

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
          <PagePath title="Planos de serviço" />
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
                style={{ marginRight: '0.625rem' }}
                className="primary-button outline-secundary"
                onClick={() => {
                  setValueInputFilter('');
                }}
              >
                <div className="icon-button ">
                  <Icon icon={trashIcon} color="#DB324F" />
                </div>
                Limpar filtro
              </Button>
              <Button
                style={{ width: '9.375rem' }}
                className="primary-button outline-primary"
                onClick={() => {
                  onNavigationClick('/home/service-plans/create');
                }}
              >
                <div className="icon-button">
                  <Icon icon={BoxSeamIcon} color="#011A2C" />
                </div>
                Novo plano
              </Button>
            </div>
          </div>
          <div className="card-content">
            <h2 className="subTitle marginBottom">Todos</h2>
            {!loading ? (
              <Table
                columns={SERVICE_PLANS_HEADERS}
                data={servicePlans}
                actions={[
                  {
                    icon: {
                      name: 'eyeIcon',
                      type: eyeIcon,
                    },
                    onClick: (value: any) => {
                      onNavigationClick(`/home/service-plans/view/${value}`);
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
      <AcceptModal
        value={acceptModalShow}
        handleClose={handleClose}
        updateUser={deletePlan}
      />
    </>
  );
};

export default TableServicePlans;
