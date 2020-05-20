import initialStates from './initialStates';
import * as actionTypes from '../actions/actionTypes';

const updateTTL = (markers) => {
    let updatedTTL = {};
    for (const key in markers) {
        if (markers[key].ttl - 1 !== 0) {
            updatedTTL[key] = {
                ...markers[key],
                ttl: markers[key].ttl - 1,
            }
        }   
    }
    return updatedTTL;
}

const reducer = (state = initialStates, action) => {
    switch (action.type) {
        // case actionTypes.UPDATE_SPAT:
        //     return {
        //         ...state,
        //         spat: {
        //             ...state.spat,
        //             ...action.payload
        //         }
        //     };
        case actionTypes.UPDATE_SIGNALS:
            return {
                ...state,
                signals: {
                    ...updateTTL(state.signals),
                    ...action.payload
                }
            };
        case actionTypes.CLEAR_MARKERS:
            return  {
                ...state,
                markers: {}
            };
        case actionTypes.UPDATE_MARKER:
            //let updatedTTL = {};
            // for (const key in state.markers) {
            //     if (state.markers[key].ttl - 1 !== 0) {
            //         updatedTTL[key] = {
            //             ...state.markers[key],
            //             ttl: state.markers[key].ttl - 1,
            //         }
            //     }   
            // }
            return {
                ...state,
                markers: {
                    ...updateTTL(state.markers),
                    ...action.payload
                }
            };
        case actionTypes.ADD_HISTORY:
            // (1) filter out duplicate searches (2) limit history items to 8
            let filtered = state.history.filter(item => item.id !== action.payload.id).slice(0,7);
            return {
                ...state,
                history: [action.payload, ...filtered]
            };
        case actionTypes.UPDATE_NOTIFICATION:
            let count = action.payload.filter(key=> !(key in state.markers)).length;
            if (state.notification.listen){ 
                return {
                    ...state,
                    notification: {
                        ...state.notification,
                        newMessages: state.notification.newMessages + count,
                    }
                };
            } else {
                return state;
            }
        case actionTypes.SET_NOTIFICATION:
            return {
                ...state,
                notification: {
                    ...state.notification,
                    ...action.payload
                }
            };
        case actionTypes.RESTORE_STATE:
            return {
                ...initialStates,
                ...action.payload
            };
        case actionTypes.SET_MAPMODE:
            return {
                ...state,
                mapMode: {
                    ...state.mapMode,
                    ...action.payload
                }
            };
        case actionTypes.SET_MAPVIEW:
            return {
                ...state,
                mapView: {
                    ...state.mapView,
                    ...action.payload,
                }
            };
        case actionTypes.SET_ANIMATION:
            return {
                ...state,
                animateIcons: action.payload,
            }
        case actionTypes.MSG_MENU_TOGGLE:
            return {
                ...state,
                messageSettings: {
                    ...state.messageSettings,
                    [action.payload]: !state.messageSettings[action.payload]
                }
            };
        case actionTypes.DISPLAY_MENU_TOGGLE:
            return {
                ...state,
                displaySettings: {
                    ...state.displaySettings,
                    [action.payload]: !state.displaySettings[action.payload]
                }
            };
        case actionTypes.CLEAR_HISTORY:
            return {
                ...state,
                history: []
            };
        case actionTypes.ADD_ERROR:
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
        case actionTypes.PROCESS_ERROR:
            return  {
                ...state,
                error: {
                    message: state.error.queue.length > 0? state.error.queue[0]: "",
                    queue: state.error.queue.slice(1),
                }
            };
        case actionTypes.REMOVE_ERROR:
            return {
                ...state,
                error: {
                    ...state.error,
                    message: "",
                }
            }
        default: 
            return state;
    }
};

export default reducer;

