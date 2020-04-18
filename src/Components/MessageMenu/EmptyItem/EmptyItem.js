import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

export default function() {
    return (
        <ListItem key="empty">
            <ListItemIcon>
                <HourglassEmptyIcon />
            </ListItemIcon>
        <ListItemText secondary="No messages..."></ListItemText>
        </ListItem>
    )
}