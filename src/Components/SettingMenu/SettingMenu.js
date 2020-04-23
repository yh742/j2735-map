import React from 'react'
import { withStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import styles from './style/styles';
import DisplaySettings from './DisplaySettings/DisplaySettings';
import MessageSettings from './MessageSettings/MessageSettings';

const SettingMenu = ({classes}) => {
    return (
        <Container maxWidth="md" className={classes.container}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <DisplaySettings />
                    <MessageSettings />
                </Grid>
            </Grid>
        </Container>
    );
}

export default withStyles(styles)(SettingMenu);