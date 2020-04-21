import React, { Component } from 'react';
import clsx from 'clsx';


import AnimationStopper from '../Helper/Animation';
import EmptyItem from './EmptyItem/EmptyItem';
import MessageItem from './MessagetItem/MessageItem';
import TrackingMenu from './TrackingMenu/TrackingMenu';
import MessageMenuHeader from './MessageMenuHeader/MessageMenuHeader';
import { SettingContext, SettingActions } from '../Store'

import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
const drawerWidth = 260;

const styles =(theme) => ({
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
    marginTop: theme.spacing(6),
  },
});

class MessageMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      snapshot: {
        mapMode: {},
        markers: {},
      },
    }
  }

  refresh = () => {
    const [ state ] = this.context;
    this.setState({
      snapshot: state,
    });
  }

  handleItemClick = (key) => {
    const [ state, dispatch ] = this.context;
    // stop animation to move viewport
    AnimationStopper(state, dispatch, 300);
    // change viewport center location
    if (!(key in state.markers)) {
      this.setState({ selected: null });
      dispatch({
        type: SettingActions.addError,
        payload: `Marker "${key}" doesn't exist on map anymore!`
      });
      return;
    }
    dispatch({
      type: SettingActions.setMapView,
      payload: {
        longitude: state.markers[key].long,
        latitude: state.markers[key].lat,
        transitionDuration: 0,
      }
    });

    console.log(state.markers[key].topic);
    if (this.state.selected === key) {
      // de-select menu item and take off highlight marker
      this.setState({ selected: null });
      dispatch({
        type: SettingActions.setMapMode,
        payload: {
          targetId: null,
        }
      });
    } else {
      // select menu item and highlight marker
      this.setState({ selected: key });
      dispatch({
        type: SettingActions.setMapMode,
        payload: {
          targetId: key,
        }
      });
    }
  }

  handleButtonClick = (event, id) => {
    // const [ state, dispatch ] = this.context;
    // event.stopPropagation();
    // AnimationStopper(state, dispatch, 1500);
    // dispatch({
    //   type: SettingActions.setMapView,
    //   payload: {
    //     longitude: state.markers[id].long,
    //     latitude: state.markers[id].lat,
    //     bearing: state.markers[id].heading,
    //     transitionDuration: 0,
    //   }
    // });
    // dispatch({
    //   type: SettingActions.setMapMode,
    //   payload: {
    //     worldView: false,
    //     targetId: id,
    //   }
    // });
  }
  
  handleStopButtonClick = () => {
    // const [ state, dispatch ] = this.context;
    // AnimationStopper(state, dispatch, 1500);
    // dispatch({
    //   type: SettingActions.setMapMode,
    //   payload: {
    //     worldView: true,
    //     targetId: null,
    //   }
    // });
    // dispatch({
    //   type: SettingActions.setMapView,
    //   payload: {
    //     transitionDuration: 0,
    //   }
    // });
  }

  componentDidUpdate(prevProps) {
    const [ state ] = this.context;
    if (this.props.showMenu === true && prevProps.showMenu !== true) {
      this.setState({
        snapshot: state,
      });
    }
  }

  render() {
    const {classes, showMenu} = this.props;
    let targetId =  this.state.snapshot.mapMode.targetId;
    let valid = targetId in this.state.snapshot.markers;
    return ( showMenu?
      <Drawer
        classes={{paper: clsx(classes.drawerPaper, !showMenu && classes.drawerPaperClose)}}
        variant="persistent"
        anchor="right"
        open={showMenu}>
        <div className={classes.toolbarSpacer} />
          { !this.state.snapshot.mapMode.worldView?
            ( <TrackingMenu 
                id={targetId}
                ttl={valid? this.state.snapshot.markers[targetId].ttl: "0"}
                topic={valid? this.state.snapshot.markers[targetId].topic: "Inactive"}
                long={valid? this.state.snapshot.markers[targetId].long.toFixed(4) + "°": "-"}
                lat={valid? this.state.snapshot.markers[targetId].lat.toFixed(4) + "°": "-"}
                speed={valid? this.state.snapshot.markers[targetId].speed.toFixed(2) + " km/h": "-"}
                heading={valid? this.state.snapshot.markers[targetId].heading.toFixed(1) + "°": "-"}
                handleStopButtonClick={this.handleStopButtonClick}
              />) : null }
        <List dense style={{position: "relative", overflow:"auto", backgroundColor: "white", padding: "0px"}}>
          <MessageMenuHeader refresh={this.refresh} />
          { Object.keys(this.state.snapshot.markers).length > 0 
              ? Object.keys(this.state.snapshot.markers).map(key => ( 
                <MessageItem 
                  key={key} 
                  id={key}
                  selected={key === this.state.selected}
                  worldView={this.state.snapshot.mapMode.worldView} 
                  itemClick={this.handleItemClick}
                  buttonClick={this.handleButtonClick}
                  msgType={this.state.snapshot.markers[key].msgType} 
                  topic={this.state.snapshot.markers[key].topic} />))
              : <EmptyItem /> }
        </List>
      </Drawer>: null)
  }
}
MessageMenu.contextType = SettingContext;
export default withStyles(styles)(MessageMenu);