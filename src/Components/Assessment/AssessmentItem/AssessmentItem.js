import React from 'react';
import clsx from 'clsx';

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
}));

const maxStringLength = 13;

const truncateLabel = (topic) => {
    return topic.length <= 13? topic: topic.substring(0, maxStringLength) + "..." 
}

export default React.memo(({ key, worldView, itemClick, msgType, topic }) => {
    const classes = useStyles();
    return (
        <ListItem button={worldView} onClick={()=> {if (worldView) itemClick(key)}}>
            <ListItemIcon className={classes.listIcon}>
            {msgType === "BSM"? <LocalTaxiIcon />: <AccessibilityIcon />}
            </ListItemIcon>
            <ListItemText
                primary={key} 
                secondary={truncateLabel(topic)} />
            {worldView? (<Button 
                onClick={(evt)=>itemClick(evt, key)} 
                variant="outlined" 
                size="small" 
                color="primary" 
                className={classes.trackButton}>Track</Button>): null}
        </ListItem>)
});