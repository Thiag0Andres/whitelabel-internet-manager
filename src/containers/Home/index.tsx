import React, { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../store';
import { useStyles } from '../../services/material-ui';
import { Drawer, Header } from '../../components';
import {
  Dashboard,
  TableUsers,
  TableInvoice,
  TableServicePlans,
  TableBillsToReceive,
  TableAuditLog,
  RegisterUser,
} from '..';

const Home: React.FC = () => {
  const history = useHistory();
  const { user } = useSelector((state: ApplicationState) => state.user);
  const actualRoute = window.location.pathname.substring(1).split('/')[1];
  const classes = useStyles();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const RenderContentPage = useCallback(
    (userType: string) => {
      switch (userType) {
        case 'provider':
          return useMemo(() => {
            switch (actualRoute) {
              case 'dashboard':
                return <Dashboard />;
              case 'clients':
                return <TableUsers />;
              case 'register':
                return <RegisterUser />;
              case 'bill-of-sale':
                return <TableInvoice />;
              case 'service-plans':
                return <TableServicePlans />;
              case 'bills-to-receive':
                return <TableBillsToReceive />;
              case 'audit-log':
                return <TableAuditLog />;
              default:
                history.push('/home/dashboard');
                return <h5>Rota inexistente</h5>;
            }
          }, [actualRoute, history]);

        default:
          history.push('/login');
          return <h5>Rota inexistente</h5>;
      }
    },
    [actualRoute, history],
  );

  return (
    <div className="container-dash">
      <Drawer openDrawer={openDrawer} openMobileDrawer={openMobileDrawer} />

      <main className={classes.content}>
        <Header
          setOpenDrawer={setOpenDrawer}
          setOpenMobileDrawer={setOpenMobileDrawer}
        />
        {RenderContentPage(user?.userType)}
      </main>
    </div>
  );
};

export default Home;
