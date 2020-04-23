import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

import styles from '../Style/styles';

const maxStringLength = 12;

const truncateLabel = (topic) => {
    let cleanTopic = topic.toUpperCase().replace("VZCV2X/1/IN/", "");
    return cleanTopic.length <= maxStringLength? cleanTopic: cleanTopic.substring(0, maxStringLength) + ".." 
}

const MessageItem = ({ classes, id, itemClick, msgType, topic, selected }) => {
    const truncatedTopic = truncateLabel(topic);
    const color =  truncatedTopic.startsWith("VEH")? classes.vzColor: null;
    return (
        <ListItem 
            button 
            onClick={()=> itemClick(id)} 
            selected={selected}>
            <ListItemIcon classes={{root: color}} className={classes.listIcon}>
                {msgType === "BSM"? <LocalTaxiIcon />: <AccessibilityIcon />}
            </ListItemIcon>
            <ListItemText
                primary={id} 
                classes={{ primary: color,secondary: color }}
                secondary={truncatedTopic} />
            <Button 
                variant="outlined" 
                size="small" 
                color={truncatedTopic.startsWith("VEH")? "secondary": "primary"} 
                className={classes.trackButton}>Track</Button>
        </ListItem>)
};

export default withStyles(styles)(MessageItem);