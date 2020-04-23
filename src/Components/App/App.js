import React, {Component} from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import './css/mapbox/mapbox-gl.css';
import './css/mapbox/mapbox-gl-geocoder.css';
import { withStyles } from '@material-ui/core';
import { Route, Switch, Redirect } from 'react-router-dom';

import Map from '../Map/Map';
import Settings from '../SettingMenu/SettingMenu';
import Header from '../Header/Header';
import DrawerMenu from '../DrawerMenu/DrawerMenu';
import MessageMenu from '../MessageMenu/MessageMenu';
import ErrorNotification from '../ErrorNotification/ErrorNotification';
import styles from './Style/styles';
import ValidateSettings from './Schema';
import * as actionCreators from '../store/actions/actions';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      showMessageMenu: false,
    };
  }

  restoreAppState() {
    let settings = localStorage.getItem("lastSettingState");
    try {
        let settingObj = JSON.parse(settings);
        if (ValidateSettings(settingObj)) this.props.restoreState(settingObj);
    } catch (e) {
      // ignore this error, just use default states
      console.log("ERROR: unable to parse json string from local storage");  
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onLoadingCallback);
    this.restoreAppState();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLoadingCallback);
  }

  onLoadingCallback = () => {
    console.log("saving state...");
    let serialized = JSON.stringify({
      messageSettings: this.props.messageSettings,
      displaySettings: this.props.displaySettings,
      history: this.props.history,
      mapView: {
          latitude: this.props.mapView.latitude,
          longitude: this.props.mapView.longitude,
          zoom: this.props.mapView.zoom,
          bearing: this.props.mapView.bearing,
          pitch: this.props.mapView.pitch,
      }
    });
    localStorage.setItem("lastSettingState", serialized);
  }

  handleMenuToggle = () => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu,
    }));
  }

  handleMessageMenuToggle = () => {
    this.setState(prevState => ({
        showMessageMenu: !prevState.showMessageMenu,
    }), () => this.props.setNotification(0, this.state.showMessageMenu));
  }

  render() {
    const {classes, notifications} = this.props;
    // don't waste map renders, check current browser path
    const showMap = this.props.location.pathname === "/";
    return (
      <div className={classes.root}>
        <Header 
          onClick={this.handleMenuToggle} 
          onAssessmentClick={this.handleMessageMenuToggle} 
          badgeCount={notifications}
          showMenu={this.state.showMenu} /> 
        <DrawerMenu onClick={this.handleMenuToggle} showMenu={this.state.showMenu}/>
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

const mapStateToProps = state => {
    return {
        displaySettings: state.displaySettings,
        messageSettings: state.messageSettings,
        mapView: state.mapView,
        history: state.history,
        notifications: state.notification.newMessages
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        restoreState: (storedState) => dispatch(actionCreators.restoreState(storedState)),
        setNotification: (message, listen) => dispatch(actionCreators.setNotification(message, listen))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));
