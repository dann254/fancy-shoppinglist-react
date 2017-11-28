import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class BuddyShoppinglists extends Component {
  constructor(props) {
    super(props)
    this.state = { buddyshoppinglists: [], success: false, message: '' }
    this.getBuddyShoppinglists = this.getBuddyShoppinglists.bind(this)
  }
  componentWillMount=() => {
    this.getBuddyShoppinglists();
  }
  getBuddyShoppinglists() {
    // Send GET request
      var self = this;
       const url = 'https://fancy-shoppinglist-api.herokuapp.com/buddies/shoppinglists/';
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
           self.setState({success: true})
           self.setState({
               buddyshoppinglists: response.data.result
           });

           return response.data;
       }).catch(function (error) {
           if (error.response) {
               console.log(error.response.data);
               console.log( self.state.message );
               self.setState({
                   message: error.response.data.message
               });
           } else if (error.request) {
               console.log(error.request);
           } else {
               console.log('Error', JSON.stringify(error.message));
           }
           console.log(error.config);
       });
  }
  render() {
    if (this.state.message !== '') {
      var resp = <div>{this.state.message}</div>
    } else {
      var resp = this.state.buddyshoppinglists.map(bslist => {
      return ( <div key={bslist.id}>
               <h4>{bslist.name}</h4>
               </div>
               )
          })
    }
    return (
      <div className="">
      <div className="row bslist col-lg-5 col-md-5 col-sm-12 col-xs-12">
      <div className="panel panel-danger">
        <div className="panel-heading">Buddy Shoppinglists</div>
        <div className="panel-body">
          {resp}

         </div>
         <div className="panel-footer">add</div>
       </div>
       </div>
      </div>
    );
  }
}

export default BuddyShoppinglists;
