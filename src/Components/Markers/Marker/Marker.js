import React from 'react';
import clsx from 'clsx';
import { Marker } from 'react-map-gl';
import { withStyles } from '@material-ui/core';

import styles from '../style/styles';
import CarIcon from '../Assets/Images/car.png';
import PedIcon from '../Assets/Images/ped.png';
import {Rotate, ScaleMarker} from '../../Helper/Utility';

const CustomMarker = React.memo(({ classes, highlight, popup, animateIcons, lat, long, msgType, heading, speed, zoom, mapBearing }) => {
    return (
        <Marker className={clsx((animateIcons && speed > 1) && classes.transition)} 
            latitude={lat} 
            longitude={long}>
            { popup? (<div className={classes.popups}>{speed} KPH</div>): null } 
                <img 
                alt="message marker"
                src={msgType === "BSM"? CarIcon: PedIcon}
                style={{
                    filter: highlight? "drop-shadow(0px 0px 7px rgba(255, 255, 255, 1))": "none",
                    opacity: highlight? "1": "0.5",
                    width: "auto",
                    height: `${ScaleMarker(lat, zoom, msgType)}px`,
                    transform: `rotate(${Rotate(heading, mapBearing)}deg)`}} />
        </Marker>)
});

export default withStyles(styles)(CustomMarker);