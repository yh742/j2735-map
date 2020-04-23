import clsx from 'clsx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';

import styles from './style/styles';
import EmptyItem from './EmptyItem/EmptyItem';
import MessageItem from './MessagetItem/MessageItem';
import TrackingMenu from './TrackingMenu/TrackingMenu';
import MessageMenuHeader from './MessageMenuHeader/MessageMenuHeader';
import * as actionCreators from '../../store/actions/actions';
import { DecodeTopicType } from '../Helper/Utility';

const defaultView = {
  id: "-", 
  ttl: "0",
  topic: "Inactive",
  long: "-",
  lat: "-",
  speed: "-",
  heading: "-"
};

class MessageMenu extends Component {
  
  constructor(props) {
    super(props);
    this.refreshJob = null;
    this.trackingJob = null;
    this.state = {
      targetStats: {
        ...defaultView
      },
      selected: null,
      markerSnap: {},
    };
  }

  // forceUpdate skips shouldComponentUpdate
  refresh = () => {
    // this.forceUpdate();
    this.setState({markerSnap: this.props.markers})
  }
  
  clearIntervalJob = () => {
    if (this.trackingJob) {
      clearInterval(this.trackingJob);
      this.trackingJob = null;
    }
  }

  publishView(targetId) {
    const { markers } = this.props;
    if (targetId in markers) {
      const {long, lat} = markers[targetId];
      this.props.setMapView({
        longitude: long,
        latitude: lat,
        transitionDuration: window.production.animate
      });
      this.setState({
        targetStats: {
          id: markers[targetId].id,
          ttl: markers[targetId].ttl,
          topic: markers[targetId].topic,
          long: markers[targetId].long.toFixed(4) + "°",
          lat: markers[targetId].lat.toFixed(4) + "°",
          speed: markers[targetId].speed.toFixed(2) + " km/h",
          heading: markers[targetId].heading.toFixed(1) + "°"
        }
      });
      return;
    }
    this.setState({
      targetStats: defaultView
    });
    if (this.trackingJob) this.clearIntervalJob();
  }

  handleStopButtonClick = () => {
    this.props.setMapMode(null, false);
    if (this.trackingJob) this.clearIntervalJob();
  }

  handleButtonClick = (evt, key, source) => {
    // don't propogate to outer ListItem
    evt.stopPropagation();
    this.setState({ selected: null });
    // check if key still exists in current markers
    if (!(key in this.props.markers)) {
      this.props.addError(`Marker "${key}" doesn't exist on map anymore!`);
      return;
    }
    this.props.pauseAnimation(this.props.animationIcons, 300);
    this.props.setMapView({
      longitude: this.props.markers[key].long, 
      latitude: this.props.markers[key].lat,
      bearing: 0,
      transitionDuration: 0,
      zoom: this.props.zoom > 19? this.props.zoom: 19
    });
    console.log("set tracking id to ", key);
    this.props.setMapMode(key, true);
    this.clearIntervalJob();
    if (source === "Camera") {
      this.trackingJob = setInterval(() => this.publishView(key), window.production.animate);
    }
    this.container.scrollTop = 0;
  }

  handleItemClick = (key) => {
    // check if key still exists in current markers
    if (!(key in this.props.markers)) {
      this.setState({ selected: null });
      this.props.addError(`Marker "${key}" doesn't exist on map anymore!`);
      return;
    }
    if (this.state.selected === key) {
      // de-select menu item and take off highlight marker
      this.setState({ selected: null });
      this.props.setMapMode(null, false);
    } else {
      // (1) highlight marker on menu UI
      // (2) set the map to the location of the marker
      // (3) set map to target marker ID
      this.setState({ selected: key });
      this.props.pauseAnimation(this.props.animationIcons, 300);
      this.props.setMapMode(key, false);
      this.props.setMapView({
        longitude: this.props.markers[key].long, 
        latitude: this.props.markers[key].lat,
        transitionDuration: 0,
        zoom: this.props.zoom > 19? this.props.zoom: 19
      });
    }
  }

  // refreshMenu = () => {
  //   if (this.props.showMenu) this.setState({markerSnap: this.props.markers});
  // }

  // only re-render component when menu is open
  shouldComponentUpdate(nextProps) {
    return this.props.showMenu || nextProps.showMenu;
  }

  componentDidUpdate(prevProps) {
    if (this.props.showMenu && !prevProps.showMenu) this.setState({markerSnap: this.props.markers});
  }

  render() {
    const {classes, showMenu, mapMode} = this.props;
    let targetId =  mapMode.targetId;
    return (
      <Drawer
        classes={{paper: clsx(classes.drawerPaper, !showMenu && classes.drawerPaperClose)}}
        variant="persistent"
        anchor="right"
        open={showMenu}>
        <div className={classes.toolbarSpacer} />
        <List dense classes={{root: classes.menuList}} ref={el => this.container = el}>
        { mapMode.tracking? 
          (<><MessageMenuHeader text="Message Details" button={false} refresh={null} />
            <TrackingMenu 
                id={targetId}
                ttl={this.state.targetStats.ttl}
                topic={this.state.targetStats.topic}
                long={this.state.targetStats.long}
                lat={this.state.targetStats.lat}
                speed={this.state.targetStats.speed}
                heading={this.state.targetStats.heading}
                handleStopButtonClick={this.handleStopButtonClick} /></>) : null }
          <MessageMenuHeader text="Message Tracker" button={true} refresh={this.refresh} />
          { Object.keys(this.state.markerSnap).length > 0 
              ? Object.keys(this.state.markerSnap).map(key => ( 
                <MessageItem 
                  key={key} 
                  id={key}
                  disable={mapMode.tracking}
                  selected={key === this.state.selected}
                  buttonClick={(evt) => this.handleButtonClick(evt, key, DecodeTopicType(this.state.markerSnap[key].topic))}
                  itemClick={() => this.handleItemClick(key)}
                  msgType={this.state.markerSnap[key].msgType} 
                  source={DecodeTopicType(this.state.markerSnap[key].topic)} />))
              : <EmptyItem /> }
        </List>
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return {
    mapMode: state.mapMode,
    markers: state.markers,
    zoom: state.mapView.zoom,
    animationIcons: state.animateIcons
  };
};

const mapDispatchToProps = dispatch => {
  return {
      pauseAnimation: (onNow, time) => dispatch(actionCreators.pauseAnimation(onNow, time)),
      addError: (msg) => dispatch(actionCreators.addError(msg)),
      setMapView: (view) => dispatch(actionCreators.setMapView(view)),
      setMapMode: (target, tracking) => dispatch(actionCreators.setMapMode(target, tracking))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageMenu));