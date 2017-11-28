import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class NavHome extends Component {
  constructor(props) {
    super(props)
    this.state = {logged_in: false}
  }
  componentWillMount=() => {
    if (!window.localStorage.getItem('token')){
      return this.setState({ logged_in:false })
    }
    this.getUser();
  }
  getUser=()=> {
    // Send GET request
    var self = this;
       const url = 'https://fancy-shoppinglist-api.herokuapp.com/user/';
       axios({
           method: "get",
           url: url,
           headers: {
               'Auth': window.localStorage.getItem('token')
           }
       }).then((response) => {
           if (!response.statusText === 'OK') {
               toast.error(response.data.message)
           }
           //this.setState({success: true})
           this.setState({
               logged_in: true
           });

           return response.data;
       }).catch(function (error) {
           if (error.response) {
             self.setState({
                 logged_in:false
             });
             window.localStorage.clear();
           } else if (error.request) {
               // The request was made but no response was received
               console.log(error.request);
           } else {
               // Something happened in setting up the request that triggered an Error
               console.log('Error', JSON.stringify(error.message));
           }
           console.log(error.config);
       });
  }

  render() {
    if (this.state.logged_in) {
      return (
        <div className="">
          <Redirect push to={{
            pathname: '/dashboard/'
          }}/>
        </div>
      );
    }
    return (
      <div className="">
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="b navbar-brand" href="/"> Fancy shoppinglist</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav">
              <li ><a href="/" className="b"><span className="glyphicon glyphicon-home"></span> Home</a></li>
            </ul>
            <ul className="b2 nav navbar-nav navbar-right">
              <li><a href="/register/" className="b"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
              <li><a href="/login/" className="b"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul>

          </div>
        </div>
      </nav>
      </div>
    );
  }
}

export default NavHome;
