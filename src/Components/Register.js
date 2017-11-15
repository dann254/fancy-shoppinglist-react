import React, { Component } from 'react';
import NavHome from './Navhome';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';


class Register extends Component {
  constructor(props) {
        super(props);
        this.state = { username: '', email: '', password: '',xemails:[],xusernames:[], cpassword: '', errors: { username: '',email:'', password:'', cpassword:'' }, success: false };
    }
    componentDidMount = () => {
      var self =this;
      const url = 'https://fancy-shoppinglist-api.herokuapp.com/users/AESDxsdgfhbcsdsd';
      axios({
          method: "get",
          url: url
      }).then(function (response) {
          self.setState({ xusernames : response.data.result.usernames})
          self.setState({ xemails : response.data.result.emails})
          return response.data;
      }).catch(function (error) {
          if (error.response) {
              console.log(error.response.data);
          } else if (error.request) {
              console.log(error.request);
          } else {
              console.log('Error', error.message);
          }
          console.log(error.config);
      });
    }
    onInputChange = (evt)=> {
        evt.preventDefault();
        let fields = {};
        fields[evt.target.name] = evt.target.value;
        this.setState(fields);
        this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: "" },});
        var errors = '';
        errors = this.validate(fields)
        if (errors) {
            return this.setState({ errors: { ...this.state.errors, [Object.keys(fields)[0]]: errors },});
        }
    }
    validate = (fields) => {
        var errors = '';
        // username validation
        if (fields.username) {
          var usn = fields.username
          if(this.state.xusernames.includes(usn)){
            errors = "username already exists";
            return errors;
          }
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
          var eml = fields.email
          if(this.state.xemails.includes(eml)){
            errors = "Email already exists";
            return errors;
          }
          // Regular expression to validate username
          var re0 = /^[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+$/;
          var re1 = /^[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+[.]+[a-z]+$/;
          var re2 = /^[a-z0-9]+[.]+[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+$/;
          var re3 = /^[a-z0-9]+[.]+[a-z0-9]+[@]+[a-z0-9]+[.]+[a-z]+$/;
          if (!eml.match(re0) && !eml.match(re1) && !eml.match(re2)&& !eml.match(re3)) {
              errors = "invalid email";
              return errors;
          }
        }
        if (fields.password) {
          var psw = fields.password
          if (psw.length < 6) {
              errors = "password should not be less than 6 characters long.";
              return errors;
          }
          if (this.state.cpassword !== '' && psw !== this.state.cpassword) {
            errors = "passwords do not match";
            return errors;
          }
        }
        if (fields.cpassword) {
          var psw2 = fields.cpassword
          if (psw2 !== this.state.password) {
              errors = "passwords do not match";
              return errors;
          }
        }
    }
    handleSubmit = (evt) => {
        evt.preventDefault();
        if (this.state.errors.username !== '' || this.state.errors.email !== '' || this.state.errors.password !== '' || this.state.errors.cpassword !== '') {
          toast.error("Please enter valid values for each field")
        }else{

          this.sendRequest(this.state.email, this.state.username, this.state.password);
        }

    }
    sendRequest(email, username, password) {
      var self =this;
        var data = { "email": email, "username": username, "password": password }
        const url = 'https://fancy-shoppinglist-api.herokuapp.com/auth/register/';
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
            toast.success(response.data.message);
            self.setState({ success: true })
            return response.data;
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                toast.error(error.response.data.message)
            } else if (error.request) {
                // No response received
                console.log(error.request);
            } else {
                // Request error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
  render() {
    //setInterval(() => {
      if (this.state.success) {
        return (
          <div>
          <NavHome />
          <ToastContainer hideProgressBar={true} />
          <div className="f-success">
            <h1 className="f-big">Yaaayyy!! thank you for registering.</h1>
            <h3 className="f-info" >You now need confirm your email to continue. <br />
            Confirmation link sent to : <b className="f-label">{this.state.email}.</b> <br /> <br /> </h3>
            <h4 className="f-info"> Did not receive email? <a href="/resend_confirmation/" className="f-link">Resend confirmation.</a></h4>
            <h4 className="f-info"> Already confirmed? <a href="/login/" className="f-link">Login.</a></h4>
          </div>
          </div>
        );
      }
    //}, 1000);
    return (
      <div className="">
      <NavHome />
      <ToastContainer hideProgressBar={true} />
        <div className="col-lg-12 pre-forms">
            <h2 className="f-head text-center">Signup</h2>
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="form-group col-lg-4 col-lg-offset-4 col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
              <label className="f-label"> Username: <span className="text-err">{ this.state.errors.username }</span></label>
              <input type="text" className={this.state.errors.username ? "form-control f-error":"form-control" } name="username" value={this.state.username} onInput={this.onInputChange} placeholder="Username" required /><br />
              <label className="f-label"> Email: <span className="text-err">{ this.state.errors.email }</span></label>
              <input type="email" className={this.state.errors.email ? "form-control f-error":"form-control" } name="email" value={this.state.email} onInput={this.onInputChange} placeholder="email" required /><br />
              <label className="f-label"> Password: <span className="text-err">{ this.state.errors.password }</span></label>
              <input type="password" className={this.state.errors.password ? "form-control f-error":"form-control" } name="password" value={this.state.password} onInput={this.onInputChange} placeholder="Password" required /><br />
              <label className="f-label"> Confirm password: <span className="text-err">{ this.state.errors.cpassword }</span></label>
              <input type="password" className={this.state.errors.cpassword ? "form-control f-error":"form-control" } name="cpassword" value={this.state.cpassword} onInput={this.onInputChange} placeholder="Confirm Password" required /><br />
              <input type="submit" value="Submit" className="btn btn-primary btn-lg btn-block f-submit" />

          </div>
        </form>
      </div>
      </div>
    );
  }
}

export default Register;
