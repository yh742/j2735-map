import React, { useContext } from 'react'
import {SettingContext} from '../../Store'
import Marker from './Marker/Marker'

export default function Markers(props) {
    const [state] = useContext(SettingContext);
    const { inViewPort } = props;
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
                <div key={key}>
                <Marker
                    highlight={key === state.mapMode.targetId? true: false}
                    popup={state.vehPopup}
                    animateIcon={state.animateIcons} 
                    lat={lat} 
                    long={long}
                    msgType={obj.msgType} 
                    heading={obj.heading} 
                    zoom={state.mapView.zoom}
                    speed={speed}
                    mapBearing={state.mapView.bearing} />
                </div>
            )}): null }
        </>
    );
}
