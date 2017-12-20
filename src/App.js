import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';

import Register from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Rcon from './Components/resend_confirmation';
import VerifyEmail from './Components/Verify';
import ForgotPassword from './Components/Forgotpassword';
import ResetPassword from './Components/Reset';
import Dashboard from './Components/dashboard';
import Items from './Components/Items';
import BuddyItems from './Components/BuddyItems';
import Profile from './Components/profile';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="null">
        <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route path="/register/" component={Register} />
        <Route path="/login/" component={Login} />
        <Route path="/resend_confirmation/" component={Rcon} />
        <Route path="/verify/:token" component={VerifyEmail} />
        <Route path="/forgot_password/" component={ForgotPassword} />
        <Route path="/auth/reset_password/:token" component={ResetPassword} />
        <Route exact path="/dashboard/" component={Dashboard} />
        <Route exact path="/dashboard/shoppinglist/:id/items" component={Items} />
        <Route exact path="/dashboard/buddy_shoppinglist/:id" component={BuddyItems} />
        <Route path="/user/" component={Profile} />
        </Switch>
      </div>
    );
  }
}
export default App;
