import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';

import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Rcon from './Components/resend_confirmation';
import Verify from './Components/Verify';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        {
          // App entry point
        }
        <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route path="/register/" component={Register} />
        <Route path="/login/" component={Login} />
        <Route path="/resend_confrimation/" component={Rcon} />
        <Route path="/verify/" component={Verify} />
        </Switch>
      </div>
    );
  }
}
export default App;
