import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function() {
    return (
        <ListItem key="empty" style={{marginTop: "8px", marginLeft: "64px", paddingTop: "35VH"}}>
        <ListItemText secondary="No Messages"></ListItemText>
        </ListItem>
    )
}