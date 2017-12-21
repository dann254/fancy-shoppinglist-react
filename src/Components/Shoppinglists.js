import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ShoppinglistView from "./shoppinglist_view";
import * as api from "./API_URLS";

class Shoppinglists extends Component {
  // initialize state
  constructor(props) {
    super(props);
    this.state = {
      sname: "",
      shoppinglists: [],
      success: false,
      message: "",
      errors: { sname: "" },
      addSuccess: false,
      paginateLimit: 10,
      start: 1,
      search: "",
      links: {}
    };
  }

  // mount shoppinglists when the page loads
  componentWillMount = () => {
    let pg =
      "?start=" + this.state.start + "&limit=" + this.state.paginateLimit;
    this.getShoppinglists(pg);
  };

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
    if (evt.target.name === "paginateLimit") {
      let vl = evt.target.value;
      if (errors === "invalid") {
        vl = 10;
      }
      this.setState({ paginateLimit: vl }, () => {
        let pg =
          "?start=" + this.state.start + "&limit=" + this.state.paginateLimit;
        this.getShoppinglists(pg);
      });
    } else if (evt.target.name === "search") {
      let vl = evt.target.value;
      this.setState({ search: vl }, () => {
        let pg = "?q=" + this.state.search;
        this.getShoppinglists(pg);
      });
    } else {
      this.setState({ sname: evt.target.value });
    }
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
    if (fields.paginateLimit) {
      var plm = fields.paginateLimit;
      var re = /^[0-9]+$/;
      if (!plm.match(re)) {
        errors = "invalid";
        return errors;
      }
    }
  };

  // validate form submission
  handleSubmit = evt => {
    evt.preventDefault();
    if (this.state.errors.sname !== "") {
      toast.error("Please enter a valid shoppinglist name");
    } else {
      this.sendAddRequest(this.state.sname);
    }
  };

  // send request
  sendAddRequest(sname) {
    var data = { name: sname };
    const url = api.shoppinglistsEP;
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
        toast.success("Shoppinglist created");
        var newShopp = this.state.shoppinglists.slice();
        newShopp.push(response.data);
        this.setState({ shoppinglists: newShopp });
        document.getElementById("as-modal-close").click();
        this.setState({ addSuccess: true, sname: "" });
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
  // handle pagination
  handlePg = (pg, evt) => {
    evt.preventDefault();
    this.getShoppinglists(pg);
  };
  // send pagination request
  getShoppinglists = pg => {
    // Send GET request
    const url = api.shoppinglistsEP + pg;
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
          shoppinglists: response.data.results,
          links: response.data.links
        });

        return response.data;
      })
      .catch(function(error) {
        if (error.response) {
          this.setState({
            shoppinglists: [],
            message: error.response.data.message,
            success: false
          });
          // toast.error(error.response.data.message)
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
      errors: { sname: "" },
      sname: ""
    });
  };

  // handle manipulation of shoppinglists
  ShoppinglistHandler = () => {
    let pg =
      "?start=" + this.state.start + "&limit=" + this.state.paginateLimit;
    this.getShoppinglists(pg);
  };
  // render shoppinglists appropriately
  render() {
    if (
      !this.state.shoppinglists[0] &&
      !this.state.success &&
      this.state.message === "you dont have any shoppinglists with that name"
    ) {
      var load = (
        <div className="spanel-item-none">
          <h4>You dont have any shoppinglists with that name</h4>
        </div>
      );
    } else if (!this.state.shoppinglists[0] && this.state.success === true) {
      var adds = (
        <span className="c-add">
          Click here to add <span className="fa fa-hand-o-right"> </span>{" "}
        </span>
      );
      var load = (
        <div className="spanel-item-none">
          <h4>You dont have any shoppinglists</h4>
        </div>
      );
    } else if (!this.state.shoppinglists[0] && !this.state.success) {
      var load = (
        <div className="spanel-item-loading">
          <h4>Loading</h4>
          <div className="text-right spn">
            <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
          </div>
        </div>
      );
    } else {
      var load = (
        <ShoppinglistView
          shoppinglists={this.state.shoppinglists}
          shandler={this.ShoppinglistHandler}
        />
      );
    }

    if (!this.state.links) {
      var buttons = <span />;
    } else if (this.state.links.next && !this.state.links.previous) {
      var buttons = (
        <button
          type="button"
          onClick={evt => this.handlePg(this.state.links.next, evt)}
        >
          next
        </button>
      );
    } else if (this.state.links.next && this.state.links.previous) {
      var buttons = (
        <span>
          <button
            type="button"
            onClick={evt => this.handlePg(this.state.links.next, evt)}
          >
            next
          </button>{" "}
          <button
            type="button"
            onClick={evt => this.handlePg(this.state.links.previous, evt)}
          >
            prev
          </button>
        </span>
      );
    } else if (!this.state.links.next && this.state.links.previous) {
      var buttons = (
        <span>
          <button
            type="button"
            onClick={evt => this.handlePg(this.state.links.previous, evt)}
          >
            prev
          </button>
        </span>
      );
    } else {
      var buttons = <span />;
    }
    return (
      <div className="">
        <div className="row shoppinglist col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <div className="panel spanel">
            <div className="panel-heading spanel-head">
              <h2>My Shoppinglists</h2>
              <span className="pull-right srch">
                <input
                  type="text"
                  className="form-control"
                  onInput={this.onInputChange}
                  name="search"
                  placeholder="Search"
                  value={this.state.search}
                />
              </span>
            </div>
            <div className="panel-body spanel-body">{load}</div>
            <div className="panel-footer spanel-foot">
              <span className="pull-left pgn">
                Show{" "}
                <input
                  type="number"
                  step="1"
                  min="1"
                  onChange={this.onInputChange}
                  name="paginateLimit"
                  value={this.state.paginateLimit}
                />{" "}
                entries
              </span>
              <span className="nbts">{buttons}</span>
              <a
                data-toggle="modal"
                data-target="#myModal"
                className="add-list"
                onClick={this.reset}
              >
                <span className="fa fa-plus" />
              </a>
              {adds}
            </div>
          </div>
        </div>

        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content mdl">
              <div className="modal-header">
                <a
                  type="button"
                  className="close close-x"
                  data-dismiss="modal"
                  id="as-modal-close"
                >
                  &times;
                </a>
                <h3 className="modal-title">Add Shoppinglist</h3>
              </div>
              <div className="modal-body">
                <form className="form" onSubmit={this.handleSubmit}>
                  <label className="f-label m-label">
                    {" "}
                    name:{" "}
                    <span className="text-err">{this.state.errors.sname}</span>
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
                      placeholder="shoppinglist name"
                      required
                    />
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
