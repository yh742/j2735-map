import React from 'react';
import clsx from 'clsx';
import { Marker } from "react-map-gl"
import { makeStyles } from '@material-ui/core'

import CarIcon from '../../Assets/Images/car.png'
import PedIcon from '../../Assets/Images/ped.png'
import {Rotate, ScaleMarker} from './Helpers';


const useStyles = makeStyles(() => ({
    transition: {
        transition: "all 1000ms linear",
    }
}));

export default React.memo(({ animateIcon, lat, long, msgType, heading, zoom, mapBearing }) => {
    const classes = useStyles();
    // console.log(animateIcon, lat, long, msgType, heading, zoom, mapBearing );
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
});