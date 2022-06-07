/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import Iframe from 'react-iframe';

import { toast } from 'react-toastify';
import Mask from 'react-input-mask';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';

import { ContainerPage, PagePath } from '../../components';

import { BillsToReceive, User } from '../../services/types';

import api from '../../services/api';

import './styles.scss';
import { renderTextStatus } from '../../services/functions';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const ViewBillsToReceive: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const [infoBills, setInfoBills] = useState<BillsToReceive>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const id = window.location.pathname.substring(3).split('/')[3];

  const loadUser = useCallback((id: string) => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(`/users/search?id=${id}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        // console.log(response.data.data);
        setUser(response.data.data);
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
  }, []);

  const loadBillsToReceive = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(`transactions/search?id=${id}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        // console.log(response.data.data);
        setInfoBills(response.data.data);
        loadUser(response.data.data.userId);
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
    loadBillsToReceive();
  }, [loadBillsToReceive]);

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  return (
    <>
      <ContainerPage>
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <PagePath title="Contas a receber" />
          <div className="card-header">
            <Button
              className="primary-button outline-primary"
              onClick={() => {
                onNavigationClick('/home/bills-to-receive');
              }}
            >
              <div className="icon-button">
                <Icon icon={arrowLeft} color="#011A2C" />
              </div>
              Voltar
            </Button>
          </div>
          <div className="card-content">
            <h2 className="subTitle marginBottom">Detalhes do tomador</h2>
            {!loading ? (
              <>
                <Row noGutters>
                  <Col lg="6">
                    <Form.Group>
                      <Form.Label>Nome completo do tomador</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="Nome completo do tomador"
                        value={infoBills?.takerFullname}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col className="field" lg="3">
                    <Form.Group>
                      <Form.Label>CPF do tomador</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="000.000.000-00"
                        as={Mask}
                        maskChar=""
                        mask="999.999.999-99"
                        value={user?.cpf}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col className="field" lg="2">
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="Status"
                        value={
                          infoBills?.billet.billetStatus
                            ? renderTextStatus(infoBills?.billet.billetStatus)
                            : infoBills?.isPaid
                            ? 'Pago'
                            : 'Pendente'
                        }
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {infoBills?.billet.billetUrl && (
                  <>
                    <h2 className="subTitle marginTop marginBottom">
                      Visualizar boleto
                    </h2>
                    <Row noGutters className="container-body-pdf ">
                      <Iframe
                        url={String(infoBills?.billet.billetUrl)}
                        className="pdfViewer"
                      />
                    </Row>
                  </>
                )}
              </>
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
    </>
  );
};

export default ViewBillsToReceive;
