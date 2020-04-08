import React, {useContext} from 'react';

import { Drawer } from '@material-ui/core/';
import { MenuContext } from "../../Store"

export default function DrawerMenu(props) {
    const [ state, dispatch ] = useContext(MenuContext);
    const openMenu = menuItem => {
        dispatch({
          type: "MENU_TOGGLE",
          payload: menuItem
        });
      }
    return (
        <Drawer anchor={"right"} open={state.currentView? true: false} onClose={()=>openMenu("")}>
            {props.children}
        </Drawer>
    );
}