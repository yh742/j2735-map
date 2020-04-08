import React, {Component} from 'react';

import { MenuContextProvider } from "./Components/Store";
import Header from "./Components/Header";
import DrawerMenu from "./Components/MenuSetting/Drawer/DrawerMenu"

class App extends Component {
  render() {
    return (
      <MenuContextProvider>
        <Header></Header>
        <DrawerMenu></DrawerMenu>
      </MenuContextProvider>
    )
  }
}

export default App;
