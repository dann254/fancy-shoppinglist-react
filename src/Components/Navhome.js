import React, { Component } from 'react';

class NavHome extends Component {
  render() {
    return (
      <div className="">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/register/">Register</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </div>
    );
  }
}

export default NavHome;
