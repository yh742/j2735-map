import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

import styles from '../style/styles';

const MessageItem = React.memo(({ classes, id, disable, itemClick, buttonClick, msgType, selected, source }) => {
    return (
        <ListItem 
            button 
            classes={{root: clsx(disable && classes.noHover)}}
            selected={selected}
            onClick={() => { if(!disable) itemClick(id) }} >
            <ListItemIcon className={classes.listIcon}>
                {msgType === "BSM"? <LocalTaxiIcon />: <AccessibilityIcon />}
            </ListItemIcon>
            <ListItemText
                primary={id} 
                secondary={source} />
            { !disable?
            <Button 
                size="small"
                variant="outlined" 
                onClick={buttonClick} 
                color={source === "Vehicle" ? "secondary": "primary"} 
                className={classes.trackButton}>Track</Button>: null}
        </ListItem>)
});

export default withStyles(styles)(MessageItem);