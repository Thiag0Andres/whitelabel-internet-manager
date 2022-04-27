import React, { useState } from 'react';

import { Icon } from '@iconify/react';
import menuIcon from '@iconify-icons/heroicons-outline/menu';
import { useMobile } from '../../hooks/use-mobile';
import './styles.scss';

enum DrawerType {
  Mobile,
  Computer,
}

interface Props {
  setOpenDrawer: any;
  setOpenMobileDrawer: any;
}

// eslint-disable-next-line react/prop-types
const Header: React.FC<Props> = ({ setOpenDrawer, setOpenMobileDrawer }) => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useMobile();

  const handleDrawerToggle = (type: DrawerType) => {
    if (type === DrawerType.Mobile) {
      setMobileOpen(!mobileOpen);
      setOpenMobileDrawer(!mobileOpen);
    } else {
      setOpen(!open);
      setOpenDrawer(!open);
    }
  };

  return (
    <div className="container-header">
      <button
        type="button"
        className="button-container"
        onClick={() =>
          handleDrawerToggle(isMobile ? DrawerType.Mobile : DrawerType.Computer)
        }
      >
        <Icon icon={menuIcon} color="#CCD1E6" />
      </button>
    </div>
  );
};

export default Header;
