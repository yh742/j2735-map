import React from 'react'
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import InfoIcon from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton, Badge } from '@material-ui/core';

import styles from './Style/styles';
import { ReactComponent as Logo } from "./Assets/logo.svg";

const Header = ({ classes, onClick, showMenu, onAssessmentClick, badgeCount }) => {
  return (
    <AppBar position='absolute' className={clsx(classes.appBar, showMenu && classes.appBarShift)}>
      <Toolbar variant="dense">
        <IconButton 
          edge="start"
          color="inherit" 
          onClick={onClick}
          className={clsx(classes.menuButton, showMenu && classes.menuButtonHidden)}>
          <MenuIcon />
        </IconButton>
        <div className={classes.title}>
          <Logo className={classes.logo} />
        </div>
        <IconButton color="inherit" onClick={onAssessmentClick}>
          <Badge badgeContent={badgeCount} color="secondary">
            <InfoIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default withStyles(styles)(Header);