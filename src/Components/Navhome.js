import React, { Component } from 'react';

class NavHome extends Component {
  render() {
    return (
      <div className="">
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="b navbar-brand" href="/"> Fancy shoppinglist</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav">
              <li ><a href="/" className="b"><span className="glyphicon glyphicon-home"></span> Home</a></li>
            </ul>
            <ul className="b2 nav navbar-nav navbar-right">
              <li><a href="/register/" className="b"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
              <li><a href="/login/" className="b"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
            </ul>

          </div>
        </div>
      </nav>
      </div>
    );
  }
}

export default NavHome;
