import React, { useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';

import { toast } from 'react-toastify';

import { Button } from '@material-ui/core';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';

import { Icon } from '@iconify/react';
import personIcon from '@iconify-icons/bi/person';
import boxArrowInRight from '@iconify-icons/bi/box-arrow-in-right';
import arrowLeft from '@iconify-icons/bi/arrow-left';

import { ForgotForm } from '../../services/types';
import validationSchema from './validations';

import { PagePath } from '../../components';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_TOKEN } = process.env;

const ForgotPassword: React.FC = () => {
  const history = useHistory();
  const token = String(REACT_APP_TOKEN);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback((form: ForgotForm, resetForm) => {
    if (form.email !== '') {
      setLoading(true);
      api
        .post(
          '/users/forgot',
          {
            ...form,
          },
          { headers: { Authorization: token } },
        )
        .then(() => {
          setLoading(false);
          resetForm({});
          toast.success('Email enviado com sucesso');
          history.push('/login');
        })
        .catch(error => {
          // console.log(error.response);
          setLoading(false);
          if (error.response.data.error.error_description) {
            toast.error(`${error.response.data.error.error_description}`);
          } else {
            toast.error(`${error.response.data.error}`);
          }
        });
    }
  }, []);

  const formik = useFormik<ForgotForm>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit,
  });
  const { values, setFieldValue, setFieldTouched, errors, touched, resetForm } =
    formik;

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const formSignIn = (
    <Form
      onSubmit={(event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(values, resetForm);
      }}
    >
      <Form.Group>
        <Form.Label className="label-input">E-mail</Form.Label>
        <div className="input-container">
          <div className="icon-input">
            <Icon icon={personIcon} color="#CCD1E6" />
          </div>
          <Form.Control
            id="email"
            placeholder="E-mail"
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
        </div>
      </Form.Group>

      <Button
        id="button-send-forgot-password"
        type="submit"
        className="primary-button"
      >
        {!loading ? (
          <>
            <div className="icon-button">
              <Icon icon={boxArrowInRight} color="#ffffff" />
            </div>
            Enviar
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
      <Button
        id="button-back-to-login"
        className="primary-button outline-primary"
        onClick={() => {
          onNavigationClick('/login');
        }}
      >
        <div className="icon-button">
          <Icon icon={arrowLeft} color="#011A2C" />
        </div>
        Voltar
      </Button>
    </Form>
  );

  return (
    <Container fluid className="container-forgot">
      <Row>
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <PagePath title="Esqueceu a senha?" />
          <p>
            Insira seu e-mail associado à sua conta e enviaremos um link para
            cadastrar uma nova senha.
          </p>
          {formSignIn}
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
