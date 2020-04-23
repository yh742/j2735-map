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
    "enableBSM": "Enable BSM Messages",
    "enablePSM": "Enable PSM Messages",
    "enableSPaT": "Enable SPaT Messages",
}

const MessageSettings = ({classes, messageSettings, messageSettingToggle}) => {
    return (
        <Paper className={classes.paper}>
            <List subheader={<ListSubheader>Message Settings</ListSubheader>} className={classes.root}>
                { Object.keys(settingsMap).map(item => (
                    <ListItem key={item}>
                        <ListItemText primary={settingsMap[item]} />
                        <ListItemSecondaryAction>
                        <Switch
                            name={item}
                            checked={messageSettings[item]}
                            edge="end"
                            onChange={() => messageSettingToggle(item)}
                        />
                        </ListItemSecondaryAction>
                    </ListItem>
                    ))}
            </List>
        </Paper>
    );
}

const mapStateToProps = state => {
    return {
        messageSettings: state.messageSettings
    };
};

const mapDispatchToProps = dispatch => {
    return {
        messageSettingToggle: (setting) => dispatch(actionCreators.messageSettingToggle(setting))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageSettings));



