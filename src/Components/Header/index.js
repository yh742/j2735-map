import React, { useContext } from 'react'
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core'
import AssessmentIcon from '@material-ui/icons/Assessment';
import { makeStyles } from '@material-ui/core/styles'
import { ReactComponent as Logo } from "./logo.svg";
import SettingsIcon from '@material-ui/icons/Settings';
import SearchBar from './SearchBar/SearchBar';
import HistoryIcon from '@material-ui/icons/History';
import { MenuContext } from "../Store";

const styles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    alignContent: "center",
  },
  logo: {
    height: 30,
    width: "auto",
  },
}));

export default function Header() {
  const classes = styles();
  const [ , dispatch ] = useContext(MenuContext);

  const openMenu = menuItem => {
    dispatch({
      type: "MENU_TOGGLE",
      payload: menuItem
    });
  }

  return (
    <AppBar position='static'>
      <Toolbar variant="dense">
            <div className={classes.title}>
              <Logo className={classes.logo} />
            </div>
            <SearchBar />
            <div>
              <IconButton color="inherit" onClick={()=> openMenu("tracker")}>
                <AssessmentIcon />
              </IconButton>
              <IconButton color="inherit" onClick={()=> openMenu("history")}>
                <HistoryIcon />
              </IconButton>
              <IconButton color="inherit" onClick={()=> openMenu("setting")}>
                <SettingsIcon />
              </IconButton>
            </div>
      </Toolbar>
    </AppBar>
  )
}

