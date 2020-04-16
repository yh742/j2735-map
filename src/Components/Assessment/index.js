import React, {useContext, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { ListSubheader, Button }  from '@material-ui/core'
import { SettingContext, SettingActions } from '../Store'
import Drawer from '@material-ui/core/Drawer';
import AnimationStopper from '../Helper/Animation';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocalTaxiIcon from '@material-ui/icons/LocalTaxi';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    width: 0,
  },
  toolbarSpacer: {
    height: theme.spacing(6),
  },
  listIcon: {
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(1),
    },
  },
  trackIconContainer: {
    minWidth: "40px",
    paddingBottom: theme.spacing(3),
  },
  button: {
    fontSize: '9px',
    minWidth: '0px',
    paddingLeft: "8px",
    paddingRight: "8px",
   // backgroundColor: 'white',
  },
  trackIcon: {
    width: "20px",
    height: "auto",
  }
}));

const maxStringLength = 13;

export default function AssessmentDrawer(props) {
  const classes = useStyles();
  const {showMenu} = props;
  const [state, dispatch] = useContext(SettingContext);
  const [selected, setSelected] = useState(null);

  const handleItemClick = (item) => {
    AnimationStopper(state, dispatch);
    dispatch({
      type: SettingActions.setMapView,
      payload: {
        longitude: item.long,
        latitude: item.lat,
      }
    });
  }

  const handleButtonClick = (event, id, item) => {
    event.stopPropagation();
    setSelected(id);
    AnimationStopper(state, dispatch, 1500);
    dispatch({
      type: SettingActions.setMapView,
      payload: {
        longitude: item.long,
        latitude: item.lat,
        bearing: item.heading,
        transitionDuration: 0,
      }
    });
    dispatch({
      type: SettingActions.setMapMode,
      payload: {
        worldView: false,
        targetId: id,
      }
    });
  }

  return (
    <>
      { showMenu === true ? (
        <Drawer
          classes={{paper: clsx(classes.drawerPaper, !showMenu && classes.drawerPaperClose)}}
          variant="persistent"
          anchor="right"
          open={showMenu}>
          <div className={classes.toolbarSpacer}>
          </div>
          <List>
            <ListSubheader inset>Message Sources</ListSubheader>
            { Object.keys(state.markers).length > 0? 
              Object.keys(state.markers).map(key => (
                <ListItem button key={key} onClick={()=> handleItemClick(state.markers[key])}>
                  <ListItemIcon className={classes.listIcon}>
                    {state.markers[key].msgType === "BSM"? <LocalTaxiIcon />: <AccessibilityIcon />}
                  </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{variant: 'subtitle1'}}
                  secondaryTypographyProps={{variant: 'caption'}}
                  primary={key} 
                  secondary={
                    state.markers[key].topic.length <= maxStringLength? 
                    state.markers[key].topic: 
                    state.markers[key].topic.substring(0, maxStringLength) + "..." } />
                <Button 
                  onClick={(evt)=>handleButtonClick(evt, key, state.markers[key])} 
                  variant={key === selected? "contained": "outlined"} 
                  size="small" 
                  color="primary" 
                  className={classes.button}>Track</Button>
              </ListItem>)): 
              <ListItem key="empty">
                  <ListItemIcon>
                    <HourglassEmptyIcon />
                  </ListItemIcon>
                <ListItemText secondary="No messages...">
                </ListItemText>
              </ListItem>
            }
          </List>
        </Drawer>)  : null
      }
    </>
  );
}