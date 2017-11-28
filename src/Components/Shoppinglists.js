import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ShoppinglistView from './shoppinglist_view';

class Shoppinglists extends Component {
  constructor(props) {
    super(props)
    this.state = { sname: '', shoppinglists: [], success: false, message:'', errors: { sname: '' }, addSuccess: false }
  }
  componentWillMount=() => {
    this.getShoppinglists();
  }
  closeModal=()=> {
    this.setState({addSuccess: false})
    console.log('yeah')
  }
  onInputChange = (evt) => {
    evt.preventDefault();
    let fields = {};
    fields[evt.target.name] = evt.target.value;
    this.setState(fields);
    this.setState({sname : evt.target.value})
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
      if (fields.sname) {
        var usn = fields.sname
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
  handleSubmit=(evt)=> {
      evt.preventDefault();
      if (this.state.errors.sname !== '') {
        toast.error("Please enter a valid shoppinglist name")
      }else{
        this.sendAddRequest(this.state.sname);
      }
  }

  sendAddRequest(sname) {
    var self =this;
      var data = { 'name': sname}
      const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/';
      axios({
          method: "post",
          url: url,
          headers: {
              'Auth': window.localStorage.getItem('token')
          },
          data: data
      }).then(function (response) {
          if (!response.statusText === 'OK') {
              toast.error(response.data.message)
          }
          toast.success("Shoppinglist created");
          var newShopp = self.state.shoppinglists.slice();
          newShopp.push(response.data);
          self.setState({shoppinglists:newShopp})
          self.setState({ addSuccess: true })
          self.closeModal()
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

  getShoppinglists=()=> {
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

           console.log(this.state)
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
    if (!this.state.shoppinglists[0]&& this.state.success===true) {
      var adds = <span className="c-add">Click here to add  <span className="fa fa-hand-o-right"> </span> </span>
      var load = <div className="spanel-item-none">
                  <h4>You dont have any shoppinglists</h4>
                </div>
    }else if (!this.state.shoppinglists[0] && !this.state.success) {
      var load = <div className="spanel-item-loading">
          <h4>Loading</h4>
           <div className="text-right spn">
            <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></span>
           </div>
      </div>
    } else {
      var load = <ShoppinglistView shoppinglists={this.state.shoppinglists} />
    }
    return (
      <div className="">
       <ToastContainer hideProgressBar={true} />
        <div className="row shoppinglist col-lg-5 col-md-5 col-sm-12 col-xs-12">
        <div className="panel spanel">
          <div className="panel-heading spanel-head"><h2>Shoppinglists</h2></div>
          <div className="panel-body spanel-body">
          {load}
         </div>
         <div className="panel-footer spanel-foot"><a data-toggle="modal" data-target="#myModal" className="add-list"> <span className="fa fa-plus"></span></a>{adds}</div>
       </div>
       </div>

        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">


            <div className="modal-content mdl">
              <div className="modal-header">
                <button type="button" className="close close-x" data-dismiss="modal">&times;</button>
                <h3 className="modal-title">Add Shoppinglist</h3>
              </div>
              <div className="modal-body">
                <form className="form" onSubmit={this.handleSubmit} >
                <div className="input-group">
                  <label className="f-label"> name: <span className="text-err">{ this.state.errors.sname }</span></label>
                  <input type="text" name="sname" className={this.state.errors.sname ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.sname} placeholder="shoppinglist name" required />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="submit">
                        add
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

export default Shoppinglists;
