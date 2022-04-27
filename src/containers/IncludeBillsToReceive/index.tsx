import React, { useState } from 'react';
import { Drawer, Header, IncludeFormBillsToReceive } from '../../components';
import { useStyles } from '../../services/material-ui';

const IncludeBillsToReceive: React.FC = () => {
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
        <IncludeFormBillsToReceive />
      </main>
    </div>
  );
};

export default IncludeBillsToReceive;
