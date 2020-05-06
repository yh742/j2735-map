import React from 'react'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import styles from '../style/styles';
import * as actionCreators from '../../../store/actions/actions';

// map key in global store to label
const settingsMap = {
    "intNotification": 'Intersection Notification',
    "vehPopup": "Vehicle Popup",
    "stNames": "Street Name",
    "trajectories": "Trajectories",
    "sigDebug": "Signal Debug",
    "metric": "Metric Units",
    'highlightTTL': "Highlight Low TTL"
};

const DisplaySettings = ({classes, displaySettings, displaySettingToggle}) => {
    return (
        <Paper className={classes.paper}>
            <List subheader={<ListSubheader>Display Settings</ListSubheader>} className={classes.root}>
                { Object.keys(settingsMap).map(item => (
                    <ListItem key={item}>
                        <ListItemText primary={settingsMap[item]} />
                        <ListItemSecondaryAction>
                        <Switch
                            name={item}
                            checked={displaySettings[item]}
                            edge="end"
                            onChange={() => displaySettingToggle(item)}
                        />
                        </ListItemSecondaryAction>
                    </ListItem>
                )) }
            </List>
        </Paper>
    );
}

const mapStateToProps = state => {
    return {
        displaySettings: state.displaySettings
    };
};

const mapDispatchToProps = dispatch => {
    return {
        displaySettingToggle: (setting) => dispatch(actionCreators.displaySettingToggle(setting))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DisplaySettings));