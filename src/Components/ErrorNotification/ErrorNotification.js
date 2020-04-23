import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorIcon from '@material-ui/icons/Error';

import styles from './Style/styles';
import * as actionCreators from '../../store/actions/actions';

const ErrorNotification = ({ classes, handleClose, handleExit, errorMessage }) => {
  return (
    <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={errorMessage !== ""}
        message={errorMessage}
        ContentProps={{classes: { root: classes.background}}}
        autoHideDuration={3000}
        onClose={(evt, reason) => { if(reason === "timeout") handleClose()}}
        onExited={handleExit}
        action={<>
            <ErrorIcon />
            <IconButton size="small" aria-label="close" onClick={handleClose} color="inherit">
                <CloseIcon fontSize="small" />
            </IconButton>
        </>} />
  );
}

const mapStateToProps = state => {
    return {
        errorMessage: state.error.message
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleClose: () => dispatch(actionCreators.handleErrorClose()),
        handleExit: () => dispatch(actionCreators.handleErrorExit())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ErrorNotification));