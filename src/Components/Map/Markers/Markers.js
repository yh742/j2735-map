import React from 'react'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

import Marker from './Marker/Marker';
import styles from './Style/styles';

const Markers = ({ inViewPort, markers, targetedMarker, popupEnabled, animateIcons, zoom, bearing }) => {
    // only render markers that are in viewport 
    const inViewMarkers = Object.keys(markers).filter(key => inViewPort(markers[key].long, markers[key].lat))
    return (
        <>
        { inViewMarkers.length > 0? inViewMarkers.map(key => {
            let obj = markers[key];
            let lat = Math.floor(obj.lat * 1e5) / 1e5;
            let long = Math.floor(obj.long * 1e5) / 1e5;
            let speed = Math.floor(obj.speed);
            return (
                <div key={key}>
                <Marker
                    highlight={key === targetedMarker? true: false}
                    popup={popupEnabled}
                    animateIcons={animateIcons} 
                    lat={lat} 
                    long={long}
                    msgType={obj.msgType} 
                    heading={obj.heading} 
                    zoom={zoom}
                    speed={speed}
                    mapBearing={bearing} />
                </div>
            )}): null }
        </>
    );
}

const mapStateToProps = state => {
    return {
        markers: state.markers, 
        targetedMarker: state.mapMode.targetId,
        popupEnabled: state.displaySettings.vehPopup,
        animateIcons: state.animateIcons,
        zoom: state.mapView.zoom,
        bearing: state.mapView.bearing
    };
}

export default connect(mapStateToProps, null)(withStyles(styles)(Markers));