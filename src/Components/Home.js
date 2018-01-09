import React, { Component } from "react";

import NavHome from "./Navhome";

class Home extends Component {
  render() {
    return (
      <div className="Home">
        // Render landing page
        <NavHome />
        <div className="col-lg-12 text-center custom-content">
          <h1 className="landing-head">
            <b>Tired writing your shopping list on paper?</b>
          </h1>
          <h4 className="an">
            Here is a solution that will make you enjoy your experience with
            shopping lists.<br /> It even allows you to share your lists.<br />{" "}
            How amazing!
          </h4>
          <a href="/register/" className="btn btn-lg bb">
            Sign Up
          </a>
          <a href="/login/" className="btn bb btn-lg">
            Login
          </a>
        </div>
      </div>
    );
  }
}

export default Home;
