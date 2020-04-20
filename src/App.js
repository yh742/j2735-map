import React, {Component} from 'react';
import clsx from 'clsx';

import './css/mapbox/mapbox-gl.css';
import './css/mapbox/mapbox-gl-geocoder.css';

import ErrorNotification from './Components/ErrorNotification/ErrorNotification';
import { SettingContext, SettingActions } from "./Components/Store";
import Header from "./Components/Header";
import DrawerMenu from "./Components/Menu";
import MessageMenu from "./Components/MessageMenu";
import { withStyles } from '@material-ui/core';
import { Route, Switch, Redirect } from 'react-router-dom';

import Settings from './Components/Setting';
import Map from './Components/Map';

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  appBarSpacer: {
    height: theme.spacing(6),
  },
  displayNone: {
    display: "none",
  },
  mapContainer: {
    // position: "fixed",
    height: `calc(100% - 48px)`,
    // height: '100%',
    width: '100%'
  }
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      showMessageMenu: false,
    };
  }

  static getDrawerWidth() {
    return 280;
  }

  componentDidMount() {
    const [,dispatch] = this.context;
    dispatch({
      type: SettingActions.restoreState
    });
    window.addEventListener('beforeunload', this.onLoadingCallback);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLoadingCallback);
  }

  onLoadingCallback = () => {
    const [state,] = this.context;
    console.log("saving state...", state);
    localStorage.setItem("lastSettingState", JSON.stringify({...state, markers:{}}));
  }

  handleMenuToggle = () => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu,
    }));
  }

  handleMessageMenuToggle = () => {
    const [, dispatch] = this.context;
    this.setState(prevState => ({
      showMessageMenu: !prevState.showMessageMenu,
    }), () => {
      if (this.state.showMessageMenu) {
        dispatch({
          type: SettingActions.setNotification,
          payload: {
            newMessages: 0,
            listen: false
          }
        });
      } else {
        dispatch({
          type: SettingActions.setNotification,
          payload: {
            newMessages: 0,
            listen: true
          }
        });
      }
    });
  }

  render() {
    const {classes} = this.props;
    const [state,] = this.context;
    // don't waste map reloads, just hide it based on current pathname
    const showMap = this.props.location.pathname === "/";
    return (
      <div className={classes.root}>
        <Header onClick={this.handleMenuToggle} 
          showMenuButton={state.mapMode.worldView}
          onAssessmentClick={this.handleMessageMenuToggle} 
          badgeCount={state.notification.newMessages}
          drawerWidth={App.getDrawerWidth()}
          showMenu={state.mapMode.worldView && this.state.showMenu} /> 
        { state.mapMode.worldView? 
            (<DrawerMenu onClick={this.handleMenuToggle} showMenu={this.state.showMenu} drawerWidth={App.getDrawerWidth()}/>)
            : null }
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div className={clsx(showMap && classes.mapContainer)}>
            <Map />
          </div>
          <Switch>
            <Route path="/settings" component={Settings} />
            <Redirect to="/" />
          </Switch>
        </main>
        <ErrorNotification />
        <MessageMenu showMenu={this.state.showMessageMenu} />
      </div>
    )
  }
}
App.contextType = SettingContext;
export default withStyles(styles)(App);
