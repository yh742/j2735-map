import React from 'react';
import clsx from 'clsx';

import MapIcon from '@material-ui/icons/Map';
import SettingIcon from '@material-ui/icons/Settings'

import { Link } from 'react-router-dom';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { 
  Drawer, 
  IconButton, 
  Divider, 
  List, 
  makeStyles, 
  ListSubheader,
  ListItem,
  ListItemText, 
  ListItemIcon } from '@material-ui/core/';

const useStyles = drawerWidth => makeStyles((theme) =>({
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  listIcon: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
    },
  }
}));

export default function DrawerMenu(props) {
  const {showMenu, onClick, drawerWidth } = props;
  const classes = useStyles(drawerWidth)();
  return (
      <Drawer open={showMenu}             
        classes={{
          paper: clsx(classes.drawerPaper, !showMenu && classes.drawerPaperClose),
        }} 
        variant="permanent">
        <div className={classes.toolbarIcon}>
          <IconButton 
            onClick={onClick}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon className={classes.listIcon}>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Map" />
          </ListItem>
          <ListItem button component={Link} to="/settings">
            <ListItemIcon className={classes.listIcon}>
              <SettingIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        <Divider />
        <List>
        <ListSubheader inset>Past Searches</ListSubheader>
        </List>
      </Drawer>
  );
}