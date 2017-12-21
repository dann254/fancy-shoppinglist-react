import React, { Component } from "react";
import NavDash from "./NavDash";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ItemView from "./item_view";
import * as api from "./API_URLS";

class Items extends Component {
  // initialize state
  constructor(props) {
    super(props);
    this.state = {
      shoppinglist: {},
      errors: { sitem: "", price: "", quantity: "" },
      items: [],
      success: false,
      sitem: "",
      price: "",
      quantity: ""
    };
  }

  // handle user input
  onInputChange = evt => {
    evt.preventDefault();
    let fields = {};
    fields[evt.target.name] = evt.target.value;
    this.setState(fields);
    this.setState({
      errors: { ...this.state.errors, [Object.keys(fields)[0]]: "" }
    });
    var errors = "";
    errors = this.validate(fields);
    if (errors) {
      return this.setState({
        errors: { ...this.state.errors, [Object.keys(fields)[0]]: errors }
      });
    }
  };

  // validate user input
  validate = fields => {
    var errors = "";
    // username validation
    if (fields.sitem) {
      var usn = fields.sitem;
      if (usn.length < 2) {
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
    if (fields.price) {
      var price = fields.price;
      // Regular expression to validate price
      var re3 = /^[0-9]+$/;
      var re23 = /^[0-9]+[.]+[0-9]+$/;
      if (!price.match(re3) && !price.match(re23)) {
        errors = "invalid value";
        return errors;
      }
    }
    if (fields.quantity) {
      var qty = fields.quantity;
      // Regular expression to validate quantity
      var re4 = /^[0-9]+$/;
      var re24 = /^[0-9]+[.]+[0-9]+$/;
      if (!qty.match(re4) && !qty.match(re24)) {
        errors = "invalid value";
        return errors;
      }
    }
  };

  // handle form submission
  handleSubmit = evt => {
    evt.preventDefault();
    if (
      this.state.errors.sitem !== "" ||
      this.state.errors.price !== "" ||
      this.state.errors.quantity !== ""
    ) {
      toast.error("please enter valid values");
    } else {
      this.sendAddRequest(
        this.state.sitem,
        this.state.price,
        this.state.quantity,
        this.props.match.params.id
      );
    }
  };

  // send add request and resolve response
  sendAddRequest(sitem, price, quantity, id) {
    var data = { name: sitem, price: price, quantity: quantity };
    const url = api.shoppinglistsEP + id + "/items";
    axios({
      method: "post",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      },
      data: data
    })
      .then(response => {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        document.getElementById("item-modal-close").click();
        toast.success("Item created");
        var newShopp = this.state.items.slice();
        newShopp.push(response.data);
        this.setState({ items: newShopp, sitem: "", price: "", quantity: "" });
        this.setState({ addSuccess: true });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          // No response received
          console.log(error.request);
        } else {
          // Request error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }

  // load items when component mounts
  componentWillMount() {
    this.shoppinglistDetails(this.props.match.params.id);
    this.loadItems(this.props.match.params.id);
  }

  // get shoppinglist details
  shoppinglistDetails = id => {
    const url = api.shoppinglistsEP + id;
    axios({
      method: "get",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      }
    })
      .then(response => {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        this.setState({
          shoppinglist: response.data
        });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", JSON.stringify(error.message));
        }
        console.log(error.config);
      });
  };

  // handle post item manipulation
  ItemHandler = id => {
    this.loadItems(id);
  };

  // send request to get all items
  loadItems = id => {
    const url = api.shoppinglistsEP + id + "/items";
    axios({
      method: "get",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      }
    })
      .then(response => {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        this.setState({ success: true });
        this.setState({
          items: response.data.results
        });

        return response.data;
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.data);
          toast.error(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", JSON.stringify(error.message));
        }
        console.log(error.config);
      });
  };
  reset = () => {
    this.setState({
      errors: { sitem: "", price: "", quantity: "" },
      sitem: "",
      price: "",
      quantity: ""
    });
  };

  // render items
  render() {
    var load = "";
    if (!this.state.items[0] && this.state.success === true) {
      load = (
        <tbody>
          <tr>
            <td className="item-none" colSpan="4">
              This shoppinglist has no items
            </td>
          </tr>
        </tbody>
      );
    } else if (!this.state.items[0] && !this.state.success) {
      return (
        <div>
          <NavDash />
          <div className="item-loading">
            <div className="spn-item">
              <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
            </div>
            <h4>Loading</h4>
          </div>
        </div>
      );
    } else {
      load = (
        <ItemView
          items={this.state.items}
          ItemHandler={this.ItemHandler}
          sid={this.props.match.params.id}
        />
      );
    }
    return (
      <div className="items">
        <NavDash />
        <ToastContainer hideProgressBar={true} />
        <div className="s-heading">
          <span>{this.state.shoppinglist.name}</span>
          <a
            data-toggle="modal"
            data-target="#myModal"
            className="add-item-l"
            onClick={this.reset}
          >
            Add item
            <span className="fa fa-plus"> </span>
          </a>
          <a href="/dashboard" className="back-l">
            Back to dashboard
          </a>
        </div>
        <div className="item-container">
          <div className="item-t" />
          <div className="">
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
                <a
                  className="close close-x"
                  data-dismiss="modal"
                  id="item-modal-close"
                >
                  &times;
                </a>
                <h3 className="modal-title">Add Item</h3>
              </div>
              <div className="modal-body">
                <form className="form" onSubmit={this.handleSubmit}>
                  <label className="f-label">
                    {" "}
                    name:{" "}
                    <span className="text-err">{this.state.errors.sitem}</span>
                  </label>
                  <input
                    type="text"
                    name="sitem"
                    className={
                      this.state.errors.sitem
                        ? "form-control f-error"
                        : "form-control"
                    }
                    onInput={this.onInputChange}
                    value={this.state.sitem}
                    placeholder="item name"
                    required
                  />

                  <label className="f-label">
                    {" "}
                    price:{" "}
                    <span className="text-err">{this.state.errors.price}</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    className={
                      this.state.errors.price
                        ? "form-control f-error"
                        : "form-control"
                    }
                    onInput={this.onInputChange}
                    value={this.state.price}
                    placeholder="unit price"
                    required
                  />

                  <label className="f-label">
                    quantity:{" "}
                    <span className="text-err">
                      {this.state.errors.quantity}
                    </span>
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    className={
                      this.state.errors.quantity
                        ? "form-control f-error"
                        : "form-control"
                    }
                    onInput={this.onInputChange}
                    value={this.state.quantity}
                    placeholder="Quantity"
                    required
                  />
                  <br />
                  <button
                    className="btn btn-success btn-block f-submit"
                    type="submit"
                  >
                    add
                  </button>
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
