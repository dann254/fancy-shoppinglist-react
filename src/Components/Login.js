import React, { Component } from "react";
import NavHome from "./Navhome";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as api from "./API_URLS";

class Login extends Component {
  constructor(props) {
    super(props);
    // initialize state
    this.state = {
      username: "",
      password: "",
      errors: { username: "", password: "" },
      redirect: false,
      failure: false,
      message: "",
      submitted: false
    };
  }

  // check if there is a saved token.
  componentDidMount = () => {
    try {
      if (this.props.location.state.msg) {
        toast.success(this.props.location.state.msg);
      }
    } catch (e) {}
  };

  // verify and save user input
  onInputChange = evt => {
    evt.preventDefault();
    let fields = {};
    fields[evt.target.name] = evt.target.value;
    this.setState(fields);
    this.setState({
      errors: { ...this.state.errors, [Object.keys(fields)[0]]: "" }
    });
    var errors = "";
    errors = this.validate(fields);
    if (errors) {
      return this.setState({
        errors: { ...this.state.errors, [Object.keys(fields)[0]]: errors }
      });
    }
  };

  // Validate user input
  validate = fields => {
    var errors = "";
    // username validation
    if (fields.username) {
      var usn = fields.username;
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
    // validate password
    if (fields.password) {
      var psw = fields.password;
      if (psw.length < 6) {
        errors = "password should not be less than 6 characters long.";
        return errors;
      }
    }
  };

  // function to handle user submitted data
  handleSubmit = evt => {
    evt.preventDefault();
    this.sendRequest(this.state.username, this.state.password);
  };

  // function to send login request.
  sendRequest = (username, password) => {
    var data = { username: username, password: password };
    const url = api.loginEp;
    axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    })
      .then(response => {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        toast.success(response.data.message);
        window.localStorage.setItem("token", response.data.access_token);
        window.localStorage.setItem("msg", response.data.message);
        this.setState({
          redirect: true,
          message: response.data.message
        });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            failure: true,
            message: error.response.data.message
          });
          toast.error(error.response.data.message);
          this.setState({ submitted: false });
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };
  render() {
    // show loading before waiting for response
    var loading = null;
    if (this.state.submitted) {
      loading = (
        <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw ld" />
      );
    }
    // redirect to dashboard after login
    if (this.state.redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: "/dashboard/"
          }}
        />
      );
    }

    let notice = null;
    if (
      this.state.failure &&
      this.state.message === "please verify your email before logging in"
    ) {
      notice = (
        <div className="i-c">
          <div className="i-container col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
            Click here to verify your email{" "}
            <a href="/resend_confirmation/" className="btn btn-md i-submit">
              Verify
            </a>
          </div>
        </div>
      );
    }
    if (
      this.state.failure &&
      this.state.message === "Invalid username or password"
    ) {
      notice = (
        <div className="i-c">
          <div className="i-container col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
            Dont have an account?{" "}
            <a href="/register/" className="btn btn-md i-submit">
              Sign Up
            </a>
          </div>
        </div>
      );
    }
    try {
      if (
        this.props.location.state.msg ===
        "Your session expired. Please login to continue"
      ) {
        notice = (
          <div className="i-c">
            <div className="i-container col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
              You have been logged out please login to continue.
            </div>
          </div>
        );
      }
    } catch (e) {}
    return (
      <div className="">
        <NavHome />
        <ToastContainer hideProgressBar={true} />
        {notice}
        <br />
        <br />
        <div className="col-lg-12 login pre-forms">
          <h2 className="text-center f-head">Login</h2>
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
              <label className="f-label"> Username</label>
              <input
                type="text"
                className={
                  this.state.errors.username
                    ? "form-control f-error"
                    : "form-control"
                }
                name="username"
                value={this.state.username}
                onInput={this.onInputChange}
                placeholder="Username"
                required
              />
              <br />
              <label className="f-label"> Password</label>
              <input
                type="password"
                className={
                  this.state.errors.password
                    ? "form-control f-error"
                    : "form-control"
                }
                name="password"
                value={this.state.password}
                onInput={this.onInputChange}
                placeholder="Password"
                required
              />
              <br />
              {loading}
              <input
                type="submit"
                value="Login"
                className="btn btn-primary btn-lg btn-block f-submit"
              />

              <h4 className="">
                <a href="/forgot_password/" className="f-link">
                  Forgot password?
                </a>
              </h4>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
