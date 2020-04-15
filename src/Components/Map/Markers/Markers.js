import React, { useContext, PureComponent, Component } from 'react';
import clsx from 'clsx';
import { Marker } from "react-map-gl"
import { makeStyles, withStyles } from '@material-ui/core'
import {SettingContext} from '../../Store'
import CarIcon from '../Assets/Images/car.png'
import PedIcon from '../Assets/Images/ped.png'
import {Rotate, ScaleMarker} from './Helpers';

// const useStyles = makeStyles(() => ({
//     transition: {
//         transition: "all 1000ms linear",
//       }
// }));

const style  = () => ({
    transition: {
        transition: "all 1000ms linear",
    }
})

class CustomMarker extends PureComponent {
    render() {
        console.log(this.props);
        const { classes, animateIcon, lat, long, msgType, heading, zoom, mapBearing } = this.props;
        console.log(typeof lat, typeof long)
        return (
            <Marker 
            className={clsx(animateIcon && classes.transition)} 
            latitude={lat} 
            longitude={long}>
                <img 
                alt="message marker"
                src={msgType === "BSM"? CarIcon: PedIcon}
                className={clsx(animateIcon && classes.transition)} 
                style={{
                    width: "auto",
                    height: `${ScaleMarker(lat, zoom, msgType)}px`,
                    transform: `rotate(${Rotate(heading, mapBearing)}deg)`
                }}
                />
            </Marker>
        );
    }
}

const MsgMarker = withStyles(style)(CustomMarker);

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
            return (
                <MsgMarker
                    key={key}
                    animateIcon={animateIcon} 
                    lat={Math.floor(obj.lat * 1e5) / 1e5} 
                    long={Math.floor(obj.long * 1e5) / 1e5}
                    msgType={obj.msgType} 
                    heading={obj.heading} 
                    zoom={state.mapView.zoom}
                    mapBearing={state.mapView.bearing} />
            )}): null }
        </>
    );
}

// const MsgMarker = React.memo(function ({ id, animateIcon, lat, long, msgType, heading, zoom, mapBearing }) {
//     const classes = useStyles();
//     console.log("this");
//     return (
//         <Marker 
//         key={id} 
//         className={clsx(animateIcon && classes.transition)} 
//         latitude={lat} 
//         longitude={long}>
//             <img 
//             alt="message marker"
//             src={msgType === "BSM"? CarIcon: PedIcon}
//             className={clsx(animateIcon && classes.transition)} 
//             style={{
//                 width: "auto",
//                 height: `${ScaleMarker(lat, zoom, msgType)}`,
//                 transform: `rotate(${Rotate(heading, mapBearing)}deg)`
//             }}
//             />
//         </Marker>
//     );
// });
