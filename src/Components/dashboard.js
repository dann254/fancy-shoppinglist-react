import React, { Component } from "react";
import NavDash from "./NavDash";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Buddies from "./Buddies";
import BuddyShoppinglists from "./Buddy_shoppinglists";
import Shoppinglists from "./Shoppinglists";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppinglists: [],
      buddyshoppinglists: ["random"],
      buddies: [],
      success: false
    };
  }

  // show welcome message
  componentDidMount() {
    try {
      if (window.localStorage.getItem("msg")) {
        toast.success(window.localStorage.getItem("msg"));
        window.localStorage.removeItem("msg");
      }
    } catch (e) {}
  }
  render() {
    if (!window.localStorage.getItem("token")) {
      return <NavDash />;
    }
    return (
      <div className="">
        <ToastContainer hideProgressBar={true} />
        <NavDash />
        <div className="container custom_content">
          <Shoppinglists />
          <BuddyShoppinglists />
          <Buddies />
        </div>
      </div>
    );
  }
}

export default Dashboard;
