import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Row, Col, Form, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import Mask from 'react-input-mask';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import trashIcon from '@iconify-icons/bi/trash';
import PersonPlus from '@iconify-icons/bi/person-plus';
import { useFormik } from 'formik';

import validationSchema from './validations';
import { ServicePlans } from '../../services/types';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const RegisterFormProvider: React.FC = () => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const [infoPlans, setInfoPlans] = useState<Array<ServicePlans>>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadPlans = useCallback(() => {
    // console.log('token', token);

    api
      .get(`/plans/search?limit=${1000}&type=provider`, {
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

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const createProviderAccount = useCallback((id, form, resetForm) => {
    if (form) {
      const newObject = form;
      delete newObject.url;

      api
        .post(
          'users/register',
          {
            ...newObject,
            attendanceType: 'urbano',
            providerId: String(id),
            address: {
              ...newObject.address,
              number: Number(newObject.address.number),
            },
            establishmentEmail:
              form.establishmentEmail !== ''
                ? form.establishmentEmail
                : undefined,
            status: 'compliant',
          },
          { headers: { Authorization: token } },
        )
        .then(() => {
          // console.log(response.data);
          resetForm({});
          setLoadingSubmit(false);
          toast.success('Conta do provedor criada com sucesso');
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

  const onSubmit = useCallback((form, resetForm) => {
    if (form && form.gender !== '' && form.planId !== '') {
      setLoadingSubmit(true);
      api
        .post(
          'providers',
          {
            planId: form.planId,
            responsibleName: form.name,
            fantasyName: form.fantasyName,
            socialReason: form.socialReason,
            phone: form.phone,
            phone2: form.phone3,
            email: form.establishmentEmail,
            cnpj: form.cnpj,
            cpf: form.cpf,
            url: form.url === '' ? undefined : form.url,
            address: {
              zipcode: form.address.zipcode,
              state: form.address.state,
              city: form.address.city,
              street: form.address.street,
              neighborhood: form.address.neighborhood,
              number: Number(form.address.number),
              complement: form.address.complement,
            },
            bank: '-',
            theme1: '#59971f',
            status: 'compliant',
          },
          { headers: { Authorization: token } },
        )
        .then(response => {
          // console.log(response.data);
          createProviderAccount(response.data.data.id, form, resetForm);
          toast.success('Provedor cadastrado com sucesso');
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
      planId: '',
      userType: 'provider',
      name: '',
      gender: '',
      cpf: '',
      rg: '',
      emittingOrgan: '',
      birthDate: '',
      email: '',
      phone: '',
      socialReason: '',
      fantasyName: '',
      cnpj: '',
      stateRegistration: '',
      establishmentEmail: '',
      phone2: '',
      phone3: '',
      url: '',
      address: {
        zipcode: '',
        state: '',
        city: '',
        street: '',
        neighborhood: '',
        number: '',
        complement: '',
        ibgeCode: '',
      },
    },
    validationSchema,
    onSubmit,
  });

  const { values, setFieldValue, setFieldTouched, errors, touched, resetForm } =
    formik;

  const loadCepInfos = useCallback((cep: string) => {
    api
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => {
        setFieldValue('address.ibgeCode', response.data.ibge);
        setFieldValue('address.city', response.data.localidade);
        setFieldValue('address.state', response.data.uf);
        setFieldValue('address.street', response.data.logradouro);
        setFieldValue('address.neighborhood', response.data.bairro);

        if (response.data.erro) {
          toast.error('CEP não encontrado');
        }
      })
      .catch(() => {
        // console.log(error.response);
      });
  }, []);

  return (
    <Form
      className="form-provider"
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(values, resetForm);
      }}
    >
      <h2 className="subTitle marginBottom">Dados Pessoais</h2>
      <Row noGutters>
        <Col lg="5">
          <Form.Group>
            <Form.Label>Nome completo</Form.Label>
            <Form.Control
              placeholder="Nome completo"
              className="form-control"
              required
              value={values.name || ''}
              onBlur={() => setFieldTouched('name')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('name', event.target.value)
              }
              isInvalid={touched.name && Boolean(errors && errors.name)}
            />
            {touched.name && errors && errors.name && (
              <Form.Text className="text-error">{`${errors.name}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field">
          <Form.Group>
            <Form.Label>Sexo</Form.Label>
            <Form.Control
              className="form-control"
              required
              as="select"
              value={values.gender || ''}
              onBlur={() => setFieldTouched('gender')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('gender', event.target.value)
              }
              isInvalid={touched.gender && Boolean(errors && errors.gender)}
            >
              <option value="">Sexo</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </Form.Control>
            {touched.gender && errors && errors.gender && (
              <Form.Text className="text-error">{`${errors.gender}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>CPF</Form.Label>
            <Form.Control
              placeholder="000.000.000-00"
              as={Mask}
              maskChar="_"
              mask="999.999.999-99"
              className="form-control"
              required
              value={values.cpf || ''}
              onBlur={() => setFieldTouched('cpf')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('cpf', event.target.value)
              }
              isInvalid={touched.cpf && Boolean(errors && errors.cpf)}
            />
            {touched.cpf && errors && errors.cpf && (
              <Form.Text className="text-error">{`${errors.cpf}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field">
          <Form.Group>
            <Form.Label>RG</Form.Label>
            <Form.Control
              placeholder="0000000"
              className="form-control"
              required
              minLength={5}
              value={values.rg || ''}
              onBlur={() => setFieldTouched('rg')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('rg', event.target.value)
              }
              isInvalid={touched.rg && Boolean(errors && errors.rg)}
            />
            {touched.rg && errors && errors.rg && (
              <Form.Text className="text-error">{`${errors.rg}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Órgão expeditor</Form.Label>
            <Form.Control
              placeholder="Sigla"
              className="form-control"
              required
              value={values.emittingOrgan || ''}
              onBlur={() => setFieldTouched('emittingOrgan')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('emittingOrgan', event.target.value)
              }
              isInvalid={
                touched.emittingOrgan && Boolean(errors && errors.emittingOrgan)
              }
            />
            {touched.emittingOrgan && errors && errors.emittingOrgan && (
              <Form.Text className="text-error">{`${errors.emittingOrgan}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col lg="3">
          <Form.Group>
            <Form.Label>Data de nascimento</Form.Label>
            <Form.Control
              placeholder="DD/MM/AAAA"
              as={Mask}
              maskChar=" "
              mask="99/99/9999"
              className="form-control"
              required
              value={values.birthDate || ''}
              onBlur={() => setFieldTouched('birthDate')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('birthDate', event.target.value)
              }
              isInvalid={
                touched.birthDate && Boolean(errors && errors.birthDate)
              }
            />
            {touched.birthDate && errors && errors.birthDate && (
              <Form.Text className="text-error">{`${errors.birthDate}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="4">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              placeholder="email@email.com"
              className="form-control"
              required
              value={values.email || ''}
              onBlur={() => setFieldTouched('email')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('email', event.target.value)
              }
              isInvalid={touched.email && Boolean(errors && errors.email)}
            />
            {touched.email && errors && errors.email && (
              <Form.Text className="text-error">{`${errors.email}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="3">
          <Form.Group>
            <Form.Label>Celular</Form.Label>
            <Form.Control
              placeholder="(00) 9 0000-0000"
              as={Mask}
              maskChar=" "
              mask="(99) 9 9999-9999"
              className="form-control"
              required
              value={values.phone || ''}
              onBlur={() => setFieldTouched('phone')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('phone', event.target.value)
              }
              isInvalid={touched.phone && Boolean(errors && errors.phone)}
            />
            {touched.phone && errors && errors.phone && (
              <Form.Text className="text-error">{`${errors.phone}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <h2 className="subTitle marginTop marginBottom">Estabecimento</h2>
      <Row noGutters>
        <Col lg="6">
          <Form.Group>
            <Form.Label>Razão social</Form.Label>
            <Form.Control
              placeholder="Razão social"
              className="form-control"
              required
              value={values.socialReason || ''}
              onBlur={() => setFieldTouched('socialReason')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('socialReason', event.target.value)
              }
              isInvalid={
                touched.socialReason && Boolean(errors && errors.socialReason)
              }
            />
            {touched.socialReason && errors && errors.socialReason && (
              <Form.Text className="text-error">{`${errors.socialReason}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="6">
          <Form.Group>
            <Form.Label>Nome fantasia</Form.Label>
            <Form.Control
              placeholder="Nome fantasia"
              className="form-control"
              required
              value={values.fantasyName || ''}
              onBlur={() => setFieldTouched('fantasyName')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('fantasyName', event.target.value)
              }
              isInvalid={
                touched.fantasyName && Boolean(errors && errors.fantasyName)
              }
            />
            {touched.fantasyName && errors && errors.fantasyName && (
              <Form.Text className="text-error">{`${errors.fantasyName}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row noGutters>
        <Col lg="3">
          <Form.Group>
            <Form.Label>CNPJ</Form.Label>
            <Form.Control
              placeholder="00.000.000/0001-00"
              as={Mask}
              maskChar="_"
              mask="99.999.999/9999-99"
              className="form-control"
              required
              value={values.cnpj || ''}
              onBlur={() => setFieldTouched('cnpj')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('cnpj', event.target.value)
              }
              isInvalid={touched.cnpj && Boolean(errors && errors.cnpj)}
            />
            {touched.cnpj && errors && errors.cnpj && (
              <Form.Text className="text-error">{`${errors.cnpj}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Inscrição Estadual</Form.Label>
            <Form.Control
              placeholder="000000000000"
              className="form-control"
              value={values.stateRegistration || ''}
              onBlur={() => setFieldTouched('stateRegistration')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('stateRegistration', event.target.value)
              }
              isInvalid={
                touched.stateRegistration &&
                Boolean(errors && errors.stateRegistration)
              }
            />
            {touched.stateRegistration &&
              errors &&
              errors.stateRegistration && (
                <Form.Text className="text-error">{`${errors.stateRegistration}`}</Form.Text>
              )}
          </Form.Group>
        </Col>
        <Col className="field" lg="3">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              placeholder="email@email.com"
              className="form-control"
              required
              value={values.establishmentEmail || ''}
              onBlur={() => setFieldTouched('establishmentEmail')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('establishmentEmail', event.target.value)
              }
              isInvalid={
                touched.establishmentEmail &&
                Boolean(errors && errors.establishmentEmail)
              }
            />
            {touched.establishmentEmail &&
              errors &&
              errors.establishmentEmail && (
                <Form.Text className="text-error">{`${errors.establishmentEmail}`}</Form.Text>
              )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              placeholder="(00) 00000-0000"
              as={Mask}
              maskChar="_"
              mask="(99) 99999-9999"
              className="form-control"
              value={values.phone2 || ''}
              onBlur={() => setFieldTouched('phone2')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('phone2', event.target.value)
              }
              isInvalid={touched.phone2 && Boolean(errors && errors.phone2)}
            />
            {touched.phone2 && errors && errors.phone2 && (
              <Form.Text className="text-error">{`${errors.phone2}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Celular</Form.Label>
            <Form.Control
              placeholder="(00) 9 0000-0000"
              as={Mask}
              maskChar=" "
              mask="(99) 9 9999-9999"
              className="form-control"
              required
              value={values.phone3 || ''}
              onBlur={() => setFieldTouched('phone3')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('phone3', event.target.value)
              }
              isInvalid={Boolean(errors && errors.phone3)}
            />
            {errors && errors.phone3 && (
              <Form.Text className="text-error">{`${errors.phone3}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row noGutters>
        <Col lg="6">
          <Form.Group>
            <Form.Label>URL</Form.Label>
            <Form.Control
              placeholder="www.url.com.br"
              className="form-control"
              value={values.url || ''}
              onBlur={() => setFieldTouched('url')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('url', event.target.value)
              }
              isInvalid={Boolean(errors && errors.url)}
            />
            {errors && errors.url && (
              <Form.Text className="text-error">{`${errors.url}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <h2 className="subTitle marginTop marginBottom">Endereço</h2>
      <Row noGutters>
        <Col lg="3">
          <Form.Group>
            <Form.Label>CEP</Form.Label>
            <Form.Control
              className="form-control"
              required
              placeholder="00000-000"
              as={Mask}
              maskChar="_"
              mask="99999-999"
              name="address.zipcode"
              value={values.address.zipcode || ''}
              onBlur={() => {
                setFieldTouched('address.zipcode');
                loadCepInfos(values.address.zipcode);
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue('address.zipcode', event.target.value);
              }}
              isInvalid={
                touched.address?.zipcode &&
                Boolean(errors && errors.address?.zipcode)
              }
            />
            {touched.address?.zipcode && errors && errors.address?.zipcode && (
              <Form.Text className="text-error">{`${errors.address?.zipcode}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="6">
          <Form.Group>
            <Form.Label>Logradouro</Form.Label>
            <Form.Control
              className="form-control"
              required
              placeholder="Logradouro"
              name="address.street"
              value={values.address.street || ''}
              onBlur={() => setFieldTouched('address.street')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('address.street', event.target.value)
              }
              isInvalid={
                touched.address?.street &&
                Boolean(errors && errors.address?.street)
              }
            />
            {touched.address?.street && errors && errors.address?.street && (
              <Form.Text className="text-error">{`${errors.address?.street}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="1">
          <Form.Group>
            <Form.Label>Número</Form.Label>
            <Form.Control
              className="form-control"
              required
              placeholder="0000"
              name="address.number"
              value={values.address.number || ''}
              onBlur={() => setFieldTouched('address.number')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('address.number', event.target.value)
              }
              isInvalid={
                touched.address?.number &&
                Boolean(errors && errors.address?.number)
              }
            />
            {touched.address?.number && errors && errors.address?.number && (
              <Form.Text className="text-error">{`${errors.address?.number}`}</Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col lg="4">
          <Form.Group>
            <Form.Label>Complemento</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Complemento"
              name="address.complement"
              value={values.address.complement || ''}
              onBlur={() => setFieldTouched('address.complement')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('address.complement', event.target.value)
              }
              isInvalid={
                touched.address?.complement &&
                Boolean(errors && errors.address?.complement)
              }
            />
            {touched.address?.complement &&
              errors &&
              errors.address?.complement && (
                <Form.Text className="text-error">{`${errors.address?.complement}`}</Form.Text>
              )}
          </Form.Group>
        </Col>
        <Col className="field" lg="1">
          <Form.Group>
            <Form.Label>UF</Form.Label>
            <Form.Control
              className="form-control"
              required
              placeholder="UF"
              type="text"
              maxLength={2}
              name="address.state"
              value={values.address.state || ''}
              onBlur={() => setFieldTouched('address.state')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('address.state', event.target.value)
              }
              isInvalid={
                touched.address?.state &&
                Boolean(errors && errors.address?.state)
              }
            />
            {touched.address?.state && errors && errors.address?.state && (
              <Form.Text className="text-error">{`${errors.address?.state}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field">
          <Form.Group>
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              className="form-control"
              required
              placeholder="Cidade"
              name="address.city"
              value={values.address.city || ''}
              onBlur={() => setFieldTouched('address.city')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('address.city', event.target.value)
              }
              isInvalid={
                touched.address?.city && Boolean(errors && errors.address?.city)
              }
            />
            {touched.address?.city && errors && errors.address?.city && (
              <Form.Text className="text-error">{`${errors.address?.city}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field">
          <Form.Group>
            <Form.Label>Bairro</Form.Label>
            <Form.Control
              className="form-control"
              required
              placeholder="Bairro"
              name="address.neighborhood"
              value={values.address.neighborhood || ''}
              onBlur={() => setFieldTouched('address.neighborhood')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('address.neighborhood', event.target.value)
              }
              isInvalid={
                touched.address?.neighborhood &&
                Boolean(errors && errors.address?.neighborhood)
              }
            />
            {touched.address?.neighborhood &&
              errors &&
              errors.address?.neighborhood && (
                <Form.Text className="text-error">{`${errors.address?.neighborhood}`}</Form.Text>
              )}
          </Form.Group>
        </Col>
      </Row>

      <h2 className="subTitle marginTop marginBottom">Plano de serviço</h2>
      <Row noGutters>
        <Col lg="6">
          <Form.Group>
            <Form.Label>Plano</Form.Label>
            <Form.Control
              className="form-control"
              required
              as="select"
              value={values.planId || ''}
              onBlur={() => setFieldTouched('planId')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('planId', event.target.value)
              }
              isInvalid={touched.planId && Boolean(errors && errors.planId)}
            >
              <option value="">Selecione um Plano</option>
              {infoPlans &&
                infoPlans.map(item => {
                  return (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  );
                })}
            </Form.Control>
            {touched.planId && errors && errors.planId && (
              <Form.Text className="text-error">{`${errors.planId}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row noGutters className="container-body-buttons">
        <Button
          style={{ marginRight: '10px' }}
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
                <Icon icon={PersonPlus} color="#ffffff" />
              </div>
              Cadastrar
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

export default RegisterFormProvider;
