import React, { Component } from 'react';
import NavHome from './Navhome';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Register extends Component {
  constructor(props) {
        super(props);
        this.state = { username: '', email: '', password: '', cpassword: '', errors: '', success: false };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.validate = this.validate.bind(this);
    }

    onInputChange(evt) {
        evt.preventDefault();
        let fields = {};
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
    }
    handleSubmit(evt) {
        evt.preventDefault();
        var errors = '';
        errors = this.validate(this.state.username, this.state.email, this.state.password, this.state.cpassword)
        if (errors) {
            toast.error(errors)
            return this.setState({ errors })
        }
        this.sendRequest(this.state.email, this.state.username, this.state.password);

        //this.setState({ username: '', email: '', password: '', cpassword: '' });
    }
    validate(username, email, password, cpassword) {
        var errors = '';
        if (password !== cpassword) {
            errors = "Password mismatch";
            return errors;
        }
        // Regular expression to check for special characters
        var re = /[a-z]|[A-Z]|[0-9]|_/;
        // console.log(re.test(username))
        if (!re.test(username)) {
            errors = "Username cannot have special characters";
            return errors;
        }
    }
    sendRequest(email, username, password) {
      var self =this;
        var data = { "email": email, "username": username, "password": password }
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = 'https://fancy-shoppinglist-api.herokuapp.com/auth/register/';
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
    //setInterval(() => {
      if (this.state.success) {
        return (
          <div>
          <NavHome />
          <ToastContainer hideProgressBar={true} />
            you registered successfully confirm your email to continue. <br />
            <i>confirmation link sent to <b>{this.state.email}</b></i> <br /> <br />
            did not receive email? <a href="/resend_confrimation/">Resend confirmation</a>
          </div>
        );
      }
    //}, 1000);

    return (
      <div className="">
      <NavHome />
      <ToastContainer hideProgressBar={true} />
        <div className="col-lg-12">
            <h2 className="text-info">Signup</h2>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
              <input type="text" className="form-control" name="username" value={this.state.username} onChange={this.onInputChange} placeholder="Username" required /><br />
              <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.onInputChange} placeholder="email" required /><br />
              <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.onInputChange} placeholder="Password" required /><br />
              <input type="password" className="form-control" name="cpassword" value={this.state.cpassword} onChange={this.onInputChange} placeholder="Confirm Password" required /><br />
              <input type="submit" value="Submit" className="btn btn-primary btn-lg btn-block" />

          </div>
        </form>
      </div>
      </div>
    );
  }
}

export default Register;
