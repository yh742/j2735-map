import React, { useContext } from 'react';
import {SettingContext} from '../../Store'
import Marker from './Marker/Marker'
import Popup from './Popup/Popup'

export default function Markers(props) {
    const [state] = useContext(SettingContext);
    const { inViewPort, animateIcon } = props;

    // only render markers that are in viewport 
    const inViewMarkers = Object.keys(state.markers)
        .filter(key => inViewPort(state.markers[key].long, state.markers[key].lat))
    
    // translation animations have to be done with marker and rotation animations with images
    return (
        <>
        { inViewMarkers.length > 0? inViewMarkers.map(key => {
            let obj = state.markers[key];
            let lat = Math.floor(obj.lat * 1e5) / 1e5;
            let long = Math.floor(obj.long * 1e5) / 1e5;
            let speed = Math.floor(obj.speed);
            return (
                <>
                <Marker
                    key={key}
                    animateIcon={animateIcon} 
                    lat={lat} 
                    long={long}
                    msgType={obj.msgType} 
                    heading={obj.heading} 
                    zoom={state.mapView.zoom}
                    mapBearing={state.mapView.bearing} />
                { state.vehPopup && <Popup 
                    animateIcon={animateIcon} 
                    speed={speed}
                    lat={lat} 
                    long={long} />}
                </>
            )}): null }
        </>
    );
}
