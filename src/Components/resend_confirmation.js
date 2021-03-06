import React, { Component } from "react";
import NavHome from "./Navhome";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as api from "./API_URLS";

class Rcon extends Component {
  constructor(props) {
    super(props);
    // initialize state
    this.state = {
      email: "",
      success: false,
      errors: { email: "" },
      submitted: false
    };
  }

  // hanle user input
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
      // Regular expression to validate username
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

  // handle email submission
  handleSubmit = evt => {
    evt.preventDefault();
    if (this.state.errors.email !== "") {
      toast.error("Please enter a valid email adress");
    } else {
      this.sendRequest(this.state.email);
      this.setState({ submitted: true });
    }
  };

  // send request to the API
  sendRequest(email) {
    var data = { email: email };
    const url = api.resendEp;
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
        this.setState({ success: true });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          toast.error(error.response.data.message);
          this.setState({ submitted: false });
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }
  render() {
    // show loading before waiting for response
    var loading = null;
    if (this.state.submitted) {
      loading = (
        <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw ld" />
      );
    }
    // if suucessfully resend, show success page
    if (this.state.success) {
      return (
        <div>
          <NavHome />
          <ToastContainer hideProgressBar={true} />
          <div className="f-success">
            <h1 className="f-big">Success!!.</h1>
            <h3 className="f-info">
              Confirmation link sent to :{" "}
              <b className="f-label">{this.state.email}.</b> <br /> <br />{" "}
            </h3>
            <h4 className="f-info">
              {" "}
              Did not receive email?{" "}
              <a href="/resend_confirmation/" className="f-link">
                Resend confirmation.
              </a>
            </h4>
            <h4 className="f-info">
              {" "}
              Already confirmed?{" "}
              <a href="/login/" className="f-link">
                Login.
              </a>
            </h4>
          </div>
        </div>
      );
    }
    // render resend confirmation form.
    return (
      <div className="">
        <NavHome />
        <ToastContainer hideProgressBar={true} />
        <h3 className="f-head text-center">
          please enter your email adress to resend confirmation link
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

export default Rcon;
