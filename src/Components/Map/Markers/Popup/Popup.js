import React from 'react';
import clsx from 'clsx';
import { Popup } from "react-map-gl"
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
    popup: {
        fontSize: '10px',
        padding: '0px',
    },
    transition: {
        transition: "all 1000ms linear",
    }
}));

export default React.memo(({ animateIcon, lat, long, speed }) => {
    const classes = useStyles();
    return (
        <Popup
        className={clsx(classes.popup, animateIcon && classes.transition)} 
        latitude={lat} 
        tipSize={7}
        anchor="bottom"
        closeButton={false}
        longitude={long}>
            {speed} KPH
        </Popup>
    );
});