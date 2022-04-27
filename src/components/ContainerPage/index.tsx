/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Drawer, Header } from '..';
import { useStyles } from '../../services/material-ui';

interface IProps {
  children?: React.ReactNode;
}

const ContainerPage: React.FC<IProps> = ({ children }: IProps) => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  return (
    <div className="container-dash">
      <Drawer openDrawer={openDrawer} openMobileDrawer={openMobileDrawer} />

      <main className={classes.content}>
        <Header
          setOpenDrawer={setOpenDrawer}
          setOpenMobileDrawer={setOpenMobileDrawer}
        />
        <Container fluid className="container-content">
          {children}
        </Container>
      </main>
    </div>
  );
};

export default ContainerPage;
