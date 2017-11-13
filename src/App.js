import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';

import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Rcon from './Components/resend_confirmation';
import VerifyEmail from './Components/Verify';
import ForgotPassword from './Components/Forgotpassword';
import ResetPassword from './Components/Reset';
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
        <Route path="/resend_confirmation/" component={Rcon} />
        <Route path="/verify/:token" component={VerifyEmail} />
        <Route path="/forgot_password/" component={ForgotPassword} />
        <Route path="/auth/reset_password/:token" component={ResetPassword} />
        </Switch>
      </div>
    );
  }
}
export default App;
