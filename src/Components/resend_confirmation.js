import React, { Component } from 'react';
import NavHome from './Navhome';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Rcon extends Component {
  constructor(props) {
        super(props);
        this.state = { email: '', success: false };
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
        errors = this.validate(this.state.email)
        if (errors) {
            toast.error(errors)
            return this.setState({ errors })
        }
        this.sendRequest(this.state.email, this.state.username, this.state.password);

        //this.setState({ username: '', email: '', password: '', cpassword: '' });
    }
    validate(email) {
        var errors = '';
        return errors
    }
    sendRequest(email) {
      var self =this;
        var data = { "email": email }
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = 'https://fancy-shoppinglist-api.herokuapp.com//auth/resend_confirmation';
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
    return (
      <div className="">
      <NavHome />
      <ToastContainer hideProgressBar={true} />
      <h3>please enter your email adress to resend confirmation email</h3>
      <form className="form" onSubmit={this.handleSubmit}>
      <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
        <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.onInputChange} placeholder="Confirmation email" required /><br />
        <input type="submit" value="Resend" className="btn btn-primary btn-lg btn-block" />
        </div>
      </form>
      </div>
    );
  }
}

export default Rcon;
