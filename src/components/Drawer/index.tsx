import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Drawer as DrawerMaterial,
  List,
  ListItem,
  ListItemIcon,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Col from 'react-bootstrap/esm/Col';
import { useDispatch, useSelector } from 'react-redux';

import clsx from 'clsx';
import { Icon } from '@iconify/react';
import barChart from '@iconify-icons/bi/bar-chart';
import personIcon from '@iconify-icons/bi/person';
import personPlus from '@iconify-icons/bi/person-plus';
import receiptIcon from '@iconify-icons/bi/receipt';
import cogLine from '@iconify-icons/clarity/cog-line';
import boxIcon from '@iconify-icons/bi/box';
import cashStack from '@iconify-icons/bi/cash-stack';
import fileEarmarkText from '@iconify-icons/bi/file-earmark-text';
import boxArrowLeft from '@iconify-icons/bi/box-arrow-left';
import { ApplicationState } from '../../store';
import { useMobile } from '../../hooks/use-mobile';
import { LIST_MENU_PROVIDER } from '../../constants/list-menu';
import { logout } from '../../store/ducks/auth/actions';

import './styles.scss';

enum DrawerType {
  Mobile,
  Computer,
}

const DRAWER_MENU = 220;

const DRAWER_ICON: { [key: string]: JSX.Element } = {
  PdC: <Icon icon={barChart} color="#ffffff" />,
  provedores: <Icon icon={personIcon} color="#ffffff" />,
  cadastrar: <Icon icon={personPlus} color="#ffffff" />,
  NF: <Icon icon={receiptIcon} color="#ffffff" />,
  PdS: <Icon icon={boxIcon} color="#ffffff" />,
  CaR: <Icon icon={cashStack} color="#ffffff" />,
  LdA: <Icon icon={fileEarmarkText} color="#ffffff" />,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    menuButton: {
      color: '#ffffff',
    },
    hide: {
      display: 'none',
    },
    drawerPaper: {
      width: DRAWER_MENU,
    },
    drawer: {
      width: DRAWER_MENU,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      position: 'relative',
    },
    drawerOpen: {
      width: DRAWER_MENU,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      padding: '1.125rem',
    },
    footerIcon: {
      position: 'absolute',
      bottom: '1.188rem',
      left: '1.438rem',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);

interface Props {
  openDrawer: boolean;
  openMobileDrawer: boolean;
}

// eslint-disable-next-line react/prop-types
export const Drawer: React.FC<Props> = ({ openDrawer, openMobileDrawer }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const actualRoute = window.location.pathname.substring(1).split('/')[1];
  const [open, setOpen] = useState(openDrawer);
  const [mobileOpen, setMobileOpen] = useState(openMobileDrawer);
  const { user } = useSelector((state: ApplicationState) => state.user);

  const isMobile = useMobile();

  // console.log('open', openDrawer);
  // console.log('openM', openMobileDrawer);

  const page = window.location.pathname;

  // console.log(page);

  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
  }, [isMobile]);

  const handleDrawerToggle = (type: DrawerType) => {
    if (type === DrawerType.Mobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const goLogout = () => {
    history.push('/login');
    dispatch(logout());
  };

  const onDrawerClick = useCallback(
    (routeName: string) => {
      history.push(`/home/${routeName}`);
      setMobileOpen(false);
    },
    [history],
  );

  const onNavigationClick = useCallback(
    (path: string) => {
      history.push(path);
    },
    [history],
  );

  const drawer = (
    <>
      <div className={classes.toolbar}>
        {!openDrawer ? (
          <button
            className="button-logo"
            type="button"
            onClick={() => {
              onNavigationClick(`/home/perfil/view/${user.providerId}`);
            }}
          >
            <p className="logo">Logo</p>
          </button>
        ) : (
          <button
            className="perfil-provider"
            type="button"
            onClick={() => {
              onNavigationClick(`/home/perfil/view/${user.providerId}`);
            }}
          >
            <p className="logo-icon">L</p>
          </button>
        )}
      </div>

      {user?.userType === 'provider' && (
        <List>
          {LIST_MENU_PROVIDER.map((item, index) => (
            <ListItem
              button
              key={item.name}
              onClick={() => {
                onDrawerClick(item.routerName);
              }}
              selected={actualRoute === item.routerName}
            >
              <ListItemIcon>{DRAWER_ICON[item.icon]}</ListItemIcon>
              <Col>
                <p>{item.name}</p>
                {item.subName && <p>{item.subName}</p>}
              </Col>
            </ListItem>
          ))}
        </List>
      )}

      <button type="button" className={classes.footerIcon} onClick={goLogout}>
        <Icon icon={boxArrowLeft} color="#ffffff" />
        {openDrawer && <p style={{ marginLeft: '2.125rem' }}>Logout</p>}
      </button>
    </>
  );

  return (
    <>
      <div className="container-drawer">
        {!isMobile ? (
          <DrawerMaterial
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: !openDrawer,
              [classes.drawerClose]: openDrawer,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: !openDrawer,
                [classes.drawerClose]: openDrawer,
              }),
            }}
          >
            {drawer}
          </DrawerMaterial>
        ) : (
          <DrawerMaterial
            variant="temporary"
            anchor="left"
            className="container-drawer"
            open={openMobileDrawer}
            onClose={() => handleDrawerToggle(DrawerType.Mobile)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </DrawerMaterial>
        )}
      </div>
    </>
  );
};

export default Drawer;
