import * as actionTypes from './actionTypes';

export const clearMarkers = () => {
    return {
        type: actionTypes.CLEAR_MARKERS
    };
}

export const updateSPAT = (spat) => {
    return {
        type: actionTypes.UPDATE_SPAT,
        payload: spat
    };
}

export const updateSignals = (signals) => {
    return {
        type: actionTypes.UPDATE_SIGNALS,
        payload: signals
    };
}

export const updateMarkers = (markers) => {
    return {
        type: actionTypes.UPDATE_MARKER,
        payload: markers
    };
}

export const addHistory = (history) => {
    return {
        type: actionTypes.ADD_HISTORY,
        payload: history
    };
}

export const updateNotification = (updates) => {
    return  {
        type: actionTypes.UPDATE_NOTIFICATION,
        payload: updates
    };
}

export const setNotification = (message, listen) => {
    return {
        type: actionTypes.SET_NOTIFICATION,
        payload: {
            newMessages: message, 
            listen: listen
        } 
    };
}

export const restoreState = (restoredState) => {
    return {
        type: actionTypes.RESTORE_STATE,
        payload: restoredState
    };
}

export const setMapView = (view) => {
    return {
        type: actionTypes.SET_MAPVIEW,
        payload: view
    };
}

export const setMapMode = (target, tracking) => {
    return {
        type: actionTypes.SET_MAPMODE,
        payload: {
            tracking: tracking,
            targetId: target,
        }
    }
}

export const handleClearHistory = () => {
    return {
        type: actionTypes.CLEAR_HISTORY
    };
};

export const addError = (msg) => {
    return  {
        type: actionTypes.ADD_ERROR,
        payload: msg
    };
}

export const handleErrorClose = () => {
    return {
        type: actionTypes.REMOVE_ERROR
    };
}

export const handleErrorExit = () => {
    return {
        type: actionTypes.PROCESS_ERROR
    };
}

export const messageSettingToggle = (setting) => {
    return {
        type: actionTypes.MSG_MENU_TOGGLE,
        payload: setting
    };
}

export const displaySettingToggle = (setting) => {
    return {
        type: actionTypes.DISPLAY_MENU_TOGGLE,
        payload: setting
    };
}

export const setAnimation = (on) => {
    return {
        type: actionTypes.SET_ANIMATION,
        payload: on
    };
}

export const pauseAnimation = (onNow, time) => {
    return (dispatch) => {
        if (onNow) dispatch(setAnimation(false));
        setTimeout(() => {
            dispatch(setAnimation(true));
        }, time)
    };
}