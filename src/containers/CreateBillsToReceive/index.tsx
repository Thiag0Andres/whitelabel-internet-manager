import React, { useState } from 'react';
import { Drawer, Header, RegisterFormBillsToReceive } from '../../components';
import { useStyles } from '../../services/material-ui';

const CreateBillsToReceive: React.FC = () => {
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
        <RegisterFormBillsToReceive />
      </main>
    </div>
  );
};

export default CreateBillsToReceive;
