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
                ...cloneDeep(state),
                [action.payload]: !state[action.payload]
            };
        case SettingActions.addHistory:
            console.log(SettingActions.addHistory, state.history, action.payload);
            // limit history items to 10
            let filtered = state.history.filter(item => item.id !== action.payload.id).slice(0,9);
            return {
                ...cloneDeep(state),
                history: [action.payload, ...cloneDeep(filtered)]
            };
        case SettingActions.clearHistory:
            return {
                ...cloneDeep(state),
                history: []
            }
        case SettingActions.setMapView:
            return {
                ...cloneDeep(state),
                mapView: {
                    ...state.mapView,
                    ...action.payload,
                }
            }
        case SettingActions.restoreState:
            let settings = localStorage.getItem("lastSettingState");
            console.log("retrieved from local storage", settings);
            try {
                let settingObj = JSON.parse(settings);
                if (ValidateSettings(settingObj)) {
                    const {
                        latitude, longitude, zoom, bearing, pitch
                    } = settingObj.mapView
                    return {
                        ...settingObj,
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
                ...initialState
            }
        default:
            break;
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