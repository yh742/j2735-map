import React from 'react'
import { SettingContext, SettingActions} from '../Store'

import { Component } from "react";
import { withStyles } from '@material-ui/core'

import RoadLabels from './Layers/RoadLabels'

import Geocoder from 'react-map-gl-geocoder'
import ReactMapGL, {Layer, NavigationControl} from "react-map-gl"

const styles = (theme) => ({
  navControl: {
    position: 'absolute', 
    right: theme.spacing(1),
    bottom: theme.spacing(8)
  }
})

const MAPBOX_TOKEN = "pk.eyJ1IjoieWg3NDIiLCJhIjoiY2s2ZnphcmxiMDEwaDNsbzVzMmFienR4ZyJ9.ID31klWjgTDI2oBKc-fXUA";

class Map extends Component {

  static contextType = SettingContext;

  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
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

  render() {
    const {classes} = this.props;
    const [ state, ] = this.context;

    return (
      <ReactMapGL
        ref={this.mapRef}
        {...state.mapView}
        onLoad={this.handleMapLoad}
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
        {/* <Layer {...parkLayer} paint={{'fill-color': '#dea'}} /> */}
        <Layer {...RoadLabels} layout={{...RoadLabels.layout, "visibility": state.stNames? "visible": "none"}}/>
      </ReactMapGL>
    );
  }
}

export default withStyles(styles)(Map);