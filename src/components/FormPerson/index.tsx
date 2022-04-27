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

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import { currencyMask } from '../../services/mask';

import validationSchema from './validations';
import { ServicePlans, RegisterPerson } from '../../services/types';

import api from '../../services/api';

import './styles.scss';

interface IProps {
  option: string;
}

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const FormPerson: React.FC<IProps> = ({ option }: IProps) => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [infoPlans, setInfoPlans] = useState<Array<ServicePlans>>([]);
  const [infoMK, setInfoMK] = useState<Array<any>>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const loadPlans = useCallback(() => {
    // console.log('token', token);

    api
      .get(
        `/plans/search?limit=${1000}&type=client&providerId=${String(
          user.providerId,
        )}`,
        {
          headers: { Authorization: token },
        },
      )
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
    loadPlans();
    loadMK();
  }, [loadPlans, loadMK]);

  const onSubmit = useCallback((form: RegisterPerson, resetForm) => {
    if (
      form &&
      form.gender !== '' &&
      form.attendanceType !== '' &&
      form.planId !== ''
    ) {
      setLoadingSubmit(true);
      const newObject = form;
      delete newObject.typePerson;

      api
        .post(
          'users/register',
          {
            ...newObject,
            address: {
              ...newObject.address,
              number: Number(newObject.address.number),
            },
            status: 'compliant',
            establishmentEmail:
              form.establishmentEmail !== ''
                ? form.establishmentEmail
                : undefined,
          },
          { headers: { Authorization: token } },
        )
        .then(() => {
          // console.log(response);
          resetForm({});
          setLoadingSubmit(false);
          toast.success('Cliente cadastrado com sucesso');
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
      typePerson: '',
      providerId: String(user.providerId),
      planId: '',
      mkId: '',
      email: '',
      establishmentEmail: '',
      name: '',
      fantasyName: '',
      socialReason: '',
      stateRegistration: '',
      gender: '',
      userType: 'client',
      cpf: '',
      cnpj: '',
      rg: '',
      emittingOrgan: '',
      birthDate: '',
      phone: '',
      phone2: '',
      phone3: '',
      attendanceType: '',
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
      discount: {
        amount: '',
        dueDate: '',
      },
      increment: {
        amount: '',
        dueDate: '',
      },
      dueDate: '',
      tolerance: '',
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

  useEffect(() => {
    setFieldValue('typePerson', option);
  }, [option]);

  return (
    <Form
      className="form-person"
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(values, resetForm);
      }}
    >
      <h2 className="subTitle marginBottom">
        {option === 'Pessoa Jurídica' ? 'Proprietário' : 'Dados Pessoais'}
      </h2>
      <Row noGutters>
        <Col lg="5">
          <Form.Group>
            <Form.Label>Nome completo</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Nome completo"
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
              as="select"
              required
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
              className="form-control"
              placeholder="000.000.000-00"
              required
              as={Mask}
              maskChar="_"
              mask="999.999.999-99"
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
              className="form-control"
              placeholder="0000000"
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
              className="form-control"
              placeholder="Sigla"
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
              className="form-control"
              placeholder="DD/MM/AAAA"
              required
              as={Mask}
              maskChar=" "
              mask="99/99/9999"
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
              className="form-control"
              placeholder="email@email.com"
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
              className="form-control"
              placeholder="(00) 9 0000-0000"
              required
              as={Mask}
              maskChar=" "
              mask="(99) 9 9999-9999"
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
      {option === 'Pessoa Jurídica' && (
        <>
          <h2 className="subTitle marginTop marginBottom">Estabecimento</h2>
          <Row noGutters>
            <Col lg="6">
              <Form.Group>
                <Form.Label>Razão social</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="Razão social"
                  required
                  value={values.socialReason || ''}
                  onBlur={() => setFieldTouched('socialReason')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('socialReason', event.target.value)
                  }
                  isInvalid={
                    touched.socialReason &&
                    Boolean(errors && errors.socialReason)
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
                  className="form-control"
                  placeholder="Nome fantasia"
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
                  className="form-control"
                  placeholder="00.000.000/0001-00"
                  required
                  as={Mask}
                  maskChar="_"
                  mask="99.999.999/9999-99"
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
                  className="form-control"
                  placeholder="000000000000"
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
                  className="form-control"
                  placeholder="email@email.com"
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
                  className="form-control"
                  placeholder="(00) 00000-0000"
                  as={Mask}
                  maskChar="_"
                  mask="(99) 99999-9999"
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
                  className="form-control"
                  placeholder="(00) 9 0000-0000"
                  required
                  as={Mask}
                  maskChar=" "
                  mask="(99) 9 9999-9999"
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
        </>
      )}

      <h2 className="subTitle marginTop marginBottom">Endereço</h2>
      <Row noGutters>
        <Col lg="3">
          <Form.Group>
            <Form.Label>CEP</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="00000-000"
              required
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
              placeholder="Logradouro"
              required
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
              placeholder="0000"
              name="address.number"
              value={values.address.number || ''}
              required
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
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Tipo de atendimento</Form.Label>
            <Form.Control
              className="form-control"
              as="select"
              required
              value={values.attendanceType || ''}
              onBlur={() => setFieldTouched('attendanceType')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('attendanceType', event.target.value)
              }
              isInvalid={
                touched.attendanceType &&
                Boolean(errors && errors.attendanceType)
              }
            >
              <option value="">Atendimento</option>
              <option value="urbano">Urbano</option>
              <option value="rural">Rural</option>
            </Form.Control>
            {touched.attendanceType && errors && errors.attendanceType && (
              <Form.Text className="text-error">{`${errors.attendanceType}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>
      <Row noGutters>
        <Col>
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
              placeholder="UF"
              required
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
        <Col className="field" lg="4">
          <Form.Group>
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Cidade"
              required
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
        <Col className="field" lg="4">
          <Form.Group>
            <Form.Label>Bairro</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Bairro"
              required
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
              as="select"
              required
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
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Dia de pagamento</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="Dia 00"
              required
              as={Mask}
              maskChar=""
              mask="99"
              value={values.dueDate || ''}
              onBlur={() => setFieldTouched('dueDate')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('dueDate', event.target.value)
              }
              isInvalid={touched.dueDate && Boolean(errors && errors.dueDate)}
            />
            {touched.dueDate && errors && errors.dueDate && (
              <Form.Text className="text-error">{`${errors.dueDate}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Tolerância de bloqueio</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="00 dias"
              required
              as={Mask}
              maskChar=""
              mask="99"
              value={values.tolerance || ''}
              onBlur={() => setFieldTouched('tolerance')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('tolerance', event.target.value)
              }
              isInvalid={
                touched.tolerance && Boolean(errors && errors.tolerance)
              }
            />
            {touched.tolerance && errors && errors.tolerance && (
              <Form.Text className="text-error">{`${errors.tolerance}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row noGutters>
        <Col lg="2">
          <Form.Group>
            <Form.Label>Acrescimo</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="R$ 000,00"
              value={currencyMask(values.increment.amount) || ''}
              onBlur={() => setFieldTouched('increment.amount')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('increment.amount', event.target.value)
              }
              isInvalid={
                touched.increment?.amount &&
                Boolean(errors && errors.increment?.amount)
              }
            />
            {touched.increment?.amount &&
              errors &&
              errors.increment?.amount && (
                <Form.Text className="text-error">{`${errors.increment?.amount}`}</Form.Text>
              )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Dia de vencimento do acrescimo</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="DD/MM/AAAA"
              as={Mask}
              maskChar=" "
              mask="99/99/9999"
              value={values.increment.dueDate || ''}
              onBlur={() => setFieldTouched('increment.dueDate')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('increment.dueDate', event.target.value)
              }
              isInvalid={
                touched.increment?.dueDate &&
                Boolean(errors && errors.increment?.dueDate)
              }
            />
            {touched.increment?.dueDate &&
              errors &&
              errors.increment?.dueDate && (
                <Form.Text className="text-error">{`${errors.increment?.dueDate}`}</Form.Text>
              )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Desconto</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="R$ 000,00"
              value={currencyMask(values.discount.amount) || ''}
              onBlur={() => setFieldTouched('discount.amount')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('discount.amount', event.target.value)
              }
              isInvalid={
                touched.discount?.amount &&
                Boolean(errors && errors.discount?.amount)
              }
            />
            {touched.discount?.amount && errors && errors.discount?.amount && (
              <Form.Text className="text-error">{`${errors.discount?.amount}`}</Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col className="field" lg="2">
          <Form.Group>
            <Form.Label>Dia de vencimento do desconto</Form.Label>
            <Form.Control
              className="form-control"
              placeholder="DD/MM/AAAA"
              as={Mask}
              maskChar=" "
              mask="99/99/9999"
              value={values.discount.dueDate || ''}
              onBlur={() => setFieldTouched('discount.dueDate')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFieldValue('discount.dueDate', event.target.value)
              }
              isInvalid={
                touched.discount?.dueDate &&
                Boolean(errors && errors.discount?.dueDate)
              }
            />
            {touched.discount?.dueDate &&
              errors &&
              errors.discount?.dueDate && (
                <Form.Text className="text-error">{`${errors.discount?.dueDate}`}</Form.Text>
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

export default FormPerson;
