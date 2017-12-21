import React, { Component } from "react";
import NavDash from "./NavDash";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as api from "./API_URLS";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      cpassword: "",
      errors: { username: "", email: "", password: "", cpassword: "" },
      user: {},
      success: false,
      message: "",
      failure: false,
      redirect: false
    };
  }

  // preload user info
  componentWillMount = () => {
    this.getUser();
  };

  // send get request for user info
  getUser = () => {
    // Send GET request
    const url = api.userEp;
    axios({
      method: "get",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      }
    })
      .then(response => {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        //this.setState({success: true})
        this.setState({
          user: response.data,
          success: true
        });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          this.setState({
            message: error.response.data.message,
            failure: true
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", JSON.stringify(error.message));
        }
        console.log(error.config);
      });
  };

  // handle user input
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
    if (fields.password) {
      var psw = fields.password;
      if (psw.length < 6) {
        errors = "password should not be less than 6 characters long.";
        return errors;
      }
    }
    if (fields.cpassword) {
      var psw2 = fields.cpassword;
      if (psw2.length < 6) {
        errors = "password should not be less than 6 characters long.";
        return errors;
      }
    }
  };

  // handle from submission
  handleSubmit = (identifier, evt) => {
    evt.preventDefault();
    if (identifier === "username") {
      if (this.state.errors.username !== "") {
        toast.error("Please enter a valid username");
      } else {
        var udata = { username: this.state.username };
        this.sendRequest(udata);
      }
    }
    if (identifier === "email") {
      if (this.state.errors.email !== "") {
        toast.error("Please entera valod email");
      } else {
        var edata = { email: this.state.email };
        this.sendRequest(edata);
      }
    }
    if (identifier === "password") {
      if (
        this.state.errors.password !== "" ||
        this.state.errors.cpassword !== ""
      ) {
        toast.error("Please enter valid values to change password");
      } else {
        var pdata = {
          password: this.state.password,
          new_password: this.state.cpassword
        };
        this.sendRequest(pdata);
      }
    }
  };

  // handle deleting account request with a confirmation modal
  DeleteClickHandler = () => {
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete your account",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => this.deleteHandler()
    });
  };

  // send and resolve unfriend request.
  deleteHandler = () => {
    const url = api.userEp;
    axios({
      method: "delete",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      }
    })
      .then(response => {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        window.localStorage.clear();
        this.setState({ redirect: true });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", JSON.stringify(error.message));
        }
        console.log(error.config);
      });
  };
  // send and handle data submission
  sendRequest(content) {
    const url = api.userEp;
    axios({
      method: "put",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      },
      data: content
    })
      .then(function(response) {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        toast.success(response.data.message[0]);
        return response.data;
      })
      .catch(function(error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          // No response received
          console.log(error.request);
        } else {
          // Request error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }
  // render user deatails
  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: "/"
          }}
        />
      );
    }
    var load = "";
    if (!this.state.user.username && !this.state.success) {
      load = (
        <div className="spanel-item-loading">
          <h4>Loading</h4>
          <div className="text-right spn">
            <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
          </div>
        </div>
      );
    } else {
      load = (
        <div>
          <div className="profile-item">
            Username: <span className="p-font">{this.state.user.username}</span>
            <div className="action-b">
              <a
                data-toggle="modal"
                data-target="#username"
                title="Edit username"
                className="icon-link-b"
              >
                <span className="fa fa-edit " />
              </a>
            </div>
          </div>

          <div className="profile-item">
            Email: <span className="p-font">{this.state.user.email}</span>
            <div className="action-b">
              <a
                data-toggle="modal"
                data-target="#email"
                title="Edit email"
                className="icon-link-b"
              >
                <span className="fa fa-edit " />
              </a>
            </div>
          </div>

          <div className="profile-item">
            <div className="p-manage">
              <a
                data-toggle="modal"
                data-target="#password"
                title="Edit password"
                className="edit-p"
              >
                Edit password
              </a>
            </div>
            <div className="p-manage">
              <a
                onClick={this.DeleteClickHandler}
                title="Edit password"
                className="delete-p"
              >
                Delete account
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="">
        <NavDash />
        <ToastContainer hideProgressBar={true} />
        <div className="profile col-lg-6 col-lg-offset-3 col-md-8 col-sm-10 col-xs-12">
          <div className="panel profile-panel">
            <div className="panel-heading profile-head">
              My Profile{" "}
              <span className="b-home">
                <a href="/dashboard">back</a>
              </span>
            </div>
            <div className="panel-body profile-body">{load}</div>
          </div>
        </div>

        <div className="modal fade" id="username" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content mdl">
              <div className="modal-header">
                <a className="close" data-dismiss="modal">
                  &times;
                </a>
                <h4 className="modal-title">Edit {this.state.user.username}</h4>
              </div>
              <div className="modal-body">
                <form
                  className="form"
                  onSubmit={evt => this.handleSubmit("username", evt)}
                >
                  <label className="f-label">
                    username:
                    <span className="text-err">
                      {this.state.errors.username}
                    </span>
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="username"
                      className={
                        this.state.errors.username
                          ? "form-control f-error"
                          : "form-control"
                      }
                      onInput={this.onInputChange}
                      value={this.state.username}
                      placeholder={this.state.user.username}
                      required
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-success" type="submit">
                        edit
                      </button>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="email" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content mdl">
              <div className="modal-header">
                <a className="close" data-dismiss="modal">
                  &times;
                </a>
                <h4 className="modal-title">Edit {this.state.user.email}</h4>
              </div>
              <div className="modal-body">
                <form
                  className="form"
                  onSubmit={evt => this.handleSubmit("email", evt)}
                >
                  <label className="f-label">
                    email:
                    <span className="text-err">{this.state.errors.email}</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="email"
                      name="email"
                      className={
                        this.state.errors.email
                          ? "form-control f-error"
                          : "form-control"
                      }
                      onInput={this.onInputChange}
                      value={this.state.email}
                      placeholder={this.state.user.email}
                      required
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-success" type="submit">
                        edit
                      </button>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="password" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content mdl">
              <div className="modal-header">
                <a className="close" data-dismiss="modal">
                  &times;
                </a>
                <h4 className="modal-title">Edit {this.state.user.username}</h4>
              </div>
              <div className="modal-body">
                <form
                  className="form"
                  onSubmit={evt => this.handleSubmit("password", evt)}
                >
                  <div className="form-group col-lg-6 col-lg-offset-3 col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
                    <label className="f-label">
                      {" "}
                      New password:{" "}
                      <span className="text-err">
                        {this.state.errors.password}
                      </span>
                    </label>
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
                      placeholder="Current password"
                      required
                    />
                    <br />
                    <label className="f-label">
                      Confirm new password:
                      <span className="text-err">
                        {this.state.errors.cpassword}
                      </span>
                    </label>
                    <input
                      type="password"
                      className={
                        this.state.errors.cpassword
                          ? "form-control f-error"
                          : "form-control"
                      }
                      name="cpassword"
                      value={this.state.cpassword}
                      onInput={this.onInputChange}
                      placeholder="new password"
                      required
                    />
                    <br />
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-primary btn-lg btn-block f-submit"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
