import React, {Component} from 'react';

import { SettingContextProvider } from "./Components/Store";
import Header from "./Components/Header";
import DrawerMenu from "./Components/Menu"
import { withStyles } from '@material-ui/core'
import { Route, Switch } from 'react-router-dom';

import Settings from './Components/Setting'
import Map from './Components/Map'

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  static getDrawerWidth() {
    return 240;
  }

  handleMenuToggle = () => {
    this.setState(prevState => ({
      showMenu: !prevState.showMenu,
    }));
  }

  render() {
    const {classes} = this.props;
    return (
      <SettingContextProvider>
        <div className={classes.root}>
          <Header onClick={this.handleMenuToggle} showMenu={this.state.showMenu} drawerWidth={App.getDrawerWidth()} />
          <DrawerMenu onClick={this.handleMenuToggle} showMenu={this.state.showMenu} drawerWidth={App.getDrawerWidth()} />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Switch>
              <Route path="/" component={Map} exact />
              <Route path="/settings" component={Settings} />
            </Switch>
          </main>
        </div>
      </SettingContextProvider>
    )
  }
}

export default withStyles(styles)(App);
