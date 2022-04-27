/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Modal, Form, Row, Col } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { toast } from 'react-toastify';

// Icons
import { Icon } from '@iconify/react';
import check2 from '@iconify-icons/bi/check2';
import PersonIcon from '@iconify-icons/bi/person';
import BoxIcon from '@iconify-icons/bi/box';
import ClockIcon from '@iconify-icons/bi/clock-history';
import XIcon from '@iconify-icons/bi/x';
import FilterIcon from '@iconify-icons/bi/filter';

import Mask from 'react-input-mask';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';

import { ServicePlans } from '../../services/types';
import api from '../../services/api';

import './styles.scss';
import { MONTHS_LIST, YEARS_LIST } from '../../constants/selects-options';

const { REACT_APP_LOCAL_STORAGE_USER_AUTH } = process.env;

interface Props {
  value: boolean;
  type: string;
  handleClose: () => void;
  setQuery?: any;
}

interface PropsObjs {
  key: string;
  value: string;
}

const FilterModal: React.FC<Props> = ({
  value,
  type,
  handleClose,
  setQuery,
}: Props) => {
  const history = useHistory();
  const token = localStorage.getItem(String(REACT_APP_LOCAL_STORAGE_USER_AUTH));
  const { user } = useSelector((state: ApplicationState) => state.user);
  const [infoPlans, setInfoPlans] = useState<Array<ServicePlans>>([]);
  const [objectArray, setObjectArray] = useState<Array<PropsObjs>>([]);
  const [textQuery, setTextQuery] = useState('');

  const loadPlans = useCallback(() => {
    // console.log('token', token);

    api
      .get(
        `/plans/search?limit=${1000}${
          user.userType === 'globaladmin'
            ? '&type=provider'
            : `&type=client&providerId=${user?.providerId}`
        }`,
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

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleSelectedOptionValue = (e: any) => {
    const { value, name } = e.target;
    // console.log(value);

    const temporaryArray = objectArray;

    const index = temporaryArray.findIndex(
      (item: PropsObjs) => item.value === value,
    );
    if (index === -1) {
      temporaryArray.push({
        key: name,
        value,
      }); // Adiciona
      setObjectArray(temporaryArray);
    } else {
      temporaryArray.splice(index, 1);
      setObjectArray(temporaryArray); // Remove
    }

    const queryText = objectArray
      .map(item => `${item.key}=${item.value}`)
      .join('&');

    setTextQuery(queryText);

    // console.log(objectArray);
  };

  const handleSelectedOptionName = (e: any) => {
    const { value, name } = e.target;
    // console.log(value);

    const temporaryArray = objectArray;

    const index = temporaryArray.findIndex(
      (item: PropsObjs) => item.value === value || item.key === name,
    );
    if (index === -1) {
      temporaryArray.push({
        key: name,
        value,
      }); // Adiciona
      setObjectArray(temporaryArray);
    } else {
      temporaryArray.splice(index, 1);
      setObjectArray(temporaryArray); // Remove
      temporaryArray.push({
        key: name,
        value,
      }); // Adiciona
      setObjectArray(temporaryArray);
    }

    const queryText = objectArray
      .map(item => `${item.key}=${item.value}`)
      .join('&');

    setTextQuery(queryText);

    // console.log(objectArray);
  };

  const handleSubmit = () => {
    const temporaryArray: any[] = [];

    setQuery(textQuery);
    setObjectArray(temporaryArray);
    handleClose();
  };

  return (
    <Modal
      className="modal-filter"
      show={value}
      onHide={() => handleClose()}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <h2 className="subTitle">
          {type === 'user' && 'Filtrar clientes'}
          {type === 'bills' && 'Filtrar contas a receber'}
          {type === 'invoice' && 'Filtrar notas fiscais'}
        </h2>
      </Modal.Header>
      <Modal.Body>
        {type === 'invoice' ? (
          <Row noGutters>
            <Col lg="6">
              <Form.Group>
                <Form.Label>Mês desejado</Form.Label>
                <Form.Control
                  as="select"
                  name="month"
                  onChange={e => handleSelectedOptionName(e)}
                >
                  <option>Selecione um mês</option>
                  {MONTHS_LIST.map(item => {
                    return (
                      <option key={item.id} value={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col className="field" lg="6">
              <Form.Group>
                <Form.Label>Ano desejado</Form.Label>
                <Form.Control
                  as="select"
                  name="year"
                  onChange={e => handleSelectedOptionName(e)}
                >
                  <option>Selecione um ano</option>
                  {YEARS_LIST.map(item => {
                    return (
                      <option key={item.id} value={item.value}>
                        {item.value}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        ) : (
          <>
            <div className="container-checks">
              <h3 className="title-option">
                <Icon
                  style={{ marginRight: '0.313rem' }}
                  icon={check2}
                  color="#3F7D20"
                />
                {type === 'user' ? 'Status do cliente' : 'Status'}
              </h3>
              <h3 className="title-option">
                <Icon
                  style={{ marginRight: '0.313rem' }}
                  icon={PersonIcon}
                  color="#3F7D20"
                />
                Tipo de cliente
              </h3>

              {type === 'user' ? (
                <Form.Check
                  inline
                  label="Ativo"
                  name="status[]"
                  type="checkbox"
                  value="compliant"
                  onChange={e => handleSelectedOptionValue(e)}
                />
              ) : (
                <Form.Check
                  inline
                  label="Pago"
                  name="status[]"
                  type="checkbox"
                  value="paid"
                  onChange={e => handleSelectedOptionValue(e)}
                />
              )}

              <Form.Check
                inline
                label="Pessoa física"
                name="physicalPerson"
                type="checkbox"
                value="true"
                onClick={e => handleSelectedOptionValue(e)}
              />

              {type === 'user' ? (
                <Form.Check
                  inline
                  label="Inadimplente"
                  name="status[]"
                  type="checkbox"
                  value="defaulting"
                  onChange={e => handleSelectedOptionValue(e)}
                />
              ) : (
                <Form.Check
                  inline
                  label="Pendente"
                  name="status[]"
                  type="checkbox"
                  value="waiting"
                  onChange={e => handleSelectedOptionValue(e)}
                />
              )}

              <Form.Check
                inline
                label="Pessoa jurídica"
                name="juridicalPerson"
                type="checkbox"
                value="true"
                onClick={e => handleSelectedOptionValue(e)}
              />

              {type === 'user' && (
                <Form.Check
                  inline
                  label="Bloqueado"
                  name="status[]"
                  type="checkbox"
                  value="inactive"
                  onChange={e => handleSelectedOptionValue(e)}
                />
              )}
            </div>
            <div className="container-select">
              {type === 'user' ? (
                <>
                  <h3 className="title-option">
                    <Icon
                      style={{ marginRight: '0.313rem' }}
                      icon={BoxIcon}
                      color="#3F7D20"
                    />
                    Plano de serviço
                  </h3>
                  <Form.Group>
                    <Form.Control
                      as="select"
                      name="planId"
                      onChange={e => handleSelectedOptionName(e)}
                    >
                      <option>Selecione um Plano</option>
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
                </>
              ) : (
                <Row noGutters>
                  <h3 className="title-option">
                    <Icon
                      style={{ marginRight: '0.313rem' }}
                      icon={ClockIcon}
                      color="#3F7D20"
                    />
                    Período
                  </h3>
                  <Col className="field" lg="6">
                    <Form.Group>
                      <Form.Label>De:</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="DD/MM/AAAA"
                        name="fromDate"
                        as={Mask}
                        maskChar=" "
                        mask="99/99/9999"
                        onChange={e => handleSelectedOptionName(e)}
                      />
                    </Form.Group>
                  </Col>

                  <Col className="field" lg="6">
                    <Form.Group>
                      <Form.Label>Até:</Form.Label>
                      <Form.Control
                        className="form-control"
                        placeholder="DD/MM/AAAA"
                        name="toDate"
                        as={Mask}
                        maskChar=" "
                        mask="99/99/9999"
                        onChange={e => handleSelectedOptionName(e)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="container-body-buttons-modal">
          <Button
            style={{ marginRight: '0.625rem' }}
            className="primary-button outline-primary"
            onClick={() => handleClose()}
          >
            <div className="icon-button">
              <Icon icon={XIcon} color="#59971f" />
            </div>
            Cancelar
          </Button>
          <Button className="primary-button" onClick={handleSubmit}>
            <div className="icon-button">
              <Icon icon={FilterIcon} color="#ffffff" />
            </div>
            Filtrar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
