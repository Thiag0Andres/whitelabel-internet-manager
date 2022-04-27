import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';

import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';
import pencil from '@iconify-icons/bi/pencil';
import check2 from '@iconify-icons/bi/check2';
import XIcon from '@iconify-icons/bi/x';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import { AcceptModal, ContainerPage, PagePath } from '../../components';

import {
  moneyFormat,
  currencyMask,
  currencyConvert,
  percentageMask,
} from '../../services/mask';

import api from '../../services/api';

import './styles.scss';
import { ENVIRONMENT_TYPES } from '../../constants/selects-options';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const ViewServicePlans: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [infoService, setInfoService] = useState<any>();
  const [sendPlan, setSendPlan] = useState<any>();
  const [infoMK, setInfoMK] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);

  const id = window.location.pathname.substring(3).split('/')[3];

  const loadServicePlan = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(`plans/search?id=${id}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        // console.log(response.data.data);
        setInfoService(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        // console.log(error.response);
        if (error.response.data.error.error_description) {
          toast.error(`${error.response.data.error.error_description}`);
        } else {
          toast.error(`${error.response.data.error}`);
        }
        setLoading(false);
        if (error.response.data.status === 401) {
          history.push('/login');
        }
      });
  }, [token]);

  const loadMK = useCallback(() => {
    // console.log('token', token);

    api
      .get(`mikrotik/search?providerId=${user.providerId}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        // console.log(response.data.data);
        setInfoMK(response.data.data);
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
  }, [token]);

  useEffect(() => {
    loadServicePlan();

    if (user.userType !== 'globaladmin') {
      loadMK();
    }
  }, [loadServicePlan, loadMK]);

  const updatePlan = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);
    setLoading(true);

    api
      .put(
        `/plans/${id}`,
        {
          ...sendPlan,
          cfop: sendPlan?.cfop ? sendPlan?.cfop : infoService.cfop,
        },
        {
          headers: { Authorization: token },
        },
      )
      .then(() => {
        toast.success('Plano atualizado');
        setEdit(false);
        setAcceptModalShow(false);
        setLoading(false);
      })
      .catch(error => {
        // console.log(error.response);
        if (error.response.data.error.error_description) {
          toast.error(`${error.response.data.error.error_description}`);
        } else {
          toast.error(`${error.response.data.error}`);
        }
        setLoading(false);
        setAcceptModalShow(false);
        if (error.response.data.status === 401) {
          history.push('/login');
        }
      });
  };

  const handleInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    // console.log(name); setInfoService({ ...infoService, [name]: value });

    if (value !== '') {
      setInfoService({ ...infoService, [name]: value });
      setSendPlan({ ...sendPlan, [name]: value });
    }
  };

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const handleClose = () => {
    setAcceptModalShow(false);
  };

  return (
    <>
      <ContainerPage>
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <PagePath title="Planos de serviço" />
          <div className="card-header">
            <Button
              style={{ width: '6.25rem' }}
              className="primary-button outline-primary"
              onClick={() => {
                onNavigationClick('/home/service-plans');
              }}
            >
              <div className="icon-button">
                <Icon icon={arrowLeft} color="#59971f" />
              </div>
              Voltar
            </Button>
            <Button
              style={{ width: '9.375rem' }}
              className="primary-button outline-primary"
              onClick={() => {
                setEdit(true);
              }}
            >
              <div className="icon-button">
                <Icon icon={pencil} color="#59971f" />
              </div>
              Editar Plano
            </Button>
          </div>
          <div className="card-content">
            {!loading ? (
              <>
                <h2 className="subTitle marginBottom">
                  {`Detalhes do plano - ${
                    infoService?.name ? infoService?.name : ''
                  }`}
                </h2>

                <Row noGutters>
                  <Form.Label>Tipo</Form.Label>
                  <Col lg="2">
                    <Form.Check
                      checked
                      inline
                      label="Dedicado"
                      name="planType"
                      type="radio"
                      value="dedicated"
                    />
                  </Col>
                  <Col className="field" lg="2">
                    <Form.Check
                      inline
                      label="Semi-dedicado"
                      name="planType"
                      type="radio"
                      value="semiDedicated"
                    />
                  </Col>
                </Row>
                <Row noGutters>
                  <Col lg="6">
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="Nome do plano"
                        required
                        name="name"
                        value={infoService?.name}
                        disabled={!edit}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col className="field" lg="6">
                    <Form.Group>
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="Descrição do plano"
                        name="description"
                        value={infoService?.description}
                        disabled={!edit}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                  {user.userType === 'globaladmin' && (
                    <>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Máximo de clientes</Form.Label>
                          <Form.Control
                            placeholder="000 Clientes"
                            className="form-control"
                            name="maxClients"
                            value={`${infoService?.maxClients} Clientes`}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Valor total</Form.Label>
                          <Form.Control
                            placeholder="R$ 000,00"
                            className="form-control"
                            name="amount"
                            value={
                              edit
                                ? currencyMask(String(infoService?.amount))
                                : moneyFormat(
                                    Number(
                                      currencyConvert(
                                        String(infoService?.amount),
                                      ),
                                    ),
                                  )
                            }
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}

                  {user.userType !== 'globaladmin' && (
                    <>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Valor total</Form.Label>
                          <Form.Control
                            placeholder="R$ 000,00"
                            className="form-control"
                            name="amount"
                            value={
                              edit
                                ? currencyMask(String(infoService?.amount))
                                : moneyFormat(
                                    Number(
                                      currencyConvert(
                                        String(infoService?.amount),
                                      ),
                                    ),
                                  )
                            }
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Valor SCM</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="R$ 000,00"
                            name="scmAmount"
                            value={
                              edit
                                ? currencyMask(String(infoService?.scmAmount))
                                : moneyFormat(
                                    Number(
                                      currencyConvert(
                                        String(infoService?.scmAmount),
                                      ),
                                    ),
                                  )
                            }
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Valor SVA</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="R$ 000,00"
                            name="svaAmount"
                            value={
                              edit
                                ? currencyMask(String(infoService?.svaAmount))
                                : moneyFormat(
                                    Number(
                                      currencyConvert(
                                        String(infoService?.svaAmount),
                                      ),
                                    ),
                                  )
                            }
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="3">
                        <Form.Group>
                          <Form.Label>Tipo do meio</Form.Label>
                          <Form.Control
                            className="form-control"
                            as="select"
                            name="environmentType"
                            value={infoService?.environmentType}
                            disabled={!edit}
                            onChange={handleInputChange}
                          >
                            <option value="">Tipo</option>
                            {ENVIRONMENT_TYPES.map(item => {
                              return (
                                <option value={item.value} key={item.id}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="3">
                        <Form.Group>
                          <Form.Label>Tipo de tecnologia</Form.Label>
                          <Form.Control
                            placeholder="NR"
                            className="form-control"
                            name="technologyType"
                            value={infoService?.technologyType}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}
                </Row>

                <h2 className="subTitle marginTop marginBottom">
                  Dados Fiscais
                </h2>
                <Row noGutters>
                  <Col lg="2">
                    <Form.Group>
                      <Form.Label>CFOP</Form.Label>
                      <Form.Control
                        as="select"
                        value={infoService?.cfop}
                        name="cfop"
                        disabled={!edit}
                        onChange={handleInputChange}
                      >
                        <option value="5304">5.304</option>
                        <option value="5307">5.307</option>
                        <option value="6304">6.304</option>
                        <option value="6307">6.307</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  {user.userType !== 'globaladmin' && (
                    <>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Alíquota ICMS</Form.Label>
                          <Form.Control
                            placeholder="0%"
                            className="form-control"
                            name="icmsTax"
                            value={percentageMask(infoService?.icmsTax)}
                            disabled={!edit}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setInfoService({
                                ...infoService,
                                icmsTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                              setSendPlan({
                                ...sendPlan,
                                icmsTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Alíquota PIS/PASEP</Form.Label>
                          <Form.Control
                            placeholder="0%"
                            className="form-control"
                            name="pisTax"
                            value={percentageMask(infoService?.pisTax)}
                            disabled={!edit}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setInfoService({
                                ...infoService,
                                pisTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                              setSendPlan({
                                ...sendPlan,
                                pisTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Alíquota COFINS</Form.Label>
                          <Form.Control
                            placeholder="0%"
                            className="form-control"
                            name="cofinsTax"
                            value={percentageMask(infoService?.cofinsTax)}
                            disabled={!edit}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setInfoService({
                                ...infoService,
                                cofinsTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                              setSendPlan({
                                ...sendPlan,
                                cofinsTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </>
                  )}
                </Row>
                {user.userType !== 'globaladmin' && (
                  <>
                    <Row noGutters>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>IBPT geral</Form.Label>
                          <Form.Control
                            placeholder="0%"
                            className="form-control"
                            name="ibptTax"
                            value={percentageMask(infoService?.ibptTax)}
                            disabled={!edit}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setInfoService({
                                ...infoService,
                                ibptTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                              setSendPlan({
                                ...sendPlan,
                                ibptTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>IBPT municipal</Form.Label>
                          <Form.Control
                            placeholder="0%"
                            className="form-control"
                            name="ibptCityTax"
                            value={percentageMask(infoService?.ibptCityTax)}
                            disabled={!edit}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setInfoService({
                                ...infoService,
                                ibptCityTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                              setSendPlan({
                                ...sendPlan,
                                ibptCityTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>IBPT estadual</Form.Label>
                          <Form.Control
                            placeholder="0%"
                            className="form-control"
                            name="ibptStateTax"
                            value={percentageMask(infoService?.ibptStateTax)}
                            disabled={!edit}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setInfoService({
                                ...infoService,
                                ibptStateTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                              setSendPlan({
                                ...sendPlan,
                                ibptStateTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>IBPT federal</Form.Label>
                          <Form.Control
                            placeholder="0%"
                            className="form-control"
                            name="ibptFederalTax"
                            value={percentageMask(infoService?.ibptFederalTax)}
                            disabled={!edit}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              setInfoService({
                                ...infoService,
                                ibptFederalTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                              setSendPlan({
                                ...sendPlan,
                                ibptFederalTax:
                                  Number(percentageMask(event.target.value)) >=
                                  100.0
                                    ? percentageMask('100')
                                    : event.target.value,
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}

                {user.userType !== 'globaladmin' && (
                  <>
                    <h2 className="subTitle marginTop marginBottom">
                      Velocidade de acesso
                    </h2>
                    <Row noGutters>
                      <Col lg="2">
                        <Form.Group>
                          <Form.Label>Dowload</Form.Label>
                          <Form.Control
                            placeholder="000 Mega"
                            className="form-control"
                            name="downloadSpeed"
                            value={
                              edit
                                ? `${infoService?.downloadSpeed}`
                                : `${infoService?.downloadSpeed} Mega`
                            }
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Upload</Form.Label>
                          <Form.Control
                            placeholder="000 Mega"
                            className="form-control"
                            name="uploadSpeed"
                            value={
                              edit
                                ? `${infoService?.uploadSpeed}`
                                : `${infoService?.uploadSpeed} Mega`
                            }
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row noGutters>
                      <Col lg="6">
                        <Form.Group>
                          <Form.Label>Mikrotik</Form.Label>
                          <Form.Control
                            as="select"
                            name="mkId"
                            value={infoService?.mkId}
                            disabled={!edit}
                            onChange={handleInputChange}
                          >
                            {infoMK &&
                              infoMK.map(item => {
                                return (
                                  <option value={item.id} key={item.id}>
                                    {item.username}
                                  </option>
                                );
                              })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                  </>
                )}
                {edit && (
                  <Row noGutters className="container-body-buttons">
                    <Button
                      style={{
                        marginTop: '1.25rem',
                        marginRight: '0.625rem',
                      }}
                      className="primary-button outline-secundary"
                      onClick={() => {
                        setEdit(false);
                        loadServicePlan();
                      }}
                    >
                      <div className="icon-button">
                        <Icon icon={XIcon} color="#db324f" />
                      </div>
                      Cancelar
                    </Button>
                    <Button
                      className="primary-button"
                      style={{ marginTop: '1.25rem' }}
                      onClick={() => {
                        setAcceptModalShow(true);
                      }}
                    >
                      <div className="icon-button">
                        <Icon icon={check2} color="#ffffff" />
                      </div>
                      Salvar
                    </Button>
                  </Row>
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
      <AcceptModal
        value={acceptModalShow}
        handleClose={handleClose}
        updateUser={updatePlan}
      />
    </>
  );
};

export default ViewServicePlans;
