import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import { useFormik } from 'formik';

import Mask from 'react-input-mask';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import trashIcon from '@iconify-icons/bi/trash';
import BoxSeamIcon from '@iconify-icons/bi/box-seam';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import validationSchema from './validations';
import { ServicePlansForm } from '../../services/types';
import { currencyMask, percentageMask } from '../../services/mask';

import { ENVIRONMENT_TYPES } from '../../constants/selects-options';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const FormServicePlans: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [infoMK, setInfoMK] = useState<Array<any>>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const loadMK = useCallback(() => {
    // console.log('token', token);

    api
      .get(
        `/mikrotik/search?limit=${1000}&providerId=${String(user.providerId)}`,
        {
          headers: { Authorization: token },
        },
      )
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
    if (user.userType !== 'globaladmin') {
      loadMK();
    }
  }, [loadMK]);

  const onSubmit = useCallback((form: ServicePlansForm, resetForm) => {
    if (form) {
      setLoadingSubmit(true);
      const bodyPlanAdmin = {
        type: 'provider',
        name: form.name,
        amount: form.amount,
        description: form.description !== '' ? form.description : '-',
        maxClients: form.maxClients,
        cfop: form.cfop,
        planType: form.planType,
      };

      const bodyPlanProvider = form;
      delete bodyPlanProvider.maxClients;

      api
        .post(
          'plans',
          user.userType === 'globaladmin' ? bodyPlanAdmin : bodyPlanProvider,
          {
            headers: { Authorization: token },
          },
        )
        .then(() => {
          // console.log(response);
          resetForm({});
          setLoadingSubmit(false);
          toast.success('Plano cadastrado com sucesso');
          onNavigationClick('/home/service-plans');
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

  const formik = useFormik<ServicePlansForm>({
    initialValues: {
      providerId: String(user.providerId),
      mkId: '',
      type: 'client',
      downloadSpeed: '',
      uploadSpeed: '',
      name: '',
      description: '',
      amount: '',
      environmentType: '',
      technologyType: '',
      maxClients: '',
      scmAmount: '',
      svaAmount: '',
      planType: '',
      cfop: '',
      icmsTax: '',
      pisTax: '',
      cofinsTax: '',
      ibptTax: '',
      ibptCityTax: '',
      ibptStateTax: '',
      ibptFederalTax: '',
    },
    validationSchema,
    onSubmit,
  });

  const { values, setFieldValue, setFieldTouched, errors, touched, resetForm } =
    formik;

  useEffect(() => {
    setFieldValue('planType', 'dedicated');
  }, []);

  return (
    <Form
      className="form-service"
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(values, resetForm);
      }}
    >
      <h2 className="subTitle marginBottom">Novo plano</h2>
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue('planType', event.target.value);
            }}
          />
        </Col>
        <Col className="field" lg="2">
          <Form.Check
            inline
            label="Semi-dedicado"
            name="planType"
            type="radio"
            value="semiDedicated"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue('planType', event.target.value);
            }}
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
              value={values.name || ''}
              onBlur={() => setFieldTouched('name')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('name', event.target.value);
              }}
              isInvalid={touched.name && Boolean(errors && errors.name)}
            />
            {touched.name && errors && errors.name && (
              <Form.Text className="text-error">{`${errors.name}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="6">
          <Form.Group>
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Descrição do plano"
              value={values.description || ''}
              onBlur={() => setFieldTouched('description')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('description', event.target.value);
              }}
              isInvalid={
                touched.description && Boolean(errors && errors.description)
              }
            />
            {touched.description && errors && errors.description && (
              <Form.Text className="text-error">{`${errors.description}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        {user.userType === 'globaladmin' && (
          <>
            <Col lg="2">
              <Form.Group>
                <Form.Label>Máximo de clientes</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="0 Clientes"
                  required
                  value={values.maxClients || ''}
                  onBlur={() => setFieldTouched('maxClients')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('maxClients', event.target.value);
                  }}
                  isInvalid={
                    touched.maxClients && Boolean(errors && errors.maxClients)
                  }
                />
                {touched.maxClients && errors && errors.maxClients && (
                  <Form.Text className="text-error">{`${errors.maxClients}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>Valor total</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="R$ 000,00"
                  required
                  value={currencyMask(values.amount) || ''}
                  onBlur={() => setFieldTouched('amount')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('amount', event.target.value)
                  }
                  isInvalid={touched.amount && Boolean(errors && errors.amount)}
                />
                {touched.amount && errors && errors.amount && (
                  <Form.Text className="text-error">{`${errors.amount}`}</Form.Text>
                )}
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
                  className="form-control"
                  placeholder="R$ 000,00"
                  required
                  value={currencyMask(values.amount) || ''}
                  onBlur={() => setFieldTouched('amount')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('amount', event.target.value)
                  }
                  isInvalid={touched.amount && Boolean(errors && errors.amount)}
                />
                {touched.amount && errors && errors.amount && (
                  <Form.Text className="text-error">{`${errors.amount}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>Valor SCM</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="R$ 000,00"
                  value={currencyMask(values.scmAmount) || ''}
                  onBlur={() => setFieldTouched('scmAmount')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('scmAmount', event.target.value)
                  }
                  isInvalid={
                    touched.scmAmount && Boolean(errors && errors.scmAmount)
                  }
                />
                {touched.scmAmount && errors && errors.scmAmount && (
                  <Form.Text className="text-error">{`${errors.scmAmount}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>Valor SVA</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="R$ 000,00"
                  value={currencyMask(values.svaAmount) || ''}
                  onBlur={() => setFieldTouched('svaAmount')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('svaAmount', event.target.value)
                  }
                  isInvalid={
                    touched.svaAmount && Boolean(errors && errors.svaAmount)
                  }
                />
                {touched.svaAmount && errors && errors.svaAmount && (
                  <Form.Text className="text-error">{`${errors.svaAmount}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="3">
              <Form.Group>
                <Form.Label>Tipo do meio</Form.Label>
                <Form.Control
                  className="form-control"
                  as="select"
                  required
                  value={values.environmentType || ''}
                  onBlur={() => setFieldTouched('environmentType')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('environmentType', event.target.value)
                  }
                  isInvalid={
                    touched.environmentType &&
                    Boolean(errors && errors.environmentType)
                  }
                >
                  <option value="">Selecione</option>
                  {ENVIRONMENT_TYPES.map(item => {
                    return (
                      <option value={item.value} key={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Control>
                {touched.environmentType &&
                  errors &&
                  errors.environmentType && (
                    <Form.Text className="text-error">{`${errors.environmentType}`}</Form.Text>
                  )}
              </Form.Group>
            </Col>
            <Col className="field" lg="3">
              <Form.Group>
                <Form.Label>Tipo de tecnologia</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="NR"
                  required
                  value={values.technologyType || ''}
                  onBlur={() => setFieldTouched('technologyType')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('technologyType', event.target.value)
                  }
                  isInvalid={
                    touched.technologyType &&
                    Boolean(errors && errors.technologyType)
                  }
                />
                {touched.technologyType && errors && errors.technologyType && (
                  <Form.Text className="text-error">{`${errors.technologyType}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </>
        )}
      </Row>

      <h2 className="subTitle marginTop marginBottom">Dados Fiscais</h2>
      <Row noGutters>
        <Col lg="2">
          <Form.Group>
            <Form.Label>CFOP</Form.Label>
            <Form.Control
              as="select"
              value={values.cfop || ''}
              required
              onBlur={() => setFieldTouched('cfop')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('cfop', event.target.value)
              }
              isInvalid={touched.cfop && Boolean(errors && errors.cfop)}
            >
              <option>Escolha...</option>
              <option value="5304">5.304</option>
              <option value="5307">5.307</option>
              <option value="6304">6.304</option>
              <option value="6307">6.307</option>
            </Form.Control>
            {touched.cfop && errors && errors.cfop && (
              <Form.Text className="text-error">{`${errors.cfop}`}</Form.Text>
            )}
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
                  value={percentageMask(values.icmsTax || '')}
                  onBlur={() => setFieldTouched('icmsTax')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      'icmsTax',
                      Number(percentageMask(event.target.value)) >= 100.0
                        ? percentageMask('100')
                        : event.target.value,
                    )
                  }
                  isInvalid={
                    touched.icmsTax && Boolean(errors && errors.icmsTax)
                  }
                />
                {touched.icmsTax && errors && errors.icmsTax && (
                  <Form.Text className="text-error">{`${errors.icmsTax}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>Alíquota PIS/PASEP</Form.Label>
                <Form.Control
                  placeholder="0%"
                  className="form-control"
                  name="pisTax"
                  value={percentageMask(values.pisTax || '')}
                  onBlur={() => setFieldTouched('pisTax')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      'pisTax',
                      Number(percentageMask(event.target.value)) >= 100
                        ? percentageMask('100')
                        : event.target.value,
                    )
                  }
                  isInvalid={touched.pisTax && Boolean(errors && errors.pisTax)}
                />
                {touched.pisTax && errors && errors.pisTax && (
                  <Form.Text className="text-error">{`${errors.pisTax}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>Alíquota COFINS</Form.Label>
                <Form.Control
                  placeholder="0%"
                  className="form-control"
                  name="cofinsTax"
                  value={percentageMask(values.cofinsTax || '')}
                  onBlur={() => setFieldTouched('cofinsTax')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      'cofinsTax',
                      Number(percentageMask(event.target.value)) >= 100.0
                        ? percentageMask('100')
                        : event.target.value,
                    )
                  }
                  isInvalid={
                    touched.cofinsTax && Boolean(errors && errors.cofinsTax)
                  }
                />
                {touched.cofinsTax && errors && errors.cofinsTax && (
                  <Form.Text className="text-error">{`${errors.cofinsTax}`}</Form.Text>
                )}
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
                  value={percentageMask(values.ibptTax || '')}
                  onBlur={() => setFieldTouched('ibptTax')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      'ibptTax',
                      Number(percentageMask(event.target.value)) >= 100
                        ? percentageMask('100')
                        : event.target.value,
                    )
                  }
                  isInvalid={
                    touched.ibptTax && Boolean(errors && errors.ibptTax)
                  }
                />
                {touched.ibptTax && errors && errors.ibptTax && (
                  <Form.Text className="text-error">{`${errors.ibptTax}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>IBPT municipal</Form.Label>
                <Form.Control
                  placeholder="0%"
                  className="form-control"
                  name="ibptCityTax"
                  value={percentageMask(values.ibptCityTax || '')}
                  onBlur={() => setFieldTouched('ibptCityTax')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      'ibptCityTax',
                      Number(percentageMask(event.target.value)) >= 100
                        ? percentageMask('100')
                        : event.target.value,
                    )
                  }
                  isInvalid={
                    touched.ibptCityTax && Boolean(errors && errors.ibptCityTax)
                  }
                />
                {touched.ibptCityTax && errors && errors.ibptCityTax && (
                  <Form.Text className="text-error">{`${errors.ibptCityTax}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>IBPT estadual</Form.Label>
                <Form.Control
                  placeholder="0%"
                  className="form-control"
                  name="ibptStateTax"
                  value={percentageMask(values.ibptStateTax || '')}
                  onBlur={() => setFieldTouched('ibptStateTax')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      'ibptStateTax',
                      Number(percentageMask(event.target.value)) >= 100
                        ? percentageMask('100')
                        : event.target.value,
                    )
                  }
                  isInvalid={
                    touched.ibptStateTax &&
                    Boolean(errors && errors.ibptStateTax)
                  }
                />
                {touched.ibptStateTax && errors && errors.ibptStateTax && (
                  <Form.Text className="text-error">{`${errors.ibptStateTax}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>IBPT federal</Form.Label>
                <Form.Control
                  placeholder="0%"
                  className="form-control"
                  name="ibptFederalTax"
                  value={percentageMask(values.ibptFederalTax || '')}
                  onBlur={() => setFieldTouched('ibptFederalTax')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue(
                      'ibptFederalTax',
                      Number(percentageMask(event.target.value)) >= 100
                        ? percentageMask('100')
                        : event.target.value,
                    )
                  }
                  isInvalid={
                    touched.ibptFederalTax &&
                    Boolean(errors && errors.ibptFederalTax)
                  }
                />
                {touched.ibptFederalTax && errors && errors.ibptFederalTax && (
                  <Form.Text className="text-error">{`${errors.ibptFederalTax}`}</Form.Text>
                )}
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
                <Form.Label>Download</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="000 Mega"
                  required
                  value={values.downloadSpeed || ''}
                  onBlur={() => setFieldTouched('downloadSpeed')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('downloadSpeed', event.target.value);
                  }}
                  isInvalid={
                    touched.downloadSpeed &&
                    Boolean(errors && errors.downloadSpeed)
                  }
                />
                {touched.downloadSpeed && errors && errors.downloadSpeed && (
                  <Form.Text className="text-error">{`${errors.downloadSpeed}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col className="field" lg="2">
              <Form.Group>
                <Form.Label>Upload</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="000 Mega"
                  required
                  value={values.uploadSpeed || ''}
                  onBlur={() => setFieldTouched('uploadSpeed')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('uploadSpeed', event.target.value);
                  }}
                  isInvalid={
                    touched.uploadSpeed && Boolean(errors && errors.uploadSpeed)
                  }
                />
                {touched.uploadSpeed && errors && errors.uploadSpeed && (
                  <Form.Text className="text-error">{`${errors.uploadSpeed}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <h2 className="subTitle marginTop marginBottom">Mikrotik</h2>
          <Row noGutters>
            <Col lg="6">
              <Form.Group>
                <Form.Label>Mikrotik</Form.Label>
                <Form.Control
                  className="form-control"
                  as="select"
                  required
                  value={values.mkId || ''}
                  onBlur={() => setFieldTouched('mkId')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('mkId', event.target.value)
                  }
                  isInvalid={touched.mkId && Boolean(errors && errors.mkId)}
                >
                  <option value="">Selecione um mikrotik</option>
                  {infoMK &&
                    infoMK.map(item => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.username}
                        </option>
                      );
                    })}
                </Form.Control>
                {touched.mkId && errors && errors.mkId && (
                  <Form.Text className="text-error">{`${errors.mkId}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
        </>
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
                <Icon icon={BoxSeamIcon} color="#ffffff" />
              </div>
              Cadastrar plano
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
  );
};

export default FormServicePlans;
