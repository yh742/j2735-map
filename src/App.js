import React, {Component} from 'react';
import clsx from 'clsx';

import './css/mapbox/mapbox-gl.css';
import './css/mapbox/mapbox-gl-geocoder.css';

import { SettingContext, SettingActions } from "./Components/Store";
import Header from "./Components/Header";
import DrawerMenu from "./Components/Menu";
import AssessmentDrawer from "./Components/Assessment";
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
      showAssessment: false,
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
    localStorage.setItem("lastSettingState", JSON.stringify(state));
  }

  handleMenuToggle = () => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu,
    }));
  }

  handleAssessmentToggle = () => {
    const [, dispatch] = this.context;
    this.setState(prevState => ({
      showAssessment: !prevState.showAssessment,
    }), () => {
      if (this.state.showAssessment) dispatch({
        type: SettingActions.clearNotification
      });
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
          onAssessmentClick={this.handleAssessmentToggle} 
          badgeCount={state.newMessages}
          drawerWidth={App.getDrawerWidth()}
          showMenu={this.state.showMenu} />
        <DrawerMenu onClick={this.handleMenuToggle} showMenu={this.state.showMenu} drawerWidth={App.getDrawerWidth()}/>
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
        <AssessmentDrawer showMenu={this.state.showAssessment} />
      </div>
    )
  }
}
App.contextType = SettingContext;
export default withStyles(styles)(App);
