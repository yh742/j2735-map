import React, {useContext} from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import {SettingContext, SettingActions} from '../Store';

import MapIcon from '@material-ui/icons/Map';
import HistoryIcon from '@material-ui/icons/History';
import SettingIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

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
  const [state, dispatch] = useContext(SettingContext);
  const maxStringLength = 21;

  const handleHistory = (event) => {
    console.log(event);
    dispatch({
      type: SettingActions.setMapView,
      payload: {
        longitude: event.center[0], 
        latitude: event.center[1]
      },
    });
  }

  const handleClearHistory = () => {
    dispatch({
      type: SettingActions.clearHistory
    });
  }

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
        <ListSubheader inset>Search History</ListSubheader>
          { state?
            state.history.map((item) => (
              <ListItem key={item.id} button component={Link} to="/" onClick={() => handleHistory(item)}>
                <ListItemIcon className={classes.listIcon} >
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary={item.text.length <= maxStringLength? item.text: item.text.substring(0, maxStringLength) + "..." } />
              </ListItem>
            )
          ): null }
          <ListItem button onClick={handleClearHistory}>
            <ListItemIcon className={classes.listIcon}>
              <DeleteSweepIcon />
            </ListItemIcon>
            <ListItemText primary="Clear History" />
          </ListItem>
        </List>
      </Drawer>
  );
}