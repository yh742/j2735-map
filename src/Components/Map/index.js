import React from 'react'
import clsx from 'clsx'
import { SettingContext, SettingActions} from '../Store'
import CreateMqttClient, { CloseMqtt } from './MqttClient/MqttClient'

import { Component } from "react";
import { withStyles, ThemeProvider } from '@material-ui/core'

import { ParseSpeed, ParseLocation, ParseHeading, Rotate, ScaleMarker } from './Conversions'
import RoadLabels from './Assets/Layers/RoadLabels'
import CarIcon from './Assets/Images/car.png'
import PedIcon from './Assets/Images/ped.png'

import Geocoder from 'react-map-gl-geocoder'
import ReactMapGL, {Layer, NavigationControl, ScaleControl, Marker} from "react-map-gl"

const styles = (theme) => ({
  navControl: {
    position: 'absolute', 
    right: theme.spacing(1),
    bottom: theme.spacing(8)
  },
  markerContainer: {
    transition: "all 1000ms linear",
  }
})

const MAPBOX_TOKEN = "pk.eyJ1IjoieWg3NDIiLCJhIjoiY2s2ZnphcmxiMDEwaDNsbzVzMmFienR4ZyJ9.ID31klWjgTDI2oBKc-fXUA";

class Map extends Component {

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.localMarkerCache = {};
    this.resizeTimer = null;
    this.state = {
      animateIcon: true,
    }
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

  handleMqttMessages = (topic, message) => {
    let jsonString = new TextDecoder('utf-8').decode(message)
    let jsonObj;
    try {
      jsonObj = JSON.parse(jsonString);
    } catch (e) {
      console.log("couldn't convert " + jsonString + " to json object");
      return;
    }
    if ("BasicSafetyMessage" in jsonObj.MessageFrame.value) {
      // handle BSM messages here
      this.convertMessages(
        jsonObj.MessageFrame.value.BasicSafetyMessage.coreData,
        topic,
        "BSM"
        );
    } else if ("PersonalSafetyMessage" in jsonObj.MessageFrame.value){
      this.convertMessages(
        jsonObj.MessageFrame.value.PersonalSafetyMessage,
        topic, 
        "PSM"
      );
    }
  }

  // TODO: parse partII of the BSM messages
  convertMessages = (msgObj, topic, msgType) => {
    const {
      heading, id, long, lat, speed
    } = msgObj;
    this.localMarkerCache = {
      ...this.localMarkerCache,
      [id]: {
        topic: topic,
        msgType: msgType,
        long: ParseLocation(long),
        lat: ParseLocation(lat),
        speed: ParseSpeed(speed),
        heading: ParseHeading(heading),
      }
    }
  }

  handleMapResize = () => {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    if (this.state.animateIcon) {
        this.setState({
          animateIcon: false,
        });
    }
    this.resizeTimer = setTimeout(()=> this.setState({animateIcon: true}), 1000)
  }

  handleTimer = () => {
    const [ , dispatch] = this.context;
    dispatch({
      type: SettingActions.addMarker,
      payload: this.localMarkerCache
    });
    this.localMarkerCache = {};
  }

  handleInteractions = (iState) => {
    if (iState.isDragging || iState.isPanning || iState.isRotating || iState.isZooming && 
        this.state.animateIcon === true) {
      this.setState({
        animateIcon: false,
      })
    } else {
      this.setState({
        animateIcon: true,
      })
    }
  }

  componentDidMount() {
    this.mqttClient = CreateMqttClient(this.handleMqttMessages);
    this.interval = setInterval(this.handleTimer, 1000);
  }

  componentWillUnmount() {
    if (this.mqttClient) {
      CloseMqtt(this.mqttClient);
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const {classes} = this.props;
    const [ state, ] = this.context;

    let markers = state.mapView.zoom > 16 && this.mapRef.current?
        Object.keys(state.markers)
          .filter(key => this.mapRef.current.getMap().getBounds().contains([state.markers[key].long, state.markers[key].lat]))
          .map(key => <Marker className={clsx(this.state.animateIcon && classes.markerContainer)} key={key} latitude={state.markers[key].lat} longitude={state.markers[key].long}>
            <img 
              src={state.markers[key].msgType === "BSM"? CarIcon: PedIcon} 
              style={{
                transition: "transform 1000ms linear",
                width: "auto",
                height: `${ScaleMarker(state.markers[key].lat, state.mapView.zoom, state.markers[key].msgType)}px`,  
                transform: `rotate(${Rotate(state.markers[key].heading, state.mapView.bearing)}deg)`}} />
          </Marker>)
          : null;

    if (markers !== null && markers.length === 0) {
      markers = null;
    }
    
    return (
      <ReactMapGL
        ref={this.mapRef}
        {...state.mapView}
        onResize={this.handleMapResize}
        onLoad={this.handleMapLoad}
        onInteractionStateChange={this.handleInteractions}
        onViewportChange={this.handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/yh742/ck8tcx23g09pf1imf92m2wfko" 
        height="100%"
        width="100%">
        <Geocoder 
          mapRef={this.mapRef}
          onResult={this.handleGeocoderOnResult}
          onViewportChange={this.handleGeocoderViewportChange}
          placeholder="Search Location..."
          mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        <div className={classes.navControl}>
          <NavigationControl />
        </div>
        <div style={{position: 'absolute', bottom: 100, left: 20}}>
          <ScaleControl maxWidth={100} unit="metric" />
        </div>
        <Layer {...RoadLabels} layout={{...RoadLabels.layout, "visibility": state.stNames? "visible": "none"}}/>
        { markers }
      </ReactMapGL>
    );
  }
}
Map.contextType = SettingContext;

export default withStyles(styles)(Map);