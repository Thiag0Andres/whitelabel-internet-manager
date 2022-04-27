import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { Button } from '@material-ui/core';

import Mask from 'react-input-mask';

import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import XIcon from '@iconify-icons/bi/x';
import Receipticon from '@iconify-icons/bi/receipt';

import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import validationSchema from './validations';
import { EmitReceiptForm } from '../../services/types';

import api from '../../services/api';

import './styles.scss';

interface Props {
  value: boolean;
  actionIds: any;
  handleClose: () => void;
}

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

const ReceiptModal: React.FC<Props> = ({
  value,
  actionIds,
  handleClose,
}: Props) => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const onSubmit = useCallback((form: EmitReceiptForm, resetForm) => {
    if (form) {
      setLoadingSubmit(true);
      const body = { ...form, transactionIds: actionIds };
      /*       console.log(body.transactionIds.length);
      console.log(body); */

      if (body.transactionIds.length > 0) {
        api
          .post('transactions/receipt21', body, {
            headers: { Authorization: token },
          })
          .then(response => {
            // console.log(response.data);
            resetForm({});
            setLoadingSubmit(false);
            handleClose();
            toast.success(`${response.data.data}`);
          })
          .catch(error => {
            // console.log(error.response.data);
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
      } else {
        setLoadingSubmit(false);
        toast.error('Nenhuma transação selecionada');
      }
    }
  }, []);

  const formik = useFormik<EmitReceiptForm>({
    initialValues: {
      transactionIds: [''],
      providerId: String(user.providerId),
      emissionDate: '',
      message: '',
    },
    validationSchema,
    onSubmit,
  });

  const { values, setFieldValue, setFieldTouched, errors, touched, resetForm } =
    formik;

  return (
    <Modal
      className="modal-receipt"
      size="lg"
      show={value}
      onHide={() => {
        handleClose();
        resetForm({});
      }}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h2 className="subTitle">Gerar NF-es</h2>
      </Modal.Header>
      <Form
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          onSubmit(values, resetForm);
        }}
      >
        <Modal.Body>
          <Row noGutters>
            <Col lg="3">
              <Form.Group>
                <Form.Label>Data de emissão</Form.Label>
                <Form.Control
                  className="form-control"
                  placeholder="DD/MM/AAAA"
                  as={Mask}
                  maskChar=""
                  mask="99/99/9999"
                  name="emissionDate"
                  value={values.emissionDate || ''}
                  onBlur={() => setFieldTouched('emissionDate')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('emissionDate', event.target.value)
                  }
                  isInvalid={
                    touched.emissionDate &&
                    Boolean(errors && errors.emissionDate)
                  }
                />
                {touched.emissionDate && errors && errors.emissionDate && (
                  <Form.Text className="text-error">{`${errors.emissionDate}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row noGutters>
            <Col>
              <Form.Group>
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="message"
                  value={values.message || ''}
                  onBlur={() => setFieldTouched('message')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('message', event.target.value)
                  }
                  isInvalid={
                    touched.message && Boolean(errors && errors.message)
                  }
                />
                {touched.message && errors && errors.message && (
                  <Form.Text className="text-error">{`${errors.message}`}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <div className="container-body-buttons">
            <Button
              style={{ marginRight: '0.625rem' }}
              className="primary-button outline-primary"
              onClick={() => {
                handleClose();
                resetForm({});
              }}
            >
              <div className="icon-button">
                <Icon icon={XIcon} color="#59971f" />
              </div>
              Cancelar
            </Button>
            <Button
              className="primary-button"
              type="submit"
              disabled={loadingSubmit}
            >
              {!loadingSubmit ? (
                <>
                  <div className="icon-button">
                    <Icon icon={Receipticon} color="#ffffff" />
                  </div>
                  Gerar
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
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReceiptModal;
