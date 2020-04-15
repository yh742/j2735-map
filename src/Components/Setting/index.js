import React, { useContext } from 'react'
import { 
    makeStyles, 
    Container, 
    Grid, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Switch, 
    ListSubheader, 
    ListItemSecondaryAction } from '@material-ui/core';
import { SettingContext, SettingActions } from '../Store';

const useStyles = makeStyles((theme)=> ({
    container: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        width: "100%",
    },
    paper: {
        marginTop: theme.spacing(4),
        padding: theme.spacing(4)
    }
  }));

export default function Settings() {
    const classes = useStyles();
    const [state, dispatch] = useContext(SettingContext);

    const displaySettings = {
        "intNotification": 'Intersection Notification',
        "vehPopup": "Vehicle Popup",
        "stNames": "Street Name",
        "trajectories": "Trajectories",
        "sigDebug": "Signal Debug",
        "metric": "Metric Units",
    };

    const messageSettings = {
        "enableBSM": "Enable BSM Messages",
        "enablePSM": "Enable PSM Messages",
        "enableSPaT": "Enable SPaT Messages",
    }

    const handleToggle = (event) => {
        dispatch({
            type: SettingActions.menuToggle,
            payload: event.target.name,
        });
    };

    return (
    <Container maxWidth="md" className={classes.container}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <List subheader={<ListSubheader>Display Settings</ListSubheader>} className={classes.root}>
                        { Object.keys(displaySettings).map(item => (
                            <ListItem key={item}>
                                <ListItemText primary={displaySettings[item]} />
                                <ListItemSecondaryAction>
                                <Switch
                                    name={item}
                                    checked={state[item]}
                                    edge="end"
                                    onChange={handleToggle}
                                />
                                </ListItemSecondaryAction>
                            </ListItem>
                        )) }
                    </List>
                </Paper>
                <Paper className={classes.paper}>
                    <List subheader={<ListSubheader>Message Settings</ListSubheader>} className={classes.root}>
                        { Object.keys(messageSettings).map(item => (
                            <ListItem key={item}>
                                <ListItemText primary={messageSettings[item]} />
                                <ListItemSecondaryAction>
                                <Switch
                                    name={item}
                                    checked={state[item]}
                                    edge="end"
                                    onChange={handleToggle}
                                />
                                </ListItemSecondaryAction>
                            </ListItem>
                            ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    </Container>)
}