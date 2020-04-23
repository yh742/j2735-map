import clsx from 'clsx';
import React from 'react';
import { withStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import styles from './style/styles';
import HistoryBar from './HistoryMenu/HistoryMenu';
import NavigationMenu from './NavigationMenu/NavigationMenu';

const DrawerMenu = ({showMenu, classes, onClick}) => {
  return (
    <Drawer open={showMenu}             
      classes={{
        paper: 
          clsx(classes.drawerPaper, !showMenu && classes.drawerPaperClose),
      }} 
      variant="permanent">
      <div className={classes.toolbarIcon}>
        <IconButton 
          onClick={onClick}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <NavigationMenu />
      <Divider />
      <HistoryBar />
    </Drawer>
  );
}

export default withStyles(styles)(DrawerMenu);