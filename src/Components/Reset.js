import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import NavHome from './Navhome';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { password:'', cpassword:'', success: false, failure: false, message: '' };
    this.emailVerify = this.resetPassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  onInputChange(evt) {
      evt.preventDefault();
      let fields = {};
      fields[evt.target.name] = evt.target.value;
      this.setState(fields);
  }
  handleSubmit(evt) {
    evt.preventDefault();
    this.resetPassword( this.props.match.params.token, this.state.password)
  }
  resetPassword(token, password) {
    var self = this;
    var data = { "password": password }
    const url = 'https://fancy-shoppinglist-api.herokuapp.com/auth/reset_password/' + token;
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
        self.setState({ success: true })
        return response.data;
    }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            toast.error(error.response.data.message)
            self.setState({ failure: true, message: error.response.data.message })
        } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
  }
  render() {
    if (this.state.success) {
      return (
        <div>
          <NavHome />
          <ToastContainer hideProgressBar={true} />
          <Redirect to="/login/" />
        </div>
      );
    }
    if (this.state.failure) {
      if (this.state.message === 'Invalid token.') {
        return (
          <div>
            <NavHome />
            <ToastContainer hideProgressBar={true} />
            <h3>Invalid link please click below to resend reset link</h3>
            <a href="/forgot_password/">Resend reset link</a>
          </div>
        );
      }
    }
    return (
      <div className="">
        <NavHome />
        <ToastContainer hideProgressBar={true} />
        <div className="col-lg-12">
            <h2 className="text-info">Reset password</h2>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
              <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.onInputChange} placeholder="New password" required /><br />
              <input type="password" className="form-control" name="cpassword" value={this.state.cpassword} onChange={this.onInputChange} placeholder="Confirm new password" required /><br />
              <input type="submit" value="Submit" className="btn btn-primary btn-lg btn-block" />

          </div>
        </form>
      </div>
      </div>
    );
  }
}

export default ResetPassword;
