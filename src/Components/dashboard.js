import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = { shoppinglists: [], success: false }
    this.getShoppinglists = this.getShoppinglists.bind(this);
  }
  componentDidMount() {
    this.getShoppinglists();
  }
  getShoppinglists() {
    // Send GET request
       const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/';
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
               shoppinglists: response.data.results
           });

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
               console.log('Error', JSON.stringify(error.message));
           }
           console.log(error.config);
       });
  }
  render() {
    // if (!this.state.success) {
    //   return (
    //     <div>
    //       // <ToastContainer hideProgressBar={true} />
    //       <Redirect to="/login/" />
    //     </div>
    //   );
    // }
    return (
      <div className="">
        this is your dashboard
        {this.state.shoppinglists.map(shoppinglists => {
        return ( <div key={shoppinglists.id}>
                 <h4>{shoppinglists.name}</h4>
                 </div>
                 )
      })
     }
      </div>
    );
  }
}

export default Dashboard;
