import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import * as api from "./API_URLS";

class ItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (fields.price) {
      var price = fields.price;
      // Regular expression to validate price
      var re3 = /^[0-9]+$/;
      var re2 = /^[0-9]+[.]+[0-9]+$/;
      if (!price.match(re3) && !price.match(re2)) {
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
  handleSubmit = (itemId, evt) => {
    evt.preventDefault();
    if (
      this.state.sitem === "" &&
      this.state.price === "" &&
      this.state.quantity === ""
    ) {
      toast.error("nothing to submit");
    } else if (
      this.state.errors.sitem !== "" ||
      this.state.errors.price !== "" ||
      this.state.errors.quantity !== ""
    ) {
      toast.error("please enter valid values");
    } else {
      this.sendEditRequest(
        this.state.sitem,
        this.state.price,
        this.state.quantity,
        this.props.sid,
        itemId
      );
    }
  };

  // send request to edit item
  sendEditRequest(sitem, price, quantity, id, itemId) {
    var data = { name: sitem, price: price, quantity: quantity };
    const url = api.shoppinglistsEP + id + "/items/" + itemId;
    axios({
      method: "put",
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
        this.props.ItemHandler(id);
        document.getElementById("item-modal-close" + itemId).click();
        toast.success("Item edited");
        this.setState({
          editSuccess: true,
          sitem: "",
          price: "",
          quantity: ""
        });
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

  // handle item deletion
  DeleteClickHandler = (id, name) => {
    confirmAlert({
      title: "Confirm to Delete", // Title dialog
      message: "Are you sure you want to delete:  " + name, // Message dialog
      childrenElement: () => <div>Custom UI</div>, // Custom UI or Component
      confirmLabel: "Delete", // Text button confirm
      cancelLabel: "Cancel", // Text button cancel
      onConfirm: () => this.deleteRequest(id) // Action after Confirm
    });
  };

  // send delete request
  deleteRequest = id => {
    // Send GET request
    const url = api.shoppinglistsEP + this.props.sid + "/items/" + id;
    axios({
      method: "delete",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      }
    })
      .then(response => {
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        toast.error(response.data.message);
        this.props.ItemHandler(this.props.sid);
        return response.data;
      })
      .catch(function(error) {
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
    return (
      <tbody>
        {this.props.items.map(items => {
          return (
            <tr key={items.id}>
              <td>{items.name}</td>
              <td>{items.price}</td>
              <td>{items.quantity}</td>
              <td className="item-action">
                <a
                  data-toggle="modal"
                  data-target={"#editModal" + items.id}
                  title="Edit"
                  onClick={this.reset}
                >
                  <span className="fa fa-edit " />
                </a>{" "}
                |{" "}
                <a
                  onClick={e =>
                    this.DeleteClickHandler(items.id, items.name, e)
                  }
                  className=""
                  data-toggle="tooltip"
                  title="Delete"
                >
                  <span className="fa fa-trash-o " />
                </a>
              </td>
              <div
                id={"editModal" + items.id}
                className="modal fade"
                role="dialog"
              >
                <div className="modal-dialog">
                  <div className="modal-content mdl">
                    <div className="modal-header">
                      <a
                        className="close close-x"
                        data-dismiss="modal"
                        id={"item-modal-close" + items.id}
                      >
                        &times;
                      </a>
                      <h3 className="modal-title">Edit Item: {items.name}</h3>
                    </div>
                    <div className="modal-body">
                      <form
                        className="form"
                        onSubmit={evt => this.handleSubmit(items.id, evt)}
                      >
                        <label className="f-label">
                          {" "}
                          name:{" "}
                          <span className="text-err">
                            {this.state.errors.sitem}
                          </span>
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
                          placeholder={items.name}
                        />

                        <label className="f-label">
                          {" "}
                          price:{" "}
                          <span className="text-err">
                            {this.state.errors.price}
                          </span>
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
                          placeholder={items.price}
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
                          placeholder={items.quantity}
                        />
                        <br />
                        <button
                          className="btn btn-success btn-block f-submit"
                          type="submit"
                        >
                          edit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </tr>
          );
        })}
      </tbody>
    );
  }
}

export default ItemView;
