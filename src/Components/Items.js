import React, { Component } from 'react';
import NavDash from './NavDash';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ItemView from './item_view';

class Items extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shoppinglist: {},
      errors: { sitem: '', price:'', quantity:'' },
      items: [],
      success: false,
      errors: '',
      sitem : '',
      price : '',
      quantity: ''

    }
  }
  onInputChange = (evt) => {
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
      if (fields.sitem) {
        var usn = fields.sitem
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
      if (this.state.errors.sitem !== '') {
        toast.error("Please enter a valid shoppinglist name")
      }else{
        this.sendAddRequest(this.state.sitem, this.state.price, this.state.quantity, this.props.match.params.id);
      }
  }
  sendAddRequest(sitem, price, quantity, id) {
    var self =this;
      var data = { 'name': sitem, 'price':price, 'quantity':quantity}
      const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/'+id+'/items';
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
          document.getElementById('item-modal-close').click()
          toast.success("Item created");
          var newShopp = self.state.items.slice();
          newShopp.push(response.data);
          self.setState({items:newShopp, sitem:'', price: '', quantity: ''})
          self.setState({ addSuccess: true })
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
  componentWillMount() {
    this.shoppinglistDetails( this.props.match.params.id );
    this.loadItems( this.props.match.params.id );
  }

  shoppinglistDetails=(id)=>{
    const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/'+id;
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
        this.setState({
            shoppinglist: response.data
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

  ItemHandler=(id) => {
    this.loadItems( id );
  }

  loadItems=(id)=>{
    const url = 'https://fancy-shoppinglist-api.herokuapp.com/shoppinglists/'+id+'/items';
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
            items: response.data.results
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
    if (!this.state.items[0]&& this.state.success===true) {
      var adds = <span className="c-add">Click here to add  <span className="fa fa-hand-o-right"> </span> </span>
      var load = <div className="spanel-item-none">
                  <h4>You dont have any shoppinglists</h4>
                </div>
    }else if (!this.state.items[0] && !this.state.success) {
      var load = <div className="spanel-item-loading">
          <h4>Loading</h4>
           <div className="text-right spn">
            <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></span>
           </div>
      </div>
    } else {
      var load = <ItemView items={this.state.items} ItemHandler={this.ItemHandler} sid={this.props.match.params.id} />
    }
    return (
      <div className="items">
        <NavDash />
        <ToastContainer hideProgressBar={true} />
        <div className="item-container">
          <div className="item-t row col-lg-3 col-md-3 col-sm-12 col-xs-12">
            <span className="s-heading">{this.state.shoppinglist.name}</span>
            <a data-toggle="modal" data-target="#myModal" className="add-item-l"> <span className="fa fa-plus"> Add item</span></a>
            <a href="/dashboard" className="back-l">Back to dashboard</a>
          </div>
          <div className="row col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <table className="table table-striped my-t">
            <thead>
              <tr>
                <th>Item name</th>
                <th>unit price</th>
                <th>Quantity</th>
                <th>action</th>
              </tr>
            </thead>
            {load}
            </table>
          </div>
        </div>
        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">


            <div className="modal-content mdl">
              <div className="modal-header">
                <button type="button" className="close close-x" data-dismiss="modal" id="item-modal-close">&times;</button>
                <h3 className="modal-title">Add Item</h3>
              </div>
              <div className="modal-body">
                <form className="form" onSubmit={this.handleSubmit} >
                  <label className="f-label"> name: <span className="text-err">{ this.state.errors.sitem }</span></label>
                  <input type="text" name="sitem" className={this.state.errors.sitem ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.sitem} placeholder="item name" required />

                  <label className="f-label"> price: <span className="text-err">{ this.state.errors.price }</span></label>
                  <input type="text" name="price" className={this.state.errors.price ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.price} placeholder="unit price" required />

                  <label className="f-label">quantity: <span className="text-err">{ this.state.errors.quantity }</span></label>
                  <input type="text" name="quantity" className={this.state.errors.quantity ? "form-control f-error":"form-control" } onInput={this.onInputChange} value={this.state.quantity} placeholder="Quantity" required />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="submit">
                        add
                    </button>
                  </span>
                  </form>
                </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Items;
