import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Col } from 'react-bootstrap';
import { Button } from '@material-ui/core';

// Icons
import { Icon } from '@iconify/react';
import arrowLeft from '@iconify-icons/bi/arrow-left';

import { ContainerPage, PagePath, FormServicePlans } from '../../components';

import './styles.scss';

const RegisterServicePlans: React.FC = () => {
  const history = useHistory();

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  return (
    <ContainerPage>
      <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
        <PagePath title="Planos de serviço" />
        <div className="card-header">
          <Button
            className="primary-button outline-primary"
            onClick={() => {
              onNavigationClick('/home/service-plans');
            }}
          >
            <div className="icon-button">
              <Icon icon={arrowLeft} color="#59971f" />
            </div>
            Voltar
          </Button>
        </div>
        <div className="card-content">
          <FormServicePlans />
        </div>
      </Col>
    </ContainerPage>
  );
};

export default RegisterServicePlans;
