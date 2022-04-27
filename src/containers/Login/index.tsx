import React, { useState, useEffect, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';

import { toast } from 'react-toastify';

import { Button } from '@material-ui/core';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';

import { Icon } from '@iconify/react';
import personIcon from '@iconify-icons/bi/person';
import keyIcon from '@iconify-icons/bi/key';
import boxArrowInRight from '@iconify-icons/bi/box-arrow-in-right';

import { login } from '../../store/ducks/auth/actions';
import { updateUser, removeUser } from '../../store/ducks/user/action';

import { LoginForm } from '../../services/types';
import validationSchema from './validations';

import { LinkButton } from '../../components';

import api from '../../services/api';

import './styles.scss';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH, REACT_APP_LOCAL_STORAGE_USER_ID } =
  process.env;

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(
    (form: LoginForm, resetForm) => {
      if (form.email !== '' && form.password !== '') {
        setLoading(true);
        api
          .post('users/authenticate', {
            ...form,
          })
          .then(response => {
            const { user, token } = response.data.data;

            localStorage.setItem(
              String(REACT_APP_LOCAL_STORAGE_USER_AUTH),
              token,
            );
            localStorage.setItem(
              String(REACT_APP_LOCAL_STORAGE_USER_ID),
              user.id,
            );

            dispatch(login());
            dispatch(updateUser(user));
            setLoading(false);
            resetForm({});
            history.push('/home');
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
    },
    [dispatch],
  );

  const formik = useFormik<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit,
  });
  const { values, setFieldValue, setFieldTouched, errors, touched, resetForm } =
    formik;

  // Limpando token
  useEffect(() => {
    localStorage.removeItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
    localStorage.removeItem(String(REACT_APP_LOCAL_STORAGE_USER_ID));
    dispatch(removeUser());
  }, []);

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
        <Form.Label className="label-input">Login</Form.Label>
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
        <Form.Label>Senha</Form.Label>
        <div className="input-container">
          <div className="icon-input">
            <Icon icon={keyIcon} color="#CCD1E6" />
          </div>
          <Form.Control
            placeholder="Senha"
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

      <div className="input-container forget-password">
        <LinkButton
          title="Esqueceu a senha?"
          onClick={() => onNavigationClick('/forgot-password')}
        />
      </div>

      <Button type="submit" className="primary-button">
        {!loading ? (
          <>
            <div className="icon-button">
              <Icon icon={boxArrowInRight} color="#ffffff" />
            </div>
            Login
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
    <Container fluid className="container-login">
      <Row>
        <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
          <p className="logo">Logo</p>
          {formSignIn}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
