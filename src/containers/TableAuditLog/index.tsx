import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import eyeIcon from '@iconify-icons/bi/eye';
import trashIcon from '@iconify-icons/bi/trash';
import SearchIcon from '@iconify-icons/heroicons-outline/search';

import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import { populateAuditLog } from '../../store/ducks/tables/actions';

import { formatDate, formatHour } from '../../services/mask';
import { AUDIT_LOG_HEADERS } from '../../constants/table-headers';
import { AcceptModal, PagePath, Table } from '../../components';
import api from '../../services/api';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const TableAuditLog: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auditLog } = useSelector((state: ApplicationState) => state.tables);
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [valueInputFilter, setValueInputFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAuditLog = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(`actions?limit=${1000}&providerId=${user.providerId}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        const arrayLogs = response.data.data;

        const newArray: any = [];

        // eslint-disable-next-line array-callback-return
        arrayLogs.map((item: any) => {
          const Date = formatDate(item.createdAt);
          const Time = formatHour(item.createdAt);

          const body = {
            id: Number(item.id),
            activity: String(item.name),
            name: String(item.user.name),
            time: String(Time),
            date: String(Date),
          };
          newArray.push(body);
        });

        dispatch(populateAuditLog(newArray));
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
    loadAuditLog();
  }, [loadAuditLog]);

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
          <PagePath title="Log de auditoria" />
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
                id="clear-filters"
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
            </div>
          </div>
          <div className="card-content">
            <h2 className="subTitle marginBottom">Todos</h2>
            {!loading ? (
              <Table
                id="logs-list"
                columns={AUDIT_LOG_HEADERS}
                data={auditLog}
                actions={[
                  {
                    icon: {
                      name: 'eyeIcon',
                      type: eyeIcon,
                    },
                    onClick: (value: any) => {
                      onNavigationClick(`/home/audit-log/view/${value}`);
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
    </>
  );
};

export default TableAuditLog;
