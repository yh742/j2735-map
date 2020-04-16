import React from 'react'
import { SettingContext, SettingActions} from '../Store'
import Markers from './Markers/Markers'
import MqttClient from './MqttClient/MqttClient'

import { Component } from "react";
import { withStyles } from '@material-ui/core'

import RoadLabels from './Assets/Layers/RoadLabels'


import Geocoder from 'react-map-gl-geocoder'
import ReactMapGL, { Layer, NavigationControl } from "react-map-gl"

import AnimationStopper from '../Helper/Animation'

const styles = (theme) => ({
  navControl: {
    position: 'absolute', 
    right: theme.spacing(1),
    bottom: theme.spacing(4)
  }
})

const MAPBOX_TOKEN = window.production.mbToken;
const MAPBOX_STYLE = window.production.mbStyle;

class Map extends Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.localMarkerCache = {};
    this.resizeTimer = null;
  }

  handleViewportChange = (viewport) => {
    const [ , dispatch] = this.context;
    dispatch({
      type: SettingActions.setMapView,
      payload: viewport
    });
  }
 
  handleGeocoderOnResult = ({result}) => {
    console.log("search results:", result);
    const [ , dispatch] = this.context;
    dispatch({
      type: SettingActions.addHistory,
      payload: {
          id: result.id,
          text: result.text,
          center: result.center,
      }
    })
  }
    
  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { 
      transitionDuration: 500,
    }
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    })
  }

  // when map resizes disable transition animation
  handleMapResize = () => {
    const [ state, dispatch ] = this.context;
    AnimationStopper(state, dispatch, 500);
  }

  // remove animation transition when user is interacting
  handleInteractions = (iState) => {
    const [ state, dispatch ] = this.context;
    if ((iState.isDragging || iState.isPanning || iState.isRotating || iState.isZooming) && 
        state.animateIcon === true) {
      dispatch({
        type: SettingActions.setAnimation,
        payload: false,
      });
    } else {
      dispatch({
        type: SettingActions.setAnimation,
        payload: true,
      });
    }
  }

  componentDidMount() {
    this.mqttClient = new MqttClient((cache) => {
      console.log("dispatching markers");
      const [,dispatch] = this.context;
      dispatch({
        type: SettingActions.updateMarker,
        payload: cache
      });
    });
  }

  componentWillUnmount() {
    if (this.mqttClient) {
      this.mqttClient.close();
    }
  }

  render() {
    const {classes} = this.props;
    const [ state, ] = this.context;

    return (
      <ReactMapGL
        ref={this.mapRef}
        {...state.mapView}
        scrollZoom={state.mapMode.worldView}
        dragPan={state.mapMode.worldView}
        dragRotate={state.mapMode.worldView}
        doubleClickZoom={state.mapMode.worldView}
        touchZoom={state.mapMode.worldView}
        onResize={this.handleMapResize}
        onLoad={this.handleMapLoad}
        onInteractionStateChange={this.handleInteractions}
        onViewportChange={this.handleViewportChange}
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
        <Layer {...RoadLabels} layout={{...RoadLabels.layout, "visibility": state.stNames? "visible": "none"}}/>
          { state.mapView.zoom > 16 && this.mapRef.current? 
          <Markers 
            inViewPort={(long, lat) => this.mapRef.current.getMap().getBounds().contains([long, lat])} />: null }
      </ReactMapGL>
    );
  }
}
Map.contextType = SettingContext;

export default withStyles(styles)(Map);