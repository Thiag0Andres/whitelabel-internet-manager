import React from 'react';

import { Container, Col } from 'react-bootstrap';

import { PagePath, FormProvider } from '../../components';

import './styles.scss';

const RegisterProvider: React.FC = () => {
  return (
    <Container fluid className="container-register-provider">
      <Col className="container-form" xl="12" lg="12" md="12" xs="12" sm="12">
        <PagePath title="Cadastrar provedor" />
        <div className="card-header">
          <div style={{ height: '1.875rem' }} />
        </div>
        <div className="card-content">
          <FormProvider />
        </div>
      </Col>
    </Container>
  );
};

export default RegisterProvider;
