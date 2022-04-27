import React, { useMemo, useState } from 'react';

import { Container, Col } from 'react-bootstrap';

import SelectSearch from 'react-select-search';

// Icons
import { Icon } from '@iconify/react';
import PersonIcon from '@iconify-icons/bi/person';
import BuildingIcon from '@iconify-icons/bi/building';

import { TYPE_PERSON_PROVIDER } from '../../constants/selects-options';

import { Options } from '../../services/types';

import { FormPerson, PagePath } from '../../components';

import './styles.scss';

const RegisterUser: React.FC = () => {
  const [option, setOption] = useState('Pessoa Física');

  const selectOption = (optionId: number) => {
    const selectedDelivery = TYPE_PERSON_PROVIDER.filter(
      item => item.id === optionId,
    )[0];

    setOption(String(selectedDelivery.name));
  };

  const getDistributorsOptions = () => {
    const options: Options[] = [];

    TYPE_PERSON_PROVIDER.forEach(item => {
      options.push({ name: item.name, value: String(item.id) });
    });
    return options;
  };

  const renderSelectOption = useMemo(() => {
    switch (option) {
      case 'Pessoa Física':
        return <FormPerson option={option} />;
      case 'Pessoa Jurídica':
        return <FormPerson option={option} />;
      default:
        return <h1>Usuário inexistente</h1>;
    }
  }, [option]);

  return (
    <Container fluid className="container-register-person">
      <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
        <PagePath title="Cadastrar" />
        <div className="card-header">
          {option === 'Pessoa Jurídica' ? (
            <div className="icon-button">
              <Icon icon={BuildingIcon} color="#000b13" />
            </div>
          ) : (
            <div className="icon-button">
              <Icon icon={PersonIcon} color="#000b13" />
            </div>
          )}

          <SelectSearch
            onChange={e => selectOption(Number(e))}
            options={getDistributorsOptions()}
          />
        </div>
        <div className="card-content">{renderSelectOption}</div>
      </Col>
    </Container>
  );
};

export default RegisterUser;
