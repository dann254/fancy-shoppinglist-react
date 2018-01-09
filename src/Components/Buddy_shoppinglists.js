import React, { Component } from "react";
import axios from "axios";
import * as api from "./API_URLS";

class BuddyShoppinglists extends Component {
  constructor(props) {
    super(props);
    this.state = { buddyshoppinglists: [], success: false, message: "" };
  }
  // mount buddy shoppinglists when the page loads
  componentWillMount = () => {
    this.getBuddyShoppinglists();
  };

  // send and resolve getting the shoppinglists
  getBuddyShoppinglists = () => {
    // Send GET request
    const url = api.buddiesListEP;
    axios({
      method: "get",
      url: url,
      headers: {
        Auth: window.localStorage.getItem("token")
      }
    })
      .then(response => {
        // Resolve response and update state
        if (!response.statusText === "OK") {
          console.log(response.data.message);
        }
        this.setState({
          buddyshoppinglists: response.data.result,
          success: true
        });

        return response.data;
      })
      .catch(error => {
        // Catch and log any errors from the response
        if (error.response) {
          console.log(error.response.data.message);
          this.setState({
            message: error.response.data.message
          });
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", JSON.stringify(error.message));
        }
        console.log(error.config);
      });
  };
  render() {
    // Refresh When Buddies are updated
    if (this.props.refresh === true) {
      this.getBuddyShoppinglists();
    }
    // SShow message when there are no shoppinglists shared with th user.
    var resp = "";
    if (this.state.message !== "") {
      resp = (
        <div className="spanel-item-none">
          <h4>{this.state.message}</h4>
        </div>
      );
    } else if (!this.state.buddyshoppinglists[0] && !this.state.success) {
      // SHow loading when the component hasnt mounted
      resp = (
        <div className="spanel-item-loading">
          <h4>Loading</h4>
          <div className="text-right spn">
            <span className="fa fa-circle-o-notch fa-spin fa-3x fa-fw" />
          </div>
        </div>
      );
    } else {
      // Display all the shoppinglists shared with user appropriately
      resp = this.state.buddyshoppinglists.map(bslist => {
        return (
          <div className="spanel-item-bs" key={bslist.id}>
            <a href={"/dashboard/buddy_shoppinglist/" + bslist.id}>
              <h4>{bslist.name}</h4>{" "}
            </a>
            <div className="action-bs">
              {" "}
              <a
                className="owner"
                title="buddy"
                data-toggle="modal"
                data-target={"#myModal" + bslist.owned_by}
              >
                {" "}
                <span className="fa fa-user-circle"> {bslist.owner}</span>
              </a>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="">
        <div className="row bslist col-lg-5 col-md-5 col-sm-12 col-xs-12">
          <div className="panel spanel-bs">
            <div className="panel-heading spanel-head-bs">
              <h2>{"Buddys' Shoppinglists"}</h2>
            </div>
            <div className="panel-body spanel-body-bs">{resp}</div>
            <div className="panel-footer spanel-foot-bs" />
          </div>
        </div>
      </div>
    );
  }
}

export default BuddyShoppinglists;
