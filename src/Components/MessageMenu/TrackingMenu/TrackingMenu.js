import React from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

import styles from '../style/styles';

const defaultView = {
    id: "-", 
    ttl: "0",
    topic: "Inactive",
    long: "-",
    lat: "-",
    speed: "-",
    heading: "-"
};

const TrackingMenu = React.memo(({ classes, id, ttl, topic, long, lat, speed, heading, handleStopButtonClick, intersection }) => {
    return (
        <List>
            <ListItem>
                <ListItemText className={classes.listStartEntry} primary={id} secondary="Identifier" />
                <ListItemText primary={ttl} secondary="Time To Live" />
            </ListItem>
            <ListItem>
                <ListItemText 
                    className={classes.listStartEntry}
                    classes={{ primary: classes.wordWrap }}
                    primary={topic}
                    secondary="Message Source Topic" />
            </ListItem>
            <ListItem>
                <ListItemText 
                    className={classes.listStartEntry}
                    classes={{ primary: classes.wordWrap }}
                    primary={intersection.streets? intersection.streets[0] + " & " + intersection.streets[1]: "-"}
                    secondary="Closest Intersection" />
            </ListItem>
            <ListItem>
                <ListItemText 
                    className={classes.listStartEntry}
                    primary={long}
                    secondary="Longitude" />
                <ListItemText 
                    primary={lat}
                    secondary="Latitude" />
            </ListItem>
            <ListItem>
                <ListItemText 
                    className={classes.listStartEntry}
                    primary={speed}
                    secondary="Speed" />
                <ListItemText 
                    primary={heading}
                    secondary="Heading" />
            </ListItem>
            <ListItem alignItems='center'> 
            <Button 
                onClick={handleStopButtonClick} 
                variant="contained"
                size="small" 
                color="secondary"
                style={{margin: "auto"}}>Stop Tracking</Button>
            </ListItem>
            <div style={{padding: "8px"}}></div>
            <Divider />
        </List>)
});

const mapStateToProps = state => {
    let valid = state.mapMode.targetId in state.markers;
    if (valid) {
        return {
            id: state.mapMode.targetId,
            ttl: state.markers[state.mapMode.targetId].ttl,
            topic: state.markers[state.mapMode.targetId].topic,
            long: state.markers[state.mapMode.targetId].long.toFixed(4),
            lat: state.markers[state.mapMode.targetId].lat.toFixed(4),
            speed: state.markers[state.mapMode.targetId].speed.toFixed(2),
            heading: state.markers[state.mapMode.targetId].heading.toFixed(1) 
        };
    } else {
        return {
            ...defaultView
        };
    }
};

export default connect(mapStateToProps, null)(withStyles(styles)(TrackingMenu));

