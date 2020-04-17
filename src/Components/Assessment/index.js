import React, {useContext} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, Typography }  from '@material-ui/core'
import { SettingContext, SettingActions } from '../Store'
import Drawer from '@material-ui/core/Drawer';
import AnimationStopper from '../Helper/Animation';
import AssessmentItem from './AssessmentItem/AssessmentItem';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    height: "100vh",
    overflow: "scroll",
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
  menuTitle: {
    paddingTop: "16px",
    paddingBottom: "16px"
  },
  toolbarSpacer: {
    marginTop: theme.spacing(7),
  },
  trackIconContainer: {
    minWidth: "40px",
    paddingBottom: theme.spacing(3),
  },
  trackButton: {
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

export default function AssessmentDrawer(props) {
  const classes = useStyles();
  const {showMenu} = props;
  const [state, dispatch] = useContext(SettingContext);

  const handleButtonClick = (event, id) => {
    event.stopPropagation();
    AnimationStopper(state, dispatch, 1500);
    dispatch({
      type: SettingActions.setMapView,
      payload: {
        longitude: state.markers[id].long,
        latitude: state.markers[id].lat,
        bearing: state.markers[id].heading,
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
  
  const handleStopButtonClick = () => {
    AnimationStopper(state, dispatch, 1500);
    dispatch({
      type: SettingActions.setMapMode,
      payload: {
        worldView: true,
        targetId: null,
      }
    });
    dispatch({
      type: SettingActions.setMapView,
      payload: {
        transitionDuration: 0,
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
          <div className={classes.toolbarSpacer} />
          <Typography className={classes.menuTitle} variant="body1" align="center" display="block">Message Tracker</Typography>
            { !state.mapMode.worldView?
              (<List dense>
                <ListItem>
                  <ListItemText  className={classes.listIcon}
                    primary={state.mapMode.targetId}
                    secondary="Identifier" />
                  <ListItemText 
                    primary={state.mapMode.targetId in state.markers? state.markers[state.mapMode.targetId].ttl: "0" }
                    secondary="Time To Live" />
                </ListItem>
                <ListItem>
                <ListItemText  className={classes.listIcon}
                    primaryTypographyProps={{ style: { wordWrap: "break-word", whiteSpace: "normal" } }}
                    primary={state.mapMode.targetId in state.markers? state.markers[state.mapMode.targetId].topic: "Source is inactive" }
                    secondary="Message Source Topic" />
                </ListItem>
                <ListItem>
                <ListItemText  className={classes.listIcon}
                    primary={state.mapMode.targetId in state.markers? state.markers[state.mapMode.targetId].long.toFixed(4) + "°": "-" }
                    secondary="Longitude" />
                <ListItemText 
                    primary={state.mapMode.targetId in state.markers? state.markers[state.mapMode.targetId].lat.toFixed(4) + "°": "-" }
                    secondary="Latitude" />
                </ListItem>
                <ListItem>
                <ListItemText  className={classes.listIcon}
                    primary={state.mapMode.targetId in state.markers? state.markers[state.mapMode.targetId].speed.toFixed(1) + " KM/H": "-" }
                    secondary="Speed" />
                <ListItemText 
                    primary={state.mapMode.targetId in state.markers? state.markers[state.mapMode.targetId].heading.toFixed(0)  + "°": "-" }
                    secondary="Heading" />
                </ListItem>
                <ListItem alignItems='center'> 
                <Button
                    onClick={(evt)=>handleStopButtonClick(evt)} 
                    variant="contained"
                    size="small" 
                    color="secondary"
                    style={{margin: "auto"}} >Stop Tracking</Button>
                </ListItem>
                <div style={{padding: "8px"}}></div>
                <Divider />
                </List>) : null }
            <List dense>
            { Object.keys(state.markers).length > 0? 
              Object.keys(state.markers).map(key => ( 
                <AssessmentItem 
                  key={key} 
                  worldView={state.mapMode.worldView} 
                  itemClick={handleButtonClick}
                  msgType={state.markers[key].msgType} 
                  topic={state.markers[key].topic} />)): null} 
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