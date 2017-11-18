import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class NavDash extends Component {
  constructor(props) {
    super(props)
    this.state = { user: '', success: false, message:'', failure:false }
  }
  logout = () => {
      window.localStorage.clear();
      return this.setState({ failure:true, message: 'Logout successful' })
  }
  componentWillMount=() => {
    if (!window.localStorage.getItem('token')){
      return this.setState({ failure:true, message: 'Please login to continue' })
    }else{
    this.getUser();
  }
  }
  getUser=()=> {
    // Send GET request
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
               user: response.data.username
           });
           window.localStorage.setItem('username', response.data.username);
           return response.data;
       }).catch(function (error) {
           if (error.response) {
             this.setState({
                 message: error.response.data.message, failure:true
             });
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
    if (this.state.failure && this.state.message === 'Expired token. Please login to get a new token' ) {
      return (
        <div className="">
          <Redirect push to={{
            pathname: '/login/',
            state : {msg:'Your session expired. Please login to continue'}
          }}/>
        </div>
      );
    }
    if (this.state.failure) {
      return (
        <div className="">
          <Redirect push to={{
            pathname: '/login/',
            state : {msg:this.state.message}
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
            <a className="b navbar-brand" href="/dashboard/"> Fancy shoppinglist</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">

            <ul className="b2 nav navbar-nav navbar-right">
              <li><a href="/register/" className="b"><span className="glyphicon glyphicon-user"></span> {window.localStorage.getItem('username')}</a></li>
              <li><a onClick={this.logout} className="b"><span className="glyphicon glyphicon-log-out"></span> Logout</a></li>
            </ul>

          </div>
        </div>
      </nav>
      </div>
    );
  }
}

export default NavDash;
