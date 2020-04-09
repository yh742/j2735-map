import React, { useReducer, createContext } from "react";

export const SettingContext = createContext();

export const SettingActions = {
    menuToggle: "DISPLAY_MENU_TOGGLE",
}

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
};

const reducer = (state, action) => {
    switch (action.type) {
        case SettingActions.menuToggle:
            console.log({[action.payload]: !state[action.payload]})
            return {
                ...state,
                [action.payload]: !state[action.payload]
            };
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