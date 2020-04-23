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

import styles from '../Style/styles';
import * as actionCreators from '../../store/actions/actions';

const MAX_STRING_LENGTH = 21;

const truncateString = (text) => {
    return text.length <= MAX_STRING_LENGTH? text: text.substring(0, MAX_STRING_LENGTH) + "..." ;
}

const HistoryMenu = ({classes, historyList, handleHistoryClick, handleClearHistory}) => {
    return (
        <List>
            <ListSubheader inset>Search History</ListSubheader>
            { historyList.map((item) => (
                <ListItem key={item.id} button component={Link} to="/" onClick={() => handleHistoryClick(item)}>
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
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        handleHistoryClick: (item) => dispatch(actionCreators.setMapCenter(item.center[0], item.center[1])),
        handleClearHistory: () => dispatch(actionCreators.handleClearHistory()),
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(HistoryMenu));





