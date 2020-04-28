import React from 'react';
import clsx from 'clsx';
import { Marker } from 'react-map-gl';
import { withStyles } from '@material-ui/core';

import styles from '../style/styles';
import CarIcon from '../Assets/Images/car.png';
import PedIcon from '../Assets/Images/ped.png';
import {Rotate, ScaleMarker} from '../../Helper/Utility';

const CustomMarker = React.memo(({ classes, tracking, highlight, popup, animateIcons, lat, long, msgType, heading, speed, zoom, mapBearing }) => {
    let markerSize = msgType === "BSM"? 4: 3;
    let markerHeight = ScaleMarker(lat, zoom, markerSize);
    let markerWidth = (146/278)*markerHeight;
    let radius = highlight? ScaleMarker(lat, zoom, 100): 0;
    return (
        <Marker className={clsx((animateIcons && speed > 1) && classes.transition)} 
            draggable={false}
            latitude={lat} 
            longitude={long}>
            {highlight && tracking?  <div style={{
                position: "absolute",
                top: `-${(radius+markerHeight)/2}px`,
                left: `-${(radius+markerWidth)/2}px`,
                display: "inline-block",
                height: `${radius}px`,
                width: `${radius}px`,
                borderRadius: "50%",
                backgroundColor: "White",
                borderColor: "white",
                opacity: 0.1,
            }}></div>: null }
            { popup? (<div className={classes.popups}>{speed} KPH</div>): null } 
                <img 
                alt="message marker"
                src={msgType === "BSM"? CarIcon: PedIcon}
                style={{
                    filter: highlight? `drop-shadow(0px 0px 7px rgba(255, 255, 255, 1))`: "none",
                    opacity: highlight? "1": "0.5",
                    width: markerWidth,
                    height: markerHeight,
                    transform: `rotate(${Rotate(heading, mapBearing)}deg)`}} />
        </Marker>)
});

export default withStyles(styles)(CustomMarker);