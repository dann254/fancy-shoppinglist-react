import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Buddies extends Component {
  constructor(props) {
    super(props)
    this.state = { buddies: [], success: false, username:'',errors: { username: '' } }
  }
  onInputChange = (evt) => {
    evt.preventDefault();
    let fields = {};
    fields[evt.target.name] = evt.target.value;
    this.setState(fields);
    this.setState({username : evt.target.value})
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
            errors = "name should be three or more characters long";
            return errors;
        }
        if (usn.length > 30) {
            errors = "name too long";
            return errors;
        }
        // Regular expression to validate username
        var re = /^[a-zA-Z0-9_ -]+$/;
        if (!usn.match(re)) {
            errors = "invalid shoppinglist name";
            return errors;
        }
      }
  }
  componentWillMount() {
    this.getBuddies();
  }
  handleSubmit=( e )=> {
    e.preventDefault();
    this.handleInvite(this.state.username);
  }
  handleInvite=(username)=>{
    var data = {'username':username}
    const url = 'https://fancy-shoppinglist-api.herokuapp.com/buddies/';
    axios({
        method: "post",
        url: url,
        headers: {
            'Auth': window.localStorage.getItem('token')
        },
        data: data
    }).then((response) => {
        if (!response.statusText === 'OK') {
            toast.error(response.data.message)
        }
        this.getBuddies()
        document.getElementById('b-modal-close').click()
        this.setState({success: true})
        toast.success("Successfully added")

        return response.data;
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            toast.error(error.response.data.message)
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', JSON.stringify(error.message));
        }
        console.log(error.config);
    });
  }

  UnfriendClickHandler = (id, name) => {
    confirmAlert({
      title: 'Confirm Unfriend',
      message: 'Are you sure you want to unfriend ' + name + '?',
      confirmLabel: 'Unfriend',
      cancelLabel: 'Cancel',
      onConfirm: () => this.unfriendHandler(id),
    })
    console.log(id)

  }
  unfriendHandler=(id)=> {
    const url = 'https://fancy-shoppinglist-api.herokuapp.com/buddies/'+id;
    axios({
        method: "delete",
        url: url,
        headers: {
            'Auth': window.localStorage.getItem('token')
        }
    }).then((response) => {
        if (!response.statusText === 'OK') {
            toast.error(response.data.message)
        }
        this.getBuddies()
        this.setState({success: true})
        toast.success("Buddy unfriended!")

        return response.data;
    }).catch(function (error) {
        if (error.response) {
            console.log(error.response.data);
            toast.error(error.response.data.message)
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', JSON.stringify(error.message));
        }
        console.log(error.config);
    });
  }
  getBuddies=()=> {
    // Send GET request
       const url = 'https://fancy-shoppinglist-api.herokuapp.com/buddies/';
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
           console.log(response.data);
           this.setState({success: true})
           this.setState({
               buddies: response.data.result
           });

           return response.data;
       }).catch(function (error) {
           if (error.response) {
               console.log(error.response.data);
               toast.error(error.response.data.message)
           } else if (error.request) {
               console.log(error.request);
           } else {
               console.log('Error', JSON.stringify(error.message));
           }
           console.log(error.config);
       });
  }
  render() {
    if (!this.state.buddies[0] && !this.state.success){
      var resp = <div className="spanel-item-loading-b">
          <h4>Loading</h4>
           <div className="text-right spn-b">
            <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></span>
           </div>
      </div>
    } else if (!this.state.buddies[0] && this.state.success) {
      var resp = <div className="spanel-item-none"><h4>Invite your buddies</h4></div>
    } else {
      var resp = this.state.buddies.map(buddy => {
      return ( <div className="spanel-item-b" key={buddy.friend_id}>
               <a data-toggle="modal" data-target={"#myModal"+buddy.friend_id}><h4>{buddy.username}</h4></a> <div className="action-b"><a className="icon-link-b" onClick={(e) => this.UnfriendClickHandler(buddy.friend_id, buddy.username, e)}><span className="fa fa-times-circle-o" title="Unfriend"></span></a></div>
                <div className="modal fade" id={"myModal"+buddy.friend_id} role="dialog">
                  <div className="modal-dialog">

                    <div className="modal-content mdl">
                      <div className="modal-header">
                        <a className="close" data-dismiss="modal">&times;</a>
                        <h3 className="modal-title">User profile</h3>
                      </div>
                      <div className="modal-body">
                        <h3>Username: <span className="prof-info">{buddy.username}</span></h3>
                        <h3>email: <span className="prof-info">{buddy.email}</span></h3>
                        <h3>Shared shoppinglists: <span className="prof-info">{buddy.shared}</span></h3>
                      </div>
                    </div>

                  </div>
                </div>
               </div>
               )
          })
         }

    return (
      <div className="">
      <div className="row bds col-lg-2 col-md-2 col-sm-2 col-xs-2">
      <div className="panel spanel-b">
        <div className="panel-heading spanel-head-b"><h2>Buddies</h2></div>
        <div className="panel-body spanel-body-b">
          {resp}

         </div>
         <div className="panel-footer spanel-foot-b"><a className="add-list" data-toggle="modal" data-target="#myModaluser" title="Invite buddy"><span className="fa fa-user-plus"></span></a></div>
       </div>
       </div>
       <div id="myModaluser" className="modal fade" role="dialog">
         <div className="modal-dialog">


           <div className="modal-content mdl">
             <div className="modal-header">
               <a className="close close-x" data-dismiss="modal" id="b-modal-close">&times;</a>
               <h3 className="modal-title">Invite buddy</h3>
             </div>
             <div className="modal-body">
               <form className="form" onSubmit={this.handleSubmit} >
               <label className="f-label m-label"> username: <span className="text-err">{ this.state.errors.username }</span></label>
               <div className="input-group">
                 <input type="text" name="username" className={this.state.errors.username ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.username} placeholder="username" required />
                 <span className="input-group-btn">
                   <button className="btn btn-success" type="submit">
                       invite
                   </button>
                 </span>
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

export default Buddies;
