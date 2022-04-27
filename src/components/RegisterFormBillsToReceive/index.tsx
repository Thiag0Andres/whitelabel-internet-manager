import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import SelectSearch from 'react-select-search';

import Mask from 'react-input-mask';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';
import trashIcon from '@iconify-icons/bi/trash';
import personPlus from '@iconify-icons/bi/person-plus';
// import chevronDown from '@iconify-icons/heroicons-outline/chevron-down';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import PagePath from '../PagePath';

import validationSchema from './validations';
import { Imultiplebillet, Options } from '../../services/types';

import { NUMBER_BILLS } from '../../constants/selects-options';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const RegisterFormBillsToReceive: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [clients, setClients] = useState<Array<any>>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadClients = useCallback(() => {
    // console.log('token', token);

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
    loadClients();
  }, [loadClients]);

  const getDistributorsOptions = () => {
    const options: Options[] = [];

    clients.forEach(item => {
      options.push({ name: item.name, value: String(item.id) });
    });
    return options;
  };

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const onSubmit = useCallback((form: Imultiplebillet, resetForm) => {
    if (form.userId !== '' && form.dueDate !== '' && form.installments !== '') {
      setLoadingSubmit(true);
      const splitDate = form.dueDate.split('/') || [];

      const [year, month, day] = [
        Number(splitDate[2]),
        Number(splitDate[1]),
        Number(splitDate[0]),
      ];

      const body = {
        type: form.type,
        userId: [form.userId],
        year,
        month,
        day,
        installments: Number(form.installments),
      };

      // console.log(body);

      api
        .post('transactions/multiplebillet', body, {
          headers: { Authorization: token },
        })
        .then(() => {
          // console.log(response);
          toast.success('Carnê gerado com sucesso');
          resetForm({});
          setLoadingSubmit(false);
        })
        .catch(error => {
          // console.log(error.response);
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
  }, []);

  const formik = useFormik({
    initialValues: {
      type: 'provider',
      userId: '',
      dueDate: '',
      installments: '',
    },
    validationSchema,
    onSubmit,
  });

  const { values, setFieldValue, setFieldTouched, errors, touched, resetForm } =
    formik;

  return (
    <Container fluid className="container-register-bills">
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
              <Icon icon={arrowLeft} color="#59971f" />
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
            <h2 className="subTitle marginBottom">Gerar boletos de cobrança</h2>
            <Row noGutters>
              <Col lg="3">
                <Form.Group>
                  <Form.Label>Data da primeira parcela</Form.Label>
                  <Form.Control
                    placeholder="DD/MM/AAAA"
                    as={Mask}
                    maskChar=" "
                    mask="99/99/9999"
                    className="form-control"
                    value={values.dueDate || ''}
                    onBlur={() => setFieldTouched('dueDate')}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('dueDate', event.target.value)
                    }
                    isInvalid={
                      touched.dueDate && Boolean(errors && errors.dueDate)
                    }
                  />
                  {touched.dueDate && errors && errors.dueDate && (
                    <Form.Text className="text-error">{`${errors.dueDate}`}</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col className="field" lg="3">
                <Form.Group>
                  <Form.Label>Gerar boletos de cobrança</Form.Label>
                  <Form.Control as="select">
                    <option value="yes">Sim</option>
                    <option value="no">Não</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row noGutters>
              <Col lg="3">
                <Form.Group>
                  <Form.Label>Nome completo do tomador</Form.Label>
                  <SelectSearch
                    search
                    placeholder="Pesquisar..."
                    onChange={e => {
                      setFieldValue('userId', e);
                    }}
                    options={getDistributorsOptions()}
                  />

                  {touched.userId && errors && errors.userId && (
                    <Form.Text className="text-error">{`${errors.userId}`}</Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col className="field" lg="3">
                <Form.Group>
                  <Form.Label>Número de boletos por cliente</Form.Label>
                  <Form.Control
                    as="select"
                    value={values.installments || ''}
                    onBlur={() => setFieldTouched('installments')}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('installments', event.target.value)
                    }
                    isInvalid={
                      touched.installments &&
                      Boolean(errors && errors.installments)
                    }
                  >
                    <option value="">Selecione</option>
                    {NUMBER_BILLS.map(item => {
                      return (
                        <option key={item.id} value={item.value}>
                          {item.value}
                        </option>
                      );
                    })}
                  </Form.Control>
                  {touched.installments && errors && errors.installments && (
                    <Form.Text className="text-error">{`${errors.installments}`}</Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
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
                    Gerar boletos
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

export default RegisterFormBillsToReceive;
