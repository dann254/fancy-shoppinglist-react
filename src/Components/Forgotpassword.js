import React, { Component } from "react";
import NavHome from "./Navhome";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as api from "./API_URLS";

class ForgotPassword extends Component {
  // initialize state
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      success: false,
      errors: { email: "" },
      submitted: false
    };
  }
  // handle user input and save to state while validating
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

  // validate user input
  validate = fields => {
    var errors = "";
    if (fields.email) {
      var eml = fields.email;
      // Regular expression to validate email
      var re0 = /^[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+$/;
      var re1 = /^[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+[.]+[a-z]+$/;
      var re2 = /^[a-z0-9]+[.]+[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+$/;
      var re3 = /^[a-z0-9]+[.]+[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+$/;
      if (
        !eml.match(re0) &&
        !eml.match(re1) &&
        !eml.match(re2) &&
        !eml.match(re3)
      ) {
        errors = "invalid email";
        return errors;
      }
    }
  };

  // handle form submission
  handleSubmit = evt => {
    evt.preventDefault();
    if (this.state.errors.email !== "") {
      toast.error("Please enter a valid email adress");
    } else {
      this.sendRequest(this.state.email);
      this.setState({ submitted: true });
    }
  };

  //send form request
  sendRequest = email => {
    var data = { email: email };
    const url = api.forgotEp;
    // Send post request
    axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    })
      .then(response => {
        // Redsolve response
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        toast.success(response.data.message);
        this.setState({ success: true });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          toast.error(error.response.data.message);
          this.setState({ submitted: false });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
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
    // if the request is successful show a success page
    if (this.state.success) {
      return (
        <div>
          <NavHome />
          <ToastContainer hideProgressBar={true} />
          <div className="f-success">
            <h1 className="f-big">Link sent.</h1>
            <h3 className="f-info">
              Click the sent link to reset your password. <br />
              Reset link sent to :{" "}
              <b className="f-label">{this.state.email}.</b> <br /> <br />{" "}
            </h3>
            <h4 className="f-info">
              {" "}
              Did not receive email?{" "}
              <a href="/forgot_password/" className="f-link">
                Resend reset link.
              </a>
            </h4>
            <h4 className="f-info">
              {" "}
              Ready to login?{" "}
              <a href="/login/" className="f-link">
                Login.
              </a>
            </h4>
          </div>
        </div>
      );
    }
    return (
      <div className="">
        <NavHome />
        // Render forgot password page.
        <ToastContainer hideProgressBar={true} />
        <h3 className="f-head text-center">
          please enter your email adress to recieve reset password link
        </h3>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
            <label className="f-label">
              {" "}
              Email: <span className="text-err">{this.state.errors.email}</span>
            </label>
            <input
              type="email"
              className={
                this.state.errors.email
                  ? "form-control f-error"
                  : "form-control"
              }
              name="email"
              value={this.state.email}
              onInput={this.onInputChange}
              placeholder="email"
              required
            />
            <br />
            {loading}
            <input
              type="submit"
              value="Submit"
              className="btn btn-primary btn-lg btn-block f-submit"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default ForgotPassword;
