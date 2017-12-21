import React, { Component } from "react";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import * as api from "./API_URLS";

class ShoppinglistView extends Component {
  // initialize state
  constructor(props) {
    super(props);
    this.state = {
      sname: "",
      shoppinglists: [],
      success: false,
      message: "",
      errors: { sname: "" },
      editSuccess: false
    };
  }
  // link user to shoppinglist items
  ViewClickHandler = id => {
    this.history.push("/dashboard/shoppinglist/" + id + "/items");
  };

  // handle user input
  onInputChange = evt => {
    evt.preventDefault();
    let fields = {};
    fields[evt.target.name] = evt.target.value;
    this.setState(fields);
    this.setState({ sname: evt.target.value });
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
    if (fields.sname) {
      var usn = fields.sname;
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
  };

  // handle form submission
  handleSubmit = (id, evt) => {
    evt.preventDefault();
    if (this.state.errors.sname !== "") {
      toast.error("Please enter a valid shoppinglist name");
    } else {
      this.sendEditRequest(this.state.sname, id);
    }
  };

  // send request to edit a shoppinglist
  sendEditRequest(sname, id) {
    var data = { name: sname };
    const url = api.shoppinglistsEP + id;
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
        this.props.shandler();
        toast.success("Shoppinglist edited");
        document.getElementById("modal-close" + id).click();
        this.setState({ editSuccess: true, sname: "" });
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

  // handle deleting a shoppinglist with confirmation
  DeleteClickHandler = (id, name) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete  " + name,
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => this.deleteRequest(id)
    });
  };

  // handle sharing a shoppinglist with confirmation
  ShareClickHandler = (id, name, request) => {
    confirmAlert({
      title: "Confirm " + request,
      message: "Are you sure you want to " + request + " " + name + "?",
      confirmLabel: request,
      cancelLabel: "Cancel",
      onConfirm: () => this.shareRequest(id)
    });
  };

  // send and handle delete request to the api
  deleteRequest = id => {
    // Send GET request
    const url = api.shoppinglistsEP + id;
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
        this.props.shandler();
        toast.success("Shoppinglists deleted");
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

  // send and handle share request
  shareRequest = id => {
    // Send GET request
    const url = api.shoppinglistsEP + id;
    axios({
      method: "put",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      }
    })
      .then(response => {
        if (!response.statusText === "OK") {
          toast.error(response.data.message);
        }
        this.props.shandler();
        toast.success("Success");
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

  // redner shoppinglist
  render() {
    return (
      <div id="accordion" data-children=".icon-link-e" className="">
        {this.props.shoppinglists.map(shoppinglists => {
          var share_status = "";
          if (shoppinglists.shared) {
            share_status = (
              <a
                onClick={e =>
                  this.ShareClickHandler(
                    shoppinglists.id,
                    shoppinglists.name,
                    "Unshare",
                    e
                  )
                }
                className="icon-link2"
                data-toggle="tooltip"
                title="unshare"
              >
                <span className="fa fa-reply" />
              </a>
            );
          } else {
            share_status = (
              <a
                onClick={e =>
                  this.ShareClickHandler(
                    shoppinglists.id,
                    shoppinglists.name,
                    "Share",
                    e
                  )
                }
                className="icon-link2"
                data-toggle="tooltip"
                title="Share"
              >
                <span className="fa fa-share-alt " />
              </a>
            );
          }
          return (
            <div>
              {" "}
              <div className="spanel-item" key={shoppinglists.id}>
                <a
                  href={
                    "/dashboard/shoppinglist/" + shoppinglists.id + "/items"
                  }
                >
                  <h4>{shoppinglists.name}</h4>
                </a>
                <div className="text-right action">
                  {share_status}
                  <a
                    className="icon-link-e"
                    data-toggle="modal"
                    data-target={"#editModal" + shoppinglists.id}
                    title="Edit"
                  >
                    <span className="fa fa-edit " />
                  </a>
                  <a
                    onClick={e =>
                      this.DeleteClickHandler(
                        shoppinglists.id,
                        shoppinglists.name,
                        e
                      )
                    }
                    className="icon-link1"
                    data-toggle="tooltip"
                    title="Delete"
                  >
                    <span className="fa fa-trash-o " />
                  </a>
                </div>
              </div>
              <div
                className="modal fade"
                id={"editModal" + shoppinglists.id}
                role="dialog"
              >
                <div className="modal-dialog">
                  <div className="modal-content  mdl">
                    <div className="modal-header">
                      <a
                        className="close"
                        data-dismiss="modal"
                        id={"modal-close" + shoppinglists.id}
                      >
                        &times;
                      </a>
                      <h4 className="modal-title">
                        Edit shoppinglist: {shoppinglists.name}
                      </h4>
                    </div>
                    <div className="modal-body">
                      <form
                        className="form"
                        onSubmit={evt =>
                          this.handleSubmit(shoppinglists.id, evt)
                        }
                      >
                        <label className="f-label m-label">
                          {" "}
                          name:{" "}
                          <span className="text-err">
                            {this.state.errors.sname}
                          </span>
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            name="sname"
                            className={
                              this.state.errors.sname
                                ? "form-control f-error"
                                : "form-control"
                            }
                            onInput={this.onInputChange}
                            value={this.state.sname}
                            placeholder={shoppinglists.name}
                            required
                          />
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
            </div>
          );
        })}
      </div>
    );
  }
}

export default ShoppinglistView;
