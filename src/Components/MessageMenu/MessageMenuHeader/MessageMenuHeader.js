import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { ListSubheader, Divider } from '@material-ui/core';

import styles from '../style/styles';

const MessageMenuHeader = ({ refresh, button, classes, text }) => {
    return (
        <ListSubheader className={classes.header}>
            {text}
            { button?
            <Button 
                onClick={refresh} 
                variant="outlined" 
                size="small" 
                color="primary" 
                className={classes.refreshButton}>Refresh</Button>: null }
            <Divider />
        </ListSubheader>
    );
}

export default withStyles(styles)(MessageMenuHeader);