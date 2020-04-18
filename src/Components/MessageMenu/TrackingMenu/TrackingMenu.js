import React from 'react';


import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    listStartEntry: {
        [theme.breakpoints.up('sm')]: {
          paddingLeft: theme.spacing(1),
        },
      },
    wordWrap: { 
        wordWrap: "break-word", 
        whiteSpace: "normal" 
    },
}));

export default React.memo(({ id, ttl, topic, long, lat, speed, heading, handleStopButtonClick }) => {
    const classes = useStyles();
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


