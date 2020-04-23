import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MapIcon from '@material-ui/icons/Map';
import SettingIcon from '@material-ui/icons/Settings';

import styles from '../style/styles'

const NavigationMenu = ({classes}) => {
    return (
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
    );
}

export default withStyles(styles)(NavigationMenu);
