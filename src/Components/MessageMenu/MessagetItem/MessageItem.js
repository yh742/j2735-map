import React from 'react';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles} from '@material-ui/core'
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import AccessibilityIcon from '@material-ui/icons/Accessibility';

const useStyles = makeStyles((theme) => ({
    listIcon: {
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(1),
        },
    },
    trackButton: {
        fontSize: '9px',
        minWidth: '0px',
        paddingLeft: "8px",
        paddingRight: "8px",
    },
    vzColor: {
        color: theme.palette.secondary.main,
        // fontWeight: 800,
    }
}));

const maxStringLength = 12;

const truncateLabel = (topic) => {
    let cleanTopic = topic.toUpperCase().replace("VZCV2X/1/IN/", "");
    return cleanTopic.length <= maxStringLength? cleanTopic: cleanTopic.substring(0, maxStringLength) + ".." 
}

export default React.memo(({ id, worldView, itemClick, buttonClick, msgType, topic, selected }) => {
    const classes = useStyles();
    const truncatedTopic = truncateLabel(topic);
    const color =  truncatedTopic.startsWith("VEH")? classes.vzColor: null;
    return (
        <ListItem button={worldView} onClick={()=> {if (worldView) itemClick(id)}} selected={selected}>
            <ListItemIcon classes={{root: color}} className={classes.listIcon}>
            {msgType === "BSM"? <LocalTaxiIcon />: <AccessibilityIcon />}
            </ListItemIcon>
            <ListItemText
                primary={id} 
                classes={{
                    primary: color,
                    secondary: color,
                }}
                secondary={truncatedTopic} />
            {worldView? (<Button 
                onClick={(evt)=>buttonClick(evt, id)} 
                variant="outlined" 
                size="small" 
                color={truncatedTopic.startsWith("VEH")? "secondary": "primary"} 
                className={classes.trackButton}>Track</Button>): null}
        </ListItem>)
});