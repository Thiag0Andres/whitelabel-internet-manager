import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';

import { ContainerPage, PagePath } from '../../components';

import { formatDate, formatHour } from '../../services/mask';
import { AuditLog } from '../../services/types';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const ViewAuditLog: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const [infoLog, setInfoLog] = useState<AuditLog>();
  const [loading, setLoading] = useState(false);

  const id = window.location.pathname.substring(3).split('/')[3];

  const loadAuditLog = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get('actions', { headers: { Authorization: token } })
      .then(response => {
        const arrayLogs = response.data.data;

        // eslint-disable-next-line array-callback-return
        arrayLogs.map((item: any) => {
          api
            .get(`users/search?id=${Number(item.userId)}`, {
              headers: { Authorization: token },
            })
            .then(responseC => {
              if (String(id) === String(item.id)) {
                const Date = formatDate(item.createdAt);
                const Time = formatHour(item.createdAt);

                const body: AuditLog = {
                  id: Number(item.id),
                  activity: String(item.name),
                  name: String(responseC.data.data.name),
                  time: String(Time),
                  date: String(Date),
                  previousState: String(item.previousState),
                };

                setInfoLog(body);
              }
            })
            .catch(error => {
              // console.log(error.responseC);
              toast.error(`${error.responseC.data.error}`);
            });
        });

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
  }, [token]);

  useEffect(() => {
    loadAuditLog();
  }, [loadAuditLog]);

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  return (
    <ContainerPage>
      <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
        <PagePath title="Log de auditoria" />
        <div className="card-header">
          <Button
            className="primary-button outline-primary"
            onClick={() => {
              onNavigationClick('/home/audit-log');
            }}
          >
            <div className="icon-button">
              <Icon icon={arrowLeft} color="#59971f" />
            </div>
            Voltar
          </Button>
        </div>
        <div className="card-content">
          <h2 className="subTitle marginBottom">Detalhes da atividade</h2>
          {!loading ? (
            <Row noGutters>
              <Col xl="12" lg="12" md="12" xs="12" sm="12">
                <Form.Group>
                  <Form.Label>Descrição da atividade</Form.Label>
                  <Form.Control
                    placeholder="Descrição da atividade"
                    className="form-control"
                    value={infoLog?.activity}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col lg="3">
                <Form.Group>
                  <Form.Label>Valor anterior</Form.Label>
                  <Form.Control
                    placeholder="Valor anterior"
                    className="form-control"
                    value={infoLog?.previousState}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col className="field" lg="5">
                <Form.Group>
                  <Form.Label>Autor</Form.Label>
                  <Form.Control
                    placeholder="Nome do usuário"
                    className="form-control"
                    value={infoLog?.name}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col className="field" lg="2">
                <Form.Group>
                  <Form.Label>Horário</Form.Label>
                  <Form.Control
                    placeholder="00:00h"
                    className="form-control"
                    value={infoLog?.time}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col className="field" lg="2">
                <Form.Group>
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    placeholder="00/00/0000"
                    className="form-control"
                    value={infoLog?.date}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
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
    </ContainerPage>
  );
};

export default ViewAuditLog;
