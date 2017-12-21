import React, { Component } from "react";
import NavDash from "./NavDash";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import BuddyItemView from "./buddy_item_view";
import * as api from "./API_URLS";

class BuddyItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      success: false,
      shoppinglist: {},
      owner: {}
    };
  }
  // pre mount component
  componentWillMount() {
    this.loadItems(this.props.match.params.id);
  }

  // send request to  get items
  loadItems = id => {
    const url = api.buddiesListEP + id;
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
          items: response.data.response.results,
          shoppinglist: response.data.response.shoppinglist,
          owner: response.data.response.owner
        });
        this.setState({ success: true });
        return response.data;
      })
      .catch(error => {
        if (error.response) {
          toast.error(error.response.data.message);
          this.setState({ success: true });
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", JSON.stringify(error.message));
        }
        console.log(error.config);
      });
  };
  // render items
  render() {
    if (!this.state.items[0] && this.state.success === true) {
      var adds = (
        <span className="c-add">
          Click here to add <span className="fa fa-hand-o-right"> </span>{" "}
        </span>
      );
      var load = (
        <div className="spanel-item-none">
          <h4>This shoppinglist has no items</h4>
        </div>
      );
    } else if (!this.state.items[0] && !this.state.success) {
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
        <BuddyItemView
          items={this.state.items}
          sid={this.props.match.params.id}
        />
      );
    }
    return (
      <div className="items">
        <NavDash />
        <ToastContainer hideProgressBar={true} />
        <div>
          {this.state.shoppinglist.name} {this.state.owner.username}
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <td>Item name</td>
              <td>unit price</td>
              <td>Quantity</td>
            </tr>
          </thead>
          {load}
        </table>
      </div>
    );
  }
}

export default BuddyItems;
