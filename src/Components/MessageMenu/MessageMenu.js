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
import TrackingJob from '../Helper/TrackingJob';
import Loading from './Assets/loading.svg';

class MessageMenu extends Component {
  
  constructor(props) {
    super(props);
    this.refreshJob = null;
    this.state = {
      closestIntersection: {},
      loading: false,
      selected: null,
      markerSnap: {},
    };
  }

  handleStopButtonClick = async () => {
    if (this.trackingJob) {
      this.props.clearMarkers();
      this.setState({loading: true});
      let res = await this.trackingJob.stop();
      if (!res) return;
      setTimeout(()=> {
        this.props.setMapMode(null, false);
        this.refresh();
        this.setState({loading: false});
      }, 1000);
    }
  }

  intervalCallback = (targetId) => {
    const { markers } = this.props;
    if (targetId in markers) {
      const {long, lat } = markers[targetId];
      this.props.setMapView({
        longitude: long,
        latitude: lat,
        transitionDuration: window.production.animate,
      });
    }
    return;
  }

  handleButtonClick = async (evt, key, source) => {
    // don't propogate to outer ListItem
    evt.stopPropagation();
    this.setState({ selected: null });
    // check if key still exists in current markers
    if (!(key in this.props.markers)) {
      this.props.addError(`Marker "${key}" doesn't exist on map anymore!`);
      return;
    }
    // (1) pause animation before we move map (2) set this into tracking mode
    this.props.pauseAnimation(this.props.animationIcons, 700);
    this.props.setMapView({
      longitude: this.props.markers[key].long, 
      latitude: this.props.markers[key].lat,
      bearing: 0,
      transitionDuration: 0
    });
    this.props.setMapMode(key, true);
    this.setState({loading: true});
    this.trackingJob = new TrackingJob(
      {
        intervalCb: ()=> this.intervalCallback(key),
        errorCb: this.props.addError,
      },
      this.props.markers[key].topic,
      source
    );
    let res = await this.trackingJob.run();
    if (!res) return;
    setTimeout(()=> {
      this.props.clearMarkers();
      this.refresh();
      this.setState({loading: false})
    }, 2400);
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
        zoom: this.props.zoom > 18? this.props.zoom: 18
      });
    }
  }

  // only re-render component when 
  // (1) menu switch states (2) states change while menu is open (3) tracking state changes
  shouldComponentUpdate(nextProps, nextStates) {
    return (this.props.showMenu !== nextProps.showMenu) || 
      ((this.props.showMenu || nextProps.showMenu) && (this.state !== nextStates)) || 
      (this.props.mapMode.tracking !== nextProps.mapMode.tracking);
  }

  componentWillUnmount() {
    clearInterval(this.refreshJob);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.showMenu && this.props.showMenu) {
      this.refresh();
    }
  }

  componentDidMount() {
    // refresh the menu every 6 seconds
    this.refreshJob = setInterval(this.refresh, 7000);
  }

  // forceUpdate skips shouldComponentUpdate
  refresh = () => {
    this.setState({markerSnap: this.props.markers})
  }

  render() {
    const {classes, showMenu, mapMode} = this.props;
    return (
      <Drawer
        classes={{paper: clsx(classes.drawerPaper, !showMenu && classes.drawerPaperClose)}}
        variant="persistent"
        anchor="right"
        open={showMenu}>
        <div className={classes.toolbarSpacer} />
        { this.state.loading? 
          <><img alt="loading" className={classes.loadingIcon} src={Loading} /><div className={classes.loadingBackground} /></>: null}
        <List dense classes={{root: classes.menuList}} ref={el => this.container = el}>
        { mapMode.tracking? 
          <><MessageMenuHeader text="Message Details" button={false} refresh={null} />
            <TrackingMenu handleStopButtonClick={this.handleStopButtonClick} /></>: null }
          <MessageMenuHeader text="Message Tracker" button={true} refresh={this.refresh} />
          { Object.keys(this.state.markerSnap).length > 0? 
            Object.keys(this.state.markerSnap).map(key => ( 
              <MessageItem 
                key={key} 
                id={key}
                disable={mapMode.tracking}
                selected={key === this.state.selected}
                buttonClick={(evt) => this.handleButtonClick(evt, key, DecodeTopicType(this.state.markerSnap[key].topic))}
                itemClick={() => this.handleItemClick(key)}
                msgType={this.state.markerSnap[key].msgType} 
                source={DecodeTopicType(this.state.markerSnap[key].topic)} />)): <EmptyItem tracking={mapMode.tracking} /> }
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
    bearing: state.mapView.bearing,
    animationIcons: state.animateIcons
  };
};

const mapDispatchToProps = dispatch => {
  return {
      clearMarkers: () => dispatch(actionCreators.clearMarkers()),
      setAnimation: (on) => dispatch(actionCreators.setAnimation(on)),
      pauseAnimation: (onNow, time) => dispatch(actionCreators.pauseAnimation(onNow, time)),
      addError: (msg) => dispatch(actionCreators.addError(msg)),
      setMapView: (view) => dispatch(actionCreators.setMapView(view)),
      setMapMode: (target, tracking) => dispatch(actionCreators.setMapMode(target, tracking))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageMenu));