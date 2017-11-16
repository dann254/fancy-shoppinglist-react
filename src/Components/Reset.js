import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import NavHome from './Navhome';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { password:'', cpassword:'', success: false, failure: false, message: '', errors: { password:'', cpassword:'' } };
  }
  onInputChange = (evt) => {
    evt.preventDefault();
    let fields = {};
    fields[evt.target.name] = evt.target.value;
    this.setState(fields);
    this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: "" },});
    var error = '';
    error = this.validate(fields)
    if (error) {
        return this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: error },});
    }
  }
  validate = (fields) => {
      var error = '';
      if (fields.password) {
        var psw = fields.password
        if (psw.length < 6) {
            error = "password should not be less than 6 characters long.";
            return error;
        }
        if (this.state.cpassword !== '' && psw !== this.state.cpassword) {
          error = "passwords do not match";
          return error;
        }
        // if (psw === this.state.cpassword) {
        //   this.setState({ errors: { ...this.state.errors, [cpassword]:'', ...this.state.errors, [password]:''}})
        // }
      }
      if (fields.cpassword) {
        var psw2 = fields.cpassword
        if (psw2 !== this.state.password) {
            error = "passwords do not match";
            return error;
        }
      }
  }
  handleSubmit=(evt)=> {
    evt.preventDefault();
    if (this.state.errors.password !== '' || this.state.errors.cpassword !== '') {
      toast.error("Please enter valid values for each field")
    }else{
      this.resetPassword( this.props.match.params.token, this.state.password)
    }
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
        self.setState({ success: true, message:response.data.message })
        return response.data;
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            toast.error(error.response.data.message)
            self.setState({ failure: true, message: error.response.data.message })
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
  }
  render() {
    if (this.state.success) {
      return (
        <div className="">
          <NavHome />
          <ToastContainer hideProgressBar={true} />
          <Redirect push to={{
            pathname: '/login/',
            state : {msg:this.state.message}
          }}/>
        </div>
      );
    }
    if (this.state.failure) {
      if (this.state.message === 'Invalid token.' || !this.state.message) {
        return (
          <div className="">
            <NavHome />
            <ToastContainer hideProgressBar={true} />
            <div className="f-success">
            <h2 className="f-big">Error!!</h2>
              <h3 className="f-info">Invalid link please click below to resend reset link.</h3>
              <h4><a href="/forgot_password/" className="f-link">Resend reset link</a></h4>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="">
        <NavHome />
        <ToastContainer hideProgressBar={true} />
        <div className="col-lg-12 pre-forms">
            <h2 className="text-center f-head">Reset password</h2>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
              <label className="f-label"> New password: <span className="text-err">{ this.state.errors.password }</span></label>
              <input type="password" className={this.state.errors.password ? "form-control f-error":"form-control" } name="password" value={this.state.password} onInput={this.onInputChange} placeholder="New password" required /><br />
              <label className="f-label"> Confirm new password: <span className="text-err">{ this.state.errors.cpassword }</span></label>
              <input type="password" className={this.state.errors.cpassword ? "form-control f-error":"form-control" } name="cpassword" value={this.state.cpassword} onInput={this.onInputChange} placeholder="Confirm new password" required /><br />
              <input type="submit" value="Submit" className="btn btn-primary btn-lg btn-block f-submit" />

          </div>
        </form>
      </div>
      </div>
    );
  }
}

export default ResetPassword;
