import React from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Link from '@material-ui/core/Link';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import HistoryIcon from '@material-ui/icons/History';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

import styles from '../style/styles';
import * as actionCreators from '../../../store/actions/actions';

const MAX_STRING_LENGTH = 21;

const truncateString = (text) => {
    return text.length <= MAX_STRING_LENGTH? text: text.substring(0, MAX_STRING_LENGTH) + "..." ;
}

const HistoryMenu = ({classes, historyList, addError, tracking, handleHistoryClick, handleClearHistory}) => {
    
    const handleClick = (item) => {
        if (tracking) {
            addError("Can't use this feature in tracking mode!");
            return;
        }
        handleHistoryClick({
            longitude: item.center[0], 
            transitionDuration: 0,
            latitude: item.center[1], 
            zoom: 16
        });
    }

    return (
        <List>
            <ListSubheader inset>Search History</ListSubheader>
            { historyList.map((item) => (
                <ListItem key={item.id} button component={Link} to="/" onClick={() => handleClick(item)}>
                    <ListItemIcon className={classes.listIcon} >
                        <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText
                    primary={truncateString(item.text)} />
                </ListItem>)
            )}
            <ListItem button onClick={handleClearHistory}>
            <ListItemIcon className={classes.listIcon}>
                <DeleteSweepIcon />
            </ListItemIcon>
            <ListItemText primary="Clear History" />
            </ListItem>
        </List>
    );
}

const mapStateToProps = state => {
    return {
        historyList: state.history,
        tracking: state.mapMode.tracking
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        addError: (msg) => dispatch(actionCreators.addError(msg)),
        handleHistoryClick: (view) => dispatch(actionCreators.setMapView(view)),
        handleClearHistory: () => dispatch(actionCreators.handleClearHistory()),
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HistoryMenu));





