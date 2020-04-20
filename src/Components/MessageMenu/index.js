import React, {useContext, useState} from 'react';
import clsx from 'clsx';

import AnimationStopper from '../Helper/Animation';
import EmptyItem from './EmptyItem/EmptyItem';
import MessageItem from './MessagetItem/MessageItem';
import TrackingMenu from './TrackingMenu/TrackingMenu';
import { SettingContext, SettingActions } from '../Store'

import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import { Typography }  from '@material-ui/core'

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
}));

export default function MessageMenu(props) {
  const classes = useStyles();
  const {showMenu} = props;
  const [state, dispatch] = useContext(SettingContext);
  const [selected, setSelected] = useState(null);
  const targetId =  state.mapMode.targetId;
  const valid = targetId in state.markers;

  const handleItemClick = (key) => {
    console.log("clicked");
    // stop animation to move viewport
    AnimationStopper(state, dispatch, 300);
    // change viewport center location
    dispatch({
      type: SettingActions.setMapView,
      payload: {
        longitude: state.markers[key].long,
        latitude: state.markers[key].lat,
        transitionDuration: 0,
      }
    });
    if (selected === key) {
      // de-select menu item and take off highlight marker
      setSelected(null);
      dispatch({
        type: SettingActions.setMapMode,
        payload: {
          targetId: null,
        }
      });
    } else {
      // select menu item and highlight marker
      setSelected(key);
      dispatch({
        type: SettingActions.setMapMode,
        payload: {
          targetId: key,
        }
      });
    }
    dispatch({
      type: SettingActions.addError,
      payload: " THISDF IS A TEST MESSAGE!!!!" + key,
    })
  }

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
              ( <TrackingMenu 
                  id={targetId}
                  ttl={valid? state.markers[targetId].ttl: "0"}
                  topic={valid? state.markers[targetId].topic: "Inactive"}
                  long={valid? state.markers[targetId].long.toFixed(4) + "°": "-"}
                  lat={valid? state.markers[targetId].lat.toFixed(4) + "°": "-"}
                  speed={valid? state.markers[targetId].speed.toFixed(2) + " km/h": "-"}
                  heading={valid? state.markers[targetId].heading.toFixed(1) + "°": "-"}
                  handleStopButtonClick={handleStopButtonClick}
                />) : null }
          <List dense>
            { Object.keys(state.markers).length > 0 
                ? Object.keys(state.markers).map(key => ( 
                  <MessageItem 
                    key={key} 
                    id={key}
                    selected={key === selected}
                    worldView={state.mapMode.worldView} 
                    itemClick={handleItemClick}
                    buttonClick={handleButtonClick}
                    msgType={state.markers[key].msgType} 
                    topic={state.markers[key].topic} />))
                : <EmptyItem /> }
          </List>
        </Drawer>)  : null
      }
    </>
  );
}