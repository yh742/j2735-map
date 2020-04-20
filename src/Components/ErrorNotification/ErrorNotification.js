import React, {useContext} from 'react';
import { SettingContext, SettingActions } from '../Store'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import ErrorIcon from '@material-ui/icons/Error';

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundColor: theme.palette.secondary.main
    }
}));

export default function MessageMenu(props) {
  const classes = useStyles();
  const [state, dispatch] = useContext(SettingContext);
  
  const handleClose = () => {
      console.log("1");
      dispatch({
          type: SettingActions.removeError
      })
  }
  
  const handleExit = () => {
    console.log("2");
      dispatch({
          type: SettingActions.processError
      })
  }

  return (
    <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={state.error.message !== ""}
        message={state.error.message}
        ContentProps={{classes: { root: classes.background}}}
        autoHideDuration={3000}
        onClose={(evt, reason) => { if(reason === "timeout") handleClose() }}
        onExited={handleExit}
        action={
        <React.Fragment>
            <ErrorIcon />
            <IconButton size="small" aria-label="close" color="inherit">
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
        }
    />
  );
}