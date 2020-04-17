import React from 'react';
import clsx from 'clsx';
import { Marker } from "react-map-gl"
import { makeStyles } from '@material-ui/core'

import CarIcon from '../../Assets/Images/car.png'
import PedIcon from '../../Assets/Images/ped.png'
import {Rotate, ScaleMarker} from './Helpers';


const useStyles = makeStyles(() => ({
    transition: {
        transition: `all ${window.production.animate}ms linear`,
    }
}));

export default React.memo(({ highlight, popup, animateIcon, lat, long, msgType, heading, speed, zoom, mapBearing }) => {
    const classes = useStyles();
    return (
        <Marker 
        className={clsx((animateIcon && speed > 1) && classes.transition)} 
        latitude={lat} 
        longitude={long}>
            {popup? (
            <div style={{
                position: "absolute",
                display: "inline-block",
                textAlign: "center",
                whiteSpace: "nowrap",
                top: `-22px`,
                height: "20px",
                maxWidth: "60px",
                minWidth: "40px",
                borderRadius: "2px",
                fontSize: "10px",
                padding: "4px",
                backgroundColor: "white",
                 }}>{speed} KPH</div>): null}
            <img 
            alt="message marker"
            src={msgType === "BSM"? CarIcon: PedIcon}
            // className={clsx(animateIcon && classes.transition)} 
            style={{
                opacity: highlight? "1": "0.5",
                width: "auto",
                height: `${ScaleMarker(lat, zoom, msgType)}px`,
                transform: `rotate(${Rotate(heading, mapBearing)}deg)`
            }} /></Marker>)
        });