// import React from 'react';


// import List from '@material-ui/core/List';
// import Button from '@material-ui/core/Button';
// import Divider from '@material-ui/core/Divider';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import { makeStyles } from '@material-ui/core';

// const useStyles = makeStyles((theme) => ({
//     listStartEntry: {
//         [theme.breakpoints.up('sm')]: {
//           paddingLeft: theme.spacing(1),
//         },
//       },
//     wordWrap: { 
//         wordWrap: "break-word", 
//         whiteSpace: "normal" 
//     },
// }));

// export default React.memo(({ id, ttl, topic, long, lat, speed, heading, handleStopButtonClick }) => {
//     const classes = useStyles();
//     return (
//         <List>
//             <ListItem>
//                 <ListItemText className={classes.listStartEntry} primary={id} secondary="Identifier" />
//                 <ListItemText primary={ttl} secondary="Time To Live" />
//             </ListItem>
//             <ListItem>
//                 <ListItemText 
//                     className={classes.listStartEntry}
//                     classes={{ primary: classes.wordWrap }}
//                     primary={topic}
//                     secondary="Message Source Topic" />
//             </ListItem>
//             <ListItem>
//                 <ListItemText 
//                     className={classes.listStartEntry}
//                     primary={long}
//                     secondary="Longitude" />
//                 <ListItemText 
//                     primary={lat}
//                     secondary="Latitude" />
//             </ListItem>
//             <ListItem>
//                 <ListItemText 
//                     className={classes.listStartEntry}
//                     primary={speed}
//                     secondary="Speed" />
//                 <ListItemText 
//                     primary={heading}
//                     secondary="Heading" />
//             </ListItem>
//             <ListItem alignItems='center'> 
//             <Button 
//                 onClick={handleStopButtonClick} 
//                 variant="contained"
//                 size="small" 
//                 color="secondary"
//                 style={{margin: "auto"}}>Stop Tracking</Button>
//             </ListItem>
//             <div style={{padding: "8px"}}></div>
//             <Divider />
//         </List>)
// });


// { !mapMode.worldView?
//     ( <TrackingMenu 
//         id={targetId}
//         ttl={valid? markers[targetId].ttl: "0"}
//         topic={valid? markers[targetId].topic: "Inactive"}
//         long={valid? markers[targetId].long.toFixed(4) + "°": "-"}
//         lat={valid? markers[targetId].lat.toFixed(4) + "°": "-"}
//         speed={valid? markers[targetId].speed.toFixed(2) + " km/h": "-"}
//         heading={valid? markers[targetId].heading.toFixed(1) + "°": "-"}
//         handleStopButtonClick={this.handleStopButtonClick}
//       />) : null }


// handleButtonClick = (event, id) => {
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
  // }
  
  // handleStopButtonClick = () => {
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
  // }

