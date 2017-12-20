import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as api from "./API_URLS";

class NavDash extends Component {
  // initialize state
  constructor(props) {
    super(props);
    this.state = { user: "", success: false, message: "", failure: false };
  }
  // handle user logout
  logout = () => {
    window.localStorage.clear();
    return this.setState({ failure: true, message: "Logout successful" });
  };
  //  prepare to verify login status
  componentWillMount = () => {
    if (!window.localStorage.getItem("token")) {
      return this.setState({
        failure: true,
        message: "Please login to continue"
      });
    } else {
      this.getUser();
    }
  };
  // get user to verify login status
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
          toast.error(response.data.message);
        }
        this.setState({
          user: response.data.username
        });
        window.localStorage.setItem("username", response.data.username);
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

  render() {
    // redirect if the user is not logged in
    if (
      this.state.failure &&
      this.state.message === "Expired token. Please login to get a new token"
    ) {
      return (
        <div className="">
          <Redirect
            push
            to={{
              pathname: "/login/",
              state: { msg: "Your session expired. Please login to continue" }
            }}
          />
        </div>
      );
    }
    if (this.state.failure) {
      return (
        <div className="">
          <Redirect
            push
            to={{
              pathname: "/login/",
              state: { msg: this.state.message }
            }}
          />
        </div>
      );
    }
    var usrnm = "";
    if (!window.localStorage.getItem("username")) {
      usrnm = this.state.user;
    } else {
      usrnm = window.localStorage.getItem("username");
    }
    // redner navbar
    return (
      <div className="">
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target="#myNavbar"
              >
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="b navbar-brand" href="/dashboard/">
                {" "}
                Fancy shoppinglist
              </a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="b2 nav navbar-nav navbar-right">
                <li>
                  <a href="/user/" className="b">
                    <span className="glyphicon glyphicon-user" /> {usrnm}
                  </a>
                </li>
                <li>
                  <a onClick={this.logout} className="b">
                    <span className="glyphicon glyphicon-log-out" /> Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavDash;
