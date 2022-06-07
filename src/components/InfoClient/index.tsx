import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';
import receipt from '@iconify-icons/bi/receipt';
import pencil from '@iconify-icons/bi/pencil';
import check2 from '@iconify-icons/bi/check2';
import XIcon from '@iconify-icons/bi/x';

import Mask from 'react-input-mask';

import { useDispatch, useSelector } from 'react-redux';
import { populateTransactions } from '../../store/ducks/tables/actions';
import { ApplicationState } from '../../store';

import {
  cpfMask,
  currencyConvert,
  currencyMask,
  moneyFormat,
} from '../../services/mask';
import { renderStatus } from '../Table';

import { BILLS_TO_RECEIVE_HEADERS } from '../../constants/table-headers';

import { ServicePlans, User } from '../../services/types';
import { Table, AcceptModal } from '..';

import api from '../../services/api';

import './styles.scss';
import PagePath from '../PagePath';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const InfoClient: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { transactions } = useSelector(
    (state: ApplicationState) => state.tables,
  );

  const [user, setUser] = useState<User>();
  const [sendUser, setSendUser] = useState<User>();
  const [infoPlans, setInfoPlans] = useState<Array<ServicePlans>>([]);
  const [infoMK, setInfoMK] = useState<Array<any>>([]);
  const [option1, setoption1] = useState(true);
  const [option2, setoption2] = useState(false);
  const [option3, setoption3] = useState(false);
  const [option4, setoption4] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);

  const id = window.location.pathname.substring(3).split('/')[3];

  const loadBillsToReceive = useCallback(
    (id: string) => {
      // console.log('token', token);

      api
        .get(`transactions/search?limit=${1000}&userId=${id}`, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response);
          dispatch(populateTransactions(response.data.data));
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
    },
    [dispatch, token],
  );

  const loadPlans = useCallback(
    (id: string) => {
      // console.log('token', token);

      api
        .get(`plans/search?limit=${1000}&type=client&providerId=${id}`, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data.data);
          setInfoPlans(response.data.data);
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
    },
    [token],
  );

  const loadMK = useCallback(
    (id: string) => {
      // console.log('token', token);

      api
        .get(`mikrotik/search?limit=${1000}&providerId=${id}`, {
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
    },
    [token],
  );

  const loadUser = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(`/users/search?id=${id}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        // console.log(response.data.data);
        setUser(response.data.data);
        loadPlans(response.data.data.providerId);
        loadMK(response.data.data.providerId);
        loadBillsToReceive(response.data.data.id);
        setLoading(false);
      })
      .catch(error => {
        // console.log(error.response);
        toast.error(`${error?.response?.data.error}`);
        setLoading(false);
        if (error?.response?.data.status === 401) {
          history.push('/login');
        }
      });
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const updateUser = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);
    setLoading(true);

    api
      .put(`/users/${id}`, sendUser, {
        headers: { Authorization: token },
      })
      .then(() => {
        toast.success('Cliente atualizado');
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
        if (error.response.data.status === 401) {
          history.push('/login');
        }
        setLoading(false);
        setAcceptModalShow(false);
      });
  };

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const handleInputChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    // console.log(name);

    setUser({ ...user, [name]: value });
    setSendUser({ ...sendUser, [name]: value });
  };

  const handleClose = () => {
    setAcceptModalShow(false);
  };

  return (
    <>
      <Container fluid className="container-view-user">
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <PagePath
            title={!loading ? `Clientes > ${user?.name}` : 'Clientes'}
          />
          <div className="card-header">
            <Button
              style={{ width: '6.25rem' }}
              className="primary-button outline-primary"
              onClick={() => {
                onNavigationClick('/home/clients');
              }}
            >
              <div className="icon-button">
                <Icon icon={arrowLeft} color="#011A2C" />
              </div>
              Voltar
            </Button>
            <div className="container-body-buttons">
              <Button
                style={{ marginRight: '0.625rem' }}
                className="primary-button outline-primary"
                onClick={() => {
                  setEdit(true);
                }}
              >
                <div className="icon-button">
                  <Icon icon={pencil} color="#011A2C" />
                </div>
                Editar cliente
              </Button>
            </div>
          </div>
          <div className="card-content">
            <h2 className="subTitle marginBottom">
              {user?.name}&nbsp;&nbsp;
              <p>
                Status do cliente:{' '}
                <span>{user?.status ? renderStatus(user?.status) : ''}</span>
              </p>
            </h2>
            <div className="container-view-user">
              <button
                type="button"
                className={option1 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(true);
                  setoption2(false);
                  setoption3(false);
                  setoption4(false);
                }}
              >
                Dados Pessoais
              </button>
              <button
                type="button"
                className={option2 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(false);
                  setoption2(true);
                  setoption3(false);
                  setoption4(false);
                }}
              >
                Endereço
              </button>
              <button
                type="button"
                className={option3 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(false);
                  setoption2(false);
                  setoption3(true);
                  setoption4(false);
                }}
              >
                Plano
              </button>
              <button
                type="button"
                className={option4 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(false);
                  setoption2(false);
                  setoption3(false);
                  setoption4(true);
                }}
              >
                Cobrança
              </button>
            </div>
            {!loading ? (
              <Form onSubmit={updateUser}>
                {option1 && (
                  <>
                    <Row noGutters>
                      <Col className="field" lg="5">
                        <Form.Group>
                          <Form.Label>Nome completo</Form.Label>
                          <Form.Control
                            placeholder="Nome completo"
                            className="form-control"
                            name="name"
                            value={user?.name}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field">
                        <Form.Group>
                          <Form.Label>Sexo</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="Sexo"
                            as="select"
                            name="gender"
                            value={user?.gender}
                            disabled={!edit}
                            onChange={handleInputChange}
                          >
                            <option value="male">Masculino</option>
                            <option value="female">Feminino</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>CPF</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="000.000.000-00"
                            as={Mask}
                            maskChar=""
                            mask="999.999.999-99"
                            name="cpf"
                            value={cpfMask(String(user?.cpf))}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field">
                        <Form.Group>
                          <Form.Label>RG</Form.Label>
                          <Form.Control
                            placeholder="0000000"
                            className="form-control"
                            name="rg"
                            value={user?.rg}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Órgão expeditor</Form.Label>
                          <Form.Control
                            placeholder="Sigla"
                            className="form-control"
                            name="emittingOrgan"
                            value={user?.emittingOrgan}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="3">
                        <Form.Group>
                          <Form.Label>Data de nascimento</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="DD/MM/AAAA"
                            as={Mask}
                            maskChar=""
                            mask="99/99/9999"
                            name="birthDate"
                            value={user?.birthDate}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="4">
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            placeholder="email@email.com"
                            className="form-control"
                            name="email"
                            value={user?.email}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="3">
                        <Form.Group>
                          <Form.Label>Celular</Form.Label>
                          <Form.Control
                            placeholder="(00) 9 0000-0000"
                            as={Mask}
                            maskChar=""
                            mask="(99) 9 9999-9999"
                            className="form-control"
                            name="phone"
                            value={user?.phone}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    {user?.cnpj && (
                      <Row noGutters>
                        <Col className="field" lg="6">
                          <Form.Group>
                            <Form.Label>Razão social</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="Razão social"
                              name="socialReason"
                              value={user?.socialReason}
                              disabled={!edit}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="6">
                          <Form.Group>
                            <Form.Label>Nome fantasia</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="Nome fantasia"
                              name="fantasyName"
                              value={user?.fantasyName}
                              disabled={!edit}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="3">
                          <Form.Group>
                            <Form.Label>CNPJ</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="00.000.000/0001-00"
                              as={Mask}
                              maskChar="_"
                              mask="99.999.999/9999-99"
                              name="cnpj"
                              value={user?.cnpj}
                              disabled={!edit}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="3">
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="email@email.com"
                              name="establishmentEmail"
                              value={user?.establishmentEmail}
                              disabled={!edit}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="3">
                          <Form.Group>
                            <Form.Label>Telefone</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="(00) 00000-0000"
                              as={Mask}
                              maskChar="_"
                              mask="(99) 99999-9999"
                              name="phone2"
                              value={user?.phone2}
                              disabled={!edit}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="3">
                          <Form.Group>
                            <Form.Label>Celular</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="(00) 9 0000-0000"
                              as={Mask}
                              maskChar=" "
                              mask="(99) 9 9999-9999"
                              name="phone3"
                              value={user?.phone3}
                              disabled={!edit}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                    <Row noGutters>
                      <Col className="field" lg="6">
                        <Form.Group>
                          <Form.Label>Mikrotik</Form.Label>
                          <Form.Control
                            as="select"
                            name="mkId"
                            value={user?.mkId}
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
                            loadUser();
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
                )}
                {option2 && (
                  <>
                    <Row noGutters>
                      <Col className="field" lg="3">
                        <Form.Group>
                          <Form.Label>CEP</Form.Label>
                          <Form.Control
                            placeholder="00000-000"
                            as={Mask}
                            maskChar=""
                            mask="99999-999"
                            className="form-control"
                            name="address.zipcode"
                            value={user?.address?.zipcode}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                address: {
                                  ...user?.address,
                                  zipcode: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                address: {
                                  ...sendUser?.address,
                                  zipcode: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="8">
                        <Form.Group>
                          <Form.Label>Logradouro</Form.Label>
                          <Form.Control
                            placeholder="Logradouro"
                            className="form-control"
                            name="address.street"
                            value={user?.address?.street}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                address: {
                                  ...user?.address,
                                  street: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                address: {
                                  ...sendUser?.address,
                                  street: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field">
                        <Form.Group>
                          <Form.Label>Número</Form.Label>
                          <Form.Control
                            placeholder="0000"
                            className="form-control"
                            name="address.number"
                            value={user?.address?.number}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                address: {
                                  ...user?.address,
                                  number: Number(event.target.value),
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                address: {
                                  ...sendUser?.address,
                                  number: Number(event.target.value),
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="4">
                        <Form.Group>
                          <Form.Label>Complemento</Form.Label>
                          <Form.Control
                            placeholder="Complemento"
                            className="form-control"
                            name="address.complement"
                            value={user?.address?.complement}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                address: {
                                  ...user?.address,
                                  complement: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                address: {
                                  ...sendUser?.address,
                                  complement: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="1">
                        <Form.Group>
                          <Form.Label>UF</Form.Label>
                          <Form.Control
                            placeholder="UF"
                            type="text"
                            maxLength={2}
                            className="form-control"
                            name="address.state"
                            value={user?.address?.state}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                address: {
                                  ...user?.address,
                                  state: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                address: {
                                  ...sendUser?.address,
                                  state: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field">
                        <Form.Group>
                          <Form.Label>Cidade</Form.Label>
                          <Form.Control
                            placeholder="Cidade"
                            className="form-control"
                            name="address.city"
                            value={user?.address?.city}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                address: {
                                  ...user?.address,
                                  city: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                address: {
                                  ...sendUser?.address,
                                  city: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field">
                        <Form.Group>
                          <Form.Label>Bairro</Form.Label>
                          <Form.Control
                            placeholder="Bairro"
                            className="form-control"
                            name="address.neighborhood"
                            value={user?.address?.neighborhood}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                address: {
                                  ...user?.address,
                                  neighborhood: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                address: {
                                  ...sendUser?.address,
                                  neighborhood: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Row noGutters>
                        <Col className="field" lg="4">
                          <Form.Group>
                            <Form.Label>Tipo de atendimento</Form.Label>
                            <Form.Control
                              placeholder="Tipo de atendimento"
                              className="form-control"
                              name="address.attendanceType"
                              value={user?.attendanceType}
                              disabled={!edit}
                              onChange={handleInputChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Row>
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
                            loadUser();
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
                )}
                {option3 && (
                  <>
                    <Row noGutters>
                      <Col className="field" lg="6">
                        <Form.Group>
                          <Form.Label>Plano</Form.Label>
                          <Form.Control
                            as="select"
                            name="planId"
                            value={user?.planId}
                            disabled={!edit}
                            onChange={handleInputChange}
                          >
                            <option>Selecione um Plano</option>
                            {infoPlans &&
                              infoPlans.map(item => {
                                return (
                                  <option value={item.id} key={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Dia de pagamento</Form.Label>
                          <Form.Control
                            placeholder="Dia 00"
                            as={Mask}
                            maskChar=""
                            mask="99"
                            className="form-control"
                            name="dueDate"
                            value={user?.dueDate}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Tolerância de bloqueio</Form.Label>
                          <Form.Control
                            placeholder="00 dias"
                            as={Mask}
                            maskChar=""
                            mask="99"
                            className="form-control"
                            name="tolerance"
                            value={user?.tolerance}
                            disabled={!edit}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row noGutters>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Acrescimo</Form.Label>
                          <Form.Control
                            placeholder="R$ 000,00"
                            className="form-control"
                            name="increment.amount"
                            value={
                              edit
                                ? `${currencyMask(
                                    String(user?.increment?.amount),
                                  )}`
                                : moneyFormat(
                                    Number(
                                      currencyConvert(
                                        String(user?.increment?.amount),
                                      ),
                                    ),
                                  )
                            }
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                increment: {
                                  ...user?.increment,
                                  amount: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                increment: {
                                  ...sendUser?.increment,
                                  amount: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Dia de vencimento</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="DD/MM/AAAA"
                            as={Mask}
                            maskChar=""
                            mask="99/99/9999"
                            name="increment.dueDate"
                            value={
                              user?.increment ? user?.increment.dueDate : ''
                            }
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                increment: {
                                  ...user?.increment,
                                  dueDate: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                increment: {
                                  ...sendUser?.increment,
                                  dueDate: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Desconto</Form.Label>
                          <Form.Control
                            placeholder="R$ 000,00"
                            className="form-control"
                            value={
                              edit
                                ? `${currencyMask(
                                    String(user?.discount?.amount),
                                  )}`
                                : moneyFormat(
                                    Number(
                                      currencyConvert(
                                        String(user?.discount?.amount),
                                      ),
                                    ),
                                  )
                            }
                            name="discount.amount"
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                discount: {
                                  ...user?.discount,
                                  amount: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                discount: {
                                  ...sendUser?.discount,
                                  amount: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Dia de vencimento</Form.Label>
                          <Form.Control
                            className="form-control"
                            placeholder="DD/MM/AAAA"
                            as={Mask}
                            maskChar=""
                            mask="99/99/9999"
                            name="discount.dueDate"
                            value={user?.discount ? user?.discount.dueDate : ''}
                            disabled={!edit}
                            onChange={(
                              event: ChangeEvent<HTMLSelectElement>,
                            ) => {
                              setUser({
                                ...user,
                                discount: {
                                  ...user?.discount,
                                  dueDate: event.target.value,
                                },
                              });
                              setSendUser({
                                ...sendUser,
                                discount: {
                                  ...sendUser?.discount,
                                  dueDate: event.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
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
                            loadUser();
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
                )}
                {option4 && (
                  <Table
                    id="bills-list"
                    columns={BILLS_TO_RECEIVE_HEADERS}
                    data={transactions}
                    onViewClick={(id: number) =>
                      onNavigationClick(`/home/bills-to-receive/view/${id}`)
                    }
                  />
                )}
              </Form>
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
        updateUser={updateUser}
      />
    </>
  );
};

export default InfoClient;
