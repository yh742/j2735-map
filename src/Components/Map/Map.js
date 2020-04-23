import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import Geocoder from 'react-map-gl-geocoder';
import ReactMapGL, { Layer, NavigationControl, LinearInterpolator } from 'react-map-gl';

import styles from './Style/styles';
import Markers from './Markers/Markers'
import RoadLabels from './Assets/Layers/RoadLabels'
import SpatLayers from './SpatLayers/SpatLayers'
import BufferedMessageClient from '../Helper/BufferedMessageClient';
import * as actionCreators from '../store/actions/actions';

const MAPBOX_TOKEN = window.production.mbToken;
const MAPBOX_STYLE = window.production.mbStyle;

class Map extends Component {

  constructor(props) {
    super(props);
    this.client = null;
    this.resizeTimer = null;
    this.mapRef = React.createRef();
  }

  handleViewportChange = (viewport) => {
    this.props.setMapView(viewport);
  }
 
  handleGeocoderOnResult = ({result}) => {
    this.props.addHistory({
      id: result.id,
      text: result.text,
      center: result.center
    });
  }
    
  handleGeocoderViewportChange = (viewport) => {
    this.handleViewportChange({
      ...viewport,
      transitionDuration: 500
    });
  }

  // when map resizes disable transition animation
  handleMapResize = () => {
    this.props.pauseAnimation(this.props.animateIcons, 400);
  }

  // remove animation transition when user is interacting
  handleInteractions = (iState) => {
    if ((iState.isDragging || iState.isPanning || iState.isRotating || iState.isZooming) && 
      this.props.animateIcons === true) {
        this.props.setAnimation(false);
    } else {
      this.props.setAnimation(true);
    }
  }

  componentDidMount() {
    this.client = new BufferedMessageClient({
      addError: this.props.addError,
      updateMarker: this.props.updateMarker,
      updateNotification: this.props.updateNotification,
      updateSignals: this.props.updateSignals,
      updateSPAT: this.props.updateSPAT
    }, );
  }

  componentWillUnmount() {
    if (this.client) this.client.disconnect();
  }

  render() {
    const {classes, mapView, displayStreets} = this.props;
    return (
      <ReactMapGL
        ref={this.mapRef}
        {...mapView}
        onResize={this.handleMapResize}
        onInteractionStateChange={this.handleInteractions}
        onViewportChange={this.handleViewportChange}
        transitionInterpolator={new LinearInterpolator()}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE}
        height="100%"
        width="100%">
        <Geocoder 
          mapRef={this.mapRef}
          onResult={this.handleGeocoderOnResult}
          onViewportChange={this.handleGeocoderViewportChange}
          placeholder="Search Location..."
          mapboxApiAccessToken={MAPBOX_TOKEN} />
        <div className={classes.navControl}>
          <NavigationControl />
        </div>
        <Layer {...RoadLabels} layout={{...RoadLabels.layout, "visibility": displayStreets? "visible": "none"}}/>
        <SpatLayers />
        { mapView.zoom > 16.5 && this.mapRef.current? 
            <Markers inViewPort={(long, lat) => this.mapRef.current.getMap().getBounds().contains([long, lat])} />: null }
      </ReactMapGL>
    );
  }
}

const mapStateToProps = state => {
  return {
    animateIcons: state.animateIcons,
    mapView: state.mapView,
    displayStreets: state.displaySettings.stNames
  };
}

const mapDispatchToProps = dispatch => {
  return {
      setMapView: (view) => dispatch(actionCreators.setMapView(view)),
      addHistory: (history) => dispatch(actionCreators.addHistory(history)),
      pauseAnimation: (onNow, time) => dispatch(actionCreators.pauseAnimation(onNow, time)),
      setAnimation: (on) => dispatch(actionCreators.setAnimation(on)),
      // for mqtt message 
      addError: (msg) => dispatch(actionCreators.addError(msg)),
      updateMarker: (markers) => dispatch(actionCreators.updateMarkers(markers)),
      updateNotification: (updates) => dispatch(actionCreators.updateNotification(updates)),
      updateSignals: (signals) => dispatch(actionCreators.updateSignals(signals)),
      updateSPAT: (spat) => dispatch(actionCreators.updateSPAT(spat))
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Map));