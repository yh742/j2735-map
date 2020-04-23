import clsx from 'clsx';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';

import styles from './Style/styles';
import EmptyItem from './EmptyItem/EmptyItem';
import MessageItem from './MessagetItem/MessageItem';
import MessageMenuHeader from './MessageMenuHeader/MessageMenuHeader';
import * as actionCreators from '../../store/actions/actions';
import { DecodeTopicType } from '../Helper/Utility';

class MessageMenu extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  // forceUpdate skips shouldComponentUpdate
  refresh = () => {
    this.forceUpdate();
  }

  handleItemClick = (key) => {
    // check if key still exists in current markers
    if (!(key in this.props.markers)) {
      this.setState({ selected: null });
      this.props.addError(`Marker "${key}" doesn't exist on map anymore!`);
      return;
    }
    if (this.state.selected === key) {
      // de-select menu item and take off highlight marker
      this.setState({ selected: null });
      this.props.setMapMode(null, true);
    } else {
      // (1) highlight marker on menu UI
      // (2) set the map to the location of the marker
      // (3) set map to target marker ID
      this.setState({ selected: key });
      this.props.pauseAnimation(this.props.animationIcons, 300);
      this.props.setMapView({
        longitude: this.props.markers[key].long, 
        latitude: this.props.markers[key].lat,
        zoom: 19
      });
      this.props.setMapMode(key, true);
    }
  }

  // only re-render component when menu is first opened
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.showMenu !== nextProps.showMenu ||
      this.state.selected !== nextState.selected;
  }

  render() {
    const {classes, showMenu, markers} = this.props;
    return (
      <Drawer
        classes={{paper: clsx(classes.drawerPaper, !showMenu && classes.drawerPaperClose)}}
        variant="persistent"
        anchor="right"
        open={showMenu}>
        <div className={classes.toolbarSpacer} />
        <List dense classes={{root: classes.menuList}}>
          <MessageMenuHeader refresh={this.refresh} />
          { Object.keys(markers).length > 0 
              ? Object.keys(markers).map(key => ( 
                <MessageItem 
                  key={key} 
                  id={key}
                  selected={key === this.state.selected}
                  itemClick={() => this.handleItemClick(key)}
                  msgType={markers[key].msgType} 
                  source={DecodeTopicType(markers[key].topic)} />))
              : <EmptyItem /> }
        </List>
      </Drawer>
    );
  }
}

const mapStateToProps = state => {
  return {
    markers: state.markers,
    animationIcons: state.animateIcons
  };
};

const mapDispatchToProps = dispatch => {
  return {
      pauseAnimation: (onNow, time) => dispatch(actionCreators.pauseAnimation(onNow, time)),
      addError: (msg) => dispatch(actionCreators.addError(msg)),
      setMapView: (view) => dispatch(actionCreators.setMapView(view)),
      setMapMode: (target, mapView) => dispatch(actionCreators.setMapMode(target, mapView))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MessageMenu));