import React, { useReducer, createContext } from 'react';
// import * as cloneDeep from 'lodash/cloneDeep';

export const SettingContext = createContext();

export const SettingActions = {
    menuToggle: "DISPLAY_MENU_TOGGLE",
    addHistory: "ADD_SEARCH_HISTORY",
    setMapView: "SET_MAP_VIEW",
    setState: "SET_STATE",
    restoreState: "RESTORE_STATE",
    clearHistory: "CLEAR_HISTORY",
    updateMarker: "UPDATE_MARKER",
    incrementNotification: "INC_NOTIFICATION",
    setNotification: "SET_NOTIFICATION",
    setAnimation: "SET_ANIMATION",
    setMapMode: "SET_MAP_MODE",
    addError: "ADD_ERROR",
    removeError: "REMOVE_ERROR",
    processError: "PROCESS_ERROR",
}

const schema = {
    intNotification: value => typeof value === 'boolean',
    vehPopup: value => typeof value === 'boolean',
    stNames: value => typeof value === 'boolean',
    trajectories: value => typeof value === 'boolean',
    sigDebug: value => typeof value === 'boolean',
    metric: value => typeof value === 'boolean',
    enableBSM: value => typeof value === 'boolean',
    enablePSM: value => typeof value === 'boolean',
    enableSPaT: value => typeof value === 'boolean',
    history: value => Array.isArray(value),
    mapView: value => typeof value === 'object',
    markers: value => typeof value === 'object',
};

const initialState = {
    intNotification: true,
    vehPopup: true,
    stNames: true,
    trajectories: false,
    sigDebug: false,
    metric: false,
    enableBSM: true,
    enablePSM: true,
    enableSPaT: true,
    history: [],
    mapView: {
        latitude: 0,
        longitude: 0,
        zoom: 12,
        bearing: 0,
        pitch: 0
    },
    markers: {},
    notification: {
        newMessages: 0,
        listen: true,
    },
    animateIcons: true,
    mapMode: {
        worldView: true,
        targetId: null,
    },
    error: {
        message: "",
        queue: [],
    },
};

export const ValidateSettings = (obj) =>
    Object.keys(schema)
        .filter(key=> !schema[key](obj[key]))
        .length === 0

const reducer = (state, action) => {
    switch (action.type) {
        case SettingActions.menuToggle:
            console.log(SettingActions.addHistory, state[action.payload], !state[action.payload])
            return {
                ...state,
                [action.payload]: !state[action.payload]
            };
        case SettingActions.addHistory:
            console.log(SettingActions.addHistory, state.history, action.payload);
            // (1) filter out duplicate searches (2) limit history items to 8
            let filtered = state.history.filter(item => item.id !== action.payload.id).slice(0,7);
            return {
                ...state,
                history: [action.payload, ...filtered]
            };
        case SettingActions.clearHistory:
            return {
                ...state,
                history: []
            }
        case SettingActions.incrementNotification:
            if (state.notification.listen){ 
                return {
                    ...state,
                    notification: {
                        ...state.notification,
                        newMessages: state.notification.newMessages + action.payload,
                    }
                }
            } else {
                return {
                    ...state
                }
            }
        case SettingActions.setNotification:
            return {
                ...state,
                notification: {
                    ...state.notification,
                    ...action.payload
                }
            }
        case SettingActions.setMapView:
            return {
                ...state,
                mapView: {
                    ...state.mapView,
                    ...action.payload,
                }
            }
        case SettingActions.updateMarker:
            // if (!state.mapMode.worldView && state.mapMode.targetId in state.markers) {
            //     return {
            //         ...state,
            //         mapView: {
            //             ...state.mapView,
            //             latitude: state.markers[state.mapMode.targetId].lat,
            //             longitude: state.markers[state.mapMode.targetId].long,
            //             zoom: 19.5,
            //             transitionDuration: window.production.animate,
            //             //bearing: state.markers[state.mapMode.targetId].heading,
            //             pitch: 0
            //         },
            //         notification: {
            //             ...state.notification,
            //             newMessages: state.notification.newMessages + count,
            //         },
            //         markers: {
            //             ...temp,
            //             ...action.payload
            //         }
            //     }
            // }
            let updatedTTL = {};
            for (const key in state.markers) {
                if (state.markers[key].ttl - 1 !== 0) {
                    updatedTTL[key] = {
                        ...state.markers[key],
                        ttl: state.markers[key].ttl - 1,
                    }
                }   
            }
            return {
                ...state,
                markers: {
                    ...updatedTTL,
                    ...action.payload
                }
            }
        case SettingActions.restoreState:
            let settings = localStorage.getItem("lastSettingState");
            console.log("retrieved from local storage", settings);
            try {
                let settingObj = JSON.parse(settings);
                if (ValidateSettings(settingObj)) {
                    // only restore these fields, otherwise mapbox crashes
                    const {
                        latitude, longitude, zoom, bearing, pitch
                    } = settingObj.mapView
                    return {
                        ...settingObj,
                        markers: {},
                        notification: {
                            newMessages: 0,
                            listen: true
                        },
                        mapMode: {
                            worldView: true,
                            targetId: null,
                        },
                        mapView: {
                            latitude: latitude,
                            longitude: longitude,
                            zoom: zoom,
                            bearing: bearing,
                            pitch: pitch
                        },
                        error: {
                            message: "",
                            queue: [],
                        },
                    }
                } else {
                    console.log("ERROR: cannot set object")
                } 
            } catch (e) {
              // swallow this error, just use default location
              console.log("ERROR: unable to parse json string from local storage");  
            }
            return state
        case SettingActions.setAnimation:
            return {
                ...state,
                animateIcons: action.payload,
            }
        case SettingActions.setMapMode:
            return {
                ...state,
                mapMode: {
                    ...state.mapMode,
                    ...action.payload,
                }
            }
        case SettingActions.addError:
            console.log(state.error, action.payload);
            if (state.error.message === "") {
                return {
                    ...state,
                    error: {
                        ...state.error,
                        message: action.payload,
                    }
                }
            } else {
                return {
                    ...state,
                    error: {
                        ...state.error,
                        queue: [...state.error.queue, action.payload] 
                    }
                }
            }
        case SettingActions.processError:
            return  {
                ...state,
                error: {
                    message: state.error.queue.length > 0? state.error.queue[0]: "",
                    queue: state.error.queue.slice(1),
                }
            }
        case SettingActions.removeError: 
            return {
                ...state,
                error: {
                    ...state.error,
                    message: "",
                }
            }
        default:
            return state
    }
}

export const SettingContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <SettingContext.Provider value={[state, dispatch]}>
            {props.children}
        </SettingContext.Provider>
    );
}