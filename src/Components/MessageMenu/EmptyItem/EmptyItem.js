import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core'

import styles from '../style/styles';

const EmptyItem = ({classes}) => {
    return (
        <ListItem key="empty" classes={{root: classes.emptyItem}}>
            <ListItemText secondary="No Messages"></ListItemText>
        </ListItem>
    )
}

export default withStyles(styles)(EmptyItem);