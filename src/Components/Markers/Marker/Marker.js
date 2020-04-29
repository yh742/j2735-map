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
    // (146/278) ratio of image dimension of the car, (618/489) ratio of image dimension of the pedestrian
    let markerWidth = msgType === "BSM"? (146/278) * markerHeight: (618/489) * markerHeight;
    let diameter = highlight? ScaleMarker(lat, zoom, window.production.radius * 2): 0;
    return (
        <Marker className={clsx((animateIcons && speed > 1) && classes.transition)} 
            draggable={false}
            latitude={lat} 
            longitude={long}>
            {highlight && tracking?  <div style={{
                position: "absolute",
                top: `-${(diameter+markerHeight)/2}px`,
                left: `-${(diameter+markerWidth)/2}px`,
                display: "inline-block",
                height: `${diameter}px`,
                width: `${diameter}px`,
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
                    filter: highlight? `drop-shadow(0px 0px 15px rgba(255, 255, 255, 1))`: "none",
                    opacity: highlight? "1": "0.7",
                    width: markerWidth,
                    height: markerHeight,
                    transform: `rotate(${Rotate(heading, mapBearing)}deg)`}} />
        </Marker>)
});

export default withStyles(styles)(CustomMarker);