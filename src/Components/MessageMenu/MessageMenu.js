import clsx from 'clsx';
import axios from 'axios';
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



class MessageMenu extends Component {
  
  constructor(props) {
    super(props);
    this.refreshJob = null;
    this.trackingJob = null;
    this.topicSwitch = false;
    this.state = {
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
    const { markers, bearing } = this.props;
    if (targetId in markers) {
      const {long, lat, heading} = markers[targetId];
      // if (Math.abs(heading)-Math.abs(bearing) > 5) {
      //   console.log("pausing animation", this.props.animationIcons, heading, bearing);
      //   this.props.pauseAnimation(this.props.animateIcons, 1000);
      // }
      this.props.setMapView({
        longitude: long,
        latitude: lat,
        //bearing: heading,
        zoom: 19,
        transitionDuration: window.production.animate,
      });
      return;
    }
    // if (this.trackingJob) this.clearIntervalJob();
  }

  handleStopButtonClick = () => {
    this.props.setMapMode(null, false);
    if (this.trackingJob) this.clearIntervalJob();
    if (this.topicSwitch) {
      axios.all([
        axios({
          method: 'PUT',
          url: window.production.httpIn,
          data: {
            SubTopic: 'VZCV2X/1/IN/#',
            Format: "json"
          },
          auth: {
            ...window.production.httpAuth
          }
        }),
        axios({
          method: 'PUT',
          url: window.production.httpOut,
          data: {
            SubTopic: 'blah',
          },
          auth: {
            ...window.production.httpAuth
          }
        })
      ])
      .then(axios.spread((inRes, outRes) => {
        if (inRes.status !== 200 || outRes.status !== 200) {
          this.props.addError(`Received code ${inRes.status},  ${outRes.status} from http server!`)
          return 
        }
        this.topicSwitch = false;
        this.props.clearMarkers();
        setTimeout(this.refresh, 3000);
      }));
    }
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
    this.props.setMapMode(key, true);
    this.clearIntervalJob();
    switch (source) {
      case "Camera":
        this.trackingJob = setInterval(() => this.publishView(key), window.production.animate);
        this.topicSwitch = false;
        break;
      case "Vehicle":
        let splits = this.props.markers[key].topic.replace('IN','OUT').split('/');
        if (splits.length < 7) {
          this.props.addError(`The topic format "${this.props.markers[key].topic}" doesn't look right...`);
          return;
        }
        let newTopic = splits.slice(0,7).join('/') + "/#";
        axios.all([
          axios({
            method: 'PUT',
            url: window.production.httpIn,
            data: {
              SubTopic: this.props.markers[key].topic,
              Format: "json"
            },
            auth: {
              ...window.production.httpAuth
            }
          }),
          axios({
            method: 'PUT',
            url: window.production.httpOut,
            data: {
              SubTopic: newTopic,
              Format: "json"
            },
            auth: {
              ...window.production.httpAuth
            }
          })
        ])
        .then(axios.spread((inRes, outRes) => {
          if (inRes.status !== 200 || outRes.status !== 200) {
            this.props.addError(`Received code ${inRes.status},  ${outRes.status} from http server!`)
            return 
          }
          console.log(this.props.mapMode);
          this.topicSwitch = true;
          this.props.clearMarkers();
          this.trackingJob = setInterval(() => this.publishView(key), window.production.animate);
          setTimeout(this.refresh, 3000);
        }));
        break;
      default:
        this.props.addError("This is not a supported source type."); 
        return;
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

  // only re-render component when (1) menu switch states (2) states change while menu is open
  shouldComponentUpdate(nextProps, nextStates) {
    return (this.props.showMenu !== nextProps.showMenu) || 
      ((this.props.showMenu || nextProps.showMenu) && (this.state !== nextStates)) || 
      (this.props.mapMode.tracking !== nextProps.mapMode.tracking);
  }
  
  componentDidUpdate(prevProps) {
    if (!prevProps.showMenu && this.props.showMenu) {
      this.refresh();
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshJob);
  }

  componentDidMount() {
    axios({
      method: 'PUT',
      url: window.production.httpIn,
      data: {
        SubTopic: 'VZCV2X/1/IN/#',
        Format: "json"
      },
      auth: {
        ...window.production.httpAuth
      }
    }).then((res) => {
      if (res.status !== 200) {
        this.props.addError(`Received code ${res.status} from http server!`)
        return 
      }
      this.topicSwitch = false;
    });
    this.refreshJob = setInterval(this.refresh, 8000);
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
        <List dense classes={{root: classes.menuList}} ref={el => this.container = el}>
        { mapMode.tracking? 
          (<><MessageMenuHeader text="Message Details" button={false} refresh={null} />
            <TrackingMenu handleStopButtonClick={this.handleStopButtonClick} /></>) : null }
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
              : <EmptyItem tracking={mapMode.tracking} /> }
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