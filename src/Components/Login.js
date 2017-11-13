import React, { Component } from 'react';
import NavHome from './Navhome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Login extends Component {
  render() {
    return (
      <div className="">
      <NavHome />
      <ToastContainer hideProgressBar={true} />
        This is the Login
      <a href="/forgot_password/">Forgot password?</a>
      </div>
    );
  }
}

export default Login;
