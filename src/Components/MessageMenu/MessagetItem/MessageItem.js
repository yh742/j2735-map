import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

import styles from '../Style/styles';

const MessageItem = ({ classes, id, itemClick, msgType, selected, source }) => {
    return (
        <ListItem 
            button 
            selected={selected}
            onClick={()=> itemClick(id)} >
            <ListItemIcon className={classes.listIcon}>
                {msgType === "BSM"? <LocalTaxiIcon />: <AccessibilityIcon />}
            </ListItemIcon>
            <ListItemText
                primary={id} 
                secondary={source} />
            <Button 
                variant="outlined" 
                size="small" 
                color={source === "Vehicle" ? "secondary": "primary"} 
                className={classes.trackButton}>{source === "Vehicle"? "MODE": "TRACK"}</Button>
        </ListItem>)
};

export default withStyles(styles)(MessageItem);