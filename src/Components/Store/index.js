import React, { useReducer, createContext } from "react";

export const MenuContext = createContext();

const initialState = {
    currentView: "",
}

const reducer = (state, action) => {
    switch (action.type) {
        case "MENU_TOGGLE":
            return {
                currentView: action.payload
            };
    }
}

export const MenuContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <MenuContext.Provider value={[state, dispatch]}>
            {props.children}
        </MenuContext.Provider>
    );
}