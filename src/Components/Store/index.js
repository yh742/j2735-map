import React, { useReducer, createContext } from 'react';

import * as cloneDeep from 'lodash/cloneDeep';

export const SettingContext = createContext();

export const SettingActions = {
    menuToggle: "DISPLAY_MENU_TOGGLE",
    addHistory: "ADD_SEARCH_HISTORY",
    setMapView: "SET_MAP_VIEW",
    setState: "SET_STATE",
    restoreState: "RESTORE_STATE",
    clearHistory: "CLEAR_HISTORY",
    addMarker: "ADD_MARKER",
    clearNotification: "CLEAR_NOTIFICATION",
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
    newMessages: 0,
    markers: {},
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
            // (1) move duplicate searches to top (2) limit history items to 8
            let filtered = state.history.filter(item => item.id !== action.payload.id).slice(0,7);
            return {
                ...state,
                history: [action.payload, ...cloneDeep(filtered)]
            };
        case SettingActions.clearHistory:
            return {
                ...state,
                history: []
            }
        case SettingActions.clearNotification:
            return {
                ...state,
                newMessages: 0,
            }
        case SettingActions.setMapView:
            return {
                ...state,
                mapView: {
                    ...state.mapView,
                    ...action.payload,
                }
            }
        case SettingActions.addMarker:
            let count = Object.keys(action.payload).filter(key=> !(key in state.markers)).length;
            return {
                ...state,
                newMessages: state.newMessages + count,
                markers: {
                    ...state.markers,
                    ...action.payload,
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
                        mapView: {
                            latitude: latitude,
                            longitude: longitude,
                            zoom: zoom,
                            bearing: bearing,
                            pitch: pitch
                        }
                    }
                } else {
                    console.log("ERROR: cannot set object")
                } 
            } catch (e) {
              // swallow this error, just use default location
              console.log("ERROR: unable to parse json string from local storage");  
            }
            return {
                ...state
            }
        default:
            return {
                ...state
            }
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