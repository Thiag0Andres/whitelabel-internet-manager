/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
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

import filesize from 'filesize';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';
import pencil from '@iconify-icons/bi/pencil';
import check2 from '@iconify-icons/bi/check2';
import XIcon from '@iconify-icons/bi/x';

import Mask from 'react-input-mask';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import {
  populateTransactions,
  populateClients,
} from '../../store/ducks/tables/actions';
import { cpfMask } from '../../services/mask';
import {
  ServicePlans,
  User,
  Provider,
  IUploadFile,
} from '../../services/types';

import {
  BILLS_TO_RECEIVE_HEADERS,
  CLIENTS_HEADERS,
} from '../../constants/table-headers';
import { PagePath, Table, AcceptModal, UploadFile, FileList } from '..';

import api from '../../services/api';

import './styles.scss';
import { checkPassword } from '../../services/validation';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const InfoProvider: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const { transactions, clients } = useSelector(
    (state: ApplicationState) => state.tables,
  );

  const [userProvider, setUserProvider] = useState<Provider>();
  const [sendUserProvider, setSendUserProvider] = useState<Provider>();
  const [userAccountProvider, setUserAccountProvider] = useState<User>();
  const [sendUserAccountProvider, setSendUserAccountProvider] =
    useState<User>();
  const [infoPlans, setInfoPlans] = useState<Array<ServicePlans>>([]);
  const [uploadedFiles, setUploadedFiles] = useState<IUploadFile[]>([]);
  const [uploadedFiles2, setUploadedFiles2] = useState<IUploadFile[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [logoUrl, setLogoUrl] = useState('');
  const [theme, setTheme] = useState('');
  const [option1, setoption1] = useState(true);
  const [option2, setoption2] = useState(false);
  const [option3, setoption3] = useState(false);
  const [option4, setoption4] = useState(false);
  const [option5, setoption5] = useState(false);
  const [option6, setoption6] = useState(false);
  const [option7, setoption7] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [acceptModalShow, setAcceptModalShow] = useState(false);

  const id = window.location.pathname.substring(3).split('/')[3];

  // Carrega as transactions do provedor
  const loadBillsToReceive = useCallback(
    (id: string) => {
      // console.log('token', token);
      api
        .get(`transactions/search?limit=${1000}&providerId=${id}`, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data.data);
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

  // Carrega os usuários do provedor
  const loadClients = useCallback(
    (id: string) => {
      // console.log('token', token);

      api
        .get(`users/search?limit=${1000}&userType=client&providerId=${id}`, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data.data);
          dispatch(populateClients(response.data.data));
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

  // Carrega os planos do admin
  const loadPlans = useCallback(() => {
    // console.log('token', token);

    api
      .get(`plans/search?limit=${1000}&type=provider`, {
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
  }, [token]);

  // Carrega as informações da conta do provedor
  const loadProviderAccount = useCallback(
    (id: string) => {
      // console.log('token', token);
      setLoading(true);

      api
        .get(`/users/search?providerId=${id}&userType=provider`, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data.data);
          if (response.data.data.length) {
            setUserAccountProvider(response.data.data[0]);
          }
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
    },
    [token],
  );

  // Carrega as informações  do provedor
  const loadProvider = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(
        `/providers/search?id=${
          user?.userType === 'provider' ? user?.providerId : id
        }`,
        {
          headers: { Authorization: token },
        },
      )
      .then(response => {
        // console.log(response.data.data);
        setUserProvider(response.data.data);
        setTheme(response.data.data.theme1);
        loadProviderAccount(response.data.data.id);
        loadBillsToReceive(response.data.data.id);
        loadClients(response.data.data.id);
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

  useEffect(() => {
    loadProvider();
    loadPlans();
  }, [loadProvider, loadPlans]);

  // Atualiza as informações da conta do provedor
  const updateAccountProvider = () => {
    // console.log('token', token);
    setLoading(true);

    api
      .put(`/users/${userAccountProvider?.id}`, sendUserAccountProvider, {
        headers: { Authorization: token },
      })
      .then(() => {
        toast.success('Conta do provedor atualizado');
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

  // Atualiza as informações do provedor
  const updateProvider = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);
    setLoading(true);

    api
      .put(`/providers/${id}`, sendUserProvider, {
        headers: { Authorization: token },
      })
      .then(() => {
        updateAccountProvider();
        toast.success('Provedor atualizado');
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

  // Atualiza a senha da conta do provedor
  const updatePassword = (event: FormEvent) => {
    event.preventDefault();
    // console.log('token', token);

    if (password !== '' && confirmPassword !== '') {
      if (checkPassword(password, confirmPassword)) {
        api
          .put(
            `/users/${userAccountProvider?.id}`,
            { password },
            {
              headers: { Authorization: token },
            },
          )
          .then(() => {
            toast.success('Senha atualizada');
            setAcceptModalShow(false);
            setPassword('');
            setConfirmPassword('');
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
            setAcceptModalShow(false);
          });
      } else {
        setAcceptModalShow(false);
      }
    } else {
      toast.error('Senha não pode ser vazio');
      setAcceptModalShow(false);
    }
  };

  const updateProviderTheme = (url: string) => {
    // console.log('token', token);
    setLoading(true);

    const body = {
      theme1: theme,
      logoUrl: url,
    };

    api
      .put(`/providers/${id}`, body, {
        headers: { Authorization: token },
      })
      .then(() => {
        toast.success('Provedor atualizado');
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
  };

  const SubmitLogo = (event: FormEvent) => {
    event.preventDefault();
    if (uploadedFiles[0]) {
      const body = new FormData();

      body.append('file', uploadedFiles[0].file);
      api
        .post('files', body, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data);

          const url = String(response.data.data.url);

          updateProviderTheme(url);
          // setLogoUrl(url);
        })
        .catch(error => {
          // console.log(error);
          toast.error('Falha ao fazer o upload da logo');
        });
    }
  };

  const SubmitLogoIcon = () => {
    if (uploadedFiles2[0]) {
      const body = new FormData();

      body.append('file', uploadedFiles2[0].file);
      api
        .post('files', body, {
          headers: { Authorization: token },
        })
        .then(response => {
          // console.log(response.data);

          const url = String(response.data.data.url);
          // setLogoUrl(url);
        })
        .catch(error => {
          // console.log(error);
          toast.error('Falha ao fazer o upload da logo');
        });
    }
  };

  // Upload da imagem 1
  const handleUpload = (files: []) => {
    if (files.length <= 1) {
      const upload: any = files.map((file: File) => ({
        file,
        name: file.name,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: null,
      }));
      setUploadedFiles(upload);
    } else {
      toast.error('Você só pode selecionar uma foto!');
    }
  };

  // Upload da imagem 2
  const handleUpload2 = (files: []) => {
    if (files.length <= 1) {
      const upload: any = files.map((file: File) => ({
        file,
        name: file.name,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: null,
      }));
      setUploadedFiles2(upload);
    } else {
      toast.error('Você só pode selecionar uma foto!');
    }
  };

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const handleInputChangeProvider = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    // console.log(name);

    setUserProvider({ ...userProvider, [name]: value });
    setSendUserProvider({ ...sendUserProvider, [name]: value });
  };

  const handleInputChangeAccountProvider = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    // console.log(name);

    setUserAccountProvider({ ...userAccountProvider, [name]: value });
    setSendUserAccountProvider({ ...sendUserAccountProvider, [name]: value });
  };

  const handleClose = () => {
    setAcceptModalShow(false);
  };

  // console.log('Provider', sendUserProvider);
  // console.log('Provider AC', sendUserAccountProvider);

  return (
    <>
      <Container fluid className="container-view-provider">
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <PagePath
            title={
              !loading && userProvider?.socialReason
                ? userProvider?.socialReason
                : 'Provedor'
            }
          />

          <div className="card-header">
            {user?.userType === 'globaladmin' && (
              <Button
                style={{ width: '6.25rem' }}
                className="primary-button outline-primary"
                onClick={() => {
                  onNavigationClick('/home/providers');
                }}
              >
                <div className="icon-button">
                  <Icon icon={arrowLeft} color="#59971f" />
                </div>
                Voltar
              </Button>
            )}
            <div className="container-body-buttons">
              <Button
                className="primary-button outline-primary"
                onClick={() => {
                  setEdit(true);
                }}
              >
                <div className="icon-button">
                  <Icon icon={pencil} color="#59971f" />
                </div>
                Editar dados
              </Button>
            </div>
          </div>
          <div className="card-content">
            <h2 className="subTitle marginBottom">Dados do provedor</h2>
            <div className="container-view-user">
              <button
                type="button"
                className={option1 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(true);
                  setoption2(false);
                  setoption3(false);
                  setoption4(false);
                  setoption5(false);
                  setoption6(false);
                  setoption7(false);
                }}
              >
                Provedor
              </button>
              <button
                type="button"
                className={option2 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(false);
                  setoption2(true);
                  setoption3(false);
                  setoption4(false);
                  setoption5(false);
                  setoption6(false);
                  setoption7(false);
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
                  setoption5(false);
                  setoption6(false);
                  setoption7(false);
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
                  setoption5(false);
                  setoption6(false);
                  setoption7(false);
                  setEdit(false);
                }}
              >
                Cobrança
              </button>
              <button
                type="button"
                className={option5 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(false);
                  setoption2(false);
                  setoption3(false);
                  setoption4(false);
                  setoption5(true);
                  setoption6(false);
                  setoption7(false);
                  setEdit(false);
                }}
              >
                Senha
              </button>
              <button
                type="button"
                className={option6 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(false);
                  setoption2(false);
                  setoption3(false);
                  setoption4(false);
                  setoption5(false);
                  setoption6(true);
                  setoption7(false);
                  setEdit(false);
                }}
              >
                Usuários
              </button>
              <button
                type="button"
                className={option7 ? 'button-option active' : 'button-option'}
                onClick={() => {
                  setoption1(false);
                  setoption2(false);
                  setoption3(false);
                  setoption4(false);
                  setoption5(false);
                  setoption6(false);
                  setoption7(true);
                }}
              >
                Customizar
              </button>
            </div>
            {!loading ? (
              <>
                <Form>
                  {option1 && (
                    <>
                      <Row noGutters>
                        <Col className="field" lg="5">
                          <Form.Group>
                            <Form.Label>Nome completo</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="Nome completo"
                              name="name"
                              value={userAccountProvider?.name}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  responsibleName: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  responsibleName: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                              }}
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
                              value={userAccountProvider?.gender}
                              disabled={!edit}
                              onChange={handleInputChangeAccountProvider}
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
                              name="cpf"
                              value={cpfMask(String(userAccountProvider?.cpf))}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field">
                          <Form.Group>
                            <Form.Label>RG</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="0000000"
                              name="rg"
                              value={userAccountProvider?.rg}
                              disabled={!edit}
                              onChange={handleInputChangeAccountProvider}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="2">
                          <Form.Group>
                            <Form.Label>Órgão expeditor</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="Sigla"
                              name="emittingOrgan"
                              value={userAccountProvider?.emittingOrgan}
                              disabled={!edit}
                              onChange={handleInputChangeAccountProvider}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="3">
                          <Form.Group>
                            <Form.Label>Data de nascimento</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="DD/MM/AAAA"
                              name="birthDate"
                              value={userAccountProvider?.birthDate}
                              disabled={!edit}
                              onChange={handleInputChangeAccountProvider}
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="4">
                          <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="email@email.com"
                              name="email"
                              value={userAccountProvider?.email}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col className="field" lg="3">
                          <Form.Group>
                            <Form.Label>Celular</Form.Label>
                            <Form.Control
                              placeholder="(00) 9 0000-0000"
                              as={Mask}
                              maskChar=" "
                              className="form-control"
                              mask="(99) 9 9999-9999"
                              name="phone"
                              value={userProvider?.phone}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row noGutters>
                        <Col className="field" lg="6">
                          <Form.Group>
                            <Form.Label>Razão social</Form.Label>
                            <Form.Control
                              className="form-control"
                              placeholder="Razão social"
                              name="socialReason"
                              value={userProvider?.socialReason}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                              }}
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
                              value={userProvider?.fantasyName}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                              }}
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
                              value={userProvider?.cnpj}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                              }}
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
                              value={userAccountProvider?.establishmentEmail}
                              disabled={!edit}
                              onChange={handleInputChangeProvider}
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
                              value={userProvider?.phone2}
                              disabled={!edit}
                              onChange={handleInputChangeProvider}
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
                              value={userAccountProvider?.phone3}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  phone2: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  phone2: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
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
                              loadProvider();
                              loadPlans();
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
                              value={userProvider?.address?.zipcode}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  address: {
                                    ...userProvider?.address,
                                    zipcode: event.target.value,
                                  },
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  address: {
                                    ...userProvider?.address,
                                    zipcode: event.target.value,
                                  },
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    zipcode: event.target.value,
                                  },
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  address: {
                                    ...userProvider?.address,
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
                              value={userProvider?.address?.street}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  address: {
                                    ...userProvider?.address,
                                    street: event.target.value,
                                  },
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  address: {
                                    ...userProvider?.address,
                                    street: event.target.value,
                                  },
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    street: event.target.value,
                                  },
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  address: {
                                    ...userProvider?.address,
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
                              value={userProvider?.address?.number}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  address: {
                                    ...userProvider?.address,
                                    number: Number(event.target.value),
                                  },
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  address: {
                                    ...userProvider?.address,
                                    number: Number(event.target.value),
                                  },
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    number: Number(event.target.value),
                                  },
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  address: {
                                    ...userProvider?.address,
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
                              value={userProvider?.address?.complement}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  address: {
                                    ...userProvider?.address,
                                    complement: event.target.value,
                                  },
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  address: {
                                    ...userProvider?.address,
                                    complement: event.target.value,
                                  },
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    complement: event.target.value,
                                  },
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  address: {
                                    ...userProvider?.address,
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
                              value={userProvider?.address?.state}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  address: {
                                    ...userProvider?.address,
                                    state: event.target.value,
                                  },
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  address: {
                                    ...userProvider?.address,
                                    state: event.target.value,
                                  },
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    state: event.target.value,
                                  },
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  address: {
                                    ...userProvider?.address,
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
                              value={userProvider?.address?.city}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  address: {
                                    ...userProvider?.address,
                                    city: event.target.value,
                                  },
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  address: {
                                    ...userProvider?.address,
                                    city: event.target.value,
                                  },
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    city: event.target.value,
                                  },
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  address: {
                                    ...userProvider?.address,
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
                              value={userProvider?.address?.neighborhood}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  address: {
                                    ...userProvider?.address,
                                    neighborhood: event.target.value,
                                  },
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  address: {
                                    ...userProvider?.address,
                                    neighborhood: event.target.value,
                                  },
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    neighborhood: event.target.value,
                                  },
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  address: {
                                    ...userProvider?.address,
                                    neighborhood: event.target.value,
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
                              loadProvider();
                              loadPlans();
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
                              value={userProvider?.planId}
                              disabled={!edit}
                              onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                              ) => {
                                setUserProvider({
                                  ...userProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserProvider({
                                  ...sendUserProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setUserAccountProvider({
                                  ...userAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                                setSendUserAccountProvider({
                                  ...sendUserAccountProvider,
                                  [event.target.name]: event.target.value,
                                });
                              }}
                            >
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
                              loadProvider();
                              loadPlans();
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
                </Form>
                {option4 && (
                  <Table
                    columns={BILLS_TO_RECEIVE_HEADERS}
                    data={transactions}
                    onViewClick={(id: number) =>
                      onNavigationClick(`/home/bills-to-receive/view/${id}`)
                    }
                    viewAction="notShow"
                  />
                )}
                {option5 && (
                  <Form>
                    <Row noGutters>
                      <Col className="field" lg="5">
                        <Form.Group>
                          <Form.Label>Nova senha</Form.Label>
                          <Form.Control
                            placeholder="Nova senha"
                            className="form-control"
                            type="password"
                            value={password}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => setPassword(event.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row noGutters>
                      <Col className="field" lg="5">
                        <Form.Group>
                          <Form.Label>Confirmar nova senha</Form.Label>
                          <Form.Control
                            placeholder="Confirmar nova senha"
                            className="form-control"
                            type="password"
                            value={confirmPassword}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => setConfirmPassword(event.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row noGutters className="container-body-buttons">
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
                  </Form>
                )}
                {option6 && <Table columns={CLIENTS_HEADERS} data={clients} />}
                {option7 && (
                  <Form>
                    <Row noGutters>
                      <Col className="field" lg="2">
                        <Form.Group>
                          <Form.Label>Tema do provedor</Form.Label>
                          <Form.Control
                            className="form-control-color"
                            type="color"
                            name="theme"
                            value={theme}
                            onChange={e => setTheme(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row noGutters>
                      <Col className="field" lg="6">
                        <Form.Group>
                          <Form.Label>Logo completa</Form.Label>
                          <UploadFile onUpload={handleUpload} />
                          {!!uploadedFiles.length && (
                            <FileList file={uploadedFiles[0]} />
                          )}
                        </Form.Group>
                      </Col>
                      <Col className="field" lg="6">
                        <Form.Group>
                          <Form.Label>Logo ícone</Form.Label>
                          <UploadFile onUpload={handleUpload2} />
                          {!!uploadedFiles2.length && (
                            <FileList file={uploadedFiles2[0]} />
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row noGutters className="container-body-buttons">
                      <Button
                        className="primary-button"
                        style={{ marginTop: '1.25rem' }}
                        onClick={SubmitLogo}
                      >
                        <div className="icon-button">
                          <Icon icon={check2} color="#ffffff" />
                        </div>
                        Salvar
                      </Button>
                    </Row>
                  </Form>
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
      </Container>
      {(option1 || option2 || option3 || option7) && (
        <AcceptModal
          value={acceptModalShow}
          handleClose={handleClose}
          updateUser={updateProvider}
        />
      )}
      {option5 && (
        <AcceptModal
          value={acceptModalShow}
          handleClose={handleClose}
          updateUser={updatePassword}
        />
      )}
    </>
  );
};

export default InfoProvider;
