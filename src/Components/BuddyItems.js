import React, { Component } from "react";
import NavDash from "./NavDash";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import BuddyItemView from "./buddy_item_view";
import * as api from "./API_URLS";

class BuddyItems extends Component {
  // Initialize props
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
        //Resolve the api response and update state
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
        // Catch and log any errors
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
    var load = "";
    if (!this.state.items[0] && this.state.success === true) {
      // Show message when there are sno items
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
        // Show loading when request is not complete
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
      // pass props to Buddy items view component for rendering
      load = (
        <BuddyItemView
          items={this.state.items}
          sid={this.props.match.params.id}
        />
      );
    }
    return (
      <div className="items">
        // Display the items panel
        <NavDash />
        <ToastContainer hideProgressBar={true} />
        <div className="s-heading-s">
          <a href="/dashboard" className="back-l">
            Back to dashboard
          </a>
          <span>{this.state.shoppinglist.name}</span>
          <span className="owner-l">
            <span className="sub-l">shared by </span>
            {this.state.owner.username}
          </span>
        </div>
        <div className="item-container">
          <table className="table table-striped my-t-s">
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
      </div>
    );
  }
}

export default BuddyItems;
