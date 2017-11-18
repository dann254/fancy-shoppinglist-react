import React, { Component } from 'react';
import NavHome from './Navhome';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Login extends Component {
  constructor(props) {
        super(props);
        this.state = { username: '', password: '', errors:  { username: '', password:'' }, redirect: false, failure:false, message:'' };
    }
    componentDidMount=() => {
      try {
        if (this.props.location.state.msg) {
          toast.success(this.props.location.state.msg)
        }
      } catch (e) {

      }
    }
    onInputChange=(evt) => {
      evt.preventDefault();
      let fields = {};
      fields[evt.target.name] = evt.target.value;
      this.setState(fields);
      this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: "" },});
      var errors = '';
      errors = this.validate(fields)
      if (errors) {
          return this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: errors },});
      }
    }
    validate=(fields)=> {
      var errors = '';
      // username validation
      if (fields.username) {
        var usn = fields.username
        if (usn.length < 3) {
            errors = "username should be three or more characters long";
            return errors;
        }
        if (usn.length > 30) {
            errors = "username too long";
            return errors;
        }
        // Regular expression to validate username
        var re = /^[a-z0-9_]+$/;
        if (!usn.match(re)) {
            errors = "invalid username";
            return errors;
        }
      }
      if (fields.password) {
        var psw = fields.password
        if (psw.length < 6) {
            errors = "password should not be less than 6 characters long.";
            return errors;
        }
      }
    }
    handleSubmit=(evt)=> {
        evt.preventDefault();
        this.sendRequest(this.state.username, this.state.password);

    }
    sendRequest(username, password) {
        var self=this;
        var data = { "username": username, "password": password }
        const url = 'https://fancy-shoppinglist-api.herokuapp.com/auth/login/';
        axios({
            method: "post",
            url: url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        }).then(function (response) {
            if (!response.statusText === 'OK') {
                toast.error(response.data.message)
            }
            console.log(response.data);
            toast.success(response.data.message);
            window.localStorage.setItem('token', response.data.access_token);
            self.setState({ redirect: true, message:response.data.message })
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                self.setState({ failure: true, message:error.response.data.message })
                toast.error(error.response.data.message)
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
  render() {
    if (this.state.redirect) {
      return <Redirect push to={{
        pathname: '/dashboard/',
        state : {msg:this.state.message}
      }}/>
    }
    let notice = null;
    if (this.state.failure && this.state.message === "please verify your email before logging in") {
        notice = <div className="i-c"><div className="i-container col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">Click here to verify your email <a href="/resend_confirmation/" className="btn btn-md i-submit">Verify</a></div></div>
    }
    if (this.state.failure && this.state.message === "Invalid username or password") {
        notice = <div className="i-c"><div className="i-container col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">Dont have an account? <a href="/register/" className="btn btn-md i-submit">Sign Up</a></div></div>
    }
    try {
      if (this.props.location.state.msg === 'Your session expired. Please login to continue') {
        notice = <div className="i-c"><div className="i-container col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">You have been logged out please login to continue.</div></div>
      }
    } catch (e) {

    }
    return (
      <div className="">
      <NavHome />
      <ToastContainer hideProgressBar={true} />
      {notice}<br /><br />
      <div className="col-lg-12 login pre-forms">
          <h2 className="text-center f-head">Login</h2>
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
            <label className="f-label"> Username</label>
            <input type="text" className={this.state.errors.username ? "form-control f-error":"form-control" } name="username" value={this.state.username} onInput={this.onInputChange} placeholder="Username" required /><br />
            <label className="f-label"> Password</label>
            <input type="password" className={this.state.errors.password ? "form-control f-error":"form-control" } name="password" value={this.state.password} onInput={this.onInputChange} placeholder="Password" required /><br />
            <input type="submit" value="Login" className="btn btn-primary btn-lg btn-block f-submit" />

            <h4 className=""><a href="/forgot_password/" className="f-link">Forgot password?</a></h4>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
