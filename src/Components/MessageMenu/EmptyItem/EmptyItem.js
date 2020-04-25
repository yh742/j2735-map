import React from 'react';
import clsx from 'clsx';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core'

import styles from '../style/styles';

const EmptyItem = ({classes, tracking}) => {
    return (
        <ListItem key="empty" classes={{root: clsx(!tracking && classes.emptyItem, tracking && classes.emptyItemTracking)}}>
            <ListItemText secondary="No Messages"></ListItemText>
        </ListItem>
    )
}

export default withStyles(styles)(EmptyItem);