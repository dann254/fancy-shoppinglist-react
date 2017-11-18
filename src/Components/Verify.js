import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import NavHome from './Navhome';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = { success: false, failure: false, message: '' };
  }
  componentDidMount() {
    this.emailVerify( this.props.match.params.token );
  }
  emailVerify(token) {
    var self = this;
    const url = 'https://fancy-shoppinglist-api.herokuapp.com/verify/' + token;
    axios({
        method: "get",
        url: url
    }).then(function (response) {
        if (!response.statusText === 'OK') {
            toast.error(response.data.message)
        }
        console.log(response.data);
        toast.success(response.data.message);
        self.setState({ success: true, message: response.data.message })
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
      if (this.state.message === 'Invalid token.') {
        return (
          <div className="">
            <NavHome />
            <ToastContainer hideProgressBar={true} />
            <div className="f-success">
            <h3 className="f-big">Invalid link please click below to resend confirmation link</h3>
            <h4><a href="/resend_confirmation/" className="f-link">Resend confirmation</a></h4>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="">
        <NavHome />
        <ToastContainer hideProgressBar={true} />
        <div id="loader">
          <div id="box"></div>
          <div id="hill"></div>
        </div>
        <h1 className="f-success f-big">Confirming email....</h1>
      </div>
    );
  }
}

export default VerifyEmail;
