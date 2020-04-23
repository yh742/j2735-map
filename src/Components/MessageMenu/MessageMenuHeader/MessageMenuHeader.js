import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { ListSubheader, Divider } from '@material-ui/core';

import styles from '../Style/styles';

const MessageMenuHeader = ({ refresh, classes }) => {
    return (
        <ListSubheader className={classes.header}>
            Message Tracker
            <Button 
                onClick={refresh} 
                variant="outlined" 
                size="small" 
                color="primary" 
                className={classes.refreshButton}>Refresh</Button><Divider />
        </ListSubheader>
    );
}

export default withStyles(styles)(MessageMenuHeader);