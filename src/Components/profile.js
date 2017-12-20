import React, { Component } from 'react';
import NavDash from './NavDash';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = { username:'', email:'', password:'', cpassword:'', errors:{username:'', email:'', password:'', cpassword:''}, user: {}, success: false, message:'', failure:false }
  }
  componentWillMount=() => {
    this.getUser();
  }
  getUser=()=> {
      var self=this;
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
               user: response.data, success: true
           });
           return response.data;
       }).catch(function (error) {
           if (error.response) {
             self.setState({
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
      }
      if (fields.cpassword) {
        var psw2 = fields.cpassword
        if (psw2.length < 6) {
            errors = "password should not be less than 6 characters long.";
            return errors;
        }
      }
  }
  handleSubmit = (identifier, evt) => {
      evt.preventDefault();
      if (identifier === "username") {
        if (this.state.errors.username !== '') {
          toast.error("Please enter a valid username")
        }else{
          var data = { 'username': this.state.username }
          this.sendRequest(data);
        }
      }
      if (identifier === "email") {
        if (this.state.errors.email !== '') {
          toast.error("Please entera valod email")
        }else{
          var data = { 'email': this.state.email }
          this.sendRequest(data);
        }
      }
      if (identifier === "password") {
        if (this.state.errors.password !== '' || this.state.errors.cpassword !== '') {
          toast.error("Please enter valid values to change password")
        }else{
          var data = { 'password': this.state.password, 'new_password': this.state.cpassword }
          this.sendRequest(data);
        }
      }

  }
  sendRequest(content) {
    var self =this;
      console.log( content );
      const url = 'https://fancy-shoppinglist-api.herokuapp.com/user/';
      axios({
          method: "put",
          url: url,
          headers: {
              'Auth': window.localStorage.getItem('token')
          },
          data: content
      }).then(function (response) {
          if (!response.statusText === 'OK') {
              toast.error(response.data.message)
          }
          toast.success(response.data.message[0]);
          console.log(response.data.message[0])
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
    if (!this.state.user.username && !this.state.success) {
      var load = <div className="spanel-item-loading">
          <h4>Loading</h4>
           <div className="text-right spn">
            <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></span>
           </div>
      </div>
    } else {
      var load = <div><span>Username: {this.state.user.username} <a data-toggle="modal" data-target="#username" title="Edit username">edit</a></span><br />
      <span>Email: {this.state.user.email}<a data-toggle="modal" data-target="#email" title="Edit email">edit</a></span><br />
      <span><a data-toggle="modal" data-target="#password" title="Edit password">Edit password</a></span></div>
    }
    return (
      <div className="">
          <NavDash />
          <ToastContainer hideProgressBar={true} />
          <div className="profile col-lg-6 col-lg-offset-3 col-md-8 col-sm-10 col-xs-12">
            <div className="panel panel-info profile-panel">
              <div className="panel-heading">My Profile</div>
              <div className="panel-body">
              {load}

              </div>
              </div>
          </div>

          <div className="modal fade" id="username" role="dialog">
            <div className="modal-dialog">

              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Edit {this.state.user.username}</h4>
                </div>
                <div className="modal-body">
                  <form className="form" onSubmit={(evt)=>this.handleSubmit("username", evt)} >
                  <div className="input-group">
                    <label className="f-label"> name: <span className="text-err">{ this.state.errors.username }</span></label>
                    <input type="text" name="username" className={this.state.errors.username ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.username} placeholder={this.state.user.username} required />
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

              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Edit {this.state.user.email}</h4>
                </div>
                <div className="modal-body">
                  <form className="form" onSubmit={(evt)=>this.handleSubmit("email", evt)} >
                  <div className="input-group">
                    <label className="f-label"> email: <span className="text-err">{ this.state.errors.email }</span></label>
                    <input type="email" name="email" className={this.state.errors.email ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.email} placeholder={this.state.user.email} required />
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

              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h4 className="modal-title">Edit {this.state.user.username}</h4>
                </div>
                <div className="modal-body">
                    <form className="form" onSubmit={(evt)=>this.handleSubmit("password", evt)}>
                      <div className="form-group col-lg-6 col-lg-offset-3 col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
                      <label className="f-label"> New password: <span className="text-err">{ this.state.errors.password }</span></label>
                      <input type="password" className={this.state.errors.password ? "form-control f-error":"form-control" } name="password" value={this.state.password} onInput={this.onInputChange} placeholder="Current password" required /><br />
                      <label className="f-label"> Confirm new password: <span className="text-err">{ this.state.errors.cpassword }</span></label>
                      <input type="password" className={this.state.errors.cpassword ? "form-control f-error":"form-control" } name="cpassword" value={this.state.cpassword} onInput={this.onInputChange} placeholder="new password" required /><br />
                      <input type="submit" value="Submit" className="btn btn-primary btn-lg btn-block f-submit" />

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
