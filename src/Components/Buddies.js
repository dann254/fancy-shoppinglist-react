import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Buddies extends Component {
  constructor(props) {
    super(props)
    this.state = { buddies: [], success: false }
  }
  componentWillMount() {
    this.getBuddies();
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
    return (
      <div className="">
      <div className="row bds col-lg-2 col-md-2 col-sm-2 col-xs-2">
      <div className="panel panel-success">
        <div className="panel-heading">Buddies</div>
        <div className="panel-body">
        {this.state.buddies.map(buddy => {
        return ( <div key={buddy.friend_id}>
                 <h4>{buddy.username}</h4>
                 </div>
                 )
            })
           }

         </div>
         <div className="panel-footer">add</div>
       </div>
       </div>
      </div>
    );
  }
}

export default Buddies;
