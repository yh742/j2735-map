import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles} from '@material-ui/core';
import { ListSubheader, Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    listIcon: {
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(1),
        },
    },
    header: {
        paddingLeft: theme.spacing(3),
        display: "block",
        lineHeight: "3.5rem",
    },
    trackButton: {
        fontSize: '9px',
        minWidth: '0px',
        marginLeft: theme.spacing(6),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
}));

export default React.memo(({ refresh }) => {
    const classes = useStyles();
    return (
        <>
        <ListSubheader className={classes.header} sticky={true}>Message Tracker
            <Button 
                onClick={refresh} 
                variant="outlined" 
                size="small" 
                color="primary" 
                className={classes.trackButton}>Refresh</Button><Divider /></ListSubheader>

        </>)
});