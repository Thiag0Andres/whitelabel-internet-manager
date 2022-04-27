import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import SelectSearch from 'react-select-search';

import Mask from 'react-input-mask';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';
import trashIcon from '@iconify-icons/bi/trash';
import personPlus from '@iconify-icons/bi/person-plus';

import { useFormik } from 'formik';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import PagePath from '../PagePath';

import validationSchema from './validations';
import { currencyMask } from '../../services/mask';
import { transformDate } from '../../services/functions';
import { EmitBilletForm, Options, IBank } from '../../services/types';

// Data
import dataJSON from '../../data/bank.json';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const IncludeFormBillsToReceive: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [clients, setClients] = useState<Array<any>>([]);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadClients = useCallback(() => {
    // console.log('token', token);
    setLoading(true);

    api
      .get(
        `users/search?limit=${1000}&userType=client&providerId=${
          user.providerId
        }`,
        {
          headers: { Authorization: token },
        },
      )
      .then(response => {
        // console.log(response.data.data);
        setClients(response.data.data);
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
    loadClients();
  }, [loadClients]);

  const getDistributorsOptions = () => {
    const options: Options[] = [];

    clients.forEach(item => {
      options.push({
        name: item.name,
        value: { id: String(item.id), name: String(item.name) },
      });
    });

    return options;
  };

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const onSubmit = useCallback(
    (form: EmitBilletForm, resetForm) => {
      if (
        Boolean(form.isIndividual) === false &&
        form.institution !== '' &&
        form.userId !== '' &&
        form.expireDate !== '' &&
        form.amount !== ''
      ) {
        setLoadingSubmit(true);
        api
          .post(
            'transactions/billet',
            {
              ...form,
              expireDate: transformDate(form.expireDate),
              type: 'provider',
            },
            { headers: { Authorization: token } },
          )
          .then(() => {
            // console.log(response);
            toast.success('Boleto incluido com sucesso');
            resetForm({});
            setLoadingSubmit(false);
            onNavigationClick('/home/bills-to-receive');
          })
          .catch(error => {
            if (error.response.data.error.error_description) {
              toast.error(`${error.response.data.error.error_description}`);
            } else {
              toast.error(`${error.response.data.error}`);
            }
            setLoadingSubmit(false);
            if (error.response.data.status === 401) {
              history.push('/login');
            }
          });
      }
      if (
        Boolean(form.isIndividual) === true &&
        userName !== '' &&
        form.userId !== '' &&
        form.expireDate !== '' &&
        form.amount !== ''
      ) {
        setLoadingSubmit(true);
        api
          .post(
            'transactions',
            {
              userId: form.userId,
              isIndividual: true,
              providerId: user.providerId,
              billet: {
                expireDate: form.expireDate,
              },
              takerFullname: userName,
              amount: form.amount.replace(/[^a-zA-Z0-9 ]/g, ''),
              type: 'provider',
            },
            { headers: { Authorization: token } },
          )
          .then(() => {
            // console.log(response);
            toast.success('Transação incluida com sucesso');
            resetForm({});
            setLoadingSubmit(false);
            onNavigationClick('/home/bills-to-receive');
          })
          .catch(error => {
            if (error.response.data.error.error_description) {
              toast.error(`${error.response.data.error.error_description}`);
            } else {
              toast.error(`${error.response.data.error}`);
            }
            setLoadingSubmit(false);
            if (error.response.data.status === 401) {
              history.push('/login');
            }
          });
      }
    },
    [token, userName],
  );

  const formik = useFormik<EmitBilletForm>({
    initialValues: {
      isIndividual: false,
      institution: '',
      userId: '',
      expireDate: '',
      amount: '',
      message: '',
    },
    validationSchema,
    onSubmit,
  });

  const { values, setFieldValue, setFieldTouched, errors, touched, resetForm } =
    formik;

  return (
    <Container fluid className="container-include-bills">
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
          <Form
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();
              onSubmit(values, resetForm);
            }}
          >
            <h2 className="subTitle marginBottom">Emitir novo boleto</h2>
            <Row noGutters>
              <Col lg="1">
                <Form.Group>
                  <Form.Label>Transação manual</Form.Label>
                  <Form.Control
                    as="select"
                    className="form-control"
                    value={Number(values.isIndividual) || 0}
                    onBlur={() => setFieldTouched('isIndividual')}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('isIndividual', event.target.value)
                    }
                    isInvalid={
                      touched.isIndividual &&
                      Boolean(errors && errors.isIndividual)
                    }
                  >
                    <option value={1}>Sim</option>
                    <option value={0}>Não</option>
                  </Form.Control>
                  {touched.isIndividual && errors && errors.isIndividual && (
                    <Form.Text className="text-error">{`${errors.isIndividual}`}</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            {Number(values.isIndividual) === 0 && (
              <Row noGutters>
                <Col lg="4">
                  <Form.Group>
                    <Form.Label>Instituição</Form.Label>
                    <Form.Control
                      as="select"
                      onBlur={() => setFieldTouched('institution')}
                      value={values.institution || ''}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setFieldValue('institution', event.target.value);
                      }}
                      isInvalid={
                        touched.institution &&
                        Boolean(errors && errors.institution)
                      }
                      disabled={loading}
                    >
                      <option value="">Selecione</option>
                      {dataJSON.map((item: IBank) => {
                        return (
                          <option
                            value={`${item.code} - ${item.name}`}
                            key={item.code}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </Form.Control>
                    {touched.institution && errors && errors.institution && (
                      <Form.Text className="text-error">{`${errors.institution}`}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row noGutters>
              <Col lg="4">
                <Form.Group>
                  <Form.Label>Nome completo do tomador</Form.Label>
                  <SelectSearch
                    search
                    placeholder="Pesquisar..."
                    onChange={(e: any) => {
                      setFieldValue('userId', e.id);
                      setUserName(e.name);
                    }}
                    options={getDistributorsOptions()}
                  />

                  {touched.userId && errors && errors.userId && (
                    <Form.Text className="text-error">{`${errors.userId}`}</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row noGutters>
              <Col lg="2">
                <Form.Group>
                  <Form.Label>Valor do boleto</Form.Label>
                  <Form.Control
                    placeholder="R$ 0000,00"
                    className="form-control"
                    value={currencyMask(values.amount) || ''}
                    onBlur={() => setFieldTouched('amount')}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('amount', event.target.value)
                    }
                    isInvalid={
                      touched.amount && Boolean(errors && errors.amount)
                    }
                    disabled={loading}
                  />
                  {touched.amount && errors && errors.amount && (
                    <Form.Text className="text-error">{`${errors.amount}`}</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col className="field" lg="2">
                <Form.Group>
                  <Form.Label>Vencimento</Form.Label>
                  <Form.Control
                    placeholder="DD/MM/AAAA"
                    as={Mask}
                    maskChar=" "
                    mask="99/99/9999"
                    className="form-control"
                    value={values.expireDate || ''}
                    onBlur={() => setFieldTouched('expireDate')}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('expireDate', event.target.value)
                    }
                    isInvalid={
                      touched.expireDate && Boolean(errors && errors.expireDate)
                    }
                    disabled={loading}
                  />
                  {touched.expireDate && errors && errors.expireDate && (
                    <Form.Text className="text-error">{`${errors.expireDate}`}</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            {Number(values.isIndividual) === 0 && (
              <Row noGutters>
                <Col>
                  <Form.Group>
                    <Form.Label>Observações do boleto</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={values.message || ''}
                      onBlur={() => setFieldTouched('message')}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue('message', event.target.value)
                      }
                      isInvalid={
                        touched.message && Boolean(errors && errors.message)
                      }
                      disabled={loading}
                    />
                    {touched.message && errors && errors.message && (
                      <Form.Text className="text-error">{`${errors.message}`}</Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row noGutters className="container-body-buttons">
              <Button
                style={{ marginRight: '0.625rem' }}
                className="primary-button outline-secundary"
                onClick={() => {
                  resetForm({});
                }}
              >
                <div className="icon-button">
                  <Icon icon={trashIcon} color="#DB324F" />
                </div>
                Limpar
              </Button>
              <Button
                className="primary-button"
                type="submit"
                disabled={loadingSubmit}
              >
                {!loadingSubmit ? (
                  <>
                    <div className="icon-button">
                      <Icon icon={personPlus} color="#ffffff" />
                    </div>
                    Gerar boleto
                  </>
                ) : (
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </Row>
          </Form>
        </div>
      </Col>
    </Container>
  );
};

export default IncludeFormBillsToReceive;
