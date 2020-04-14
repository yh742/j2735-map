import React from 'react'
import clsx from 'clsx';

import { AppBar, Toolbar, IconButton, Badge } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { makeStyles } from '@material-ui/core/styles'
import { ReactComponent as Logo } from "./Assets/logo.svg";


const styles = drawerWidth => makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(4),
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    alignContent: "center",
  },
  logo: {
    height: 30,
    width: "auto",
  },
}));

export default function Header(props) {
  const { onClick, showMenu, drawerWidth } = props;
  const classes = styles(drawerWidth)();

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
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <AssessmentIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

