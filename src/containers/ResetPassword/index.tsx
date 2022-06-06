import React, { useState, useCallback } from 'react';

import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';

import { toast } from 'react-toastify';

import { Button } from '@material-ui/core';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';

import { Icon } from '@iconify/react';
import personIcon from '@iconify-icons/bi/person';
import keyIcon from '@iconify-icons/bi/key';
import boxArrowInRight from '@iconify-icons/bi/box-arrow-in-right';

import { RedefineForm } from '../../services/types';
import { checkPassword } from '../../services/validation';
import validationSchema from './validations';

import { PagePath, LinkButton } from '../../components';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_TOKEN } = process.env;

const ResetPassword: React.FC = () => {
  const history = useHistory();
  const tokenGlobal = String(REACT_APP_TOKEN);
  const [loading, setLoading] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const onSubmit = useCallback((form: RedefineForm, resetForm) => {
    if (
      form.token !== '' &&
      form.email !== '' &&
      form.password !== '' &&
      form.confirmPassword !== ''
    ) {
      if (checkPassword(form.password, form.confirmPassword)) {
        setLoading(true);
        api
          .post(
            '/users/reset',
            {
              token: form.token,
              email: form.email,
              password: form.password,
            },
            { headers: { Authorization: tokenGlobal } },
          )
          .then(() => {
            setLoading(false);
            resetForm({});
            history.push('/login');
            toast.success('Senha redefinida com sucesso');
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
    }
  }, []);

  const formik = useFormik<RedefineForm>({
    initialValues: {
      token: String(token),
      email: '',
      password: '',
      confirmPassword: '',
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
      <Form.Group>
        <Form.Label>Nova Senha</Form.Label>
        <div className="input-container">
          <div className="icon-input">
            <Icon icon={keyIcon} color="#CCD1E6" />
          </div>
          <Form.Control
            placeholder="Nova senha"
            type="password"
            value={values.password || ''}
            onBlur={() => setFieldTouched('password')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue('password', event.target.value)
            }
            isInvalid={touched.password && Boolean(errors && errors.password)}
          />
          {touched.password && errors && errors.password && (
            <Form.Text className="text-error">{`${errors.password}`}</Form.Text>
          )}
        </div>
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirmar senha</Form.Label>
        <div className="input-container">
          <div className="icon-input">
            <Icon icon={keyIcon} color="#CCD1E6" />
          </div>
          <Form.Control
            placeholder="Senha"
            type="password"
            value={values.confirmPassword || ''}
            onBlur={() => setFieldTouched('confirmPassword')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFieldValue('confirmPassword', event.target.value)
            }
            isInvalid={
              touched.confirmPassword &&
              Boolean(errors && errors.confirmPassword)
            }
          />
          {touched.confirmPassword && errors && errors.confirmPassword && (
            <Form.Text className="text-error">{`${errors.confirmPassword}`}</Form.Text>
          )}
        </div>
      </Form.Group>

      <div className="input-container redefine-password">
        <LinkButton
          id="button-redefine-password"
          title="Voltar para tela de login"
          onClick={() => onNavigationClick('/login')}
        />
      </div>

      <Button type="submit" className="primary-button">
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
    </Form>
  );

  return (
    <Container fluid className="container-redefine">
      <Row>
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <PagePath title="Redefinir senha" />
          {formSignIn}
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
